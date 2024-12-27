import { Body, Controller, Delete, HttpStatus, Post, UseGuards } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { UserLogoutCommand } from '../../core/command/logout.command.event';
import { UserLoginCommand } from '../../core/command/login.command.event';
import { UserLoginCommandAdapter } from '../adapter/command';
import { BusinessResponse } from '@infrastructure/utils/base/base-response';
import { TokenGuard } from '@modules/auth/infrastructure/guard/jwt.v2.guard';
import { Roles } from '@modules/auth/infrastructure/decorators/roles.decorator';
import { Role } from '@modules/user/core/value/enum/role';
import { RolesGuard } from '@modules/auth/infrastructure/guard/roles.guard';
import { Secured } from '@modules/auth/infrastructure/guard/token.guard.decorator';
import { User } from '@modules/user/core/entity/user';
import { UserReIssueSessionCommand } from '@modules/auth/core/command/token.command.event';

@Controller({ path: 'auth', version: ['1'] })
export class AuthController {
  constructor(private readonly commandBus: CommandBus) {}

  @Post('/login')
  async login(
    @Body() adapter: UserLoginCommandAdapter,
  ): Promise<BusinessResponse<{ accessToken: string; refreshToken: string }>> {
    // login 을 하면,
    const result: { accessToken: string; refreshToken: string } = await this.commandBus.execute(
      new UserLoginCommand(adapter.email, adapter.password),
    );
    return new BusinessResponse<{ accessToken: string; refreshToken: string }>(result, '로그인 성공', HttpStatus.OK);
  }

  @Delete('/logout')
  @UseGuards(TokenGuard, RolesGuard)
  @Roles(Role.USER, Role.ADMIN)
  async logout(@Secured() user: User): Promise<BusinessResponse<boolean>> {
    const result: boolean = await this.commandBus.execute(new UserLogoutCommand({ email: user.email.email }));
    return new BusinessResponse(result, '로그아웃 성공', HttpStatus.OK);
  }

  @Post('/reissue')
  @UseGuards(TokenGuard, RolesGuard)
  @Roles(Role.USER, Role.ADMIN)
  async reIssueAccessibleToken(
    @Secured() user: User,
  ): Promise<BusinessResponse<{ accessToken: string; refreshToken: string }>> {
    const result = await this.commandBus.execute(new UserReIssueSessionCommand({ user }));
    return new BusinessResponse<{ accessToken: string; refreshToken: string }>(result, '로그인 성공', HttpStatus.OK);
  }
}
