import { Embedded, Entity, EntityRepositoryType, PrimaryKey } from '@mikro-orm/core';
import { EducationRepository } from '../../infrastructure/repository/education.repository';
import { AggregateRootIdentifier } from '../../../../infrastructure/utils/structure/aggregate-root-id';

@Entity({ repository: () => EducationRepository })
export class Education {
  [EntityRepositoryType]?: EducationRepository;

  @PrimaryKey({ autoincrement: true })
  _id!: number;

  @Embedded({ prefix: false })
  identifier: AggregateRootIdentifier;
}
