import { Embedded, Entity, EntityRepositoryType, PrimaryKey } from '@mikro-orm/core';
import { ExperienceRepository } from '../../infrastructure/repository/experience.repository';
import { AggregateRootIdentifier } from '../../../../infrastructure/utils/structure/aggregate-root-id';

@Entity({ repository: () => ExperienceRepository })
export class Experience {
  [EntityRepositoryType]?: ExperienceRepository;

  @PrimaryKey({ autoincrement: true })
  _id!: number;

  @Embedded({ prefix: false })
  identifier: AggregateRootIdentifier;
}
