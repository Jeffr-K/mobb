import { Profile } from '../entity/profile';
import { Timestamp } from '@infrastructure/database/postgres/timestamp';
import day from 'dayjs';
import { User } from '@modules/user/core/entity/user';
import { Persona } from '@modules/user/core/value/embeddable/persona';
import { Skill } from '@modules/user/core/value/embeddable/skill';
import { AggregateRootIdentifier } from '@infrastructure/utils/structure/aggregate-root-id';

export interface ProfileBuilder {
  build(): Profile;
}

export class ProfileConcreteBuilder implements ProfileBuilder {
  private readonly profile: Profile;

  constructor() {
    this.profile = new Profile();
    this.profile.identifier = new AggregateRootIdentifier({});
  }

  setPersona(): this {
    this.profile.persona = new Persona({
      cave: 'default',
      personal: 'default',
      identity: 'default',
      interests: ['default'],
      location: 'default',
      description: 'default',
      summary: 'default',
    });

    return this;
  }

  setSkill(): this {
    this.profile.skill = new Skill({
      techSkills: [],
      usableTools: [],
    });

    return this;
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
