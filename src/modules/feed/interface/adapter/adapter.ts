import {
  ArrayMaxSize,
  IsArray,
  IsBoolean,
  IsIn,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
  IsUUID,
  Matches,
  Max,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { Sanitized } from '@infrastructure/utils/system/sanitize';
import { Nullable } from '@/infrastructure/utils/types/types';

export class FeedImage {
  @IsString()
  @IsNotEmpty()
  @IsUUID('4')
  uuid: string;

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
  readonly title: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  @MaxLength(300)
  @Sanitized()
  readonly content: string;

  @IsOptional()
  @IsArray()
  @Type(() => FeedImage)
  @ArrayMaxSize(10)
  readonly images?: Nullable<Array<FeedImage>>;

  @IsString()
  @IsNotEmpty()
  readonly categoryUuid: string;
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

export class CategoryCreateAdapter {
  @ApiProperty({ description: '카테고리 이름', example: '기술' })
  @IsNotEmpty({ message: '카테고리 이름은 필수입니다.' })
  @IsString({ message: '카테고리 이름은 문자열이어야 합니다.' })
  name: string;

  @ApiPropertyOptional({
    description: '상위 카테고리 UUID (없을 경우 최상위 카테고리)',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsOptional()
  @IsUUID('4', { message: '상위 카테고리 UUID 형식이 올바르지 않습니다.' })
  parentCategoryUuid?: string | null;
}

export class CategoryEditAdapter {
  @ApiProperty({ description: '카테고리 이름', example: '프론트엔드' })
  @IsNotEmpty({ message: '카테고리 이름은 필수입니다.' })
  @IsString({ message: '카테고리 이름은 문자열이어야 합니다.' })
  name: string;

  @ApiPropertyOptional({
    description: '상위 카테고리 UUID (null로 설정 시 최상위 카테고리로 변경)',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsOptional()
  @IsUUID('4', { message: '상위 카테고리 UUID 형식이 올바르지 않습니다.' })
  parentCategoryUuid?: Nullable<string>;
}

export class CategoryDeleteAdapter {
  @ApiPropertyOptional({ description: '연결된 피드가 있어도 강제 삭제 여부', default: false })
  @IsOptional()
  @IsBoolean({ message: 'forceUpdate는 boolean 값이어야 합니다.' })
  forceUpdate?: boolean;
}

export class CategoryResponseAdapter {
  @ApiProperty({ description: '카테고리 UUID', example: '123e4567-e89b-12d3-a456-426614174000' })
  uuid: string;

  @ApiProperty({ description: '카테고리 이름', example: '프론트엔드' })
  name: string;

  @ApiPropertyOptional({ description: '상위 카테고리 UUID', example: '123e4567-e89b-12d3-a456-426614174000' })
  parentCategoryUuid?: string;
}

export class CategoriesQueryAdapter {
  @ApiPropertyOptional({ description: '페이지 번호', default: 1, minimum: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: 'page 는 숫자여야 합니다.' })
  @Min(1, { message: 'page 는 1 이상이어야 합니다.' })
  page?: number = 1;

  @ApiPropertyOptional({ description: '페이지당 항목 수', default: 10, minimum: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: 'limit는 숫자여야 합니다.' })
  @Min(1, { message: 'limit는 1 이상이어야 합니다.' })
  limit?: number = 10;

  @ApiPropertyOptional({ description: '건너뛸 레코드 수 (페이지네이션에서 시작 위치 지정)', default: 0, minimum: 0 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: 'offset은 숫자여야 합니다.' })
  @Min(0, { message: 'offset은 0 이상이어야 합니다.' })
  offset?: number = 0;

  @ApiPropertyOptional({ description: '정렬 기준 (필드명 앞에 -를 붙이면 내림차순)', example: 'createdAt' })
  @IsOptional()
  @IsString({ message: 'orderBy는 문자열이어야 합니다.' })
  orderBy?: string = 'createdAt';
}

export class PaginatedCategoryResponseAdapter {
  @ApiProperty({ description: '카테고리 목록', type: [CategoryResponseAdapter] })
  items: CategoryResponseAdapter[];

  @ApiProperty({ description: '총 카테고리 수', example: 42 })
  total: number;

  @ApiProperty({ description: '총 페이지 수', example: 5 })
  pageCount: number;

  @ApiProperty({ description: '현재 페이지', example: 1 })
  currentPage: number;

  @ApiProperty({ description: '페이지당 항목 수', example: 10 })
  pageSize: number;
}

export class FeedQueriesAdapter {
  @ApiProperty({
    description: '페이지 번호 (0부터 시작)',
    type: Number,
    required: false,
    default: 0,
    example: 0,
  })
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  @Min(0)
  readonly page: number = 0;

  @ApiProperty({
    description: '페이지당 항목 수',
    type: Number,
    required: false,
    default: 10,
    example: 10,
  })
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  @Min(1)
  @Max(100)
  readonly size: number = 10;

  @ApiProperty({
    description: '정렬 기준 (필드명:asc|desc)',
    type: String,
    required: false,
    default: 'createdAt:desc',
    example: 'createdAt:desc',
  })
  @IsOptional()
  @IsString()
  @Matches(/^[a-zA-Z0-9]+:(asc|desc)$/)
  readonly sort: string = 'createdAt:desc';

  @ApiProperty({
    description: '카테고리 아이디',
    type: Number,
    required: false,
    example: '1',
  })
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  readonly categoryId?: Nullable<number>;
}
