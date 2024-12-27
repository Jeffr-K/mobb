import { ArrayMinSize, IsArray, IsBoolean, IsNotEmpty, IsOptional, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { Stack, Tool } from '@modules/user/core/value/embeddable/skill';

export class ProfilePersonaEditCommandAdapter {
  @IsString()
  @IsNotEmpty()
  cave: string;

  @IsString()
  @IsNotEmpty()
  personal: string;

  @IsString()
  @IsNotEmpty()
  identity: string;

  @IsArray()
  @IsNotEmpty()
  interests: string[];

  @IsString()
  @IsNotEmpty()
  location: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  @IsNotEmpty()
  summary: string;
}

class StackDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  image: string;
}

class ToolDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  image: string;
}

export class ProfileSkillRegisterCommandAdapter {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => StackDto)
  techSkills?: StackDto[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ToolDto)
  usableTools?: ToolDto[];
}

export class ProfileSkillEditCommandAdapter {
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Stack)
  techSkills?: Array<{ name: string; image: string }>;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Tool)
  usableTools?: Array<{ name: string; image: string }>;
}

export class ProfileExperienceRegisterCommandAdapter {
  @IsString()
  @IsNotEmpty()
  companyName: string;

  @IsString()
  @IsNotEmpty()
  companyLogo: string;

  @IsString()
  @IsNotEmpty()
  companyArea: string;

  @IsString()
  @IsNotEmpty()
  team: string;

  @IsString()
  @IsNotEmpty()
  role: string;

  @IsString()
  @IsNotEmpty()
  summary: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsArray()
  @ArrayMinSize(2)
  @IsNotEmpty()
  period: string[];

  @IsString()
  @IsNotEmpty()
  location: string;
}

export class ProfileEducationRegisterCommandAdapter {
  @IsString()
  @IsNotEmpty()
  status: string;

  @IsString()
  @IsNotEmpty()
  school: string;

  @IsString()
  @IsNotEmpty()
  major: string;

  @IsString()
  @IsNotEmpty()
  degree: string;

  @IsString()
  @IsNotEmpty()
  period: string[];

  @IsString()
  @IsNotEmpty()
  description: string;
}

export class ProfileActivityRegisterCommandAdapter {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsArray()
  @IsNotEmpty()
  period: string[];

  @IsString()
  @IsNotEmpty()
  role: string;

  @IsString()
  @IsNotEmpty()
  team: string;

  @IsString()
  @IsNotEmpty()
  location: string;

  @IsBoolean()
  @IsNotEmpty()
  isPublic: boolean;
}

export class ProfileGarageRegisterCommandAdapter {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsArray()
  @IsNotEmpty()
  period: string[];

  @IsString()
  @IsNotEmpty()
  role: string;

  @IsString()
  @IsNotEmpty()
  team: string;

  @IsString()
  @IsNotEmpty()
  location: string;

  @IsBoolean()
  @IsNotEmpty()
  isPublic: boolean;
}
