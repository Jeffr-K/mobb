import { Embedded, Entity, EntityRepositoryType, PrimaryKey } from '@mikro-orm/core';
import { AggregateRootIdentifier } from '@infrastructure/utils/structure/aggregate-root-id';
import { LibraryRepository } from '@modules/bootcamp/infrastructure/repository/library.repository';

@Entity({ repository: () => LibraryRepository })
export class Library {
  [EntityRepositoryType]?: LibraryRepository;

  @PrimaryKey({ autoincrement: true })
  _id!: number;

  @Embedded({ prefix: false })
  identifier: AggregateRootIdentifier;
}
