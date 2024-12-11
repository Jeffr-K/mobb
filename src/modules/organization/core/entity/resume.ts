import { Embedded, Entity, ManyToOne, PrimaryKey } from '@mikro-orm/core';
import { AggregateRootIdentifier } from '@infrastructure/utils/structure/aggregate-root-id';
import { Pool } from '@modules/organization/core/entity/pool';

@Entity({})
export class Resume {
  @PrimaryKey({ autoincrement: true })
  _id!: number;

  @Embedded({ prefix: false })
  identifier: AggregateRootIdentifier;

  @ManyToOne(() => Pool)
  pool: Pool;
}
