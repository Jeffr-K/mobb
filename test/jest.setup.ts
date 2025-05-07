/**
 * jest.setup.ts
 * 이 파일은 Jest 테스트 환경에서 글로벌 환경 설정을 위해 작성.
 * `@Transactional` 데코레이터가 모킹이 되지 않아 테스트가 실패하는 문제를 해결하기 위해 작성.
 * 만약 해당 테스트 파일에서 이 글로벌 환경 설정이 필요없다면 `jest.unmock('@mikro-orm/core');` 를 사용하여 모킹을 해제 가능.
 */
jest.mock('@mikro-orm/core', () => {
  const originalModule = jest.requireActual('@mikro-orm/core');
  return {
    ...originalModule,
    Transactional: () => {
      return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        return descriptor;
      };
    },
  };
});
