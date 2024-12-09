import { ExtendedEntityRepository } from '../../../../infrastructure/database/postgres/extended-entity-repository';
import { Education } from '../../core/entity/education';

export class EducationRepository extends ExtendedEntityRepository<Education> {}
