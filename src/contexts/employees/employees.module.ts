import { Module } from '@nestjs/common';
import { InMemoryEmployeeRepository } from './infrastructure/adapters/in-memory-employee.repository';
import { CreateEmployeeUseCase } from './application/use-cases/create-employee.use-case';
import { HandleAssetAssignedUseCase } from './application/use-cases/handle-asset-assigned.use-case';
import { EmployeeController } from './infrastructure/controllers/employee.controller';
import { AssetAssignedListener } from './infrastructure/listeners/asset-assigned.listener';

@Module({
  controllers: [EmployeeController],
  providers: [
    {
      provide: 'EmployeeRepository',
      useClass: InMemoryEmployeeRepository,
    },
    {
      provide: CreateEmployeeUseCase,
      useFactory: (employeeRepo: InMemoryEmployeeRepository) => {
        return new CreateEmployeeUseCase(employeeRepo);
      },
      inject: ['EmployeeRepository'],
    },
    {
      provide: HandleAssetAssignedUseCase,
      useFactory: (employeeRepo: InMemoryEmployeeRepository) => {
        return new HandleAssetAssignedUseCase(employeeRepo);
      },
      inject: ['EmployeeRepository'],
    },
    AssetAssignedListener,
  ],
  exports: ['EmployeeRepository', CreateEmployeeUseCase, HandleAssetAssignedUseCase],
})
export class EmployeesModule {}
