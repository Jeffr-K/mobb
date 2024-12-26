import { Embedded, Entity, EntityRepositoryType, ManyToOne, PrimaryKey } from '@mikro-orm/core';
import { ExperienceRepository } from '../../infrastructure/repository/experience.repository';
import { AggregateRootIdentifier } from '@infrastructure/utils/structure/aggregate-root-id';
import { Profile } from '@modules/user/core/entity/profile';
import { Property } from '@mikro-orm/postgresql';
import { ExperienceConcreteBuilder } from '@modules/user/core/factory/experience.builder';
import { Timestamp } from '@infrastructure/database/postgres/timestamp';

@Entity({ repository: () => ExperienceRepository })
export class Experience {
  [EntityRepositoryType]?: ExperienceRepository;

  @PrimaryKey({ autoincrement: true })
  _id!: number;

  @Embedded({ prefix: false })
  identifier: AggregateRootIdentifier;

  @Property({ nullable: false })
  companyName: string;

  @Property({ nullable: false })
  companyLogo: string;

  @Property({ nullable: false })
  companyArea: string;

  @Property({ nullable: false })
  team: string;

  @Property({ nullable: false })
  role: string;

  @Property({ nullable: false })
  summary: string;

  @Property({ nullable: false })
  description: string;

  @Property({ nullable: false })
  period: string[];

  @Property({ nullable: false })
  location: string;

  @ManyToOne(() => Profile)
  profile: Profile;

  @Embedded(() => Timestamp, { prefix: false })
  timestamp: Timestamp;

  static async register(data: {
    profile: Profile;
    companyName: string;
    companyLogo: string;
    companyArea: string;
    team: string;
    role: string;
    summary: string;
    description: string;
    period: string[];
    location: string;
  }): Promise<Experience> {
    return new ExperienceConcreteBuilder()
      .setProfile(data.profile)
      .setCompanyName(data.companyName)
      .setCompanyLogo(data.companyLogo)
      .setCompanyArea(data.companyArea)
      .setTeam(data.team)
      .setRole(data.role)
      .setSummary(data.summary)
      .setDescription(data.description)
      .setPeriod(data.period)
      .setLocation(data.location)
      .setTimestamp()
      .build();
  }

  async edit(data: {
    companyName: string;
    companyLogo: string;
    companyArea: string;
    team: string;
    role: string;
    summary: string;
    description: string;
    period: string[];
    location: string;
  }): Promise<Experience> {
    this.companyName = data.companyName;
    this.companyLogo = data.companyLogo;
    this.companyArea = data.companyArea;
    this.team = data.team;
    this.role = data.role;
    this.summary = data.summary;
    this.description = data.description;
    this.period = data.period;
    this.location = data.location;
    this.timestamp.updatedAt = new Date();

    return this;
  }
}
