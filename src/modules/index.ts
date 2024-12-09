import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { StatisticsModule } from './statistics/statistics.module';
import { OrganizationModule } from './organization/organization.module';
import { PaymentModule } from './payment/payment.module';
import { CaveModule } from './cave/cave.module';
import { AdvertiseModule } from './advertise/advertise.module';
import { AdministraterModule } from './administrater/administrater.module';
import { FileModule } from './file/file.module';
import { NotificationModule } from './notification/notification.module';
import { CommunityModule } from './community/community.module';

export const domainModules = [
  UserModule,
  AuthModule,
  StatisticsModule,
  OrganizationModule,
  PaymentModule,
  CaveModule,
  AdvertiseModule,
  AdministraterModule,
  FileModule,
  NotificationModule,
  CommunityModule,
];
