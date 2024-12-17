import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import {
  CommentEditCommandEvent,
  CommentRegisterCommandEvent,
  CommentRemoveCommandEvent,
  FeedCreateCommandEvent,
  FeedDeleteCommandEvent,
  FeedEditCommandEvent,
} from '@modules/feed/core/command/command.event';
import { InjectRepository, logger } from '@mikro-orm/nestjs';
import { FeedRepository } from '@modules/feed/infrastructure/repository/feed.repository';
import { Feed } from '@modules/feed/core/entity/feed';
import { DatabaseObjectNotFoundException, EntityManager } from '@mikro-orm/postgresql';
import { Inject, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { FeedEventHistory } from '@modules/feed/core/entity/feed.event.history';
import { FeedNotFoundException, FeedRegistrationFailedException } from '@modules/feed/core/exception/exception';
import {
  DatabaseOperationException,
  InvalidUUIDFormatException,
} from '@infrastructure/database/postgres/common-exception';
import { CommentRepository } from '@modules/feed/infrastructure/repository/comment.repository';
import { Comment } from '@modules/feed/core/entity/comment';

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

@CommandHandler(CommentRegisterCommandEvent)
export class CommentRegisterCommandEventHandler implements ICommandHandler<CommentRegisterCommandEvent> {
  constructor(
    private readonly feedRepository: FeedRepository,
    private readonly commentRepository: CommentRepository,
    private readonly entityManager: EntityManager,
  ) {}

  async execute(command: CommentRegisterCommandEvent): Promise<Comment> {
    const feed = await this.feedRepository.selectFeedBy({ uuid: command.feedId });
    if (!feed) {
      throw new NotFoundException('Feed not found');
    }

    let comment: Comment;

    if (command.parentCommentId) {
      const parent = await this.commentRepository.selectCommentBy({ uuid: command.parentCommentId });
      if (!parent) {
        throw new NotFoundException('Parent comment not found');
      }
      comment = await parent.addReply({
        feed: feed,
        writer: command.writer,
        content: command.content,
      });
    } else {
      comment = await Comment.addComment({
        feed: feed,
        writer: command.writer,
        content: command.content,
      });
    }

    await this.entityManager.persistAndFlush(comment);
    return comment;
  }
}

@CommandHandler(CommentEditCommandEvent)
export class CommentEditCommandEventHandler implements ICommandHandler<CommentEditCommandEvent> {
  constructor(private readonly commentRepository: CommentRepository, private readonly entityManager: EntityManager) {}

  async execute(command: CommentEditCommandEvent): Promise<Comment> {
    const comment = await this.commentRepository.selectCommentBy({ uuid: command.commentId });
    if (!comment) {
      throw new NotFoundException('Comment not found');
    }

    if (comment.writer.identifier.uuid !== command.writerId) {
      throw new UnauthorizedException('Not authorized to edit this comment');
    }

    await comment.editComment({ content: command.content });
    await this.entityManager.flush();

    return comment;
  }
}

@CommandHandler(CommentRemoveCommandEvent)
export class CommentRemoveCommandEventHandler implements ICommandHandler<CommentRemoveCommandEvent> {
  constructor(private readonly commentRepository: CommentRepository, private readonly entityManager: EntityManager) {}

  async execute(command: CommentRemoveCommandEvent): Promise<void> {
    const comment = await this.commentRepository.selectCommentBy({ uuid: command.commentUuid });
    if (!comment) {
      throw new NotFoundException('Comment not found');
    }

    if (comment.writer.identifier.uuid !== command.writerUuid) {
      throw new UnauthorizedException('Not authorized to delete this comment');
    }

    await comment.deleteComment();
    await this.entityManager.flush();
  }
}
