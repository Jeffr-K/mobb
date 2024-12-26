import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import {
  ProfileActivityRegisterCommand,
  ProfilePersonaEditCommandEvent,
  ProfileSkillRegisterCommand,
  ProfileGarageRegisterCommand,
  ProfileRegisterCommandEvent,
  ProfileExperienceRegisterCommand,
  ProfileEducationRegisterCommand,
  ProfileEducationEditCommand,
  ProfileGarageRemoveCommand,
  ProfileGarageEditCommand,
  ProfileExperienceEditCommand,
  ProfileExperienceRemoveCommand,
  ProfileEducationRemoveCommand,
} from './profile.command.event';
import { EntityManager } from '@mikro-orm/postgresql';
import { Inject } from '@nestjs/common';
import { Profile } from '@modules/user/core/entity/profile';
import { InjectRepository } from '@mikro-orm/nestjs';
import { ProfileRepository } from '@modules/user/infrastructure/repository/profile.repository';
import { Activity } from '@modules/user/core/entity/activity';
import { Experience } from '@modules/user/core/entity/experience';
import { Garage } from '@modules/user/core/entity/garage';
import { Education } from '@modules/user/core/entity/education';
import { ExperienceRepository } from '@modules/user/infrastructure/repository/experience.repository';
import { EducationRepository } from '@modules/user/infrastructure/repository/education.repository';
import { GarageRepository } from '@modules/user/infrastructure/repository/garage.repository';

@CommandHandler(ProfileRegisterCommandEvent)
export class ProfileRegisterCommandHandler implements ICommandHandler<ProfileRegisterCommandEvent> {
  constructor(@Inject(EntityManager) private readonly entityManager: EntityManager) {}

  async execute(command: ProfileRegisterCommandEvent): Promise<void> {
    // TODO: blog > 사용자 등록하면 기본 프로필이 등록하도록 구현했으나 profile 에서 persist error 가 나도 응답값은 201로 떨어짐
    // TODO: 커맨드 이벤트에서 에러가 나면 에러를 전파하는 방법이 필요함(추측에는 saga pattern)을 작성하면 될 것 같음.
    const profile = await Profile.register({ user: command.user });
    await this.entityManager.persistAndFlush(profile);
  }
}

@CommandHandler(ProfilePersonaEditCommandEvent)
export class ProfilePersonaEditCommandEventHandler implements ICommandHandler<ProfilePersonaEditCommandEvent> {
  constructor(
    @Inject(EntityManager) private readonly entityManager: EntityManager,
    @InjectRepository(Profile) private readonly profileRepository: ProfileRepository,
  ) {}

  async execute(command: ProfilePersonaEditCommandEvent): Promise<void> {
    const profile = await this.profileRepository.selectProfileBy({ userId: command.user._id });
    await profile.editPersona({ ...command });
    await this.entityManager.persistAndFlush(profile);
  }
}

@CommandHandler(ProfileSkillRegisterCommand)
export class ProfileSkillRegisterCommandEventHandler implements ICommandHandler<ProfileSkillRegisterCommand> {
  constructor(
    @InjectRepository(Profile) private readonly profileRepository: ProfileRepository,
    @Inject(EntityManager) private readonly entityManager: EntityManager,
  ) {}

  async execute(command: ProfileSkillRegisterCommand): Promise<any> {
    const profile = await this.profileRepository.selectProfileBy({ userId: command.user._id });
    await profile.addSkill({ techSkills: command.techSkills, usableTools: command.usableTools });

    await this.entityManager.persistAndFlush(profile);
  }
}

@CommandHandler(ProfileActivityRegisterCommand)
export class ProfileActivityCommandEventHandler implements ICommandHandler<ProfileActivityRegisterCommand> {
  constructor(
    @InjectRepository(Profile) private readonly profileRepository: ProfileRepository,
    @Inject(EntityManager) private readonly entityManager: EntityManager,
  ) {}

