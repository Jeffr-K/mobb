import { ExtendedEntityRepository } from '@infrastructure/database/postgres/extended-entity-repository';
import { Activity } from '../../core/entity/activity';

export class ActivityRepository extends ExtendedEntityRepository<Activity> {
  async selectActivitiesBy(data: { profileId: number }): Promise<Activity[]> {
    return await this.createQueryBuilder()
      .select('*')
      .where({ profile: { _id: data.profileId } })
      .getResultList();
  }

  async selectActivityBy(data: { profileId: number }): Promise<Activity> {
    return await this.createQueryBuilder()
      .select('*')
      .where({ profile: { _id: data.profileId } })
      .getSingleResult();
  }
}
