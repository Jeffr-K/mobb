import { Embedded, Entity, EntityRepositoryType, ManyToOne, PrimaryKey } from '@mikro-orm/core';
import { AggregateRootIdentifier } from '@infrastructure/utils/structure/aggregate-root-id';
import { User } from '@modules/user/core/entity/user';
import { Property } from '@mikro-orm/postgresql';
import { Timestamp } from '@infrastructure/database/postgres/timestamp';
import { ConnectRepository } from '@modules/user/infrastructure/repository/connect.repository';

@Entity({ repository: () => ConnectRepository })
export class Follow {
  [EntityRepositoryType]?: ConnectRepository;

  @PrimaryKey({ autoincrement: true })
  _id!: number;

  @Embedded({ prefix: false })
  identifier: AggregateRootIdentifier;

  @ManyToOne()
  from!: User;

  @ManyToOne()
  to!: User;

  @Property()
  accepted: boolean;

  @Embedded({ prefix: false })
  timestamp: Timestamp;
}
