import { Embedded, Entity, EntityRepositoryType, ManyToOne, PrimaryKey } from '@mikro-orm/core';
import { ActivityRepository } from '../../infrastructure/repository/activity.repository';
import { AggregateRootIdentifier } from '@infrastructure/utils/structure/aggregate-root-id';
import { Profile } from '@modules/user/core/entity/profile';
import { Timestamp } from '@infrastructure/database/postgres/timestamp';
import { Property } from '@mikro-orm/postgresql';
import { ActivityConcreteBuilder } from '@modules/user/core/factory/activity.builder';
import { AggregateRoot } from '@nestjs/cqrs';

@Entity({ repository: () => ActivityRepository })
export class Activity extends AggregateRoot {
  [EntityRepositoryType]?: ActivityRepository;

  @PrimaryKey({ autoincrement: true })
  _id!: number;

  @Embedded({ prefix: false })
  identifier: AggregateRootIdentifier;

  @Property({ nullable: false })
  title: string;

  @Property({ nullable: false })
  description: string;

  @Property({ nullable: false })
  period: string[];

  @Property({ nullable: false })
  role: string;

  @Property({ nullable: false })
  team: string;

  @Property({ nullable: false })
  location: string;

  @Property({ nullable: false })
  isPublic: boolean;

  @Embedded({ prefix: false })
  timestamp: Timestamp;

  @ManyToOne(() => Profile)
  profile: Profile;

  constructor() {
    super();
  }

  static async register(data: {
    profile: Profile;
    title: string;
    description: string;
    period: string[];
    role: string;
    team: string;
    location: string;
    isPublic: boolean;
  }): Promise<Activity> {
    return new ActivityConcreteBuilder()
      .setProfile(data.profile)
      .setTitle(data.title)
      .setDescription(data.description)
      .setPeriod(data.period)
      .setRole(data.role)
      .setTeam(data.team)
      .setLocation(data.location)
      .setIsPublic(data.isPublic)
      .setTimestamp()
      .build();
  }

  async edit(data: {
    title: string;
    description: string;
    period: string[];
    role: string;
    team: string;
    location: string;
    isPublic: boolean;
  }): Promise<Activity> {
    this.title = data.title;
    this.description = data.description;
    this.period = data.period;
    this.role = data.role;
    this.team = data.team;
    this.location = data.location;
    this.isPublic = data.isPublic;
    this.timestamp.updatedAt = new Date();

    return this;
  }
}
