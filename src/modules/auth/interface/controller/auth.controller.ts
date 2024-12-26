import { Body, Controller, Delete, HttpStatus, Post } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { UserLogoutCommand } from '../../core/command/logout.command.event';
import { UserLoginCommand } from '../../core/command/login.command.event';
import { UserLoginCommandAdapter, UserLogoutCommandAdapter } from '../adapter/command';
import { BusinessResponse } from '@infrastructure/utils/base/base-response';

@Controller({ path: 'auth', version: ['1'] })
export class AuthController {
  constructor(private commandBus: CommandBus) {}

  @Post('/login')
  async login(
    @Body() adapter: UserLoginCommandAdapter,
  ): Promise<BusinessResponse<{ accessToken: string; refreshToken: string }>> {
    const result: { accessToken: string; refreshToken: string } = await this.commandBus.execute(
      new UserLoginCommand(adapter.email, adapter.password),
    );
    return new BusinessResponse<{ accessToken: string; refreshToken: string }>(result, '로그인 성공', HttpStatus.OK);
  }

  @Delete('/logout')
  async logout(@Body() adapter: UserLogoutCommandAdapter): Promise<boolean> {
    return await this.commandBus.execute(new UserLogoutCommand({ email: adapter.email }));
  }
}
