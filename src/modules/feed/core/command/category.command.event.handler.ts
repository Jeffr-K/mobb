import { CommandHandler, ICommandHandler, QueryBus } from '@nestjs/cqrs';
import {
  CategoryCreateCommandEvent,
  CategoryDeleteCommandEvent,
  CategoryEditCommandEvent,
} from '@modules/feed/core/command/category.command.event';
import { FeedCategory } from '@modules/feed/core/entity/feed-category';
import { FeedCategoryRepository } from '@modules/feed/infrastructure/repository/feed-category.repository';
import {
  FeedCategoryHasAssociatedFeedsException,
  FeedCategoryNotFoundException,
  FeedCategoryRegistrationFailedException,
} from '@modules/feed/core/exception/exception';
import { EntityManager } from '@mikro-orm/postgresql';
import { Transactional } from '@mikro-orm/core';
import { FeedQueryEvent } from '@modules/feed/core/query/query.event';

@CommandHandler(CategoryCreateCommandEvent)
export class FeedCategoryCreateCommandEventHandler implements ICommandHandler<CategoryCreateCommandEvent> {
  constructor(private readonly em: EntityManager, private readonly feedCategoryRepository: FeedCategoryRepository) {}

  // TODO: 카테고리는 데이터가 많지 않으므로, 다 끌고와서 연산하는것도 나쁘진 않곘네.
  @Transactional()
  async execute(command: CategoryCreateCommandEvent): Promise<FeedCategory> {
    try {
      switch (true) {
        case command.parentCategoryUuid !== null:
          return await this.createSubCategory(command);
        default:
          return await this.createTopCategory(command);
      }
    } catch (error) {
      console.error('카테고리 생성 중 오류 발생:', error);
      throw error;
    }
  }

  private async createTopCategory(command: CategoryCreateCommandEvent): Promise<FeedCategory> {
    const existingCategory = await this.feedCategoryRepository.selectFeedCategoryBy({
      name: command.name,
      parent: null,
    });

    if (existingCategory) {
      throw new FeedCategoryRegistrationFailedException();
    }

    const newFeedCategory = await FeedCategory.register({
      name: command.name,
      parent: null,
    });

    this.em.persist(newFeedCategory);

    return newFeedCategory;
  }

  private async createSubCategory(command: CategoryCreateCommandEvent): Promise<FeedCategory> {
    const parentCategory = await this.feedCategoryRepository.selectFeedCategoryBy({
      uuid: command.parentCategoryUuid,
    });

    if (!parentCategory) {
      throw new FeedCategoryRegistrationFailedException();
    }

    const existingCategory = await this.feedCategoryRepository.selectFeedCategoryBy({
      name: command.name,
      parent: parentCategory,
    });

    if (existingCategory) {
      throw new FeedCategoryRegistrationFailedException();
    }

    const newFeedCategory = await FeedCategory.register({
      name: command.name,
      parent: parentCategory,
    });

    this.em.persist(newFeedCategory);
    return newFeedCategory;
  }
}

@CommandHandler(CategoryDeleteCommandEvent)
export class FeedCategoryDeleteCommandEventHandler implements ICommandHandler<CategoryDeleteCommandEvent> {
  constructor(
    private readonly em: EntityManager,
    private readonly feedCategoryRepository: FeedCategoryRepository,
    private readonly queryBus: QueryBus,
  ) {}

  async execute(command: CategoryDeleteCommandEvent): Promise<void> {
    const category = await this.feedCategoryRepository.selectFeedCategoryBy({ uuid: command.categoryUuid });

    if (!category) {
      throw new FeedCategoryNotFoundException();
    }

    const feeds = await this.queryBus.execute(new FeedQueryEvent({ categoryId: category._id }));
    if (feeds.length > 0 && !command.forceUpdate) {
      throw new FeedCategoryHasAssociatedFeedsException();
    }

    await this.em.removeAndFlush(category);
  }
}

@CommandHandler(CategoryEditCommandEvent)
export class FeedCategoryEditCommandEventHandler implements ICommandHandler<CategoryEditCommandEvent> {
  constructor(private readonly em: EntityManager, private readonly feedCategoryRepository: FeedCategoryRepository) {}

  async execute(command: CategoryEditCommandEvent): Promise<void> {
    const category = await this.feedCategoryRepository.selectFeedCategoryBy({ uuid: command.categoryUuid });

    if (!category) {
      throw new FeedCategoryNotFoundException();
    }

    category.name = command.name;

    await this.em.persistAndFlush(category);
  }
}
