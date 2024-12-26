import { ExtendedEntityRepository } from '@infrastructure/database/postgres/extended-entity-repository';
import { Education } from '../../core/entity/education';

export class EducationRepository extends ExtendedEntityRepository<Education> {
  async selectEducationsBy(data: { profileId: number }): Promise<Education[]> {
    return await this.createQueryBuilder()
      .select('*')
      .where({ profile: { _id: data.profileId } })
      .getResultList();
  }

  async selectEducationBy(data: { profileId: number }): Promise<Education> {
    return await this.createQueryBuilder()
      .select('*')
      .where({ profile: { _id: data.profileId } })
      .getSingleResult();
  }
}
