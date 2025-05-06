import { ExtendedEntityRepository } from '@infrastructure/database/postgres/extended-entity-repository';
import { FeedCategory } from '@modules/feed/core/entity/feed-category';
import { Nullable } from '@infrastructure/utils/types/types';

export class FeedCategoryRepository extends ExtendedEntityRepository<FeedCategory> {
  async selectFeedCategoryBy(filter: {
    _id?: Nullable<number>;
    uuid?: Nullable<string>;
    name?: Nullable<string>;
  }): Promise<Nullable<FeedCategory>> {
    let condition = {};

    if (filter._id) {
      condition = {
        ...condition,
        _id: filter._id,
      };
    }

    if (filter.name) {
      condition = {
        ...condition,
        name: filter.name,
      };
    }

    if (filter.uuid) {
      condition = {
        ...condition,
        uuid: filter.uuid,
      };
    }

    return await this.createQueryBuilder()
      .select('*')
      .where({ ...condition })
      .andWhere({ timestamp: { deletedAt: null } })
      .getSingleResult();
  }
}
