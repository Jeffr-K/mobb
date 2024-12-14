import { FeedEventHistory } from '@modules/feed/core/entity/feed.event.history';
import { Timestamp } from '@infrastructure/database/postgres/timestamp';
import { AggregateRootIdentifier } from '@infrastructure/utils/structure/aggregate-root-id';

export interface FeedEventHistoryConcreteBuilder {
  build(): FeedEventHistory;
}

export class FeedEventHistoryConcreteBuilder implements FeedEventHistoryConcreteBuilder {
  private readonly feedEventHistory: FeedEventHistory;

  constructor() {
    this.feedEventHistory = new FeedEventHistory();
    this.feedEventHistory.identifier = new AggregateRootIdentifier();
  }

  get Identifier(): AggregateRootIdentifier {
    return this.feedEventHistory.identifier;
  }

  setEventType(eventType: string): this {
    this.feedEventHistory.eventType = eventType;
    return this;
  }

  setEventContent(eventContent: string) {
    this.feedEventHistory.eventContent = eventContent;
    return this;
  }

  setTimestamp() {
    this.feedEventHistory.timestamp = new Timestamp({
      createdAt: new Date(),
      updatedAt: null,
      deletedAt: null,
    });

    return this;
  }

  build() {
    return this.feedEventHistory;
  }
}
