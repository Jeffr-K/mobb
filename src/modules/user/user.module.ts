import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { User } from './core/entity/user';
import { UserRepository } from './infrastructure/repository/user.repository';
import { UserController } from './interface/controller/user.controller';
import {
  UserRegisteredEventHandler,
  UserDroppedOutEventHandler,
  UserEventHandler,
} from './core/event/handler/event/user.event.handler';
import {
  UserDropdownCommandEventHandler,
  UserRegisterCommandEventHandler,
} from './core/command/user.command-event.handler';
import { UserSearchQueryEventHandler, UsersSearchQueryEventHandler } from './core/query/user.query-event.handler';
import { Encrypter } from './infrastructure/utils/encrypter';
import { AuthModule } from '../auth/auth.module';
import { IsUserExistQueryHandler } from './core/query/user.query-event.handler';
import { RDBMSModule } from '@infrastructure/database/postgres/rdbms.module';
import { EntityManager } from '@mikro-orm/postgresql';
import { ActivityRepository } from './infrastructure/repository/activity.repository';
import { JwtAuthGuard } from '@modules/auth/infrastructure/guard/jwt.guard';
import { JwtService } from '@nestjs/jwt';
import { ProfileController } from '@modules/user/interface/controller/profile.controller';
import { Experience } from '@modules/user/core/entity/experience';
import { Activity } from '@modules/user/core/entity/activity';
import { Profile } from '@modules/user/core/entity/profile';
import { Garage } from '@modules/user/core/entity/garage';
import { ProfileRegisterCommandHandler } from '@modules/user/core/command/profile.command-event.handler';

@Module({
  imports: [
    CqrsModule,
    RDBMSModule,
    AuthModule,
    MikroOrmModule.forFeature([User, Profile, Activity, Experience, Garage]),
  ],
  controllers: [UserController, ProfileController],
  providers: [
    JwtAuthGuard,
    JwtService,
    UserEventHandler,
    Encrypter,
    UserRegisterCommandEventHandler,
    UserDropdownCommandEventHandler,
    UserSearchQueryEventHandler,
    UsersSearchQueryEventHandler,
    ActivityRepository,
    UserRegisteredEventHandler,
    UserDroppedOutEventHandler,
    IsUserExistQueryHandler,
    ProfileRegisterCommandHandler,
    {
      provide: UserRepository,
      useFactory: (em: EntityManager) => {
        return new UserRepository(em, User);
      },
      inject: [EntityManager],
    },
  ],
})
export class UserModule {}
