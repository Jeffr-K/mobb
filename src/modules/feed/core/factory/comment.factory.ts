import { User } from '@modules/user/core/entity/user';
import { Feed } from '@modules/feed/core/entity/feed';
import { Timestamp } from '@infrastructure/database/postgres/timestamp';
import { AggregateRootIdentifier } from '@infrastructure/utils/structure/aggregate-root-id';
import { Comment } from '@modules/feed/core/entity/comment';

export interface CommentConcreteBuilder {
  build(): Comment;
}

export class CommentConcreteBuilder implements CommentConcreteBuilder {
  private readonly comment: Comment;

  constructor() {
    this.comment = new Comment();
    this.comment.identifier = new AggregateRootIdentifier();
  }

  get Identifier(): AggregateRootIdentifier {
    return this.comment.identifier;
  }

  setContent(content: string): this {
    this.comment.content = content;
    return this;
  }

  setDepth(depth: number): this {
    this.comment.depth = depth;
    return this;
  }

  setParent(parent: Comment): this {
    this.comment.parent = parent;
    return this;
  }

  setTimestamp(): this {
    this.comment.timestamp = new Timestamp({
      createdAt: new Date(),
      updatedAt: null,
      deletedAt: null,
    });

    return this;
  }

  setWriter(writer: User): this {
    this.comment.writer = writer;
    return this;
  }

  setFeed(feed: Feed): this {
    this.comment.feed = feed;
    return this;
  }

  build(): Comment {
    return this.comment;
  }
}
