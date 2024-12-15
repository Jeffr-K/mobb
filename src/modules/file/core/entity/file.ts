import { Embedded, Entity, EntityRepositoryType, PrimaryKey } from '@mikro-orm/core';
import { AggregateRoot } from '@nestjs/cqrs';
import { AggregateRootIdentifier } from '@infrastructure/utils/structure/aggregate-root-id';
import { Timestamp } from '@infrastructure/database/postgres/timestamp';
import { FileRepository } from '@modules/file/infrastucture/repository/file.repository';
import { Property } from '@mikro-orm/postgresql';

@Entity({ repository: () => FileRepository })
export class File extends AggregateRoot {
  [EntityRepositoryType]?: FileRepository;

  @PrimaryKey({ autoincrement: true })
  _id!: number;

  @Embedded({ prefix: false })
  identifier: AggregateRootIdentifier;

  @Property()
  metadata: string;

  @Property()
  filename: string;

  @Property()
  filesize: number;

  @Property()
  mimetype: string;

  @Property()
  encoding: string;

  @Embedded({ prefix: false })
  timestamp: Timestamp;

  constructor() {
    super();
  }
}
