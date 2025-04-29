import { IsNotEmpty, IsNumber, IsOptional, IsString, Max, Min } from 'class-validator';
import { Information } from '@modules/organization/core/value/embeddable/company.information';

export class OrganizationRegisterAdapter {
  @IsNotEmpty()
  information: Information;
}

export class OrganizationRemoveAdapter {
  @IsString()
  @IsNotEmpty()
  uuid: string;
}

// organization.edit.adapter.ts
export class OrganizationEditAdapter {
  @IsString()
  @IsNotEmpty()
  uuid: string;

  @IsNotEmpty()
  information: Information;
}

export class OrganizationGetAdapter {
  @IsString()
  @IsNotEmpty()
  uuid: string;
}

// organization.get-list.adapter.ts
export class OrganizationGetListAdapter {
  @IsNumber()
  @IsOptional()
  @Min(1)
  page?: number = 1;

  @IsNumber()
  @IsOptional()
  @Min(1)
  @Max(100)
  limit?: number = 10;
}
