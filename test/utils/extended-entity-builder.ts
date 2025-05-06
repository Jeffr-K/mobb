import { User } from '@/modules/user/core/entity/user';
import { UserConcreteBuilder } from '@modules/user/core/factory/user.builder';
import { faker } from '@faker-js/faker';
import { FeedCategoryConcreteBuilder } from '@modules/feed/core/factory/feed-category.factory';
import { FeedCategory } from '@modules/feed/core/entity/feed-category';

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

export class ExtendedFeedCategoryBuilder extends FeedCategoryConcreteBuilder {
  static random(): FeedCategory {
    return new FeedCategoryConcreteBuilder()
      .setName(faker.lorem.word())
      .setParent(this.take(1)[0])
      .setTimestamp()
      .build();
  }

  static take(count: number): FeedCategory[] {
    return Array.from({ length: count }, () => this.random());
  }
}