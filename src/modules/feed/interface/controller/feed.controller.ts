import { Body, Controller, DefaultValuePipe, Delete, Get, Param, ParseIntPipe, Post, Put, Query } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { Feed } from '@modules/feed/core/entity/feed';
import { FeedCreateAdapter, FeedDeleteParamAdapter, FeedEditAdapter } from '@modules/feed/interface/adapter/adapter';
import {
  FeedCreateCommandEvent,
  FeedDeleteCommandEvent,
  FeedEditCommandEvent,
} from '@modules/feed/core/command/command.event';
import { FeedQueryEvent, FeedsQueryEvent } from '@modules/feed/core/query/query.event';
import { PaginatedResponse } from '@infrastructure/utils/base/base-response';

@Controller({ path: 'feed', version: ['1'] })
export class FeedController {
  constructor(private readonly queryBus: QueryBus, private readonly commandBus: CommandBus) {}

  @Post('/')
  async createFeed(@Body() adapter: FeedCreateAdapter): Promise<void> {
    await this.commandBus.execute(new FeedCreateCommandEvent({ ...adapter }));
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
  ): Promise<PaginatedResponse<Feed>> {
    return await this.queryBus.execute(new FeedsQueryEvent({ page, size, sort, limit }));
  }

  @Get('/:feedId')
  async feed(@Param('feedId') feedId: string): Promise<Feed> {
    return await this.queryBus.execute(new FeedQueryEvent({ feedId }));
  }
}
