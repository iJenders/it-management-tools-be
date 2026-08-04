import { Module } from '@nestjs/common';
import { SharedModule } from './shared/shared.module';
import { OrganizationModule } from './contexts/organization/organization.module';
import { OrderPlacementModule } from './contexts/tests/order-placement/order-placement.module';
import { NotificationModule } from './contexts/tests/notification/notification.module';

@Module({
  imports: [
    SharedModule,
    OrganizationModule,
    OrderPlacementModule,
    NotificationModule,
  ],
})
export class AppModule {}

