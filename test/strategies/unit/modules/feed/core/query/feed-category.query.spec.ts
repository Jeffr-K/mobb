import { Test } from '@nestjs/testing';
import { context } from '../../../../../../utils/marker';
import {
  FeedCategoriesQueryEventHandler,
  FeedCategoryQueryEventHandler,
} from '@modules/feed/core/query/feed-category.query.event.handler';
import { FeedCategoryRepository } from '@/modules/feed/infrastructure/repository/feed-category.repository';
import { FeedCategoriesQuery, FeedCategoryQuery } from '@/modules/feed/core/query/category.query.event';

import * as exception from '@/modules/feed/core/exception/exception';
import { FeedCategory } from '@/modules/feed/core/entity/feed-category';
import { ExtendedFeedCategoryBuilder } from '../../../../../../utils/extended-entity-builder';

describe('Feed Category Query Event Unit Tests', () => {
  let categoryQueryHandler: FeedCategoryQueryEventHandler;
  let categoriesQueryHandler: FeedCategoriesQueryEventHandler;
  let mockFeedCategoryRepository: jest.Mocked<FeedCategoryRepository>;

  beforeEach(async () => {
    mockFeedCategoryRepository = {
      selectFeedCategoryBy: jest.fn().mockResolvedValue(null),
      selectFeedCategoriesBy: jest.fn().mockResolvedValue({
        items: [],
        total: 0,
        pageCount: 0,
        currentPage: 1,
        pageSize: 10,
      }),
    } as unknown as jest.Mocked<FeedCategoryRepository>;

    const module = await Test.createTestingModule({
      providers: [
        FeedCategoryQueryEventHandler,
        FeedCategoriesQueryEventHandler,
        {
          provide: FeedCategoryRepository,
          useValue: mockFeedCategoryRepository,
        },
      ],
    }).compile();

    categoryQueryHandler = module.get<FeedCategoryQueryEventHandler>(FeedCategoryQueryEventHandler);
    categoriesQueryHandler = module.get<FeedCategoriesQueryEventHandler>(FeedCategoriesQueryEventHandler);
  });

  describe('FeedCategoriesQueryEventHandler', () => {
    const category = ExtendedFeedCategoryBuilder.take(1, true);

    context('없는 카테고리를 검색할 경우', () => {
      const command = new FeedCategoryQuery({ categoryUuid: category.identifier.uuid });

      beforeEach(async () => {
        mockFeedCategoryRepository.selectFeedCategoryBy.mockResolvedValue(null);
      });

      it('피드 카테고리를 조회할 수 없다.', async () => {
        expect(categoryQueryHandler.execute(command)).rejects.toThrowError(exception.FeedCategoryNotFoundException);
      });
    });
    context('상위 카테고리를 검색할 경우', () => {
      const parentCategory = ExtendedFeedCategoryBuilder.take(1, true);
      const command = new FeedCategoryQuery({ categoryUuid: parentCategory.identifier.uuid });

      beforeEach(async () => {
        mockFeedCategoryRepository.selectFeedCategoryBy.mockResolvedValue(parentCategory);
      });

      it('상위 카테고리를 조회할 수 있다', async () => {
        const result = await categoryQueryHandler.execute(command);
        expect(result).toEqual(parentCategory);
        expect(result.parent._id).toBeUndefined();
        expect(mockFeedCategoryRepository.selectFeedCategoryBy).toHaveBeenCalledWith({
          uuid: parentCategory.identifier.uuid,
        });
      });
    });
    context('하위 카테고리를 검색할 경우', () => {
      const childCategory = ExtendedFeedCategoryBuilder.take(1, true);
      const command = new FeedCategoryQuery({ categoryUuid: childCategory.identifier.uuid });

      beforeEach(async () => {
        mockFeedCategoryRepository.selectFeedCategoryBy.mockResolvedValue(childCategory);
      });

      it('하위 피드 카테고리를 조회할 수 있다.', async () => {
        const result = await categoryQueryHandler.execute(command);
        expect(result).toEqual(childCategory);
        expect(result.identifier.uuid).toBe(childCategory.identifier.uuid);
        expect(mockFeedCategoryRepository.selectFeedCategoryBy).toHaveBeenCalledWith({
          uuid: childCategory.identifier.uuid,
        });
      });
    });
  });

  describe('FeedCategoryQueryEventHandler', () => {
    context('카테고리 목록이 없을 경우', () => {
      const command = new FeedCategoriesQuery({
        page: 1,
        limit: 10,
        offset: 0,
        orderBy: 'createdAt',
      });

      beforeEach(async () => {
        mockFeedCategoryRepository.selectFeedCategoriesBy.mockResolvedValue({
          items: [],
          total: 0,
          pageCount: 0,
          currentPage: 1,
          pageSize: 10,
        });
      });

      it('빈 카테고리 목록이 반환된다.', async () => {
        const result = await categoriesQueryHandler.execute(command);
        expect(result.items).toHaveLength(0);
        expect(result.total).toBe(0);
        expect(mockFeedCategoryRepository.selectFeedCategoriesBy).toHaveBeenCalledWith({
          page: 1,
          limit: 10,
          offset: 0,
          orderBy: 'createdAt',
        });
      });
    });

    context('상위 카테고리 목록만 검색할 경우', () => {
      const parentCategories = ExtendedFeedCategoryBuilder.take(3, false);
      const command = new FeedCategoriesQuery({
        page: 1,
        limit: 10,
        offset: 0,
        orderBy: 'createdAt',
      });

      beforeEach(async () => {
        mockFeedCategoryRepository.selectFeedCategoriesBy.mockResolvedValue({
          items: parentCategories,
          total: parentCategories.length,
          pageCount: 1,
          currentPage: 1,
          pageSize: 10,
        });
      });

      it('상위 카테고리 목록만 조회할 수 있다.', async () => {
        const result = await categoriesQueryHandler.execute(command);
        expect(result.items).toEqual(parentCategories);
        expect(result.total).toBe(parentCategories.length);
        expect(mockFeedCategoryRepository.selectFeedCategoriesBy).toHaveBeenCalledWith({
          page: 1,
          limit: 10,
          offset: 0,
          orderBy: 'createdAt',
        });

        result.items.forEach((category: FeedCategory) => {
          expect(category.parent).toBeNull();
        });
      });
    });

    context('하위 카테고리 목록만 검색할 경우', () => {
      const childCategories: FeedCategory[] = ExtendedFeedCategoryBuilder.take(3, true);

      const query = new FeedCategoriesQuery({
        page: 1,
        limit: 10,
        offset: 0,
        orderBy: 'createdAt',
      });

      beforeEach(async () => {
        mockFeedCategoryRepository.selectFeedCategoriesBy.mockResolvedValue({
          items: childCategories,
          total: childCategories.length,
          pageCount: 1,
          currentPage: 1,
          pageSize: 10,
        });
      });

      it('하위 카테고리 목록만 조회할 수 있다.', async () => {
        const result = await categoriesQueryHandler.execute(query);
        expect(result.items).toEqual(childCategories);
        expect(result.total).toBe(childCategories.length);
        expect(mockFeedCategoryRepository.selectFeedCategoriesBy).toHaveBeenCalledWith({
          page: 1,
          limit: 10,
          offset: 0,
          orderBy: 'createdAt',
        });

        result.items.forEach((category: FeedCategory) => {
          expect(category.parent).toBeDefined();
        });
      });
    });

    context('상위 및 하위 카테고리 목록 모두 검색할 경우', () => {
      const childCategories = ExtendedFeedCategoryBuilder.take(2, true);
      const parentCategories = childCategories.flatMap((child) => child.parent);
      const allCategories = [...parentCategories, ...childCategories];
      const command = new FeedCategoriesQuery({
        page: 1,
        limit: 10,
        offset: 0,
        orderBy: 'createdAt',
      });

      beforeEach(async () => {
        mockFeedCategoryRepository.selectFeedCategoriesBy.mockResolvedValue({
          items: allCategories,
          total: allCategories.length,
          pageCount: 1,
          currentPage: 1,
          pageSize: 10,
        });
      });

      it('모든 카테고리 목록을 조회할 수 있다.', async () => {
        const result = await categoriesQueryHandler.execute(command);
        expect(result.items).toEqual(allCategories);
        expect(result.total).toBe(allCategories.length);
        expect(mockFeedCategoryRepository.selectFeedCategoriesBy).toHaveBeenCalledWith({
          page: 1,
          limit: 10,
          offset: 0,
          orderBy: 'createdAt',
        });

        const parentResults = result.items.filter((category: FeedCategory) => !category.parent);
        const childResults = result.items.filter((category: FeedCategory) => category.parent);
        expect(parentResults).toHaveLength(parentCategories.length);
        expect(childResults).toHaveLength(childCategories.length);
      });
    });
  });
});
