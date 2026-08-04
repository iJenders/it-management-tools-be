import { Module } from '@nestjs/common';
import { SharedModule } from '../../shared/shared.module';

// Repositories
import { InMemoryEmployeeRepository } from './infrastructure/adapters/in-memory-employee.repository';
import { InMemoryManagementRepository } from './infrastructure/adapters/in-memory-management.repository';
import { InMemoryOrganizationUnitRepository } from './infrastructure/adapters/in-memory-organization-unit.repository';
import { InMemoryITRoleRepository } from './infrastructure/adapters/in-memory-it-role.repository';

// Id Generators adapters
import { UuidGeneratorAdapter } from '../../shared/infrastructure/adapters/uuid-generator.adapter';

// Command Handlers
import { CreateEmployeeHandler } from './application/commands/create-employee/create-employee.handler';
import { CreateManagementHandler } from './application/commands/create-management/create-management.handler';
import { CreateOrganizationUnitHandler } from './application/commands/create-organization-unit/create-organization-unit.handler';
import { CreateITRoleHandler } from './application/commands/create-it-role/create-it-role.handler';

// Query Handlers
import { ListEmployeesHandler } from './application/queries/list-employees/list-employees.handler';
import { ListManagementsHandler } from './application/queries/list-managements/list-managements.handler';
import { ListOrganizationUnitsHandler } from './application/queries/list-organization-units/list-organization-units.handler';
import { ListITRolesHandler } from './application/queries/list-it-roles/list-it-roles.handler';

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

    // Command Handlers
    {
      provide: CreateEmployeeHandler,
      useFactory: (
        employeeRepo: InMemoryEmployeeRepository,
        itRoleRepo: InMemoryITRoleRepository,
        managementRepo: InMemoryManagementRepository,
        organizationUnitRepository: InMemoryOrganizationUnitRepository,
        idGenerator: UuidGeneratorAdapter,
      ) => {
        return new CreateEmployeeHandler(
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
      provide: CreateManagementHandler,
      useFactory: (
        managementRepo: InMemoryManagementRepository,
        idGenerator: UuidGeneratorAdapter,
      ) => {
        return new CreateManagementHandler(managementRepo, idGenerator);
      },
      inject: ['ManagementRepository', 'IdGeneratorPort'],
    },
    {
      provide: CreateOrganizationUnitHandler,
      useFactory: (
        orgUnitRepo: InMemoryOrganizationUnitRepository,
        idGenerator: UuidGeneratorAdapter,
      ) => {
        return new CreateOrganizationUnitHandler(orgUnitRepo, idGenerator);
      },
      inject: ['OrganizationUnitRepository', 'IdGeneratorPort'],
    },
    {
      provide: CreateITRoleHandler,
      useFactory: (
        itRoleRepo: InMemoryITRoleRepository,
        idGenerator: UuidGeneratorAdapter,
      ) => {
        return new CreateITRoleHandler(itRoleRepo, idGenerator);
      },
      inject: ['ITRoleRepository', 'IdGeneratorPort'],
    },

    // Query Handlers
    {
      provide: ListEmployeesHandler,
      useFactory: (employeeRepo: InMemoryEmployeeRepository) => {
        return new ListEmployeesHandler(employeeRepo);
      },
      inject: ['EmployeeRepository'],
    },
    {
      provide: ListManagementsHandler,
      useFactory: (managementRepo: InMemoryManagementRepository) => {
        return new ListManagementsHandler(managementRepo);
      },
      inject: ['ManagementRepository'],
    },
    {
      provide: ListOrganizationUnitsHandler,
      useFactory: (orgUnitRepo: InMemoryOrganizationUnitRepository) => {
        return new ListOrganizationUnitsHandler(orgUnitRepo);
      },
      inject: ['OrganizationUnitRepository'],
    },
    {
      provide: ListITRolesHandler,
      useFactory: (itRoleRepo: InMemoryITRoleRepository) => {
        return new ListITRolesHandler(itRoleRepo);
      },
      inject: ['ITRoleRepository'],
    },
  ],
  exports: [
    'EmployeeRepository',
    'ManagementRepository',
    'OrganizationUnitRepository',
    'ITRoleRepository',
    CreateEmployeeHandler,
    CreateManagementHandler,
    CreateOrganizationUnitHandler,
    CreateITRoleHandler,
    ListEmployeesHandler,
    ListManagementsHandler,
    ListOrganizationUnitsHandler,
    ListITRolesHandler,
  ],
})
export class OrganizationModule {}
