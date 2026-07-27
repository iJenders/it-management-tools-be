import { Module } from '@nestjs/common';
import { SharedModule } from '../../shared/shared.module';

// Repositories
import { InMemoryEmployeeRepository } from './infrastructure/adapters/in-memory-employee.repository';
import { InMemoryManagementRepository } from './infrastructure/adapters/in-memory-management.repository';
import { InMemoryOrganizationUnitRepository } from './infrastructure/adapters/in-memory-organization-unit.repository';
import { InMemoryITRoleRepository } from './infrastructure/adapters/in-memory-it-role.repository';

// Services
import { HierarchyValidatorService } from './domain/services/hierarchy-validator.service';

// Use Cases
import { CreateEmployeeUseCase } from './application/use-cases/create-employee.use-case';
import { CreateManagementUseCase } from './application/use-cases/create-management.use-case';
import { CreateOrganizationUnitUseCase } from './application/use-cases/create-organization-unit.use-case';
import { CreateITRoleUseCase } from './application/use-cases/create-it-role.use-case';

// Controllers
import { EmployeeController } from './infrastructure/controllers/employee.controller';
import { ManagementController } from './infrastructure/controllers/management.controller';
import { OrganizationUnitController } from './infrastructure/controllers/organization-unit.controller';
import { ITRoleController } from './infrastructure/controllers/it-role.controller';

@Module({
  imports: [SharedModule],
  controllers: [
    EmployeeController,
    ManagementController,
    OrganizationUnitController,
    ITRoleController,
  ],
  providers: [
    // Database adapters / Repositories
    {
      provide: 'EmployeeRepository',
      useClass: InMemoryEmployeeRepository,
    },
    {
      provide: 'ManagementRepository',
      useClass: InMemoryManagementRepository,
    },
    {
      provide: 'OrganizationUnitRepository',
      useClass: InMemoryOrganizationUnitRepository,
    },
    {
      provide: 'ITRoleRepository',
      useClass: InMemoryITRoleRepository,
    },

    // Domain Services
    {
      provide: HierarchyValidatorService,
      useFactory: (
        managementRepo: InMemoryManagementRepository,
        orgUnitRepo: InMemoryOrganizationUnitRepository,
      ) => {
        return new HierarchyValidatorService(managementRepo, orgUnitRepo);
      },
      inject: ['ManagementRepository', 'OrganizationUnitRepository'],
    },

    // Use cases (Pure DI using factories)
    {
      provide: CreateEmployeeUseCase,
      useFactory: (
        employeeRepo: InMemoryEmployeeRepository,
        itRoleRepo: InMemoryITRoleRepository,
      ) => {
        return new CreateEmployeeUseCase(employeeRepo, itRoleRepo);
      },
      inject: ['EmployeeRepository', 'ITRoleRepository'],
    },
    {
      provide: CreateManagementUseCase,
      useFactory: (
        managementRepo: InMemoryManagementRepository,
        hierarchyVal: HierarchyValidatorService,
      ) => {
        return new CreateManagementUseCase(managementRepo, hierarchyVal);
      },
      inject: ['ManagementRepository', HierarchyValidatorService],
    },
    {
      provide: CreateOrganizationUnitUseCase,
      useFactory: (
        orgUnitRepo: InMemoryOrganizationUnitRepository,
        hierarchyVal: HierarchyValidatorService,
      ) => {
        return new CreateOrganizationUnitUseCase(orgUnitRepo, hierarchyVal);
      },
      inject: ['OrganizationUnitRepository', HierarchyValidatorService],
    },
    {
      provide: CreateITRoleUseCase,
      useFactory: (itRoleRepo: InMemoryITRoleRepository) => {
        return new CreateITRoleUseCase(itRoleRepo);
      },
      inject: ['ITRoleRepository'],
    },
  ],
  exports: [
    'EmployeeRepository',
    'ManagementRepository',
    'OrganizationUnitRepository',
    'ITRoleRepository',
    CreateEmployeeUseCase,
    CreateManagementUseCase,
    CreateOrganizationUnitUseCase,
    CreateITRoleUseCase,
  ],
})
export class OrganizationModule {}
