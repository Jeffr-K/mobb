import { Embedded, Entity, EntityRepositoryType, ManyToOne, PrimaryKey } from '@mikro-orm/core';
import { ShareRepository } from '@modules/feed/infrastructure/repository/share.repository';
import { AggregateRootIdentifier } from '@infrastructure/utils/structure/aggregate-root-id';
import { User } from '@modules/user/core/entity/user';
import { Feed } from '@modules/feed/core/entity/feed';

@Entity({ repository: () => ShareRepository })
export class Share {
  [EntityRepositoryType]?: ShareRepository;

  @PrimaryKey({ autoincrement: true })
  _id!: number;

  @Embedded({ prefix: false })
  identifier: AggregateRootIdentifier;

  @ManyToOne()
  user: User;

  @ManyToOne()
  feed: Feed;
}
