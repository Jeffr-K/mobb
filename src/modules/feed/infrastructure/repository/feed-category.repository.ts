import { ExtendedEntityRepository } from '@infrastructure/database/postgres/extended-entity-repository';
import { FeedCategory } from '@modules/feed/core/entity/feed-category';
import { Nullable } from '@infrastructure/utils/types/types';
import { PaginatedResponse } from '@/infrastructure/utils/base/base-response';
import { QueryOrder } from '@mikro-orm/postgresql';

export class FeedCategoryRepository extends ExtendedEntityRepository<FeedCategory> {
  async selectFeedCategoryBy(filter: {
    _id?: Nullable<number>;
    uuid?: Nullable<string>;
    name?: Nullable<string>;
    parent?: Nullable<FeedCategory>;
  }): Promise<Nullable<FeedCategory>> {
    let condition = {};

    if (filter._id) {
      condition = {
        ...condition,
        _id: filter._id,
      };
    }

    if (filter.uuid) {
      condition = {
        ...condition,
        uuid: filter.uuid,
      };
    }

    if (filter.name) {
      condition = {
        ...condition,
        name: filter.name,
      };
    }

    if (filter.parent) {
      condition = {
        ...condition,
        parent: filter.parent,
      };
    }

    return await this.createQueryBuilder()
      .select('*')
      .where({ ...condition })
      .andWhere({ timestamp: { deletedAt: null } })
      .getSingleResult();
  }

  async selectFeedCategoriesBy(filter: {
    page: number;
    limit: number;
    offset: number;
    orderBy: string;
  }): Promise<PaginatedResponse<FeedCategory>> {
    const order = filter.orderBy.startsWith('-') ? QueryOrder.DESC : QueryOrder.ASC;
    const orderByField = filter.orderBy.startsWith('-') ? filter.orderBy.substring(1) : filter.orderBy;

    const [categories, count] = await this.createQueryBuilder('fc')
      .select('*')
      .where({})
      .orderBy({
        [orderByField]: order,
      })
      .limit(filter.limit)
      .offset(filter.offset)
      .getResultAndCount();

    return {
      items: categories,
      total: count,
      pageCount: Math.ceil(count / filter.limit),
      currentPage: filter.page,
      pageSize: filter.limit,
    };
  }
}
