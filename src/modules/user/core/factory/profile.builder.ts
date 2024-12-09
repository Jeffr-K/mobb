import { AggregateRootIdentifier } from 'src/infrastructure/utils/structure/aggregate-root-id';
import { Profile } from '../entity/profile';

export interface ProfileBuilder {
  build(): Profile;
}

export class ProfileConcreteBuilder implements ProfileBuilder {
  private readonly profile: Profile;

  constructor() {
    this.profile = new Profile();
    this.profile.identifier = new AggregateRootIdentifier();
  }

  build(): Profile {
    return this.profile;
  }
}
