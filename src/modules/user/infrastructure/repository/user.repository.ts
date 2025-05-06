import { User } from '../../core/entity/user';
import { ExtendedEntityRepository } from '@infrastructure/database/postgres/extended-entity-repository';

export class UserRepository extends ExtendedEntityRepository<User> {
  async selectUserBy(data: { userId?: number; email?: string }): Promise<User> {
    let where: Record<string, any> = {};

    if (data.userId) {
      where = { ...where, _id: data.userId };
    }
    if (data.email) {
      where = { ...where, email: { email: data.email } };
    }

    return await this.createQueryBuilder()
      .select('*')
      .where({ ...where })
      .andWhere({ timestamp: { deletedAt: null } })
      .getSingleResult();
  }

  async selectUsersBy(data: { page: number; offset: number; limit: number }): Promise<User[]> {
    return await this.createQueryBuilder()
      .select('*')
      .where({})
      .andWhere({ timestamp: { deletedAt: null } })
      .limit(data.limit)
      .offset(data.offset)
      .getResult();
  }

  async update(data: { user: User; fieldsToUpdate: Partial<User> }): Promise<boolean> {
    try {
      await this.createQueryBuilder().update(data.fieldsToUpdate).where({ _id: data.user._id }).execute();

      return true;
    } catch (error) {
      console.error('Error updating user:', error);
      return false;
    }
  }
}
