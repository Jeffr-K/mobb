import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import {
  CommentEditCommandAdapter,
  CommentRegisterCommandAdapter,
  CommentRemoveCommandAdapter,
} from '@modules/feed/interface/adapter/adapter';
import {
  CommentEditCommandEvent,
  CommentRegisterCommandEvent,
  CommentRemoveCommandEvent,
} from '@modules/feed/core/command/comment.command.event';
import { CommentQueryEvent, CommentsQueryEvent } from '@modules/feed/core/query/query.event';
import { Roles } from '@modules/auth/infrastructure/decorators/roles.decorator';
import { Secured } from '@modules/auth/infrastructure/guard/token.guard.decorator';
import { User } from '@modules/user/core/entity/user';
import { Role } from '@modules/user/core/value/enum/role';
import { Comment } from '@modules/feed/core/entity/comment';
import { BusinessResponse, PaginatedResponse } from '@infrastructure/utils/base/base-response';
import { TokenGuard } from '@/modules/auth/infrastructure/guard/jwt.v2.guard';
import { SessionValidationGuard } from '@/modules/auth/infrastructure/guard/session-validation.guard';
import { RolesGuard } from '@/modules/auth/infrastructure/guard/roles.guard';

@Controller({ path: 'comments', version: ['1'] })
export class CommentController {
  constructor(private readonly commandBus: CommandBus, private readonly queryBus: QueryBus) {}

  @Post('/')
  @UseGuards(TokenGuard, SessionValidationGuard, RolesGuard)
  @Roles(Role.USER, Role.ADMIN)
  async createComment(
    @Secured() user: User,
    @Body() adapter: CommentRegisterCommandAdapter,
    @Query('feedId') feedId: string,
  ): Promise<BusinessResponse<{ _id: number }>> {
    const result = await this.commandBus.execute(
      new CommentRegisterCommandEvent({
        writer: user,
        feedId: feedId,
        content: adapter.content,
        parentCommentId: adapter.parentCommentId,
      }),
    );

    return new BusinessResponse<{ _id: number }>(result['_id'], '댓글 작성 성공', HttpStatus.CREATED);
  }

  @Put('/:commentId')
  @UseGuards(TokenGuard, SessionValidationGuard, RolesGuard)
  @Roles(Role.USER, Role.ADMIN)
  async editComment(@Param('commentId') commentId: string, @Body() adapter: CommentEditCommandAdapter) {
    await this.commandBus.execute(
      new CommentEditCommandEvent({ commentId, writerId: adapter.writerId, content: adapter.content }),
    );
  }

  @Delete('/:commentId')
  @UseGuards(TokenGuard, SessionValidationGuard, RolesGuard)
  @Roles(Role.USER, Role.ADMIN)
  async deleteComment(@Param('commentId') commentUuid: string, @Body() adapter: CommentRemoveCommandAdapter) {
    await this.commandBus.execute(new CommentRemoveCommandEvent(commentUuid, adapter.writerUuid));
  }

  @Get('/')
  @UseGuards(TokenGuard, SessionValidationGuard, RolesGuard)
  @Roles(Role.USER, Role.ADMIN)
  async getComments(
    @Query('feedId') feedId: string,
    @Query('page', new ValidationPipe()) page = 1,
    @Query('limit', new ValidationPipe()) limit = 10,
    @Query('orderBy') orderBy: string,
  ): Promise<PaginatedResponse<Comment>> {
    return await this.queryBus.execute(new CommentsQueryEvent({ feedId, page, limit, orderBy }));
  }

  @Get('/:commentId')
  @UseGuards(TokenGuard, SessionValidationGuard, RolesGuard)
  @Roles(Role.USER, Role.ADMIN)
  async getComment(@Param('commentId') commentId: string): Promise<Comment> {
    return await this.queryBus.execute(new CommentQueryEvent({ commentId }));
  }
}
