import { Module } from '@nestjs/common';
import {
  OrganizationEditCommandHandler,
  OrganizationRegisterCommandHandler,
  OrganizationRemoveCommandHandler,
} from '@modules/organization/core/command/command.event.handler';
import { OrganizationRepository } from '@modules/organization/infrastructure/organization.repository';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Organization } from '@modules/organization/core/entity/organization';
import { OrganizationController } from '@modules/organization/interface/controller/organization.controller';
import { CqrsModule } from '@nestjs/cqrs';
import { GetOrganizationHandler, GetOrganizationsHandler } from '@modules/organization/core/query/query.event.handler';

@Module({
  imports: [CqrsModule, MikroOrmModule.forFeature([Organization])],
  providers: [
    OrganizationEditCommandHandler,
    OrganizationRemoveCommandHandler,
    OrganizationRegisterCommandHandler,
    GetOrganizationHandler,
    GetOrganizationsHandler,
    OrganizationRepository,
  ],
  controllers: [OrganizationController],
})
export class OrganizationModule {}
