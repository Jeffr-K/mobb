import { Embedded, Entity, EntityRepositoryType, PrimaryKey } from '@mikro-orm/core';
import { ConnectRepository } from '@modules/user/infrastructure/repository/connect.repository';
import { AggregateRootIdentifier } from '@infrastructure/utils/structure/aggregate-root-id';

@Entity({ repository: () => ConnectRepository })
export class Connect {
  [EntityRepositoryType]?: ConnectRepository;

  @PrimaryKey({ autoincrement: true })
  _id!: number;

  @Embedded({ prefix: false })
  identifier: AggregateRootIdentifier;
}
