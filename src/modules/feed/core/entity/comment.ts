import { Embedded, Entity, EntityRepositoryType, ManyToOne, PrimaryKey } from '@mikro-orm/core';
import { AggregateRootIdentifier } from '@infrastructure/utils/structure/aggregate-root-id';
import { Property } from '@mikro-orm/postgresql';
import { Timestamp } from '@infrastructure/database/postgres/timestamp';
import { CommentRepository } from '@modules/feed/infrastructure/repository/comment.repository';
import { Feed } from '@modules/feed/core/entity/feed';
import { User } from '@modules/user/core/entity/user';

@Entity({ repository: () => CommentRepository })
export class Comment {
  [EntityRepositoryType]?: CommentRepository;

  @PrimaryKey({ autoincrement: true })
  _id!: number;

  @Embedded({ prefix: false })
  identifier: AggregateRootIdentifier;

  @Property()
  content!: string;

  @Embedded({ prefix: false })
  timestamp: Timestamp;

  @ManyToOne()
  writer!: User;

  @ManyToOne()
  feed!: Feed;
}
