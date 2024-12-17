import { ExtendedEntityRepository } from '@infrastructure/database/postgres/extended-entity-repository';
import { Comment } from '@modules/feed/core/entity/comment';

export class CommentRepository extends ExtendedEntityRepository<Comment> {
  async selectCommentBy(data: { uuid: string }): Promise<Comment> {
    return this.createQueryBuilder()
      .select('*')
      .where({ identifier: { uuid: data.uuid } })
      .getSingleResult();
    // .leftJoinAndSelect('c.writer', 'writer')
    // .leftJoinAndSelect('c.feed', 'feed')
    // .leftJoinAndSelect('c.replies', 'replies')
    // .leftJoinAndSelect('c.parent', 'parent')
  }

  async selectCommentsBy(data: { feedId: string }): Promise<Comment[]> {
    return await this.createQueryBuilder()
      .select('*')
      .where({ identifier: { uuid: data.feedId } })
      .orderBy({ 'c.timestamp.createdAt': 'DESC' })
      .getResult();
    // .leftJoinAndSelect('c.writer', 'writer')
    // .leftJoinAndSelect('c.replies', 'replies')
  }

  async selectReplyCount(commentUuid: string): Promise<number> {
    return this.createQueryBuilder('c')
      .select('count(*)')
      .where({ 'c.parent.identifier.uuid': commentUuid })
      .getCount();
  }
}
