import { context } from '../../../../../../utils/marker';
import {
  FeedCategoryCreateCommandEventHandler,
  FeedCategoryDeleteCommandEventHandler,
  FeedCategoryEditCommandEventHandler,
} from '@modules/feed/core/command/category.command.event.handler';
import { EntityManager } from '@mikro-orm/postgresql';
import { Test } from '@nestjs/testing';
import {
  CategoryCreateCommandEvent,
  CategoryDeleteCommandEvent,
  CategoryEditCommandEvent,
} from '@modules/feed/core/command/category.command.event';
import { FeedCategoryRepository } from '@modules/feed/infrastructure/repository/feed-category.repository';
import { FeedCategory } from '@modules/feed/core/entity/feed-category';
import { ExtendedFeedBuilder, ExtendedFeedCategoryBuilder } from '../../../../../../utils/extended-entity-builder';
import {
  FeedCategoryHasAssociatedFeedsException,
  FeedCategoryNotFoundException,
  FeedCategoryRegistrationFailedException,
} from '@modules/feed/core/exception/exception';
import { QueryBus } from '@nestjs/cqrs';
import { FeedQueryEvent } from '@modules/feed/core/query/query.event';

describe('CommentCommandHandler', () => {
  let categoryCreateHandler: FeedCategoryCreateCommandEventHandler;
  let categoryDeleteHandler: FeedCategoryDeleteCommandEventHandler;
  let categoryEditHandler: FeedCategoryEditCommandEventHandler;
  let mockTransactionalManager: jest.Mocked<EntityManager>;
  let mockFeedCategoryRepository: jest.Mocked<FeedCategoryRepository>;
  let mockQueryBus: jest.Mocked<QueryBus>;

  beforeEach(async () => {
    mockTransactionalManager = {
      rollback: jest.fn(),
      commit: jest.fn(),
      persistAndFlush: jest.fn(),
      persist: jest.fn(),
      flush: jest.fn(),
      removeAndFlush: jest.fn(),
      transactional: jest.fn().mockImplementation(async (cb) => {
        return await cb(mockTransactionalManager);
      }),
    } as unknown as jest.Mocked<EntityManager>;

    mockFeedCategoryRepository = {
      selectFeedCategoryBy: jest.fn().mockResolvedValue(null),
    } as unknown as jest.Mocked<FeedCategoryRepository>;

    mockQueryBus = {
      execute: jest.fn().mockResolvedValue([]),
    } as unknown as jest.Mocked<QueryBus>;

    FeedCategory.register = jest.fn().mockImplementation(async (params) => {
      return ExtendedFeedCategoryBuilder.random(false).setName(params.name).setParent(params.parent).build();
    });

    const module = await Test.createTestingModule({
      providers: [
        FeedCategoryCreateCommandEventHandler,
        FeedCategoryEditCommandEventHandler,
        FeedCategoryDeleteCommandEventHandler,
        {
          provide: EntityManager,
          useValue: mockTransactionalManager,
        },
        {
          provide: FeedCategoryRepository,
          useValue: mockFeedCategoryRepository,
        },
        {
          provide: QueryBus,
          useValue: mockQueryBus,
        },
      ],
    }).compile();

    categoryCreateHandler = module.get<FeedCategoryCreateCommandEventHandler>(FeedCategoryCreateCommandEventHandler);
    categoryDeleteHandler = module.get<FeedCategoryDeleteCommandEventHandler>(FeedCategoryDeleteCommandEventHandler);
    categoryEditHandler = module.get<FeedCategoryEditCommandEventHandler>(FeedCategoryEditCommandEventHandler);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('FeedCategoryCreateCommandHandler', () => {
    describe('상위 카테고리 생성 요청이 오면', () => {
      const existingParentCategory = ExtendedFeedCategoryBuilder.take(1, false) as FeedCategory;

      context('동일한 이름의 상위 카테고리인 경우', () => {
        const command = new CategoryCreateCommandEvent({
          name: existingParentCategory.name,
          parentCategoryUuid: null,
        });

        it('상위 카테고리 생성이 실패해야 한다.', async () => {
          mockFeedCategoryRepository.selectFeedCategoryBy.mockResolvedValue(existingParentCategory);
          await expect(categoryCreateHandler.execute(command)).rejects.toThrowError(
            FeedCategoryRegistrationFailedException,
          );
        });
      });

      it('카테고리가 생성되어야 한다.', async () => {
        const command = new CategoryCreateCommandEvent({
          name: 'newCategoryName',
          parentCategoryUuid: null,
        });

        mockFeedCategoryRepository.selectFeedCategoryBy.mockResolvedValue(null);

        await categoryCreateHandler.execute(command);

        expect(mockFeedCategoryRepository.selectFeedCategoryBy).toHaveBeenCalledWith({
          name: 'newCategoryName',
          parent: null,
        });
        expect(mockTransactionalManager.persist).toHaveBeenCalled();
      });
    });

    describe('하위 카테고리 생성 요청이 오면', () => {
      const parentCategory = ExtendedFeedCategoryBuilder.random().setName('parentCategory').setTimestamp().build();

      const command = new CategoryCreateCommandEvent({
        name: 'newChildCategory',
        parentCategoryUuid: parentCategory.identifier.uuid,
      });

      context('상위 카테고리가 존재하지 않는 경우', () => {
        beforeEach(() => {
          mockFeedCategoryRepository.selectFeedCategoryBy.mockResolvedValue(null);
        });

        it('카테고리 생성이 실패해야 한다.', async () => {
          await expect(categoryCreateHandler.execute(command)).rejects.toThrowError(
            FeedCategoryRegistrationFailedException,
          );
        });
      });

      context('상위 카테고리가 존재하는 경우', () => {
        beforeEach(() => {
          mockFeedCategoryRepository.selectFeedCategoryBy = jest.fn().mockImplementation((filter) => {
            if (filter.uuid === parentCategory.identifier.uuid) {
              return Promise.resolve(parentCategory);
            }
            // 다른 모든 경우
            return Promise.resolve(null);
          });
        });

        context('동일한 이름의 하위 카테고리인 경우', () => {
          const existingChildCategory = ExtendedFeedCategoryBuilder.random()
            .setName('newChildCategory')
            .setParent(parentCategory)
            .build();

          beforeEach(() => {
            // 상위 컨텍스트의 모킹을 덮어쓰는 새로운 모킹 설정
            mockFeedCategoryRepository.selectFeedCategoryBy = jest.fn().mockImplementation((filter) => {
              // 부모 카테고리 조회 시
              if (filter.uuid === parentCategory.identifier.uuid) {
                return Promise.resolve(parentCategory);
              }
              // 중복 체크 시 (부모 카테고리가 있고 이름이 같은 경우)
              if (filter.name === 'newChildCategory' && filter.parent === parentCategory) {
                return Promise.resolve(existingChildCategory);
              }
              // 다른 모든 경우
              return Promise.resolve(null);
            });
          });

          it('하위 카테고리 생성이 실패해야 한다.', async () => {
            await expect(categoryCreateHandler.execute(command)).rejects.toThrowError(
              FeedCategoryRegistrationFailedException,
            );
          });
        });

        it('하위 카테고리가 생성되어야 한다.', async () => {
          await categoryCreateHandler.execute(command);

          expect(mockFeedCategoryRepository.selectFeedCategoryBy).toHaveBeenCalledWith({
            uuid: parentCategory.identifier.uuid,
          });
          expect(FeedCategory.register).toHaveBeenCalledWith({
            name: 'newChildCategory',
            parent: parentCategory,
          });
          expect(mockTransactionalManager.persist).toHaveBeenCalled();
        });
      });
    });
  });

  describe('FeedCategoryDeleteCommandHandler', () => {
    describe('상위 카테고리 삭제 요청이 오면', () => {
      const existingCategory = ExtendedFeedCategoryBuilder.take(1, false);
      const command = new CategoryDeleteCommandEvent({
        categoryUuid: existingCategory.identifier.uuid,
        forceUpdate: false,
      });
      context('변경할 카테고리가 존재하지 않는 경우', () => {
        beforeEach(() => {
          mockFeedCategoryRepository.selectFeedCategoryBy.mockResolvedValue(null);
        });
        it('카테고리 삭제 요청이 실패되어야 한다.', async () => {
          await expect(categoryDeleteHandler.execute(command)).rejects.toThrowError(FeedCategoryNotFoundException);
        });
      });
      context('if category has feeds greater than 1', () => {
        const existingCategory = ExtendedFeedCategoryBuilder.take(1, false);
        const feeds = ExtendedFeedBuilder.take(2, { withCategory: existingCategory });

        beforeEach(() => {
          mockFeedCategoryRepository.selectFeedCategoryBy.mockResolvedValue(existingCategory);
          mockQueryBus.execute.mockResolvedValue(feeds);
        });
        it('should be failed category delete operation.', async () => {
          await expect(categoryDeleteHandler.execute(command)).rejects.toThrowError(
            FeedCategoryHasAssociatedFeedsException,
          );
        });
      });
      context('if category has no feeds', () => {
        beforeEach(() => {
          mockFeedCategoryRepository.selectFeedCategoryBy.mockResolvedValueOnce(existingCategory);
          mockQueryBus.execute.mockResolvedValue([]);
        });
        it('should be deleted successfully.', async () => {
          await categoryDeleteHandler.execute(command);
          expect(mockQueryBus.execute).toHaveBeenCalledWith(new FeedQueryEvent({ categoryId: existingCategory._id }));
        });
      });
    });
    describe('when sub category is going to be deleted', () => {
      const existingCategory = ExtendedFeedCategoryBuilder.take(1, true);
      const command = new CategoryDeleteCommandEvent({
        categoryUuid: existingCategory.identifier.uuid,
        forceUpdate: false,
      });
      context('if the editable category is no exists', () => {
        beforeEach(() => {
          mockFeedCategoryRepository.selectFeedCategoryBy.mockResolvedValue(null);
        });

        it('should be failed the category delete operation.', async () => {
          await expect(categoryDeleteHandler.execute(command)).rejects.toThrowError(FeedCategoryNotFoundException);
        });
      });
      context('카테고리에 피드가 하나 이상 존재할 경우', () => {
        const feeds = ExtendedFeedBuilder.take(2, { withCategory: existingCategory });
        beforeEach(() => {
          mockFeedCategoryRepository.selectFeedCategoryBy.mockResolvedValue(existingCategory);
          mockQueryBus.execute.mockResolvedValue(feeds);
        });
        it('카테고리 삭제가 실패 되어야 한다.', async () => {
          await expect(categoryDeleteHandler.execute(command)).rejects.toThrowError(
            FeedCategoryHasAssociatedFeedsException,
          );
          expect(mockQueryBus.execute).toHaveBeenCalledWith(new FeedQueryEvent({ categoryId: existingCategory._id }));
        });
      });
      context('카테고리에 피드가 하나라도 존재하지 않는 경우', () => {
        beforeEach(() => {
          mockFeedCategoryRepository.selectFeedCategoryBy.mockResolvedValue(existingCategory);
          mockQueryBus.execute.mockResolvedValue([]);
        });

        it('카테고리가 정상적으로 삭제된다.', async () => {
          await categoryDeleteHandler.execute(command);

          expect(mockQueryBus.execute).toHaveBeenCalledWith(new FeedQueryEvent({ categoryId: existingCategory._id }));
          expect(mockTransactionalManager.removeAndFlush).toHaveBeenCalledWith(existingCategory);
        });
      });
    });
  });

  describe('FeedCategoryEditCommandHandler', () => {
    describe('카테고리 변경 요청이 발생했을 때', () => {
      context('변경할 카테고리가 존재하지 않는 경우', () => {
        const existingParentCategory = ExtendedFeedCategoryBuilder.take(1, false);
        const command = new CategoryEditCommandEvent({
          categoryUuid: existingParentCategory.identifier.uuid,
          name: existingParentCategory.name,
          parent: null,
        });
        beforeEach(() => {
          mockFeedCategoryRepository.selectFeedCategoryBy.mockResolvedValue(null);
        });

        it('카테고리 변경 요청이 실패되어야 한다.', async () => {
          await expect(categoryEditHandler.execute(command)).rejects.toThrowError(FeedCategoryNotFoundException);
        });
      });

      context('정상적으로 카테고리 변경 요청이 들어온 경우', () => {
        const existingParentCategory = ExtendedFeedCategoryBuilder.take(1, false);
        const newExistingParentCategory = ExtendedFeedCategoryBuilder.take(1, false);

        newExistingParentCategory.identifier.increaseVersion();

        const command = new CategoryEditCommandEvent({
          categoryUuid: existingParentCategory.identifier.uuid,
          name: existingParentCategory.name,
          parent: null,
        });

        beforeEach(() => {
          mockFeedCategoryRepository.selectFeedCategoryBy.mockResolvedValue(existingParentCategory);
          const increaseSpy = jest.spyOn(existingParentCategory.identifier, 'increaseVersion');
          increaseSpy.mockResolvedValue(newExistingParentCategory.identifier);
        });

        it('카테고리가 변경되어야 한다.', async () => {
          await categoryEditHandler.execute(command);

          expect(existingParentCategory.name).toBe(command.name);
          expect(mockTransactionalManager.persistAndFlush).toHaveBeenCalledWith(existingParentCategory);
        });
      });

      // context('상위 카테고리와 하위 카테고리 모두 변경되는 경우', () => {});
    });
  });
});
