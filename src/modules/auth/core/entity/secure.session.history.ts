import { Entity, Enum, PrimaryKey, Property } from '@mikro-orm/core';
import { SessionHistoryEventMessage } from '../../infrastructure/utils/session.history.event-message';
import { SessionHistoryEventType } from '../../infrastructure/utils/session.history.event-type';

@Entity()
export class SecureSessionHistory {
  @PrimaryKey({ autoincrement: true })
  _id!: number;

  @Enum(() => SessionHistoryEventType)
  eventType: SessionHistoryEventType;

  @Enum(() => SessionHistoryEventMessage)
  eventMessage: SessionHistoryEventMessage;

  @Property()
  eventTime: Date;
}
