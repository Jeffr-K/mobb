import { EntityRepository } from '@mikro-orm/postgresql';
import { Profile } from '../../core/entity/profile';

export class ProfileRepository extends EntityRepository<Profile> {}
