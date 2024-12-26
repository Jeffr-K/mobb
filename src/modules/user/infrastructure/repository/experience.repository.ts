import { ExtendedEntityRepository } from '@infrastructure/database/postgres/extended-entity-repository';
import { Experience } from '../../core/entity/experience';

export class ExperienceRepository extends ExtendedEntityRepository<Experience> {
  async selectExperiencesBy(data: { profileId: number }): Promise<Experience[]> {
    return await this.createQueryBuilder()
      .select('*')
      .where({ profile: { _id: data.profileId } })
      .getResultList();
  }

  async selectExperienceBy(data: { profileId: number }): Promise<Experience> {
    return await this.createQueryBuilder()
      .select('*')
      .where({ profile: { _id: data.profileId } })
      .getSingleResult();
  }
}
