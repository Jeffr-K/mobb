import { User } from '@modules/user/core/entity/user';

export class ProfileRegisterCommandEvent {
  readonly user: User;

  constructor(command: { user: User }) {
    this.user = command.user;
  }
}

export class ProfileEditCommandEvent {}

export class ProfileRemoveCommandEvent {}

export class ProfileSkillRegisterCommand {}

export class ProfileActivityRegisterCommand {}

export class ProfileExperienceRegisterCommand {}

export class ProfileGarageRegisterCommand {}

