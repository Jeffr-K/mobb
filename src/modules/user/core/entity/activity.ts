import { Embedded, Entity, EntityRepositoryType, ManyToOne, PrimaryKey } from '@mikro-orm/core';
import { ActivityRepository } from '../../infrastructure/repository/activity.repository';
import { AggregateRootIdentifier } from '@infrastructure/utils/structure/aggregate-root-id';
import { Profile } from '@modules/user/core/entity/profile';
import { Timestamp } from '@infrastructure/database/postgres/timestamp';
import { Property } from '@mikro-orm/postgresql';

@Entity({ repository: () => ActivityRepository })
export class Activity {
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

  constructor() {}

  static async register(): Promise<Activity> {
    return new Activity();
  }
}