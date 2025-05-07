import { User } from '@/modules/user/core/entity/user';
import { UserConcreteBuilder } from '@modules/user/core/factory/user.builder';
import { faker } from '@faker-js/faker';
import { FeedCategoryConcreteBuilder } from '@modules/feed/core/factory/feed-category.factory';
import { FeedCategory } from '@modules/feed/core/entity/feed-category';
import { FeedConcreteBuilder } from '@modules/feed/core/factory/feed.factory';
import { Nullable } from '@infrastructure/utils/types/types';
import { Feed } from '@modules/feed/core/entity/feed';

export class ExtendedUserBuilder extends UserConcreteBuilder {
  static random(): UserConcreteBuilder {
    return new UserConcreteBuilder()
      .setUsername(faker.internet.username())
      .setEmail(faker.internet.email())
      .setPassword(faker.internet.password())
      .setAgreements({
        terms: true,
        privacyPolicy: true,
        notMinority: true,
      })
      .setTimestamp();
  }

  static take(count: number): User[] {
    return Array.from({ length: count }, () => this.random().build());
  }
}

export class ExtendedFeedBuilder extends FeedConcreteBuilder {
  static random(options?: { withCategory: FeedCategory }): FeedConcreteBuilder {
    const builder = new FeedConcreteBuilder()
      .setTitle(faker.lorem.sentence())
      .setContent(faker.lorem.paragraph())
      .setWriter(ExtendedUserBuilder.random().build())
      .setTimestamp();

    if (options?.withCategory) {
      builder.setCategory(options.withCategory);
    }

    return builder;
  }

  static take(count: 1, options: { withCategory: FeedCategory }): Feed;
  static take(count: number, options: { withCategory: FeedCategory }): Feed[];
  static take(count: number, options: { withCategory: FeedCategory }): Feed | Feed[] {
    switch (count) {
      case 0:
        throw new Error('ExtendedFeedBuilder.take: count must be greater than 0');
      case 1:
        return this.random(options).setTitle(faker.lorem.sentence()).setTimestamp().build();
      case 2:
        return Array.from({ length: count }, () => this.random(options).build());
    }
  }
}

export class ExtendedFeedCategoryBuilder extends FeedCategoryConcreteBuilder {
  static random(withParent: boolean = false): FeedCategoryConcreteBuilder {
    const builder = new FeedCategoryConcreteBuilder().setName(faker.lorem.word()).setTimestamp();

    switch (withParent) {
      case true:
        builder.setParent(new FeedCategoryConcreteBuilder().setName(faker.lorem.word()).setTimestamp().build());
        break;
      case false:
        builder.setParent(null);
        break;
    }

    return builder;
  }

  static take(count: 1, withParent: boolean): FeedCategory;
  static take(count: number, withParent: boolean): FeedCategory[];
  static take(count: number, withParent: boolean = false): FeedCategory | FeedCategory[] {
    switch (count) {
      case 0:
        throw new Error('ExtendedFeedCategoryBuilder.take: count must be greater than 0');
      case 1:
        return this.random(withParent).setName(faker.lorem.word()).setTimestamp().build();
      case 2:
        return Array.from({ length: count }, () => this.random(withParent).build());
    }
  }
}
