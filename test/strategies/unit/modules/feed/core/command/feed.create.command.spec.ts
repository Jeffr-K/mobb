import { context } from '../../../../../../utils/marker';
import { FeedCreateCommandEvent } from '@modules/feed/core/command/comment.command.event';
import { ExtendedUserBuilder } from '../../../../../../utils/extended-entity-builder';
import { FeedImage } from '@modules/feed/interface/adapter/adapter';
import { FeedCreateCommandEventHandler } from '@modules/feed/core/command/comment.command.event.handler';
import { EntityManager } from '@mikro-orm/postgresql';
import { Test } from '@nestjs/testing';

type MockedEntityManagerInstance = unknown;

describe('FeedCreateCommandEventHandler', () => {
  let handler: FeedCreateCommandEventHandler;
  let mockTransactionalManager: jest.Mocked<EntityManager>;

  beforeEach(async () => {
    mockTransactionalManager = {
      rollback: jest.fn(),
      commit: jest.fn(),
      persistAndFlush: jest.fn(),
    } as MockedEntityManagerInstance as jest.Mocked<EntityManager>;

    const module = await Test.createTestingModule({
      providers: [
        FeedCreateCommandEventHandler,
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

    handler = module.get<FeedCreateCommandEventHandler>(FeedCreateCommandEventHandler);
  });

  context('피드가 생성될 때', () => {
    const feedImages: FeedImage[] = [
      { url: 'https://example.com/image1.jpg', order: 0 },
      { url: 'https://example.com/image2.jpg', order: 1 },
    ];
    const command = new FeedCreateCommandEvent({
      title: '안녕하세요.',
      content: 'React 18과 TypeScript 5.0의 조합으로 새 프로젝트를 시작했습니다.',
      images: feedImages,
      user: ExtendedUserBuilder.random().build(),
    });

    it('피드가 생성되야 한다.', async () => {
      await handler.execute(command);
      expect(mockTransactionalManager.persistAndFlush).toHaveBeenCalled();
    });

    it('피드 히스토리가 생성되어야 한다.', async () => {
      await handler.execute(command);
      expect(mockTransactionalManager.persistAndFlush).toHaveBeenCalledTimes(2);
    });
  });

  // context('만약 비속어 또는 불순한 내용이 들어가 있는 경우', () => {
  //   const badwords = ['비속어', '욕설', '불순한 내용'];
  //
  //   const command = new FeedCreateCommandEvent({
  //     title: '비속어 제목',
  //     content: '비속어 내용',
  //     images: [],
  //     user: ExtendedUserBuilder.random().build(),
  //   });
  //
  //   it('피드가 생성되지 말아야 한다.', async () => {
  //     await handler.execute(command);
  //     expect(entityManager.persistAndFlush).toHaveBeenCalledTimes(0);
  //   });
  //
  //   it('`FeedRegistrationFailedException` 예외가 발생해야 한다.', async () => {
  //     mockTransactionalManager.persistAndFlush.mockRejectedValueOnce(new FeedRegistrationFailedException());
  //     await expect(handler.execute(command)).rejects.toThrow(FeedRegistrationFailedException);
  //   });
  // });
});
