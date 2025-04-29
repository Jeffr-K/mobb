import { Feed } from '@modules/feed/core/entity/feed';
import { Timestamp } from '@infrastructure/database/postgres/timestamp';
import { AggregateRootIdentifier } from '@infrastructure/utils/structure/aggregate-root-id';
import { User } from '@modules/user/core/entity/user';
import { FeedImage } from '@modules/feed/interface/adapter/adapter';

export interface FeedConcreteBuilder {
  build(): Feed;
}

export class FeedConcreteBuilder implements FeedConcreteBuilder {
  private readonly feed: Feed;

  constructor() {
    this.feed = new Feed();
    this.feed.identifier = new AggregateRootIdentifier();
  }

  get Identifier(): AggregateRootIdentifier {
    return this.feed.identifier;
  }

  setTitle(title: string): this {
    this.feed.title = title;
    return this;
  }

  setContent(content: string): this {
    this.feed.content = content;
    return this;
  }

  setImages(images: FeedImage[]): this {
    this.feed.images = images;
    return this;
  }

  setWriter(user: User): this {
    this.feed.writer = user;
    return this;
  }

  setTimestamp(): this {
    this.feed.timestamp = new Timestamp({
      createdAt: new Date(),
      updatedAt: null,
      deletedAt: null,
    });

    return this;
  }

  build(): Feed {
    return this.feed;
  }
}
