import { ExtendedEntityRepository } from '../../../../infrastructure/database/postgres/extended-entity-repository';
import { Garage } from '../../core/entity/garage';

export class GarageRepository extends ExtendedEntityRepository<Garage> {}
