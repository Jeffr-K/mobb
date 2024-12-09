import { Embedded, Entity, EntityRepositoryType, PrimaryKey } from '@mikro-orm/core';
import { ActivityRepository } from '../../infrastructure/repository/activity.repository';
import { AggregateRootIdentifier } from '../../../../infrastructure/utils/structure/aggregate-root-id';

@Entity({})
export class Follow {
  [EntityRepositoryType]?: ActivityRepository;

  @PrimaryKey({ autoincrement: true })
  _id!: number;

  @Embedded({ prefix: false })
  identifier: AggregateRootIdentifier;
}
