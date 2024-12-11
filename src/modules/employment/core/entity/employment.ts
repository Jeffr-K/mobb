import { Embedded, Entity, EntityRepositoryType, PrimaryKey } from '@mikro-orm/core';
import { AggregateRootIdentifier } from '@infrastructure/utils/structure/aggregate-root-id';
import { EmploymentRepository } from '@modules/employment/infrastructure/repository/employment.repository';

@Entity({ repository: () => EmploymentRepository })
export class Employment {
  [EntityRepositoryType]?: EmploymentRepository;

  @PrimaryKey({ autoincrement: true })
  _id!: number;

  @Embedded({ prefix: false })
  identifier: AggregateRootIdentifier;
}
