import { FeedCategory } from '../entity/feed-category';
import { AggregateRootIdentifier } from '@infrastructure/utils/structure/aggregate-root-id';
import { Timestamp } from '@infrastructure/database/postgres/timestamp';

export class FeedCategoryConcreteBuilder {
  private readonly feedCategory: FeedCategory;

  constructor() {
    this.feedCategory = new FeedCategory();
    this.feedCategory.identifier = new AggregateRootIdentifier({});
  }

  get Identifier(): AggregateRootIdentifier {
    return this.feedCategory.identifier;
  }

  setName(name: string): this {
    this.feedCategory.name = name;
    return this;
  }

  setParent(parent: FeedCategory): this {
    this.feedCategory.parent = parent;
    return this;
  }

  setTimestamp(): this {
    this.feedCategory.timestamp = new Timestamp({
      createdAt: new Date(),
      updatedAt: null,
      deletedAt: null,
    });

    return this;
  }

  build(): FeedCategory {
    return this.feedCategory;
  }
}
