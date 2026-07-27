import { Module } from '@nestjs/common';
import { SharedModule } from './shared/shared.module';
import { OrganizationModule } from './contexts/organization/organization.module';

@Module({
  imports: [
    SharedModule,
    OrganizationModule,
  ],
})
export class AppModule {}

