import { ExtendedEntityRepository } from '@infrastructure/database/postgres/extended-entity-repository';
import { Comment } from '@modules/feed/core/entity/comment';
import { QueryOrder } from '@mikro-orm/core';
import { PaginatedResponse } from '@infrastructure/utils/base/base-response';

export class CommentRepository extends ExtendedEntityRepository<Comment> {
  async selectCommentBy(data: { uuid?: string; feed?: string; writer?: string; parent?: string }): Promise<Comment> {
    let where = {};

    if (data.uuid) {
      where = { ...where, identifier: { uuid: data.uuid } };
    }
    if (data.feed) {
      where = { ...where, feed: { identifier: { uuid: data.feed } } };
    }
    if (data.writer) {
      where = { ...where, writer: { identifier: { uuid: data.writer } } };
    }
    if (data.parent) {
      where = { ...where, parent: { identifier: { uuid: data.parent } } };
    }

    return this.createQueryBuilder()
      .select('*')
      .where({ ...where })
      .getSingleResult();
  }

  async selectCommentsBy(data: { feedId: string; page?: number; limit?: number }): Promise<PaginatedResponse<Comment>> {
    const [comment, count] = await this.createQueryBuilder('c')
      .select('*')
      .leftJoin('c.feed', `feed`)
      .where({ feed: { identifier: { uuid: data.feedId } } })
      .orderBy({ timestamp: { createdAt: QueryOrder.DESC } })
      .limit(data.limit)
      .offset((data.page - 1) * data.limit)
      .getResultAndCount();

    return {
      items: comment,
      total: count,
      pageCount: Math.ceil(count / data.limit),
      currentPage: data.page,
      pageSize: data.limit,
    };
  }

  async selectReplyCount(commentUuid: string): Promise<number> {
    return this.createQueryBuilder('c')
      .select('count(*)')
      .where({ 'c.parent.identifier.uuid': commentUuid })
      .getCount();
  }
}
