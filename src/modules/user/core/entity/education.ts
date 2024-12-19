import { Embedded, Entity, EntityRepositoryType, ManyToOne, PrimaryKey } from '@mikro-orm/core';
import { EducationRepository } from '../../infrastructure/repository/education.repository';
import { AggregateRootIdentifier } from '@infrastructure/utils/structure/aggregate-root-id';
import { Profile } from '@modules/user/core/entity/profile';
import { Property } from '@mikro-orm/postgresql';

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
}
