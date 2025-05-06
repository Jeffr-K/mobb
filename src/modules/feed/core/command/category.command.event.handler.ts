import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import {
  CategoryCreateCommandEvent,
  CategoryDeleteCommandEvent,
  CategoryEditCommandEvent,
} from '@modules/feed/core/command/category.command.event';
import { FeedCategory } from '@modules/feed/core/entity/feed-category';
import { FeedCategoryRepository } from '@modules/feed/infrastructure/repository/feed-category.repository';
import {
  FeedCategoryRegistrationFailedException,
  ParentCategoryNotFoundException,
} from '@modules/feed/core/exception/exception';
import { EntityManager, FlushMode, IsolationLevel } from '@mikro-orm/postgresql';
import { LogContext, Transactional } from '@mikro-orm/core';

@CommandHandler(CategoryCreateCommandEvent)
export class FeedCategoryCreateCommandEventHandler implements ICommandHandler<CategoryCreateCommandEvent> {
  constructor(
    private readonly feedCategoryRepository: FeedCategoryRepository,
    private readonly entityManager: EntityManager,
  ) {}

  @Transactional({
    ctx: 'entityManager',
    isolationLevel: IsolationLevel.READ_UNCOMMITTED,
    readOnly: false,
    clear: false,
    flushMode: FlushMode.AUTO,
    ignoreNestedTransactions: false,
    loggerContext: {} as LogContext,
  })
  async execute(command: CategoryCreateCommandEvent): Promise<FeedCategory> {
    try {
      const feedCategory = await this.feedCategoryRepository.selectFeedCategoryBy({
        name: command.name,
      });

      if (feedCategory) {
        throw new FeedCategoryRegistrationFailedException();
      }

      const newFeedCategory = await FeedCategory.register({
        name: command.name,
        parent: command.parent ? await this.parentCategory(command.parent._id) : null,
      });

      this.entityManager.persist(newFeedCategory);

      return newFeedCategory;
    } catch (error) {
      console.error('카테고리 생성 중 오류 발생:', error);
      throw error;
    }
  }

  private async parentCategory(categoryId: number): Promise<FeedCategory> {
    const category = await this.feedCategoryRepository.selectFeedCategoryBy({ _id: categoryId });

    if (!category) {
      throw new ParentCategoryNotFoundException();
    }

    return category;
  }
}

@CommandHandler(CategoryDeleteCommandEvent)
export class FeedCategoryDeleteCommandEventHandler implements ICommandHandler<CategoryDeleteCommandEvent> {
  async execute(command: CategoryDeleteCommandEvent): Promise<FeedCategory> {
    throw new Error('Method not implemented.');
  }
}

@CommandHandler(CategoryEditCommandEvent)
export class FeedCategoryEditCommandEventHandler implements ICommandHandler<CategoryDeleteCommandEvent> {
  async execute(command: CategoryDeleteCommandEvent): Promise<FeedCategory> {
    throw new Error('Method not implemented.');
  }
}
