import {
  Body,
  Controller,
  DefaultValuePipe,
  Delete,
  Get,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { Feed } from '@modules/feed/core/entity/feed';
import { FeedCreateAdapter, FeedDeleteParamAdapter, FeedEditAdapter } from '@modules/feed/interface/adapter/adapter';
import {
  FeedCreateCommandEvent,
  FeedDeleteCommandEvent,
  FeedEditCommandEvent,
} from '@modules/feed/core/command/comment.command.event';
import { FeedQueryEvent, FeedsQueryEvent } from '@modules/feed/core/query/query.event';
import { BusinessResponse, PaginatedResponse } from '@infrastructure/utils/base/base-response';
import { Roles } from '@modules/auth/infrastructure/decorators/roles.decorator';
import { Role } from '@modules/user/core/value/enum/role';
import { Secured } from '@modules/auth/infrastructure/guard/token.guard.decorator';
import { User } from '@modules/user/core/entity/user';
import { RolesGuard } from '@modules/auth/infrastructure/guard/roles.guard';
import { TokenGuard } from '@modules/auth/infrastructure/guard/jwt.v2.guard';
import { SessionValidationGuard } from '@modules/auth/infrastructure/guard/session-validation.guard';

@Controller({ path: 'feed', version: ['1'] })
export class FeedController {
  constructor(private readonly queryBus: QueryBus, private readonly commandBus: CommandBus) {}

  @Post('/')
  @UseGuards(TokenGuard, SessionValidationGuard, RolesGuard)
  @Roles(Role.USER, Role.ADMIN)
  async createFeed(@Secured() user: User, @Body() adapter: FeedCreateAdapter): Promise<void> {
    await this.commandBus.execute(
      new FeedCreateCommandEvent({
        title: adapter.title,
        content: adapter.content,
        images: adapter.images,
        user: user,
      }),
    );
  }

  @Delete('/:feedId')
  async deleteFeed(@Param() param: FeedDeleteParamAdapter): Promise<void> {
    await this.commandBus.execute(new FeedDeleteCommandEvent({ ...param }));
  }

  @Put('/:feedId')
  async editFeed(@Param('feedId') feedId: string, @Body() adapter: FeedEditAdapter): Promise<void> {
    await this.commandBus.execute(
      new FeedEditCommandEvent({
        feedId: feedId,
        title: adapter.title,
        content: adapter.content,
        images: adapter.images,
      }),
    );
  }

  @Get('/list')
  async feeds(
    @Query('page', new DefaultValuePipe(0), ParseIntPipe) page: number,
    @Query('size', new DefaultValuePipe(10), ParseIntPipe) size: number,
    @Query('sort', new DefaultValuePipe('createdAt:desc')) sort: string,
    @Query('limit', new DefaultValuePipe('10'), ParseIntPipe) limit: number,
  ): Promise<BusinessResponse<PaginatedResponse<Feed>>> {
    const feeds = await this.queryBus.execute(new FeedsQueryEvent({ page, size, sort, limit }));
    // TODO: response serializer 구현해야함
    return new BusinessResponse(feeds, '조회 성공', HttpStatus.OK);
  }

  @Get('/:feedId')
  async feed(@Param('feedId') feedId: string): Promise<BusinessResponse<Feed>> {
    const feed = await this.queryBus.execute(new FeedQueryEvent({ feedId }));
    return new BusinessResponse<Feed>(feed, '조회 성공', HttpStatus.OK);
  }
}
