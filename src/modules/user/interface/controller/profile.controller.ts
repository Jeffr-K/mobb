import { Body, Controller, Get, Param, Put, Query } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { Profile } from '../../core/entity/profile';
import { ProfileSearchQuery, ProfilesSearchQuery } from '../../core/query/profile.query.event';
import { ProfileEditCommandAdapter } from '../adapter/in/profile.command.adapter';

@Controller({ path: 'profile', version: ['1'] })
export class ProfileController {
  constructor(private readonly commandBus: CommandBus, private readonly queryBus: QueryBus) {}

  @Put()
  async editProfile(@Body() adapter: ProfileEditCommandAdapter): Promise<void> {
    await this.commandBus.execute(adapter);
  }

  @Get(':/id')
  async getProfile(@Param() id: number): Promise<Profile> {
    return await this.queryBus.execute(new ProfileSearchQuery({ id: id }));
  }

  @Get('/list')
  async getProfiles(@Query() page: number, @Query() offset: number, @Query() limit: number): Promise<Profile> {
    return await this.queryBus.execute(
      new ProfilesSearchQuery({
        page: page,
        offset: offset,
        limit: limit,
      }),
    );
  }
}