  async execute(command: ProfileActivityRegisterCommand): Promise<void> {
    const profile = await this.profileRepository.selectProfileBy({ userId: command.user._id });
    const activity = await Activity.register({
      profile: profile,
      title: command.title,
      description: command.description,
      period: command.period,
      role: command.role,
      team: command.team,
      location: command.location,
      isPublic: command.isPublic,
    });

    await this.entityManager.persistAndFlush(activity);
  }
}

@CommandHandler(ProfileExperienceRegisterCommand)
export class ProfileExperienceCommandEventHandler implements ICommandHandler<ProfileExperienceRegisterCommand> {
  constructor(
    @InjectRepository(Profile) private readonly profileRepository: ProfileRepository,
    @Inject(EntityManager) private readonly entityManager: EntityManager,
  ) {}

  async execute(command: ProfileExperienceRegisterCommand): Promise<any> {
    const profile = await this.profileRepository.selectProfileBy({ userId: command.user._id });
    const experience = await Experience.register({
      profile: profile,
      companyName: command.companyName,
      companyLogo: command.companyLogo,
      companyArea: command.companyArea,
      team: command.team,
      role: command.role,
      summary: command.summary,
      description: command.description,
      period: command.period,
      location: command.location,
    });

    await this.entityManager.persistAndFlush(experience);
  }
}

@CommandHandler(ProfileExperienceEditCommand)
export class ProfileExperienceEditCommandEventHandler implements ICommandHandler<ProfileExperienceEditCommand> {
  constructor(
    @InjectRepository(Profile) private readonly profileRepository: ProfileRepository,
    @InjectRepository(Experience) private readonly experienceRepository: ExperienceRepository,
    @Inject(EntityManager) private readonly entityManager: EntityManager,
  ) {}

  async execute(command: ProfileExperienceEditCommand): Promise<void> {
    const profile = await this.profileRepository.selectProfileBy({ userId: command.user._id });
    const experience = await this.experienceRepository.selectExperienceBy({ profileId: profile._id });
    await experience.edit({
      companyName: command.companyName,
      companyLogo: command.companyLogo,
      companyArea: command.companyArea,
      team: command.team,
      role: command.role,
      summary: command.summary,
      description: command.description,
      period: command.period,
      location: command.location,
    });

    await this.entityManager.persistAndFlush(experience);
  }
}

@CommandHandler(ProfileExperienceRemoveCommand)
export class ProfileExperienceRemoveCommandEventHandler implements ICommandHandler<ProfileExperienceRemoveCommand> {
  constructor(
    @InjectRepository(Profile) private readonly profileRepository: ProfileRepository,
    @InjectRepository(Experience) private readonly experienceRepository: ExperienceRepository,
    @Inject(EntityManager) private readonly entityManager: EntityManager,
  ) {}

  async execute(command: ProfileExperienceRemoveCommand): Promise<void> {
    const profile = await this.profileRepository.selectProfileBy({ userId: command.user._id });
    const experience = await this.experienceRepository.selectExperienceBy({ profileId: profile._id });

    await this.entityManager.removeAndFlush(experience);
  }
}

@CommandHandler(ProfileEducationRegisterCommand)
export class ProfileEducationRegisterCommandEventHandler implements ICommandHandler<ProfileEducationRegisterCommand> {
  constructor(
    @InjectRepository(Profile) private readonly profileRepository: ProfileRepository,
    @Inject(EntityManager) private readonly entityManager: EntityManager,
  ) {}

  async execute(command: ProfileEducationRegisterCommand): Promise<void> {
    const profile = await this.profileRepository.selectProfileBy({ userId: command.user._id });
    const education = await Education.register({
      profile: profile,
      status: command.status,
      school: command.school,
      major: command.major,
      degree: command.degree,
      period: command.period,
      description: command.description,
    });

    await this.entityManager.persistAndFlush(education);
  }
}

