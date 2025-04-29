import { IsNotEmpty, IsString } from 'class-validator';

export class FilePresignedUrlRegisterAdapter {
  @IsString()
  @IsNotEmpty()
  fileOwner: string;

  @IsString()
  @IsNotEmpty()
  fileUsage: string;

  @IsString()
  @IsNotEmpty()
  fileFormat: string;
}
