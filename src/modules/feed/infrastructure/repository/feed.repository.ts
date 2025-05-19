import { ExtendedEntityRepository } from '@infrastructure/database/postgres/extended-entity-repository';
import { Feed } from '@modules/feed/core/entity/feed';
import { PaginatedResponse } from '@infrastructure/utils/base/base-response';
import { EntityKey, QueryOrder } from '@mikro-orm/core';
import { Nullable } from '@/infrastructure/utils/types/types';

export class FeedRepository extends ExtendedEntityRepository<Feed> {
  async selectFeedBy(filter: { uuid: string }): Promise<Feed> {
    return await this.createQueryBuilder()
      .select('*')
      .where({ uuid: filter.uuid })
      .andWhere({ timestamp: { deletedAt: null } })
      .getSingleResult();
  }

  async selectFeedsBy(filter: {
    page?: number | string;
    size?: number | string;
    sort?: string;

    categoryId?: Nullable<number | string>;
    withJoin?: { category?: boolean; profile?: boolean; images?: boolean; files?: boolean };
  }): Promise<PaginatedResponse<Feed>> {
    const { withJoin = { category: true, profile: true, images: true, files: true } } = filter;

    const queryBuilder = this.createQueryBuilder('f');
    queryBuilder.where({ timestamp: { deletedAt: null } }).leftJoinAndSelect('f.writer', 'writer');

    if (withJoin.category) {
      queryBuilder.leftJoinAndSelect('f.category', 'category');
    }

    if (withJoin.files) {
      queryBuilder.leftJoinAndSelect('f.files', 'files');
    }

    if (withJoin.profile) {
      queryBuilder.leftJoinAndSelect('writer.profile', 'profile');
    }

    const categoryId = filter.categoryId ? parseInt(String(filter.categoryId), 10) : null;
    if (categoryId && !isNaN(categoryId)) {
      if (!withJoin.category) {
        queryBuilder.leftJoinAndSelect('f.category', 'category');
      }

      queryBuilder.andWhere({ category: { _id: categoryId } });
    }

    if (filter.sort) {
      const [field, direction] = filter.sort.split(':');
      const order = direction === 'desc' ? QueryOrder.DESC : QueryOrder.ASC;

      if (field === 'createdAt') {
        queryBuilder.orderBy({ timestamp: { createdAt: order } });
      } else if (field === 'title') {
        queryBuilder.orderBy({ title: order });
      } else {
        queryBuilder.orderBy({ timestamp: { createdAt: QueryOrder.DESC } });
      }
    } else {
      queryBuilder.orderBy({ timestamp: { createdAt: QueryOrder.DESC } });
    }

    const parsePageParam = (input: any): number => {
      const parsed = parseInt(String(input), 10);
      return isNaN(parsed) ? 0 : Math.max(0, parsed);
    };

    const parseSizeParam = (input: any, fallback: number = 10): number => {
      const parsed = parseInt(String(input), 10);
      return isNaN(parsed) ? fallback : Math.min(50, Math.max(1, parsed));
    };

    const page = parsePageParam(filter.page);
    const size = parseSizeParam(filter.size, 10);

    queryBuilder.limit(size).offset(page * size);

    const populateFields = ['writer'];
    if (withJoin.category) populateFields.push('category');
    if (withJoin.files) populateFields.push('files');
    if (withJoin.profile) populateFields.push('writer.profile');

    const populateOptions = populateFields.map((field) => ({ field: field as EntityKey<Feed> }));
    queryBuilder.populate(populateOptions);

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
