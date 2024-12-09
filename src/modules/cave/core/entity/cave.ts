import { Embedded, Entity, PrimaryKey } from '@mikro-orm/core';
import { AggregateRootIdentifier } from '../../../../infrastructure/utils/structure/aggregate-root-id';

@Entity()
export class Cave {
  @PrimaryKey({ autoincrement: true })
  _id!: number;

  @Embedded({ prefix: false })
  identifier: AggregateRootIdentifier;

  name: string;

  members: string[];

  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
}
