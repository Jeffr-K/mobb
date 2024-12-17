import { IsArray, IsIn, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { PartialType } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class FeedCreateAdapter {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  content: string;

  @IsArray()
  @IsNotEmpty()
  images: string[];
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
  feedId: string;

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
