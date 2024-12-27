import { User } from '@modules/user/core/entity/user';
import { PartialType } from '@nestjs/swagger';

export class ProfileRegisterCommandEvent {
  readonly user: User;

  constructor(command: { user: User }) {
    this.user = command.user;
  }
}

export class ProfilePersonaEditCommandEvent {
  readonly cave: string;
  readonly personal: string;
  readonly identity: string;
  readonly interests: string[];
  readonly location: string;
  readonly description: string;
  readonly summary: string;
  readonly user: User;

  constructor(data: {
    cave: string;
    personal: string;
    identity: string;
    interests: string[];
    location: string;
    description: string;
    summary: string;
    user: User;
  }) {
    this.cave = data.cave;
    this.personal = data.personal;
    this.identity = data.identity;
    this.interests = data.interests;
    this.location = data.location;
    this.description = data.description;
    this.summary = data.summary;
    this.user = data.user;
  }
}

export class ProfileRemoveCommandEvent {}

export class ProfileSkillRegisterCommand {
  readonly techSkills?: Array<{ name: string; image: string }>;
  readonly usableTools?: Array<{ name: string; image: string }>;
  readonly user: User;

  constructor(data: {
    techSkills?: Array<{ name: string; image: string }>;
    usableTools?: Array<{ name: string; image: string }>;
    user: User;
  }) {
    this.techSkills = data.techSkills;
    this.usableTools = data.usableTools;
    this.user = data.user;
  }
}

export class ProfileActivityRegisterCommand {
  readonly title: string;
  readonly description: string;
  readonly period: string[];
  readonly role: string;
  readonly team: string;
  readonly location: string;
  readonly isPublic: boolean;
  readonly user: User;

  constructor(data: {
    title: string;
    description: string;
    period: string[];
    role: string;
    team: string;
    location: string;
    isPublic: boolean;
    user: User;
  }) {
    this.title = data.title;
    this.description = data.description;
    this.period = data.period;
    this.role = data.role;
    this.team = data.team;
    this.location = data.location;
    this.isPublic = data.isPublic;
    this.user = data.user;
  }
}

export class ProfileExperienceRegisterCommand {
  readonly user: User;
  readonly companyName: string;
  readonly companyLogo: string;
  readonly companyArea: string;
  readonly team: string;
  readonly role: string;
  readonly summary: string;
  readonly description: string;
  readonly period: string[];
  readonly location: string;

  constructor(data: {
    user: User;
    companyName: string;
    companyLogo: string;
    companyArea: string;
    team: string;
    role: string;
    summary: string;
    description: string;
    period: string[];
    location: string;
  }) {
    this.user = data.user;
    this.companyName = data.companyName;
    this.companyLogo = data.companyLogo;
    this.companyArea = data.companyArea;
    this.team = data.team;
    this.role = data.role;
    this.summary = data.summary;
    this.description = data.description;
    this.period = data.period;
    this.location = data.location;
  }
}

export class ProfileExperienceEditCommand extends PartialType(ProfileExperienceRegisterCommand) {}

export class ProfileExperienceRemoveCommand {
  readonly user: User;
}

export class ProfileGarageRegisterCommand {
  readonly title: string;
  readonly description: string;
  readonly period: string[];
  readonly role: string;
  readonly team: string;
  readonly location: string;
  readonly isPublic: boolean;
  readonly user: User;

  constructor(data: {
    title: string;
    description: string;
    period: string[];
    role: string;
    team: string;
    location: string;
    isPublic: boolean;
    user: User;
  }) {
    this.title = data.title;
    this.description = data.description;
    this.period = data.period;
    this.role = data.role;
    this.team = data.team;
    this.location = data.location;
    this.isPublic = data.isPublic;
    this.user = data.user;
  }
}

export class ProfileEducationRegisterCommand {
  readonly user: User;
  readonly status: string;
  readonly school: string;
  readonly major: string;
  readonly degree: string;
  readonly period: string[];
  readonly description: string;

  constructor(data: {
    user: User;
    status: string;
    school: string;
    major: string;
    degree: string;
    period: string[];
    description: string;
  }) {
    this.user = data.user;
    this.status = data.status;
    this.school = data.school;
    this.major = data.major;
    this.degree = data.degree;
    this.period = data.period;
    this.description = data.description;
  }
}

export class ProfileEducationEditCommand extends PartialType(ProfileEducationRegisterCommand) {}

export class ProfileEducationRemoveCommand {
  readonly user: User;
}

export class ProfileGarageEditCommand {
  readonly title: string;
  readonly description: string;
  readonly period: string[];
  readonly role: string;
  readonly team: string;
  readonly location: string;
  readonly isPublic: boolean;
  readonly user: User;
  readonly garageId: number;

  constructor(data: {
    title: string;
    description: string;
    period: string[];
    role: string;
    team: string;
    location: string;
    isPublic: boolean;
    user: User;
    garageId: number;
  }) {
    this.title = data.title;
    this.description = data.description;
    this.period = data.period;
    this.role = data.role;
    this.team = data.team;
    this.location = data.location;
    this.isPublic = data.isPublic;
    this.user = data.user;
    this.garageId = data.garageId;
  }
}

export class ProfileGarageRemoveCommand {
  readonly user: User;
  readonly garageId: number;

  constructor(data: { user: User; garageId: number }) {
    this.user = data.user;
    this.garageId = data.garageId;
  }
}
