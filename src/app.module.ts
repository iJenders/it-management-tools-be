import { Module } from '@nestjs/common';
import { SharedModule } from './shared/shared.module';
import { AssetsModule } from './contexts/assets/assets.module';
import { EmployeesModule } from './contexts/employees/employees.module';

@Module({
  imports: [
    SharedModule,
    AssetsModule,
    EmployeesModule,
  ],
})
export class AppModule {}

