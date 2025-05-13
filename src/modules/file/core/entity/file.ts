import { Embedded, Entity, EntityRepositoryType, ManyToOne, PrimaryKey } from '@mikro-orm/core';
import { AggregateRoot } from '@nestjs/cqrs';
import { AggregateRootIdentifier } from '@infrastructure/utils/structure/aggregate-root-id';
import { Timestamp } from '@infrastructure/database/postgres/timestamp';
import { FileRepository } from '@modules/file/infrastucture/repository/file.repository';
import { Property } from '@mikro-orm/postgresql';
import { User } from '@/modules/user/core/entity/user';
import { Feed } from '@/modules/feed/core/entity/feed';

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

  @ManyToOne(() => User, { lazy: true })
  user!: User;

  @ManyToOne(() => Feed, { lazy: true })
  feed!: Feed;

  constructor() {
    super();
  }
}
