import { ExtendedEntityRepository } from '../../../../infrastructure/database/postgres/extended-entity-repository';
import { Experience } from '../../core/entity/experience';

export class ExperienceRepository extends ExtendedEntityRepository<Experience> {}
