import { ExtendedEntityRepository } from '@infrastructure/database/postgres/extended-entity-repository';
import { Garage } from '../../core/entity/garage';

export class GarageRepository extends ExtendedEntityRepository<Garage> {
  async selectGarageBy(data: { profileId: number; garageId?: number }): Promise<Garage> {
    return await this.createQueryBuilder()
      .select('*')
      .where({ profile: { _id: data.profileId } })
      .andWhere({ _id: data.garageId })
      .getSingleResult();
  }

  async selectGaragesBy(data: { profileId: number }): Promise<Garage[]> {
    return await this.createQueryBuilder()
      .select('*')
      .where({ profile: { _id: data.profileId } })
      .getResultList();
  }
}
