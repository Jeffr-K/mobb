import { Embedded, Entity, EntityRepositoryType, PrimaryKey } from '@mikro-orm/core';
import { Tag } from '@modules/cave/core/value/tag';
import { AggregateRootIdentifier } from '@infrastructure/utils/structure/aggregate-root-id';
import { Property } from '@mikro-orm/postgresql';
import { BootcampRepository } from '@modules/bootcamp/infrastructure/repository/bootcamp.repository';

@Entity({ repository: () => BootcampRepository })
export class Bootcamp {
  [EntityRepositoryType]?: BootcampRepository;

  @PrimaryKey({ autoincrement: true })
  _id!: number;

  @Embedded({ prefix: false })
  identifier: AggregateRootIdentifier;

  name: string;

  @Property({ onCreate: () => new Date() })
  createdAt: Date;

  @Property({ onUpdate: () => new Date() })
  updatedAt: Date;

  @Property({ nullable: true })
  deletedAt: Date;
}
