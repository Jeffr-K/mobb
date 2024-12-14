import { ExtendedEntityRepository } from '@infrastructure/database/postgres/extended-entity-repository';
import { FeedEventHistory } from '@modules/feed/core/entity/feed.event.history';

export class FeedEventHistoryRepository extends ExtendedEntityRepository<FeedEventHistory> {}
