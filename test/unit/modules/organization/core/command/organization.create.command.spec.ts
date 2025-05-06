import { OrganizationRegisterCommandHandler } from '@modules/organization/core/command/command.event.handler';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@mikro-orm/nestjs';
import { Organization } from '@modules/organization/core/entity/organization';
import { OrganizationRepository } from '@modules/organization/infrastructure/organization.repository';
import { OrganizationRegisterCommand } from '@modules/organization/core/command/command.event';
import { OrganizationNameAlreadyRegisteredException } from '@modules/organization/core/exception/exception';
import { UniqueConstraintViolationException } from '@mikro-orm/core';
import { EntityManager } from '@mikro-orm/postgresql';

describe('조직(organization) 생성 usecase', () => {
  let handler: OrganizationRegisterCommandHandler;
  let organizationRepository: jest.Mocked<OrganizationRepository>;
  let entityManager: jest.Mocked<EntityManager>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrganizationRegisterCommandHandler,
        {
          provide: getRepositoryToken(Organization),
          useValue: {
            findOne: jest.fn(),
            persist: jest.fn(),
            flush: jest.fn(),
            selectOrganizationBy: jest.fn(),
          },
        },
        {
          provide: EntityManager,
          useValue: {
            transactional: jest.fn().mockImplementation(async (cb) => {
              const mockManager = {
                rollback: jest.fn(),
                commit: jest.fn(),
                persistAndFlush: jest.fn(),
              };
              await cb(mockManager);
              return mockManager;
            }),
            persistAndFlush: jest.fn(),
          },
        },
      ],
    }).compile();

    handler = module.get<OrganizationRegisterCommandHandler>(OrganizationRegisterCommandHandler);
    organizationRepository = module.get(getRepositoryToken(Organization));
    entityManager = module.get(EntityManager);
  });

  describe('Given > 새로운 조직(organization) 이 등록될 때', () => {
    const adapter = {
      name: 'Cave1',
      industry: 'Community',
      description: 'Persona 는 세상을 바꾸는 커뮤니티를 만들고 있습니다.',
      location: '우리집',
    };

    const command = new OrganizationRegisterCommand(adapter);

    describe('When > 창업자가 이미 등록된 조직을 등록하려고 할 때', () => {
      beforeEach(() => {
        entityManager.persistAndFlush.mockRejectedValue(
          new UniqueConstraintViolationException(new Error('Duplicate entry')),
        );
      });

      it('Then > 이미 등록된 조직임을 알려야 한다.', async () => {
        await expect(handler.execute(command)).rejects.toThrow(OrganizationNameAlreadyRegisteredException);
      });
      it('Then > 조직 등록이 실패해야 한다.', async () => {
        await expect(handler.execute(command)).rejects.toThrow();
        expect(entityManager.persistAndFlush).toHaveBeenCalledTimes(1);
        await expect(entityManager.persistAndFlush).rejects.toThrow(UniqueConstraintViolationException);
      });
    });

    describe('when > 창업자가 첫 조직을 등록하면', () => {
      beforeEach(() => {
        organizationRepository.persist.mockResolvedValue(undefined);
      });

      it('then > 새로운 조직이 등록되어야 한다.', async () => {
        await handler.execute(command);

        expect(entityManager.persistAndFlush).toHaveBeenCalledTimes(1);

        const saved = entityManager.persistAndFlush.mock.calls[0][0] as Organization;

        expect(saved).toBeInstanceOf(Organization);
        expect(saved.information.name).toBe(adapter.name);
        expect(saved.information.industry).toBe(adapter.industry);
        expect(saved.information.description).toBe(adapter.description);
        expect(saved.information.location).toBe(adapter.location);
      });
    });
  });
});
