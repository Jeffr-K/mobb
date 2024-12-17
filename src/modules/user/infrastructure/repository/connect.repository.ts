import { ExtendedEntityRepository } from '@infrastructure/database/postgres/extended-entity-repository';
import { Connect } from '@modules/user/core/entity/connect';

export class ConnectRepository extends ExtendedEntityRepository<Connect> {}
