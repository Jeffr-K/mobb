import { Embedded, Entity, EntityRepositoryType, PrimaryKey } from '@mikro-orm/core';
import { FeedCategoryRepository } from '@modules/feed/infrastructure/repository/feed-category.repository';
import { AggregateRoot } from '@nestjs/cqrs';
import { AggregateRootIdentifier } from '@infrastructure/utils/structure/aggregate-root-id';
import { Property } from '@mikro-orm/postgresql';
import { Timestamp } from '@infrastructure/database/postgres/timestamp';
import { FeedCategoryConcreteBuilder } from '@modules/feed/core/factory/feed-category.factory';

@Entity({ repository: () => FeedCategoryRepository })
export class FeedCategory extends AggregateRoot {
  [EntityRepositoryType]?: FeedCategoryRepository;

  @PrimaryKey({ autoincrement: true })
  _id!: number;

  @Embedded({ prefix: false })
  identifier: AggregateRootIdentifier;

  @Property()
  name: string;

  @Property()
  parent: FeedCategory;

  @Embedded(() => Timestamp, { prefix: false })
  timestamp: Timestamp;

  constructor() {
    super();
  }

  static async register(category: { name: string; parent?: FeedCategory }): Promise<FeedCategory> {
    return new FeedCategoryConcreteBuilder()
      .setName(category.name)
      .setParent(category.parent ? category.parent : null)
      .setTimestamp()
      .build();
  }
}
