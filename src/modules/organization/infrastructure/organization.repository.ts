import { ExtendedEntityRepository } from '@infrastructure/database/postgres/extended-entity-repository';
import { Organization } from '@modules/organization/core/entity/organization';
import { FilterQuery } from '@mikro-orm/core';
import { Injectable } from '@nestjs/common';

@Injectable()
export class OrganizationRepository extends ExtendedEntityRepository<Organization> {
  async selectOrganizationBy(data: { uuid: string }): Promise<Organization> {
    return this.createQueryBuilder()
      .select('*')
      .where({
        uuid: data.uuid,
      })
      .andWhere({ timestamp: { deletedAt: null } })
      .getSingleResult();
  }

  async selectOrganizationsBy(data: {
    filter: FilterQuery<Organization>;
    options?: { limit?: number; offset?: number };
  }): Promise<Array<Organization>> {
    return this.createQueryBuilder()
      .select('*')
      .where({})
      .andWhere({ timestamp: { deletedAt: null } })
      .limit(data.options.limit)
      .offset(data.options.offset)
      .getResult();
  }
}
