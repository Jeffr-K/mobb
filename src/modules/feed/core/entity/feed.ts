import { Embedded, Entity, EntityRepositoryType, ManyToOne, PrimaryKey } from '@mikro-orm/core';
import { AggregateRootIdentifier } from '@infrastructure/utils/structure/aggregate-root-id';
import { Property } from '@mikro-orm/postgresql';
import { Timestamp } from '@infrastructure/database/postgres/timestamp';
import { FeedRepository } from '@modules/feed/infrastructure/repository/feed.repository';
import { FeedConcreteBuilder } from '@modules/feed/core/factory/feed.factory';
import { AggregateRoot } from '@nestjs/cqrs';
import { User } from '@modules/user/core/entity/user';
import { FeedImage } from '@modules/feed/interface/adapter/adapter';
import { FeedCategory } from '@modules/feed/core/entity/feed-category';

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
  images: FeedImage[];

  @Embedded(() => Timestamp, { prefix: false })
  timestamp: Timestamp;

  @ManyToOne(() => User, {
    serializer: (user: User) => {
      return { _id: user?._id, name: user?.username, email: user?.email };
    },
    hidden: false,
  })
  writer!: User;

  @ManyToOne(() => FeedCategory, {
    serializer: (category: FeedCategory) => {
      return { _id: category?._id, identifier: category.identifier, name: category?.name };
    },
    hidden: false,
  })
  category!: FeedCategory;

  constructor() {
    super();
  }

  static async register(feed: {
    title: string;
    content: string;
    images: FeedImage[];
    user: User;
    category: FeedCategory;
  }): Promise<Feed> {
    return new FeedConcreteBuilder()
      .setTitle(feed.title)
      .setContent(feed.content)
      .setImages(feed.images)
      .setWriter(feed.user)
      .setTimestamp()
      .setCategory(feed.category)
      .build();
  }

  async edit(feed: { title?: string; content?: string; images?: FeedImage[] }): Promise<void> {
    this.title = feed.title;
    this.content = feed.content;
    this.images = feed.images;
    this.timestamp.updatedAt = new Date();
  }
}
