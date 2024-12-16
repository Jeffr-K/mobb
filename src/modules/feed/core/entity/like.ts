import { Embedded, Entity, EntityRepositoryType, ManyToOne, PrimaryKey } from '@mikro-orm/core';
import { LikeRepository } from '@modules/feed/infrastructure/repository/like.repository';
import { AggregateRootIdentifier } from '@infrastructure/utils/structure/aggregate-root-id';
import { Feed } from '@modules/feed/core/entity/feed';
import { User } from '@sentry/nestjs';
import { Timestamp } from '@infrastructure/database/postgres/timestamp';

@Entity({ repository: () => LikeRepository })
export class Like {
  [EntityRepositoryType]?: LikeRepository;

  @PrimaryKey({ autoincrement: true })
  _id!: number;

  @Embedded({ prefix: false })
  identifier: AggregateRootIdentifier;

  @ManyToOne()
  user: User;

  @ManyToOne()
  feed: Feed;

  @Embedded({ prefix: false })
  timestamp: Timestamp;
}