@CommandHandler(ProfileEducationEditCommand)
export class ProfileEducationEditCommandEventHandler implements ICommandHandler<ProfileEducationEditCommand> {
  constructor(
    @InjectRepository(Profile) private readonly profileRepository: ProfileRepository,
    @InjectRepository(Education) private readonly educationRepository: EducationRepository,
    @Inject(EntityManager) private readonly entityManager: EntityManager,
  ) {}

  async execute(command: ProfileEducationEditCommand): Promise<any> {
    const profile = await this.profileRepository.selectProfileBy({ userId: command.user._id });
    const education = await this.educationRepository.selectEducationBy({ profileId: profile._id });
    await education.edit({
      status: command.status,
      school: command.school,
      major: command.major,
      degree: command.degree,
      period: command.period,
      description: command.description,
    });

    await this.entityManager.persistAndFlush(education);
  }
}

@CommandHandler(ProfileEducationRemoveCommand)
export class ProfileEducationRemoveCommandEventHandler implements ICommandHandler<ProfileEducationRemoveCommand> {
  constructor(
    @InjectRepository(Profile) private readonly profileRepository: ProfileRepository,
    @InjectRepository(Education) private readonly educationRepository: EducationRepository,
    @Inject(EntityManager) private readonly entityManager: EntityManager,
  ) {}

  async execute(command: ProfileEducationRemoveCommand): Promise<void> {
    const profile = await this.profileRepository.selectProfileBy({ userId: command.user._id });
    const education = await this.educationRepository.selectEducationBy({ profileId: profile._id });

    await this.entityManager.removeAndFlush(education);
  }
}

@CommandHandler(ProfileGarageRegisterCommand)
export class ProfileGarageCommandEventHandler implements ICommandHandler<ProfileGarageRegisterCommand> {
  constructor(
    @InjectRepository(Profile) private readonly profileRepository: ProfileRepository,
    @Inject(EntityManager) private readonly entityManager: EntityManager,
  ) {}

  async execute(command: ProfileGarageRegisterCommand): Promise<void> {
    const profile = await this.profileRepository.selectProfileBy({ userId: command.user._id });
    const garage = await Garage.register({
      profile: profile,
      title: command.title,
      description: command.description,
      period: command.period,
      role: command.role,
      team: command.team,
      location: command.location,
      isPublic: command.isPublic,
    });

    await this.entityManager.persistAndFlush(garage);
  }
}

@CommandHandler(ProfileGarageEditCommand)
export class ProfileGarageEditCommandEventHandler implements ICommandHandler<ProfileGarageEditCommand> {
  constructor(
    @InjectRepository(Profile) private readonly profileRepository: ProfileRepository,
    @InjectRepository(Garage) private readonly garageRepository: GarageRepository,
    @Inject(EntityManager) private readonly entityManager: EntityManager,
  ) {}

  async execute(command: ProfileGarageEditCommand): Promise<void> {
    const profile = await this.profileRepository.selectProfileBy({ userId: command.user._id });
    const garage = await this.garageRepository.selectGarageBy({ profileId: profile._id });
    await garage.edit({
      title: command.title,
      description: command.description,
      period: command.period,
      role: command.role,
      team: command.team,
      location: command.location,
      isPublic: command.isPublic,
    });

    await this.entityManager.persistAndFlush(garage);
  }
}

@CommandHandler(ProfileGarageRemoveCommand)
export class ProfileGarageRemoveCommandEventHandler implements ICommandHandler<ProfileGarageRemoveCommand> {
  constructor(
    @InjectRepository(Profile) private readonly profileRepository: ProfileRepository,
    @InjectRepository(Garage) private readonly garageRepository: GarageRepository,
    @Inject(EntityManager) private readonly entityManager: EntityManager,
  ) {}

  async execute(command: ProfileGarageRemoveCommand): Promise<void> {
    const profile = await this.profileRepository.selectProfileBy({ userId: command.user._id });
    const garage = await this.garageRepository.selectGarageBy({ profileId: profile._id });

    await this.entityManager.removeAndFlush(garage);
  }
}
