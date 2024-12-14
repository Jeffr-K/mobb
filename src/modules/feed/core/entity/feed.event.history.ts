import { Embedded, Entity, EntityRepositoryType, PrimaryKey } from '@mikro-orm/core';
import { FeedEventHistoryRepository } from '@modules/feed/infrastructure/repository/feed.event.history.repository';
import { AggregateRootIdentifier } from '@infrastructure/utils/structure/aggregate-root-id';
import { FeedEventHistoryConcreteBuilder } from '@modules/feed/core/factory/feed.event.history.factory';
import { Timestamp } from '@infrastructure/database/postgres/timestamp';
import { Property } from '@mikro-orm/postgresql';

@Entity({ repository: () => FeedEventHistoryRepository })
export class FeedEventHistory {
  [EntityRepositoryType]?: FeedEventHistoryRepository;

  @PrimaryKey({ autoincrement: true })
  _id!: number;

  @Embedded({ prefix: false })
  identifier: AggregateRootIdentifier;

  @Property()
  eventType: string;

  @Property()
  eventContent: string;

  @Embedded(() => Timestamp, { prefix: false })
  timestamp: Timestamp;

  static async register(history: { eventType: string; eventContent: string }): Promise<FeedEventHistory> {
    return new FeedEventHistoryConcreteBuilder()
      .setEventType(history.eventType)
      .setEventContent(history.eventContent)
      .setTimestamp()
      .build();
  }
}
