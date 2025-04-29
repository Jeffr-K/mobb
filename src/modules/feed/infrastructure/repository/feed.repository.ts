import { ExtendedEntityRepository } from '@infrastructure/database/postgres/extended-entity-repository';
import { Feed } from '@modules/feed/core/entity/feed';
import { PaginatedResponse } from '@infrastructure/utils/base/base-response';
import { EntityKey, QueryOrder } from '@mikro-orm/core';

export class FeedRepository extends ExtendedEntityRepository<Feed> {
  async selectFeedBy(filter: { uuid: string }): Promise<Feed> {
    return await this.createQueryBuilder()
      .select('*')
      .where({ uuid: filter.uuid })
      .andWhere({ timestamp: { deletedAt: null } })
      .getSingleResult();
  }

  async selectFeedsBy(filter: {
    page: number;
    size: number;
    sort: string;
    limit: number;
  }): Promise<PaginatedResponse<Feed>> {
    const queryBuilder = this.createQueryBuilder('f'); // 별칭 추가

    queryBuilder
      .select('*')
      .where({ timestamp: { deletedAt: null } })
      .leftJoinAndSelect('f.writer', 'writer')
      .populate([{ field: 'writer' as EntityKey<Feed> }]);

    if (filter.sort) {
      const [order] = filter.sort.split(':');
      queryBuilder.orderBy({
        timestamp: { createdAt: order === 'desc' ? QueryOrder.DESC : QueryOrder.ASC },
      });
    }

    const page = Math.max(0, filter.page);
    const size = Math.min(50, Math.max(1, filter.size));
    queryBuilder.limit(size).offset(page * size);

    const [items, total] = await Promise.all([queryBuilder.getResultList(), queryBuilder.getCount()]);

    return {
      items,
      total,
      pageCount: Math.ceil(total / size),
      currentPage: page,
      pageSize: size,
    };
  }
}
