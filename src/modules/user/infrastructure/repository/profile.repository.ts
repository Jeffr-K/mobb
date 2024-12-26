import { EntityRepository } from '@mikro-orm/postgresql';
import { Profile } from '../../core/entity/profile';

export class ProfileRepository extends EntityRepository<Profile> {
  async selectProfileBy(data: { userId: number }): Promise<Profile> {
    return await this.createQueryBuilder()
      .select('*')
      .where({ user: { _id: data.userId } })
      .getSingleResult();
  }
}
