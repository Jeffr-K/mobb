import { Body, Controller, Get, HttpStatus, Post, Put, Query, UseGuards } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { Profile } from '../../core/entity/profile';
import {
  ProfileActivitiesSearchQuery,
  ProfileEducationsSearchQuery,
  ProfileExperiencesSearchQuery,
  ProfileSearchQuery,
  ProfilesSearchQuery,
} from '../../core/query/profile.query.event';
import {
  ProfileActivityRegisterCommandAdapter,
  ProfileEducationRegisterCommandAdapter,
  ProfileExperienceRegisterCommandAdapter,
  ProfileGarageRegisterCommandAdapter,
  ProfilePersonaEditCommandAdapter,
  ProfileSkillEditCommandAdapter,
  ProfileSkillRegisterCommandAdapter,
} from '@modules/user/interface/adapter/in/profile.command.adapter';
import {
  ProfileActivityRegisterCommand,
  ProfileEducationEditCommand,
  ProfileEducationRegisterCommand,
  ProfileExperienceRegisterCommand,
  ProfileGarageRegisterCommand,
  ProfilePersonaEditCommandEvent,
  ProfileSkillRegisterCommand,
} from '@modules/user/core/command/profile.command.event';
import { Roles } from '@modules/auth/infrastructure/decorators/roles.decorator';
import { Role } from '@modules/user/core/value/enum/role';
import { User } from '@modules/user/core/entity/user';
import { Secured } from '@modules/auth/infrastructure/guard/token.guard.decorator';
import { JwtAuthGuard } from '@modules/auth/infrastructure/guard/jwt.guard';
import { Experience } from '@modules/user/core/entity/experience';
import { Education } from '@modules/user/core/entity/education';
import { Activity } from '@modules/user/core/entity/activity';
import { BusinessResponse } from '@infrastructure/utils/base/base-response';

@Controller({ path: 'profile', version: ['1'] })
export class ProfileController {
  constructor(private readonly commandBus: CommandBus, private readonly queryBus: QueryBus) {}

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

  @Get()
  @UseGuards(JwtAuthGuard)
  @Roles(Role.USER, Role.ADMIN)
  async getProfile(@Secured() user: User): Promise<BusinessResponse<Profile>> {
    const profile = await this.queryBus.execute(new ProfileSearchQuery({ userId: user._id, options: { withExperience: true } }));
    return new BusinessResponse<Profile>(profile, '프로필 조회 성공', HttpStatus.OK);
  }

  @Put('/persona')
  @UseGuards(JwtAuthGuard)
  @Roles(Role.USER, Role.ADMIN)
  async editProfilePersona(@Secured() user: User, @Body() adapter: ProfilePersonaEditCommandAdapter): Promise<void> {
    return await this.commandBus.execute(new ProfilePersonaEditCommandEvent({ ...adapter, user: user }));
  }

  // @Delete()
  // @UseGuards(JwtAuthGuard)
  // @Roles(Role.USER, Role.ADMIN)
  // async deleteProfileSkill(@Secured() user: User, @Body() adapter: ProfileSkillEditCommandAdapter): Promise<void> {
  //   return await this.commandBus.execute(new ProfileSkillDeleteCommand({ ...adapter, user: user }));
  // }

  @Post('/skill')
  @UseGuards(JwtAuthGuard)
  @Roles(Role.USER, Role.ADMIN)
  async registerProfileSkill(
    @Secured() user: User,
    @Body() adapter: ProfileSkillRegisterCommandAdapter,
  ): Promise<void> {
    await this.commandBus.execute(new ProfileSkillRegisterCommand({ ...adapter, user: user }));
  }

  @Put('/skill')
  @UseGuards(JwtAuthGuard)
  @Roles(Role.USER, Role.ADMIN)
  async editProfileSkill(@Secured() user: User, @Body() adapter: ProfileSkillEditCommandAdapter): Promise<void> {
    return await this.commandBus.execute(new ProfileSkillRegisterCommand({ ...adapter, user: user }));
  }

  // @Post('/skill')
  // @UseGuards(JwtAuthGuard)
  // @Roles(Role.USER, Role.ADMIN)
  // async removeProfileSkill(): Promise<void> {
  //   await this.commandBus.execute(new ProfileSkillRemoveCommand({ }));
  // }

  @Post('/experience')
  @UseGuards(JwtAuthGuard)
  @Roles(Role.USER, Role.ADMIN)
  async registerProfileExperience(
    @Secured() user: User,
    @Body() adapter: ProfileExperienceRegisterCommandAdapter,
  ): Promise<void> {
    return await this.commandBus.execute(new ProfileExperienceRegisterCommand({ ...adapter, user: user }));
  }

  @Get('/experiences')
  @UseGuards(JwtAuthGuard)
  @Roles(Role.USER, Role.ADMIN)
  async getProfileExperiences(@Secured() user: User): Promise<BusinessResponse<Experience[]>> {
    const experiences = await this.queryBus.execute(new ProfileExperiencesSearchQuery({ user: user }));
    return new BusinessResponse<Experience[]>(experiences, '경험 조회 성공', HttpStatus.OK);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @Roles(Role.USER, Role.ADMIN)
  async registerProfileEducation(
    @Secured() user: User,
    @Body() adapter: ProfileEducationRegisterCommandAdapter,
  ): Promise<void> {
    return await this.commandBus.execute(new ProfileEducationRegisterCommand({ ...adapter, user: user }));
  }

  @Put()
  @UseGuards(JwtAuthGuard)
  @Roles(Role.USER, Role.ADMIN)
  async editProfileEducation(
    @Secured() user: User,
    @Body() adapter: ProfileEducationRegisterCommandAdapter,
  ): Promise<void> {
    return await this.commandBus.execute(new ProfileEducationEditCommand({ ...adapter, user: user }));
  }

  @Get('/educations')
  @UseGuards(JwtAuthGuard)
  @Roles(Role.USER, Role.ADMIN)
  async getProfileEducations(@Secured() user: User): Promise<Education[]> {
    return await this.queryBus.execute(new ProfileEducationsSearchQuery({ user: user }));
  }

  @Get('/activities')
  @UseGuards(JwtAuthGuard)
  @Roles(Role.USER, Role.ADMIN)
  async getProfileActivities(@Secured() user: User): Promise<Activity[]> {
    return await this.queryBus.execute(new ProfileActivitiesSearchQuery({ user: user }));
  }

  @Post('/activity')
  @UseGuards(JwtAuthGuard)
  @Roles(Role.USER, Role.ADMIN)
  async registerProfileActivity(@Secured() user: User, adapter: ProfileActivityRegisterCommandAdapter): Promise<void> {
    await this.commandBus.execute(new ProfileActivityRegisterCommand({ ...adapter, user: user }));
  }

  @Put()
  @UseGuards(JwtAuthGuard)
  @Roles(Role.USER, Role.ADMIN)
  async editProfileGarage(@Secured() user: User, @Body() adapter: ProfileGarageRegisterCommandAdapter): Promise<void> {
    return await this.commandBus.execute(new ProfileGarageRegisterCommand({ ...adapter, user: user }));
  }
}
