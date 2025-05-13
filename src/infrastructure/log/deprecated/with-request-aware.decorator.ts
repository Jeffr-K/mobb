// import { WithRequestContext } from '@infrastructure/log/context/decorators/with-request-context.decorator';
//
// /**
//  * 클래스의 모든 메서드에 요청 컨텍스트 기능을 추가하는 데코레이터
//  */
// export function RequestContextAware() {
//   return function <T extends { new (...args: any[]): {} }>(constructor: T) {
//     // 클래스의 모든 메서드 가져오기
//     const propertyNames = Object.getOwnPropertyNames(constructor.prototype);
//
//     // 생성자 제외한 메서드에 WithRequestContext 데코레이터 적용
//     for (const propertyName of propertyNames) {
//       if (propertyName !== 'constructor') {
//         const descriptor = Object.getOwnPropertyDescriptor(
//           constructor.prototype,
//           propertyName,
//         );
//
//         if (descriptor && typeof descriptor.value === 'function') {
//           // 메서드에 WithRequestContext 데코레이터 적용
//           const withContext = WithRequestContext();
//           const newDescriptor = withContext(
//             constructor.prototype,
//             propertyName,
//             descriptor
//           );
//
//           Object.defineProperty(constructor.prototype, propertyName, newDescriptor);
//         }
//       }
//     }
//
//     return constructor;
//   };
// }
