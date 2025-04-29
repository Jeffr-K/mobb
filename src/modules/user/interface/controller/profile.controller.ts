import { Body, Controller, Get, HttpStatus, Post, Put, Query, UseGuards } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { Profile } from '../../core/entity/profile';
import {
  ProfileActivitiesSearchQuery,
  ProfileEducationsSearchQuery,
  ProfileExperiencesSearchQuery,
  ProfileGarageSearchQuery,
  ProfileGaragesSearchQuery, ProfilePersonaSearchQuery,
  ProfileSearchQuery,
  ProfilesSearchQuery,
} from '../../core/query/event/profile.query.event';
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
import { Garage } from '@modules/user/core/entity/garage';
import { TokenGuard } from '@modules/auth/infrastructure/guard/jwt.v2.guard';
import { RolesGuard } from '@modules/auth/infrastructure/guard/roles.guard';
import { SessionValidationGuard } from '@modules/auth/infrastructure/guard/session-validation.guard';
import { Persona } from '@modules/user/core/value/embeddable/persona';
import { ProfilePersonaResponseAdapter } from '@modules/user/interface/adapter/out/profile-persona.response.adpater';

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
    const profile = await this.queryBus.execute(
      new ProfileSearchQuery({ userId: user._id, options: { withExperience: true } }),
    );
    return new BusinessResponse<Profile>(profile, '프로필 조회 성공', HttpStatus.OK);
  }

  @Get('/persona')
  @UseGuards(JwtAuthGuard)
  @Roles(Role.USER, Role.ADMIN)
  async getProfilePersona(@Secured() user: User): Promise<BusinessResponse<ProfilePersonaResponseAdapter>> {
    const persona = await this.queryBus.execute(new ProfilePersonaSearchQuery({ user: user }));
    return new BusinessResponse<ProfilePersonaResponseAdapter>(persona, '프로필 페르소나 조회 성공', HttpStatus.OK);
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
  @UseGuards(TokenGuard, SessionValidationGuard, RolesGuard)
  @Roles(Role.USER, Role.ADMIN)
  async getProfileActivities(@Secured() user: User): Promise<BusinessResponse<Activity[]>> {
    const activities = await this.queryBus.execute(new ProfileActivitiesSearchQuery({ user: user }));
    return new BusinessResponse<Activity[]>(activities, '활동 조회 성공', HttpStatus.OK);
  }

  @Post('/activity')
  @UseGuards(JwtAuthGuard)
  @Roles(Role.USER, Role.ADMIN)
  async registerProfileActivity(
    @Secured() user: User,
    @Body() adapter: ProfileActivityRegisterCommandAdapter,
  ): Promise<void> {
    await this.commandBus.execute(new ProfileActivityRegisterCommand({ ...adapter, user: user }));
  }

  @Post('/garage')
  @UseGuards(JwtAuthGuard)
  @Roles(Role.USER, Role.ADMIN)
  async registerProfileGarage(
    @Secured() user: User,
    @Body() adapter: ProfileGarageRegisterCommandAdapter,
  ): Promise<void> {
    return await this.commandBus.execute(new ProfileGarageRegisterCommand({ ...adapter, user: user }));
  }

  // @Put('/garage')
  // @UseGuards(JwtAuthGuard)
  // @Roles(Role.USER, Role.ADMIN)
  // async editProfileGarage(@Secured() user: User, @Body() adapter: ProfileGarageEditCommandAdapter): Promise<void> {
  //   return await this.commandBus.execute(new ProfileGarageEditCommand({ ...adapter, user: user }));
  // }
  //
  // @Delete('/garage')
  // @UseGuards(JwtAuthGuard)
  // @Roles(Role.USER, Role.ADMIN)
  // async deleteProfileGarage(@Secured() user: User): Promise<void> {
  //   return await this.commandBus.execute(new ProfileGarageDeleteCommand({ user: user }));
  // }
  //
  @Get('/garages')
  @UseGuards(JwtAuthGuard)
  @Roles(Role.USER, Role.ADMIN)
  async getProfileGarages(@Secured() user: User): Promise<BusinessResponse<Garage[]>> {
    const garages = await this.queryBus.execute(new ProfileGaragesSearchQuery({ user: user }));
    return new BusinessResponse<Garage[]>(garages, '차고 조회 성공', HttpStatus.OK);
  }

  @Get('/garage')
  @UseGuards(JwtAuthGuard)
  @Roles(Role.USER, Role.ADMIN)
  async getProfileGarage(
    @Secured() user: User,
    @Query('garageId') garageId: number,
  ): Promise<BusinessResponse<Garage>> {
    const garage = await this.queryBus.execute(new ProfileGarageSearchQuery({ user: user, garageId: garageId }));
    return new BusinessResponse<Garage>(garage, '차고 조회 성공', HttpStatus.OK);
  }
}
