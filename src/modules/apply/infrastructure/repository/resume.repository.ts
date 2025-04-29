import { ExtendedEntityRepository } from '@infrastructure/database/postgres/extended-entity-repository';
import { Resume } from '@modules/user/core/entity/resume';

export class ResumeRepository extends ExtendedEntityRepository<Resume> {}
