import { GetOrganizationsHandler } from '@modules/organization/core/query/query.event.handler';
import { OrganizationRepository } from '@modules/organization/infrastructure/organization.repository';
import { Organization } from '@modules/organization/core/entity/organization';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@mikro-orm/nestjs';
import { OrganizationConcreteBuilder } from '@modules/organization/core/factory/organization.factory';

describe('조직(organization) 목록 조회 usecase', () => {
  let handler: GetOrganizationsHandler;
  let organizationRepository: jest.Mocked<OrganizationRepository>;
  let organizations: Organization[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GetOrganizationsHandler,
        {
          provide: getRepositoryToken(Organization),
          useValue: {
            selectOrganizationsBy: jest.fn(),
          },
        },
      ],
    }).compile();

    handler = module.get<GetOrganizationsHandler>(GetOrganizationsHandler);
    organizationRepository = module.get(getRepositoryToken(Organization));
    organizations = [
      new OrganizationConcreteBuilder()
        .setInformation({
          name: 'Google',
          industry: 'Technology',
          description: 'Test Description',
          location: 'Seoul',
        })
        .setTimestamp()
        .build(),
      new OrganizationConcreteBuilder()
        .setInformation({
          name: 'Facebook',
          industry: 'Technology',
          description: 'Test Description',
          location: 'Seoul',
        })
        .setTimestamp()
        .build(),
    ];
  });

  describe('조직(organization) 목록이 조회될 때', () => {
    describe('조직(organization)이 존재하면', () => {
      it('then > 조직(organization) 목록이 반환된다.', async () => {
        organizationRepository.selectOrganizationsBy.mockResolvedValue(organizations);
        const result = await handler.execute({ page: 1, limit: 10 });
        expect(result).toEqual(organizations);
      });
    });
  });
});
