import { MikroOrmModule } from '@mikro-orm/nestjs';
import { forwardRef, Module } from '@nestjs/common';
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
import {
  IsUserExistQueryHandler,
  UserSearchQueryEventHandler,
  UsersSearchQueryEventHandler,
} from './core/query/user.query-event.handler';
import { Encrypter } from './infrastructure/utils/encrypter';
import { AuthModule } from '../auth/auth.module';
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
import {
  ProfileActivityCommandEventHandler,
  ProfileExperienceCommandEventHandler,
  ProfileGarageCommandEventHandler,
  ProfilePersonaEditCommandEventHandler,
  ProfileRegisterCommandHandler,
  ProfileSkillRegisterCommandEventHandler,
} from '@modules/user/core/command/profile.command-event.handler';
import { ProfileRepository } from '@modules/user/infrastructure/repository/profile.repository';
import {
  ProfileActivityQueryEventHandler,
  ProfileEducationQueryEventHandler,
  ProfileExperienceQueryEventHandler,
  ProfileGarageQueryEventHandler,
  ProfileGaragesQueryEventHandler,
  ProfileQueryEventHandler,
  ProfilesQueryEventHandler,
} from '@modules/user/core/query/profile.query-event.handler';
import { EducationRepository } from '@modules/user/infrastructure/repository/education.repository';
import { ExperienceRepository } from '@modules/user/infrastructure/repository/experience.repository';
import { Education } from '@modules/user/core/entity/education';

@Module({
  imports: [
    CqrsModule,
    RDBMSModule,
    forwardRef(() => AuthModule),
    MikroOrmModule.forFeature([User, Profile, Activity, Experience, Garage, Education]),
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
    ProfileSkillRegisterCommandEventHandler,
    ProfileQueryEventHandler,
    ProfilesQueryEventHandler,
    ProfileExperienceCommandEventHandler,
    ActivityRepository,
    EducationRepository,
    ExperienceRepository,
    ProfileRepository,
    IsUserExistQueryHandler,
    UserRegisteredEventHandler,
    UserDroppedOutEventHandler,
    ProfileRegisterCommandHandler,
    ProfilePersonaEditCommandEventHandler,
    ProfileActivityQueryEventHandler,
    ProfileEducationQueryEventHandler,
    ProfileExperienceQueryEventHandler,
    ProfileActivityCommandEventHandler,
    ProfileGarageCommandEventHandler,
    ProfileGarageQueryEventHandler,
    ProfileGaragesQueryEventHandler,
    {
      provide: UserRepository,
      useFactory: (em: EntityManager) => {
        return new UserRepository(em, User);
      },
      inject: [EntityManager],
    },
  ],
  exports: [UserRepository, IsUserExistQueryHandler],
})
export class UserModule {}
