import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import {
  UserDropdownCommandAdapter,
  UserEditEmailCommandAdapter,
  UserEditPasswordCommandAdapter,
  UserRegisterCommandAdapter,
} from '@modules/user/interface/adapter/in/user.register.adapter';
import {
  UserDropdownCommand,
  UserEditEmailCommand,
  UserEditPasswordCommand,
  UserRegisterCommand,
} from '@modules/user/core/command/user.command.event';
import { UseSearchModelSerializer } from '@modules/user/interface/adapter/out/user.serializer';
import { UserSearchQuery, UsersSearchQuery } from '@modules/user/core/query/event/user.query.event';
import { User } from '@modules/user/core/entity/user';
import { Secured } from '@modules/auth/infrastructure/guard/token.guard.decorator';
import { RolesGuard } from '@/modules/auth/infrastructure/guard/roles.guard';
import { SessionValidationGuard } from '@/modules/auth/infrastructure/guard/session-validation.guard';
import { TokenGuard } from '@/modules/auth/infrastructure/guard/jwt.v2.guard';
import { Roles } from '@/modules/auth/infrastructure/decorators/roles.decorator';
import { Role } from '../../core/value/enum/role';

@Controller({ path: 'user', version: ['1'] })
export class UserController {
  constructor(private readonly commandBus: CommandBus, private readonly queryBus: QueryBus) {}

  @Post('/')
  async register(@Body() adapter: UserRegisterCommandAdapter): Promise<void> {
    try {
      await this.commandBus.execute(
        new UserRegisterCommand(
          adapter.username,
          adapter.nickname,
          adapter.password,
          adapter.email,
          adapter.agreements,
        ),
      );
    } catch (error) {
      console.error(error);
    }
  }

  @Delete('/')
  async dropdown(@Body() adapter: UserDropdownCommandAdapter): Promise<void> {
    await this.commandBus.execute(new UserDropdownCommand(adapter.email));
  }

  @Patch('/password')
  async editPassword(@Body() adapter: UserEditPasswordCommandAdapter): Promise<void> {
    await this.commandBus.execute(
      new UserEditPasswordCommand({
        userId: adapter.userId,
        password: adapter.password,
        newPassword: adapter.newPassword,
      }),
    );
  }

  @Patch('/email')
  async editEmail(@Body() adapter: UserEditEmailCommandAdapter): Promise<void> {
    await this.commandBus.execute(
      new UserEditEmailCommand({
        userId: adapter.userId,
        email: adapter.email,
        newEmail: adapter.newEmail,
      }),
    );
  }

  @Get('/')
  @UseGuards(TokenGuard, SessionValidationGuard, RolesGuard)
  @Roles(Role.USER, Role.ADMIN)
  @UseInterceptors(ClassSerializerInterceptor)
  async user(@Secured() user: User): Promise<UseSearchModelSerializer> {
    const result = await this.queryBus.execute(new UserSearchQuery(user._id));
    return new UseSearchModelSerializer(result);
  }

  @Get('/list')
  @UseGuards(TokenGuard, SessionValidationGuard, RolesGuard)
  @Roles(Role.USER, Role.ADMIN)
  @UseInterceptors(ClassSerializerInterceptor)
  async users(
    @Secured() user: User,
    @Query('page', ParseIntPipe) page: number,
    @Query('offset', ParseIntPipe) offset: number,
    @Query('limit', ParseIntPipe) limit: number,
  ): Promise<UseSearchModelSerializer[]> {
    const users = await this.queryBus.execute(new UsersSearchQuery({ page, offset, limit }));

    return users.map((user: User) => new UseSearchModelSerializer(user));
  }
}
