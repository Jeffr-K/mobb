// src/modules/feed/interface/controller/feed-category.controller.ts
import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery, ApiBearerAuth, ApiBody } from '@nestjs/swagger';
import {
  CategoriesQueryAdapter,
  CategoryCreateAdapter,
  CategoryDeleteAdapter,
  CategoryEditAdapter,
  CategoryResponseAdapter,
  PaginatedCategoryResponseAdapter,
} from '../adapter/adapter';
import {
  CategoryCreateCommandEvent,
  CategoryEditCommandEvent,
  CategoryDeleteCommandEvent,
} from '@modules/feed/core/command/category.command.event';
import { FeedCategoryQuery, FeedCategoriesQuery } from '@modules/feed/core/query/category.query.event';
import { RolesGuard } from '@/modules/auth/infrastructure/guard/roles.guard';
import { Role } from '@/modules/user/core/value/enum/role';
import { Roles } from '@/modules/auth/infrastructure/decorators/roles.decorator';
import { SessionValidationGuard } from '@/modules/auth/infrastructure/guard/session-validation.guard';
import { TokenGuard } from '@/modules/auth/infrastructure/guard/jwt.v2.guard';

@ApiTags('Categories')
@Controller({ path: 'categories', version: '1' })
export class FeedCategoryController {
  constructor(private readonly commandBus: CommandBus, private readonly queryBus: QueryBus) {}

  @Get()
  @ApiOperation({ summary: '카테고리 목록 조회', description: '카테고리 목록을 조회합니다.' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '카테고리 목록 조회 성공',
    type: PaginatedCategoryResponseAdapter,
  })
  async getCategories(@Query() query: CategoriesQueryAdapter): Promise<PaginatedCategoryResponseAdapter> {
    const categoriesQuery = new FeedCategoriesQuery({
      page: query.page || 1,
      limit: query.limit || 10,
      offset: query.offset || 0,
      orderBy: query.orderBy || 'createdAt',
    });

    const result = await this.queryBus.execute<FeedCategoriesQuery, PaginatedCategoryResponseAdapter>(categoriesQuery);
    return result;
  }

  @Get(':uuid')
  @ApiOperation({ summary: '특정 카테고리 조회', description: '특정 카테고리의 상세 정보를 조회합니다.' })
  @ApiParam({ name: 'uuid', description: '카테고리 UUID', type: String })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '카테고리 조회 성공',
    type: CategoryResponseAdapter,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: '카테고리를 찾을 수 없음',
  })
  async getCategory(@Param('uuid') uuid: string): Promise<CategoryResponseAdapter> {
    const categoryQuery = new FeedCategoryQuery({ categoryUuid: uuid });
    const result = await this.queryBus.execute<FeedCategoryQuery, CategoryResponseAdapter>(categoryQuery);
    return result;
  }

  @Post()
  // @UseGuards(TokenGuard, SessionValidationGuard, RolesGuard)
  // @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: '카테고리 생성', description: '새로운 카테고리를 생성합니다.' })
  @ApiBody({ type: CategoryCreateAdapter })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: '카테고리 생성 성공',
    type: CategoryResponseAdapter,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: '카테고리 생성 실패',
  })
  async createCategory(@Body() adapter: CategoryCreateAdapter): Promise<CategoryResponseAdapter> {
    const command = new CategoryCreateCommandEvent({
      name: adapter.name,
      parentCategoryUuid: adapter.parentCategoryUuid || null,
    });

    const result = await this.commandBus.execute<CategoryCreateCommandEvent, CategoryResponseAdapter>(command);
    return result;
  }

  @Put(':uuid')
  @UseGuards(TokenGuard, SessionValidationGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: '카테고리 수정', description: '기존 카테고리 정보를 수정합니다.' })
  @ApiParam({ name: 'uuid', description: '카테고리 UUID', type: String })
  @ApiBody({ type: CategoryEditAdapter })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '카테고리 수정 성공',
    type: CategoryResponseAdapter,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: '카테고리를 찾을 수 없음',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: '카테고리 수정 실패',
  })
  async updateCategory(
    @Param('uuid') uuid: string,
    @Body() adapter: CategoryEditAdapter,
  ): Promise<CategoryResponseAdapter> {
    const command = new CategoryEditCommandEvent({
      categoryUuid: uuid,
      name: adapter.name,
      parentCategoryUuid: adapter.parentCategoryUuid,
    });

    const result = await this.commandBus.execute<CategoryEditCommandEvent, CategoryResponseAdapter>(command);
    return result;
  }

  @Delete(':uuid')
  @UseGuards(TokenGuard, SessionValidationGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: '카테고리 삭제', description: '카테고리를 삭제합니다.' })
  @ApiParam({ name: 'uuid', description: '카테고리 UUID', type: String })
  @ApiQuery({
    name: 'forceUpdate',
    required: false,
    description: '연결된 피드가 있어도 강제 삭제 여부',
    type: Boolean,
  })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: '카테고리 삭제 성공',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: '카테고리를 찾을 수 없음',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: '카테고리에 연결된 피드가 있어 삭제할 수 없음',
  })
  async deleteCategory(@Param('uuid') uuid: string, @Query() query: CategoryDeleteAdapter): Promise<void> {
    const command = new CategoryDeleteCommandEvent({
      categoryUuid: uuid,
      forceUpdate: query.forceUpdate || false,
    });

    await this.commandBus.execute<CategoryDeleteCommandEvent, void>(command);
  }
}
