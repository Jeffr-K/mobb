import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import {
  ProfileActivitiesSearchQuery,
  ProfileEducationsSearchQuery,
  ProfileExperiencesSearchQuery,
  ProfileGarageSearchQuery,
  ProfileGaragesSearchQuery,
  ProfileSearchQuery,
  ProfilesSearchQuery,
} from './profile.query.event';
import { InjectRepository } from '@mikro-orm/nestjs';
import { ProfileRepository } from '@modules/user/infrastructure/repository/profile.repository';
import { Profile } from '@modules/user/core/entity/profile';
import { Education } from '@modules/user/core/entity/education';
import { EducationRepository } from '@modules/user/infrastructure/repository/education.repository';
import { Activity } from '@modules/user/core/entity/activity';
import { ActivityRepository } from '@modules/user/infrastructure/repository/activity.repository';
import { Experience } from '@modules/user/core/entity/experience';
import { ExperienceRepository } from '@modules/user/infrastructure/repository/experience.repository';
import { Garage } from '@modules/user/core/entity/garage';
import { GarageRepository } from '@modules/user/infrastructure/repository/garage.repository';

@QueryHandler(ProfilesSearchQuery)
export class ProfilesQueryEventHandler implements IQueryHandler<ProfilesSearchQuery> {
  execute(query: ProfilesSearchQuery): Promise<any> {
    console.log(query);
    throw new Error('Method not implemented.');
  }
}

@QueryHandler(ProfileSearchQuery)
export class ProfileQueryEventHandler implements IQueryHandler<ProfileSearchQuery> {
  constructor(@InjectRepository(Profile) private readonly profileRepository: ProfileRepository) {}

  async execute(query: ProfileSearchQuery): Promise<Profile> {
    return await this.profileRepository.selectProfileBy({ userId: query.userId });
  }
}

@QueryHandler(ProfileExperiencesSearchQuery)
export class ProfileExperienceQueryEventHandler implements IQueryHandler<ProfileExperiencesSearchQuery> {
  constructor(
    @InjectRepository(Profile) private readonly profileRepository: ProfileRepository,
    @InjectRepository(Experience) private readonly experienceRepository: ExperienceRepository,
  ) {}

  async execute(query: ProfileExperiencesSearchQuery): Promise<any> {
    const profile = await this.profileRepository.selectProfileBy({ userId: query.user._id });
    return await this.experienceRepository.selectExperiencesBy({ profileId: profile._id });
  }
}

@QueryHandler(ProfileEducationsSearchQuery)
export class ProfileEducationQueryEventHandler implements IQueryHandler<ProfileEducationsSearchQuery> {
  constructor(
    @InjectRepository(Profile) private readonly profileRepository: ProfileRepository,
    @InjectRepository(Education) private readonly educationRepository: EducationRepository,
  ) {}

  async execute(query: ProfileEducationsSearchQuery): Promise<any> {
    const profile = await this.profileRepository.selectProfileBy({ userId: query.user._id });
    return await this.educationRepository.selectEducationsBy({ profileId: profile._id });
  }
}

@QueryHandler(ProfileActivitiesSearchQuery)
export class ProfileActivityQueryEventHandler implements IQueryHandler<ProfileActivitiesSearchQuery> {
  constructor(
    @InjectRepository(Profile) private readonly profileRepository: ProfileRepository,
    @InjectRepository(Activity) private readonly activityRepository: ActivityRepository,
  ) {}

  async execute(query: ProfileActivitiesSearchQuery): Promise<any> {
    const profile = await this.profileRepository.selectProfileBy({ userId: query.user._id });
    return await this.activityRepository.selectActivitiesBy({ profileId: profile._id });
  }
}

@QueryHandler(ProfileGaragesSearchQuery)
export class ProfileGaragesQueryEventHandler implements IQueryHandler<ProfileGaragesSearchQuery> {
  constructor(
    @InjectRepository(Profile) private readonly profileRepository: ProfileRepository,
    @InjectRepository(Garage) private readonly garageRepository: GarageRepository,
  ) {}

  async execute(query: ProfileGaragesSearchQuery): Promise<Garage[]> {
    const profile = await this.profileRepository.selectProfileBy({ userId: query.user._id });
    return await this.garageRepository.selectGaragesBy({ profileId: profile._id });
  }
}

@QueryHandler(ProfileGarageSearchQuery)
export class ProfileGarageQueryEventHandler implements IQueryHandler<ProfileGarageSearchQuery> {
  constructor(
    @InjectRepository(Profile) private readonly profileRepository: ProfileRepository,
    @InjectRepository(Garage) private readonly garageRepository: GarageRepository,
  ) {}

  async execute(query: ProfileGarageSearchQuery): Promise<Garage> {
    const profile = await this.profileRepository.selectProfileBy({ userId: query.user._id });
    return await this.garageRepository.selectGarageBy({ profileId: profile._id, garageId: query.garageId });
  }
}
