// import { OrganizationController } from '@modules/organization/interface/controller/organization.controller';
// import { OrganizationRegisterCommandHandler } from '@modules/organization/core/command/command.event.handler';
// import { OrganizationRepository } from '@modules/organization/infrastructure/organization.repository';
// import { Test } from '@nestjs/testing';
//
// describe('OrganizationController', () => {
//   let controller: OrganizationController;
//   let organizationRegisterCommandHandler: OrganizationRegisterCommandHandler;
//   let organizationRepository: OrganizationRepository;
//
//   beforeEach(async () => {
//     const moduleRef = await Test.createTestingModule({
//       controllers: [OrganizationController],
//       providers: [OrganizationRegisterCommandHandler, OrganizationRepository],
//     }).compile();
//
//     controller = moduleRef.get<OrganizationController>(OrganizationController);
//     organizationRegisterCommandHandler = moduleRef.get<OrganizationRegisterCommandHandler>(
//       OrganizationRegisterCommandHandler,
//     );
//     organizationRepository = moduleRef.get<OrganizationRepository>(OrganizationRepository);
//   });
//
//   describe('registerOrganization', () => {
//     it('어댑터의 데이터를 커맨드로 변환하여 핸들러에게 전달해야 합니다.', async () => {});
//     it('아무것도 반환되지 않아야 합니다.', async () => {});
//     it('상태 코드는 CREATED(201) 이어야 합니다.', async () => {});
//   });
// });
