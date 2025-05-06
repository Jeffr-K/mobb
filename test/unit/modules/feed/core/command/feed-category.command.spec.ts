import { context } from '../../../../../utils/marker';
import { FeedCategoryCreateCommandEventHandler } from '@modules/feed/core/command/category.command.event.handler';
import { Test } from '@nestjs/testing';
import { EntityManager } from '@mikro-orm/postgresql';

type MockedEntityManagerInstance = unknown;

describe('Feed Category Command Event Unit Tests', () => {
  let handler: FeedCategoryCreateCommandEventHandler;
  let mockTransactionalManager: jest.Mocked<EntityManager>;

  beforeEach(async () => {
    mockTransactionalManager = {
      rollback: jest.fn(),
      commit: jest.fn(),
      persistAndFlush: jest.fn(),
    } as MockedEntityManagerInstance as jest.Mocked<EntityManager>;

    const module = await Test.createTestingModule({
      providers: [
        FeedCategoryCreateCommandEventHandler,
        {
          provide: EntityManager,
          useValue: {
            transactional: jest.fn().mockImplementation(async (cb) => {
              await cb(mockTransactionalManager);
              return mockTransactionalManager;
            }),
          },
        },
      ],
    }).compile();

    handler = module.get<FeedCategoryCreateCommandEventHandler>(FeedCategoryCreateCommandEventHandler);
  });

  describe('FeedCategoryCreateCommandEventHandler', () => {
    context('비속어 및 불순한 내용이 포함되어 있을 경우', () => {
      it('카테고리 생성이 실패해야 합니다.', () => {});
      it('`FeedCategoryRegistrationFailedException` 예외가 발생해야 합니다.', () => {});
    });
    context('이미 존재하는 카테고리일 경우', () => {
      it('카테고리 생성이 실패해야 합니다.', () => {});
      it('`CategoryAlreadyExistsException` 예외가 발생해야 합니다.', () => {});
    });
    context('`사용자` 에 의해 카테고리 생성 요청이 들어올 경우', () => {
      it('카테고리 생성이 실패해야 합니다.', () => {});
      it('UnAuthorizedException 예외가 발생해야 합니다.', () => {});
    });
    context('관리자에 의해 카테고리 요청이 들어올 경우', () => {
      it('카테고리 생성이 성공해야 합니다.', () => {});
      it('카테고리가 조회되어야 합니다.', () => {});
    });
  });

  describe('FeedCategoryDeleteCommandEventHandler', () => {
    context('', () => {});
    context('', () => {});
    context('', () => {});
  });

  describe('FeedCategoryEditCommandEventHandler', () => {
    context('', () => {});
    context('', () => {});
    context('', () => {});
  });
});
