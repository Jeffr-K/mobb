import { ExtendedEntityRepository } from '../../../../infrastructure/database/postgres/extended-entity-repository';
import { Activity } from '../../core/entity/activity';

export class ActivityRepository extends ExtendedEntityRepository<Activity> {}
