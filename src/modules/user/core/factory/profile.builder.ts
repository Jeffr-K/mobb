import { AggregateRootIdentifier } from 'src/infrastructure/utils/structure/aggregate-root-id';
import { Profile } from '../entity/profile';
import { Timestamp } from '@infrastructure/database/postgres/timestamp'
import day from 'dayjs';
import { User } from '@modules/user/core/entity/user';

export interface ProfileBuilder {
  build(): Profile;
}

export class ProfileConcreteBuilder implements ProfileBuilder {
  private readonly profile: Profile;

  constructor() {
    this.profile = new Profile();
    this.profile.identifier = new AggregateRootIdentifier();
  }

  setUser(user: User): this {
    this.profile.user = user;
    return this;
  }

  setTimestamp(): this {
    this.profile.timestamp = new Timestamp({
      createdAt: day().toDate(),
      updatedAt: null,
      deletedAt: null,
    });
    return this;
  }

  build(): Profile {
    return this.profile;
  }
}
