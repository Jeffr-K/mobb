import { Body, Controller, Delete, Post } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { UserLogoutCommand } from '../../core/command/logout.command.event';
import { UserLoginCommand } from '../../core/command/login.command.event';
import { UserLoginCommandAdapter, UserLogoutCommandAdapter } from '../adapter/command';

@Controller({ path: 'auth', version: ['1'] })
export class AuthController {
  constructor(private commandBus: CommandBus) {}

  @Post('/login')
  async login(@Body() adapter: UserLoginCommandAdapter): Promise<{ accessToken: string; refreshToken: string }> {
    return await this.commandBus.execute(new UserLoginCommand(adapter.email, adapter.password));
  }

  @Delete('/logout')
  async logout(@Body() adapter: UserLogoutCommandAdapter): Promise<boolean> {
    return await this.commandBus.execute(new UserLogoutCommand({ email: adapter.email }));
  }
}
