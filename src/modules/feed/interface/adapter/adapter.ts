import {
  ArrayMaxSize,
  IsArray,
  IsIn,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
  MaxLength,
  Min,
  MinLength,
  ValidateNested,
} from 'class-validator';
import { PartialType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { Sanitized } from '@infrastructure/utils/system/sanitize';

export class FeedImage {
  @IsString()
  @IsUrl()
  url: string;

  @IsInt()
  @Min(0)
  order: number;
}

export class FeedCreateAdapter {
  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  @MaxLength(20)
  title: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(10)
  @MaxLength(300)
  @Sanitized()
  content: string;

  @IsOptional()
  @IsArray()
  @IsNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => FeedImage)
  @ArrayMaxSize(10)
  images: FeedImage[];

  @IsString()
  @IsNotEmpty()
  categoryUuid: string;
}

export class FeedEditAdapter extends PartialType(FeedCreateAdapter) {}

export class FeedDeleteParamAdapter {
  @IsString()
  @IsNotEmpty()
  feedId: string;
}

export class CommentRegisterCommandAdapter {
  @IsNotEmpty()
  @IsString()
  content: string;

  @IsOptional()
  @IsString()
  parentCommentId?: string;
}

export class CommentEditCommandAdapter {
  @IsNotEmpty()
  @IsString()
  writerId: string;

  @IsNotEmpty()
  @IsString()
  content: string;
}

export class CommentRemoveCommandAdapter {
  @IsNotEmpty()
  @IsString()
  writerUuid: string;
}

export class CommentsQueryAdapter {
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  page?: number = 0;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  limit?: number = 20;

  @IsOptional()
  @IsIn(['ASC', 'DESC'])
  orderBy?: 'ASC' | 'DESC' = 'DESC';
}
