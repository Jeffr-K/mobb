import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetOrganizationQuery, GetOrganizationsQuery } from '@modules/organization/core/query/query.event';
import { Organization } from '@modules/organization/core/entity/organization';
import { InjectRepository } from '@mikro-orm/nestjs';
import { OrganizationRepository } from '@modules/organization/infrastructure/organization.repository';
import { OrganizationNotFoundException } from '@modules/organization/core/exception/exception';

@QueryHandler(GetOrganizationQuery)
export class GetOrganizationHandler implements IQueryHandler<GetOrganizationQuery> {
  constructor(
    @InjectRepository(Organization)
    private readonly organizationRepository: OrganizationRepository,
  ) {}

  async execute(query: GetOrganizationQuery): Promise<Organization> {
    const organization = await this.organizationRepository.selectOrganizationBy({
      uuid: query.identifier,
    });

    if (!organization) {
      throw new OrganizationNotFoundException();
    }

    return organization;
  }
}

@QueryHandler(GetOrganizationsQuery)
export class GetOrganizationsHandler implements IQueryHandler<GetOrganizationsQuery> {
  constructor(
    @InjectRepository(Organization)
    private readonly organizationRepository: OrganizationRepository,
  ) {}

  async execute(query: GetOrganizationsQuery): Promise<Array<Organization>> {
    return this.organizationRepository.selectOrganizationsBy({
      filter: {},
      options: {
        limit: query.limit,
        offset: (query.page - 1) * query.limit,
      },
    });
  }
}
