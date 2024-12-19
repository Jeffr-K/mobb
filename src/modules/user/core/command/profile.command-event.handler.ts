import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import {
  ProfileActivityRegisterCommand,
  ProfileEditCommandEvent,
  ProfileSkillRegisterCommand,
  ProfileExperienceRegisterCommand,
  ProfileGarageRegisterCommand,
  ProfileRegisterCommandEvent,
} from './profile.command.event';
import { EntityManager } from '@mikro-orm/postgresql';
import { Inject } from '@nestjs/common';
import { Profile } from '@modules/user/core/entity/profile';

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

@CommandHandler(ProfileEditCommandEvent)
export class ProfileCommandEventHandler implements ICommandHandler<ProfileEditCommandEvent> {
  async execute(command: ProfileEditCommandEvent): Promise<any> {
    console.log(command);
    throw new Error('Method not implemented.');
  }
}

@CommandHandler(ProfileSkillRegisterCommand)
export class ProfileSkillCommandEventHandler implements ICommandHandler<ProfileSkillRegisterCommand> {
  async execute(command: ProfileSkillRegisterCommand): Promise<any> {
    console.log(command);
    throw new Error('Method not implemented.');
  }
}


@CommandHandler(ProfileActivityRegisterCommand)
export class ProfileActivityCommandEventHandler implements ICommandHandler<ProfileActivityRegisterCommand> {
  async execute(command: ProfileActivityRegisterCommand): Promise<any> {
    console.log(command);
    throw new Error('Method not implemented.');
  }
}

@CommandHandler(ProfileExperienceRegisterCommand)
export class ProfileExperienceCommandEventHandler implements ICommandHandler<ProfileExperienceRegisterCommand> {
  async execute(command: ProfileExperienceRegisterCommand): Promise<any> {
    console.log(command);
    throw new Error('Method not implemented.');
  }
}

@CommandHandler(ProfileGarageRegisterCommand)
export class ProfileGarageCommandEventHandler implements ICommandHandler<ProfileGarageRegisterCommand> {
  async execute(command: ProfileGarageRegisterCommand): Promise<any> {
    console.log(command);
    throw new Error('Method not implemented.');
  }
}