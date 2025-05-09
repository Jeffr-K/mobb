import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { FeedCategoriesQuery, FeedCategoryQuery } from '@modules/feed/core/query/category.query.event';
import { FeedCategoryRepository } from '@modules/feed/infrastructure/repository/feed-category.repository';
import { FeedCategory } from '@modules/feed/core/entity/feed-category';
import { FeedCategoryNotFoundException } from '../exception/exception';

@QueryHandler(FeedCategoryQuery)
export class FeedCategoryQueryEventHandler implements IQueryHandler<FeedCategoryQuery> {
  constructor(private readonly feedCategoryRepository: FeedCategoryRepository) {}

  async execute(query: FeedCategoryQuery): Promise<FeedCategory> {
    const category = await this.feedCategoryRepository.selectFeedCategoryBy({ uuid: query.categoryUuid });

    if (!category) {
      throw new FeedCategoryNotFoundException();
    }

    return category;
  }
}

@QueryHandler(FeedCategoriesQuery)
export class FeedCategoriesQueryEventHandler implements IQueryHandler<FeedCategoriesQuery> {
  constructor(private readonly feedCategoryRepository: FeedCategoryRepository) {}

  async execute(query: FeedCategoriesQuery): Promise<any> {
    return await this.feedCategoryRepository.selectFeedCategoriesBy({
      page: query.page,
      limit: query.limit,
      offset: query.offset,
      orderBy: query.orderBy,
    });
  }
}
