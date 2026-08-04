import { Employee } from '../../../domain/models/employee';
import { EmployeeRepository } from '../../../domain/ports/employee-repository.interface';
import { ITRoleRepository } from '../../../domain/ports/it-role-repository.interface';
import { ManagementRepository } from '../../../domain/ports/management-repository.interface';
import { OrganizationUnitRepository } from '../../../domain/ports/organization-unit-repository.interface';
import { PersonalInformation } from '../../../domain/value-objects/personal-information.vo';
import { Email } from '../../../domain/value-objects/email.vo';
import { Phone } from '../../../domain/value-objects/phone.vo';
import { IdGeneratorPort } from '../../../../../shared/domain/ports/id-generator.port';
import { CreateEmployeeCommand } from './create-employee.command';

export class CreateEmployeeHandler {
  constructor(
    private readonly employeeRepository: EmployeeRepository,
    private readonly itRoleRepository: ITRoleRepository,
    private readonly managementRepository: ManagementRepository,
    private readonly organizationUnitRepository: OrganizationUnitRepository,
    private readonly idGenerator: IdGeneratorPort,
  ) {}

  async execute(command: CreateEmployeeCommand): Promise<Employee> {
    const id = this.idGenerator.generate();
    const email = command.email ? new Email(command.email) : undefined;
    const phones = command.phones?.map((p) => new Phone(p.type, p.number)) || [];
    const personalInfo = new PersonalInformation({
      firstName: command.firstName,
      lastName: command.lastName,
      email,
      phones,
    });

    let itRoleName: string | null = null;
    if (command.itRoleId) {
      const itRole = await this.itRoleRepository.findById(command.itRoleId);
      if (!itRole) {
        throw new Error(`ITRole with ID ${command.itRoleId} not found`);
      }
      itRoleName = itRole.name;
    }

    if (command.managementId) {
      const management = await this.managementRepository.findById(
        command.managementId,
      );
      if (!management) {
        throw new Error(`Management with ID ${command.managementId} not found`);
      }
    }

    if (command.workingFromId) {
      const workingFrom =
        await this.organizationUnitRepository.findById(command.workingFromId);
      if (!workingFrom) {
        throw new Error(
          `OrganizationUnit with ID ${command.workingFromId} not found`,
        );
      }
    }

    const employee = new Employee(
      id,
      personalInfo,
      command.status,
      command.itRoleId,
      itRoleName,
      command.managementId,
      command.workingFromId,
      command.skills,
    );

    await this.employeeRepository.save(employee);
    return employee;
  }
}
