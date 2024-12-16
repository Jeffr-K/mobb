import { IsArray, IsNotEmpty, IsString } from 'class-validator';
import { PartialType } from '@nestjs/swagger';

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

export class CommentsQueryAdapter {}

export class CommentQueryAdapter {}

export class CommentRegisterCommandAdapter {}

export class CommentEditCommandAdapter {}

export class CommentRemoveCommandAdapter {}
