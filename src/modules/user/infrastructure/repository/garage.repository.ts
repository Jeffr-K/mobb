import { ExtendedEntityRepository } from '@infrastructure/database/postgres/extended-entity-repository';
import { Garage } from '../../core/entity/garage';

export class GarageRepository extends ExtendedEntityRepository<Garage> {
  async selectGarageBy(data: { profileId: number }): Promise<Garage> {
    return await this.createQueryBuilder()
      .select('*')
      .where({ profile: { _id: data.profileId } })
      .getSingleResult();
  }
}
