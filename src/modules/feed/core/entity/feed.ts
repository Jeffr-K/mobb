import { Embedded, Entity, EntityRepositoryType, ManyToOne, PrimaryKey } from '@mikro-orm/core';
import { AggregateRootIdentifier } from '@infrastructure/utils/structure/aggregate-root-id';
import { Property } from '@mikro-orm/postgresql';
import { Timestamp } from '@infrastructure/database/postgres/timestamp';
import { FeedRepository } from '@modules/feed/infrastructure/repository/feed.repository';
import { FeedConcreteBuilder } from '@modules/feed/core/factory/feed.factory';
import { AggregateRoot } from '@nestjs/cqrs';
import { User } from '@modules/user/core/entity/user';

@Entity({ repository: () => FeedRepository })
export class Feed extends AggregateRoot {
  [EntityRepositoryType]?: FeedRepository;

  @PrimaryKey({ autoincrement: true })
  _id!: number;

  @Embedded({ prefix: false })
  identifier: AggregateRootIdentifier;

  @Property()
  title: string;

  @Property()
  content: string;

  @Property()
  images: string[];

  @Embedded(() => Timestamp, { prefix: false })
  timestamp: Timestamp;

  @ManyToOne(() => User, { serializer: user => user?._id })
  writer!: User;

  constructor() {
    super();
  }

  static async register(feed: { title: string; content: string; images: string[]; user: User }): Promise<Feed> {
    return new FeedConcreteBuilder()
      .setTitle(feed.title)
      .setContent(feed.content)
      .setImages(feed.images)
      .setWriter(feed.user)
      .setTimestamp()
      .build();
  }

  async edit(feed: { title?: string; content?: string; images?: string[] }): Promise<void> {
    this.title = feed.title;
    this.content = feed.content;
    this.images = feed.images;
    this.timestamp.updatedAt = new Date();
  }
}
