import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { FeedCategoryQuery } from '@modules/feed/core/query/category.query.event';
import { FeedCategoryRepository } from '@modules/feed/infrastructure/repository/feed-category.repository';
import { FeedCategory } from '@modules/feed/core/entity/feed-category';

@QueryHandler(FeedCategoryQuery)
export class FeedCategoryQueryEventHandler implements IQueryHandler<FeedCategoryQuery> {
  constructor(private readonly feedCategoryRepository: FeedCategoryRepository) {}

  async execute(query: FeedCategoryQuery): Promise<FeedCategory> {
    return await this.feedCategoryRepository.selectFeedCategoryBy({ uuid: query.categoryUuid });
  }
}
