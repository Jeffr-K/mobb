import { ExtendedEntityRepository } from '@infrastructure/database/postgres/extended-entity-repository';
import { Feed } from '@modules/feed/core/entity/feed';

export class FeedRepository extends ExtendedEntityRepository<Feed> {
  async selectFeedBy(filter: { uuid: string }): Promise<Feed> {
    return await this.createQueryBuilder()
      .select('*')
      .where({ uuid: filter.uuid })
      .andWhere({ timestamp: { deletedAt: null } })
      .getSingleResult();
  }

  async selectFeedsBy(filter: { page: number; size: number; sort: string; limit: number }): Promise<Feed[]> {
    return await this.createQueryBuilder()
      .select('*')
      .where({ timestamp: { deletedAt: null } })
      .limit(filter.limit)
      .offset(filter.page * filter.size)
      .getResultList();
  }
}
