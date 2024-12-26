import { Experience } from '@modules/user/core/entity/experience';
import { AggregateRootIdentifier } from '@infrastructure/utils/structure/aggregate-root-id';
import { Timestamp } from '@infrastructure/database/postgres/timestamp';
import day from 'dayjs';
import { Profile } from '@modules/user/core/entity/profile';

export class ExperienceConcreteBuilder {
  private readonly experience: Experience;

  constructor() {
    this.experience = new Experience();
    this.experience.identifier = new AggregateRootIdentifier();
  }

  setProfile(profile: Profile): this {
    this.experience.profile = profile;
    return this;
  }

  setCompanyName(companyName: string): this {
    this.experience.companyName = companyName;
    return this;
  }

  setCompanyLogo(companyLogo: string): this {
    this.experience.companyLogo = companyLogo;
    return this;
  }

  setCompanyArea(companyArea: string): this {
    this.experience.companyArea = companyArea;
    return this;
  }

  setTeam(team: string): this {
    this.experience.team = team;
    return this;
  }

  setRole(role: string): this {
    this.experience.role = role;
    return this;
  }

  setSummary(summary: string): this {
    this.experience.summary = summary;
    return this;
  }

  setDescription(description: string): this {
    this.experience.description = description;
    return this;
  }

  setPeriod(period: string[]): this {
    this.experience.period = period;
    return this;
  }

  setLocation(location: string): this {
    this.experience.location = location;
    return this;
  }

  setTimestamp(): this {
    this.experience.timestamp = new Timestamp({
      createdAt: day().toDate(),
      updatedAt: null,
      deletedAt: null,
    });
    return this;
  }

  build(): Experience {
    return this.experience;
  }
}
