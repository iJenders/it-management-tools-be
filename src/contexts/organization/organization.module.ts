import { Module } from '@nestjs/common';
import { SharedModule } from '../../shared/shared.module';

// Repositories
import { InMemoryEmployeeRepository } from './infrastructure/adapters/in-memory-employee.repository';
import { InMemoryManagementRepository } from './infrastructure/adapters/in-memory-management.repository';
import { InMemoryOrganizationUnitRepository } from './infrastructure/adapters/in-memory-organization-unit.repository';
import { InMemoryITRoleRepository } from './infrastructure/adapters/in-memory-it-role.repository';

// Id Generators adapters
import { UuidGeneratorAdapter } from '../../shared/infrastructure/adapters/uuid-generator.adapter';

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

    // ID Generator adapter
    {
      provide: 'IdGeneratorPort',
      useClass: UuidGeneratorAdapter,
    },

    // Use cases (Pure DI using factories)
    {
      provide: CreateEmployeeUseCase,
      useFactory: (
        employeeRepo: InMemoryEmployeeRepository,
        itRoleRepo: InMemoryITRoleRepository,
        managementRepo: InMemoryManagementRepository,
        organizationUnitRepository: InMemoryOrganizationUnitRepository,
        idGenerator: UuidGeneratorAdapter,
      ) => {
        return new CreateEmployeeUseCase(
          employeeRepo,
          itRoleRepo,
          managementRepo,
          organizationUnitRepository,
          idGenerator,
        );
      },
      inject: [
        'EmployeeRepository',
        'ITRoleRepository',
        'ManagementRepository',
        'OrganizationUnitRepository',
        'IdGeneratorPort',
      ],
    },
    {
      provide: CreateManagementUseCase,
      useFactory: (
        managementRepo: InMemoryManagementRepository,
        idGenerator: UuidGeneratorAdapter,
      ) => {
        return new CreateManagementUseCase(managementRepo, idGenerator);
      },
      inject: ['ManagementRepository', 'IdGeneratorPort'],
    },
    {
      provide: CreateOrganizationUnitUseCase,
      useFactory: (
        orgUnitRepo: InMemoryOrganizationUnitRepository,
        idGenerator: UuidGeneratorAdapter,
      ) => {
        return new CreateOrganizationUnitUseCase(orgUnitRepo, idGenerator);
      },
      inject: ['OrganizationUnitRepository', 'IdGeneratorPort'],
    },

    {
      provide: CreateITRoleUseCase,
      useFactory: (
        itRoleRepo: InMemoryITRoleRepository,
        idGenerator: UuidGeneratorAdapter,
      ) => {
        return new CreateITRoleUseCase(itRoleRepo, idGenerator);
      },
      inject: ['ITRoleRepository', 'IdGeneratorPort'],
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
