import { Embedded, Entity, EntityRepositoryType, ManyToOne, PrimaryKey } from '@mikro-orm/core';
import { ExperienceRepository } from '../../infrastructure/repository/experience.repository';
import { AggregateRootIdentifier } from '@infrastructure/utils/structure/aggregate-root-id';
import { Profile } from '@modules/user/core/entity/profile';
import { Property } from '@mikro-orm/postgresql';

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
}
