import { Embedded, Entity, EntityRepositoryType, ManyToOne, PrimaryKey } from '@mikro-orm/core';
import { EducationRepository } from '../../infrastructure/repository/education.repository';
import { AggregateRootIdentifier } from '@infrastructure/utils/structure/aggregate-root-id';
import { Profile } from '@modules/user/core/entity/profile';
import { Property } from '@mikro-orm/postgresql';
import { Timestamp } from '@infrastructure/database/postgres/timestamp';
import { EducationConcreteBuilder } from '@modules/user/core/factory/education.builder';

@Entity({ repository: () => EducationRepository })
export class Education {
  [EntityRepositoryType]?: EducationRepository;

  @PrimaryKey({ autoincrement: true })
  _id!: number;

  @Embedded({ prefix: false })
  identifier: AggregateRootIdentifier;

  @Property({ nullable: false })
  status: string;

  @Property({ nullable: false })
  school: string;

  @Property({ nullable: false })
  major: string;

  @Property({ nullable: false })
  degree: string;

  @Property({ nullable: false })
  period: string[];

  @Property({ nullable: false })
  description: string;

  @ManyToOne(() => Profile)
  profile: Profile;

  @Embedded(() => Timestamp, { prefix: false })
  timestamp: Timestamp;

  static async register(data: {
    profile: Profile;
    status: string;
    school: string;
    major: string;
    degree: string;
    period: string[];
    description: string;
  }): Promise<Education> {
    return new EducationConcreteBuilder()
      .setProfile(data.profile)
      .setStatus(data.status)
      .setSchool(data.school)
      .setMajor(data.major)
      .setDegree(data.degree)
      .setPeriod(data.period)
      .setDescription(data.description)
      .setTimestamp()
      .build();
  }

  async edit(data: {
    status: string;
    school: string;
    major: string;
    degree: string;
    period: string[];
    description: string;
  }): Promise<Education> {
    this.status = data.status;
    this.school = data.school;
    this.major = data.major;
    this.degree = data.degree;
    this.period = data.period;
    this.description = data.description;
    this.timestamp.updatedAt = new Date();

    return this;
  }
}
