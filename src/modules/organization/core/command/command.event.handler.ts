import { CommandHandler } from '@nestjs/cqrs';
import { InjectRepository, logger } from '@mikro-orm/nestjs';
import { Organization } from '@modules/organization/core/entity/organization';
import { OrganizationRepository } from '@modules/organization/infrastructure/organization.repository';
import { Information } from '@modules/organization/core/value/company.information';
import { Inject, NotFoundException } from '@nestjs/common';
import {
  OrganizationEditCommand,
  OrganizationRegisterCommand,
  OrganizationRemoveCommand,
} from '@modules/organization/core/command/command.event';
import { Transactional, UniqueConstraintViolationException } from '@mikro-orm/core';
import { OrganizationNameAlreadyRegisteredException } from '@modules/organization/core/exception/exception';
import { EntityManager } from '@mikro-orm/postgresql';

@CommandHandler(OrganizationRegisterCommand)
export class OrganizationRegisterCommandHandler {
  constructor(
    @InjectRepository(Organization)
    private readonly organizationRepository: OrganizationRepository,
    @Inject(EntityManager)
    private readonly entityManager: EntityManager,
  ) {}

  async execute(command: OrganizationRegisterCommand): Promise<void> {
    await this.entityManager.transactional(async (manager: EntityManager) => {
      try {
        const organization = await Organization.register({ ...command });
        await this.entityManager.persistAndFlush(organization);
        await manager.commit();
      } catch (error) {
        if (error instanceof UniqueConstraintViolationException) {
          logger.log('OrganizationNameAlreadyRegisteredException', error);
          await manager.rollback();
          throw new OrganizationNameAlreadyRegisteredException();
        }
      }
    });
  }
}

@CommandHandler(OrganizationRemoveCommand)
export class OrganizationRemoveCommandHandler {
  constructor(
    @InjectRepository(Organization)
    private readonly organizationRepository: OrganizationRepository,
    @Inject(EntityManager)
    private readonly entityManager: EntityManager,
  ) {}

  async execute(command: OrganizationRemoveCommand): Promise<void> {
    const organization = await this.organizationRepository.selectOrganizationBy({
      uuid: command.data.uuid,
    });

    if (!organization) {
      throw new NotFoundException('Organization not found');
    }

    await this.entityManager.transactional(async (manager: EntityManager): Promise<void> => {
      try {
        await organization.remove(organization);
        await this.organizationRepository.remove(organization);
        await this.organizationRepository.flush();
        await manager.commit();
      } catch (error) {
        logger.log('OrganizationNameAlreadyRegisteredException', error);
        await manager.rollback();
      }
    });
  }
}

@CommandHandler(OrganizationEditCommand)
export class OrganizationEditCommandHandler {
  constructor(
    @InjectRepository(Organization)
    private readonly organizationRepository: OrganizationRepository,
  ) {}

  @Transactional()
  async execute(command: OrganizationEditCommand): Promise<void> {
    const organization = await this.organizationRepository.selectOrganizationBy({
      uuid: command.data.uuid,
    });

    if (!organization) {
      throw new NotFoundException('Organization not found');
    }

    const information = new Information({
      name: command.data.name,
      industry: command.data.industry,
      description: command.data.description,
      location: command.data.location,
    });

    await organization.edit({ information });

    await this.organizationRepository.flush();
  }
}
