import { Education } from '@modules/user/core/entity/education';
import { AggregateRootIdentifier } from '@infrastructure/utils/structure/aggregate-root-id';
import { Timestamp } from '@infrastructure/database/postgres/timestamp';
import { Profile } from '@modules/user/core/entity/profile';

export class EducationConcreteBuilder {
  private readonly education: Education;

  constructor() {
    this.education = new Education();
    this.education.identifier = new AggregateRootIdentifier({});
  }

  setProfile(profile: Profile): this {
    this.education.profile = profile;
    return this;
  }

  setStatus(status: string): this {
    this.education.status = status;
    return this;
  }

  setSchool(school: string): this {
    this.education.school = school;
    return this;
  }

  setMajor(major: string): this {
    this.education.major = major;
    return this;
  }

  setDegree(degree: string): this {
    this.education.degree = degree;
    return this;
  }

  setPeriod(period: string[]): this {
    this.education.period = period;
    return this;
  }

  setDescription(description: string): this {
    this.education.description = description;
    return this;
  }

  setTimestamp(): this {
    this.education.timestamp = new Timestamp({
      createdAt: new Date(),
      updatedAt: null,
      deletedAt: null,
    });
    return this;
  }

  build(): Education {
    return this.education;
  }
}
