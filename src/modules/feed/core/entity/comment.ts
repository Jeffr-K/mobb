import { Collection, Embedded, Entity, EntityRepositoryType, ManyToOne, OneToMany, PrimaryKey } from '@mikro-orm/core';
import { AggregateRootIdentifier } from '@infrastructure/utils/structure/aggregate-root-id';
import { Property } from '@mikro-orm/postgresql';
import { Timestamp } from '@infrastructure/database/postgres/timestamp';
import { CommentRepository } from '@modules/feed/infrastructure/repository/comment.repository';
import { Feed } from '@modules/feed/core/entity/feed';
import { User } from '@modules/user/core/entity/user';
import { CommentConcreteBuilder } from '@modules/feed/core/factory/comment.factory';

@Entity({ repository: () => CommentRepository })
export class Comment {
  [EntityRepositoryType]?: CommentRepository;

  @PrimaryKey({ autoincrement: true })
  _id!: number;

  @Embedded({ prefix: false })
  identifier: AggregateRootIdentifier;

  @Property()
  content!: string;

  @Property({ default: 0 })
  depth: number;

  @ManyToOne(() => Comment, { nullable: true, hidden: true })
  parent?: Comment;

  @OneToMany(() => Comment, (comment) => comment.parent, { lazy: true, hidden: true })
  replies = new Collection<Comment>(this);

  @Embedded({ prefix: false })
  timestamp: Timestamp;

  @ManyToOne(() => User, { hidden: true })
  writer!: User;

  @ManyToOne(() => Feed, { hidden: true })
  feed!: Feed;

  static async addComment(data: { feed: Feed; writer: User; content: string }): Promise<Comment> {
    return new CommentConcreteBuilder()
      .setFeed(data.feed)
      .setWriter(data.writer)
      .setContent(data.content)
      .setDepth(0)
      .setTimestamp()
      .build();
  }

  async editComment(data: { content: string }): Promise<Comment> {
    if (!data.content || data.content.trim() === '') {
      throw new Error('Content cannot be empty');
    }
    if (this.timestamp.deletedAt) {
      throw new Error('Cannot edit deleted comment');
    }

    this.timestamp.updatedAt = new Date();
    this.content = data.content.trim();
    return this;
  }

  async deleteComment(): Promise<Comment> {
    if (this.timestamp.deletedAt) {
      throw new Error('Comment is already deleted');
    }

    this.timestamp.deletedAt = new Date();

    this.content = this.replies.length > 0 ? '[deleted]' : '';

    return this;
  }

  async addReply(data: { feed: Feed; writer: User; content: string }): Promise<Comment> {
    const MAX_DEPTH = 2;

    if (this.depth >= MAX_DEPTH) {
      throw new Error('Maximum reply depth exceeded');
    }

    return new CommentConcreteBuilder()
      .setFeed(this.feed)
      .setParent(this)
      .setWriter(data.writer)
      .setDepth(this.depth + 1)
      .setContent(data.content)
      .setTimestamp()
      .build();
  }

  async editReply(data: { content: string }): Promise<Comment> {
    if (!data.content || data.content.trim() === '') {
      throw new Error('Content cannot be empty');
    }
    if (this.timestamp.deletedAt) {
      throw new Error('Cannot edit deleted reply');
    }

    this.timestamp.updatedAt = new Date();
    this.content = data.content.trim();
    return this;
  }

  async deleteReply(): Promise<Comment> {
    if (this.timestamp.deletedAt) {
      throw new Error('Reply is already deleted');
    }

    this.timestamp.deletedAt = new Date();
    this.content = '[deleted]';

    return this;
  }
}
