import { Garage } from '@modules/user/core/entity/garage';
import { Profile } from '@modules/user/core/entity/profile';
import { AggregateRootIdentifier } from '@infrastructure/utils/structure/aggregate-root-id';

export class GarageConcreteBuilder {
  private readonly garage: Garage;

  constructor() {
    this.garage = new Garage();
    this.garage.identifier = new AggregateRootIdentifier();
  }

  setProfile(profile: Profile): this {
    this.garage.profile = profile;
    return this;
  }

  setTitle(title: string): this {
    this.garage.title = title;
    return this;
  }

  setDescription(description: string): this {
    this.garage.description = description;
    return this;
  }

  setPeriod(period: string[]): this {
    this.garage.period = period;
    return this;
  }

  setRole(role: string): this {
    this.garage.role = role;
    return this;
  }

  setTeam(team: string): this {
    this.garage.team = team;
    return this;
  }

  setLocation(location: string): this {
    this.garage.location = location;
    return this;
  }

  setIsPublic(isPublic: boolean): this {
    this.garage.isPublic = isPublic;
    return this;
  }

  build(): Garage {
    return this.garage;
  }
}
