import { GetOrganizationHandler } from '@modules/organization/core/query/query.event.handler';
import { OrganizationRepository } from '@modules/organization/infrastructure/organization.repository';
import { getRepositoryToken } from '@mikro-orm/nestjs';
import { Organization } from '@modules/organization/core/entity/organization';
import { Test, TestingModule } from '@nestjs/testing';
import { OrganizationNotFoundException } from '@modules/organization/core/exception/exception';
import { OrganizationConcreteBuilder } from '@modules/organization/core/factory/organization.factory';

describe('조직(organization) 조회 usecase', () => {
  let handler: GetOrganizationHandler;
  let organizationRepository: jest.Mocked<OrganizationRepository>;
  let organization: Organization;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GetOrganizationHandler,
        {
          provide: getRepositoryToken(Organization),
          useValue: {
            selectOrganizationBy: jest.fn(),
          },
        },
      ],
    }).compile();

    handler = module.get<GetOrganizationHandler>(GetOrganizationHandler);
    organizationRepository = module.get(getRepositoryToken(Organization));
    organization = new OrganizationConcreteBuilder()
      .setInformation({
        name: 'Test Organization',
        industry: 'Technology',
        description: 'Test Description',
        location: 'Seoul',
      })
      .setTimestamp()
      .build();
  });

  describe('조직(organization)이 조회될 때', () => {
    describe('조직(organization)이 존재하면', () => {
      it('then > 조직(organization)이 반환된다.', async () => {
        organizationRepository.selectOrganizationBy.mockResolvedValue(organization);
        const result = await handler.execute({ identifier: organization.identifier.uuid });
        expect(result).toEqual(organization);
      });
    });
    describe('조직(organization)이 존재하지 않을 때', () => {
      it('조직(organization)이 없다는 예외가 발생한다.', async () => {
        organizationRepository.selectOrganizationBy.mockResolvedValue(null);

        await expect(handler.execute({ identifier: 'uuid' })).rejects.toThrow(OrganizationNotFoundException);
      });
    });
  });
});
