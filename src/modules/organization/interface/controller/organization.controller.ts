import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
import {
  OrganizationEditAdapter,
  OrganizationGetAdapter,
  OrganizationGetListAdapter,
  OrganizationRegisterAdapter,
  OrganizationRemoveAdapter,
} from '@modules/organization/interface/adapter/organization.register.adapter';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { Organization } from '@modules/organization/core/entity/organization';
import {
  OrganizationEditCommand,
  OrganizationRegisterCommand,
  OrganizationRemoveCommand,
} from '@modules/organization/core/command/command.event';
import { GetOrganizationQuery, GetOrganizationsQuery } from '@modules/organization/core/query/query.event';

@Controller({ path: 'organization', version: ['1'] })
export class OrganizationController {
  constructor(private readonly commandBus: CommandBus, private readonly queryBus: QueryBus) {}

  @Post('/')
  async registerOrganization(@Body() adapter: OrganizationRegisterAdapter): Promise<void> {
    await this.commandBus.execute(new OrganizationRegisterCommand({ ...adapter.information }));
  }

  @Delete('/')
  async removeOrganization(@Body() adapter: OrganizationRemoveAdapter): Promise<void> {
    await this.commandBus.execute(new OrganizationRemoveCommand({ uuid: adapter.uuid }));
  }

  @Put('/')
  async editOrganization(@Body() adapter: OrganizationEditAdapter): Promise<void> {
    await this.commandBus.execute(new OrganizationEditCommand({ ...adapter.information, uuid: adapter.uuid }));
  }

  @Get('/list')
  async getOrganizations(@Query() adapter: OrganizationGetListAdapter): Promise<Array<Organization>> {
    return this.queryBus.execute(new GetOrganizationsQuery(adapter.page, adapter.limit));
  }

  @Get('/:uuid')
  async getOrganization(@Param() adapter: OrganizationGetAdapter): Promise<Organization> {
    return this.queryBus.execute(new GetOrganizationQuery(adapter.uuid));
  }
}
