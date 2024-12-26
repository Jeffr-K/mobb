import { Embedded, Entity, EntityRepositoryType, ManyToOne, PrimaryKey } from '@mikro-orm/core';
import { GarageRepository } from '../../infrastructure/repository/garage.repository';
import { AggregateRootIdentifier } from '@infrastructure/utils/structure/aggregate-root-id';
import { Profile } from '@modules/user/core/entity/profile';
import { Property } from '@mikro-orm/postgresql';
import { GarageConcreteBuilder } from '@modules/user/core/factory/garage.builder';

@Entity({ repository: () => GarageRepository })
export class Garage {
  [EntityRepositoryType]?: GarageRepository;

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

  @ManyToOne(() => Profile)
  profile: Profile;

  static async register(data: {
    profile: Profile;
    title: string;
    description: string;
    period: string[];
    role: string;
    team: string;
    location: string;
    isPublic: boolean;
  }): Promise<Garage> {
    return new GarageConcreteBuilder()
      .setProfile(data.profile)
      .setTitle(data.title)
      .setDescription(data.description)
      .setPeriod(data.period)
      .setRole(data.role)
      .setTeam(data.team)
      .setLocation(data.location)
      .setIsPublic(data.isPublic)
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
  }): Promise<Garage> {
    this.title = data.title;
    this.description = data.description;
    this.period = data.period;
    this.role = data.role;
    this.team = data.team;
    this.location = data.location;
    this.isPublic = data.isPublic;

    return this;
  }
}
