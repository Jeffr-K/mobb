import { Embedded, Entity, EntityRepositoryType, ManyToOne, PrimaryKey } from '@mikro-orm/core';
import { BookmarkRepository } from '@modules/feed/infrastructure/repository/bookmark.repository';
import { AggregateRootIdentifier } from '@infrastructure/utils/structure/aggregate-root-id';
import { User } from '@modules/user/core/entity/user';
import { Feed } from '@modules/feed/core/entity/feed';
import { Timestamp } from '@infrastructure/database/postgres/timestamp';

// TODO: pivot table
@Entity({ repository: () => BookmarkRepository })
export class Bookmark {
  [EntityRepositoryType]?: BookmarkRepository;

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
