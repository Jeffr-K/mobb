import { Collection, Embedded, Entity, EntityRepositoryType, OneToMany, OneToOne, PrimaryKey } from '@mikro-orm/core';
import { AggregateRootIdentifier } from 'src/infrastructure/utils/structure/aggregate-root-id';
import { ProfileRepository } from '../../infrastructure/repository/profile.repository';
import { Persona } from '@modules/user/core/value/embeddable/persona';
import { Experience } from '@modules/user/core/entity/experience';
import { Education } from '@modules/user/core/entity/education';
import { Activity } from '@modules/user/core/entity/activity';
import { Skill } from '@modules/user/core/value/embeddable/skill';
import { Garage } from '@modules/user/core/entity/garage';
import { Timestamp } from '@infrastructure/database/postgres/timestamp';
import { User } from '@modules/user/core/entity/user';
import { ProfileConcreteBuilder } from '@modules/user/core/factory/profile.builder';
import { AggregateRoot } from '@nestjs/cqrs';

@Entity({ repository: () => ProfileRepository })
export class Profile extends AggregateRoot {
  [EntityRepositoryType]?: ProfileRepository;

  @PrimaryKey({ autoincrement: true })
  _id!: number;

  @Embedded({ prefix: false })
  identifier: AggregateRootIdentifier;

  @Embedded({ prefix: false, nullable: true })
  persona?: Persona;

  @Embedded({ prefix: false, nullable: true })
  skill?: Skill;

  @OneToMany(() => Experience, (experience) => experience.profile, { nullable: true })
  experience = new Collection<Experience>(this);

  @OneToMany(() => Education, (education) => education.profile, { nullable: true })
  education = new Collection<Education>(this);

  @OneToMany(() => Activity, (activity) => activity.profile, { nullable: true })
  activity = new Collection<Activity>(this);

  @OneToMany(() => Garage, (garage) => garage.profile, { nullable: true })
  garage = new Collection<Garage>(this);

  @OneToOne(() => User, (user) => user.profile, { orphanRemoval: true })
  user: User;

  @Embedded({ prefix: false })
  timestamp: Timestamp;

  constructor() {
    super();
  }

  static async register(data: { user: User }): Promise<Profile> {
    return new ProfileConcreteBuilder().setUser(data.user).setTimestamp().build();
  }
}
