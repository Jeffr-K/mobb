import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import {
  FeedCreateCommandEvent,
  FeedDeleteCommandEvent,
  FeedEditCommandEvent,
} from '@modules/feed/core/command/command.event';
import { InjectRepository, logger } from '@mikro-orm/nestjs';
import { FeedRepository } from '@modules/feed/infrastructure/repository/feed.repository';
import { Feed } from '@modules/feed/core/entity/feed';
import { DatabaseObjectNotFoundException, EntityManager } from '@mikro-orm/postgresql';
import { Inject } from '@nestjs/common';
import { FeedEventHistory } from '@modules/feed/core/entity/feed.event.history';
import { FeedNotFoundException, FeedRegistrationFailedException } from '@modules/feed/core/exception/exception';
import {
  DatabaseOperationException,
  InvalidUUIDFormatException,
} from '@infrastructure/database/postgres/common-exception';

@CommandHandler(FeedCreateCommandEvent)
export class FeedCreateCommandEventHandler implements ICommandHandler<FeedCreateCommandEvent> {
  constructor(@Inject(EntityManager) private readonly entityManager: EntityManager) {}

  async execute(command: FeedCreateCommandEvent): Promise<void> {
    await this.entityManager.transactional(async (manager: EntityManager): Promise<void> => {
      try {
        const feed = await Feed.register({ ...command });
        const history = await FeedEventHistory.register({ eventType: 'create', eventContent: 'create feed' });
        await manager.persistAndFlush(feed);
        await manager.persistAndFlush(history);
        await manager.commit();
      } catch (error) {
        logger.error('FeedRegistrationFailedException', error);
        await manager.rollback();
        throw new FeedRegistrationFailedException();
      }
    });
  }
}

@CommandHandler(FeedDeleteCommandEvent)
export class FeedDeleteCommandEventHandler implements ICommandHandler<FeedDeleteCommandEvent> {
  constructor(
    @InjectRepository(Feed) private readonly feedRepository: FeedRepository,
    @Inject(EntityManager) private readonly entityManager: EntityManager,
  ) {}

  async execute(command: FeedDeleteCommandEvent): Promise<void> {
    const feed = await this.feedRepository.selectFeedBy({ uuid: command.feedId });
    await this.entityManager.transactional(async (manager: EntityManager): Promise<void> => {
      try {
        const history = await FeedEventHistory.register({ eventType: 'delete', eventContent: 'remove feed' });
        await manager.removeAndFlush(feed);
        await manager.persistAndFlush(history);
      } catch (error) {
        if (error instanceof DatabaseObjectNotFoundException) {
          logger.log('FeedNotFoundException', error);
          throw new FeedNotFoundException();
        }

        throw error;
      }
    });
  }
}

@CommandHandler(FeedEditCommandEvent)
export class FeedEditCommandEventHandler implements ICommandHandler<FeedEditCommandEvent> {
  constructor(
    @InjectRepository(Feed) private readonly feedRepository: FeedRepository,
    @Inject(EntityManager) private readonly entityManager: EntityManager,
  ) {}

  async execute(command: FeedEditCommandEvent): Promise<void> {
    try {
      await this.entityManager.transactional(async (manager: EntityManager): Promise<void> => {
        const feed = await this.feedRepository.selectFeedBy({ uuid: command.feedId });
        await feed.edit({ ...command });
        const history = await FeedEventHistory.register({ eventType: 'edit', eventContent: 'edit feed' });
        await manager.persistAndFlush(feed);
        await manager.persistAndFlush(history);
      });
    } catch (error) {
      logger.error('Error details:', {
        name: error.name,
        message: error.message,
        constructor: error.constructor.name,
        prototype: Object.getPrototypeOf(error).constructor.name,
        instanceof: {
          Error: error instanceof Error,
          TypeError: error instanceof TypeError,
          InvalidUUIDError: error.message.includes('invalid input syntax for type uuid'),
        },
      });

      if (error.message?.includes('invalid input syntax for type uuid')) {
        throw new InvalidUUIDFormatException();
      }
      if (error.message?.includes('not found')) {
        throw new FeedNotFoundException();
      }
      if (error.name === 'DatabaseError') {
        throw new DatabaseOperationException(error.message);
      }

      throw error;
    }
  }
}
