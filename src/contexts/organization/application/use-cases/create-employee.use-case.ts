import { Employee } from '../../domain/models/employee';
import { EmployeeRepository } from '../../domain/ports/employee-repository.interface';
import { ITRoleRepository } from '../../domain/ports/it-role-repository.interface';
import { PersonalInformation } from '../../domain/value-objects/personal-information.vo';
import { Email } from '../../domain/value-objects/email.vo';
import { Phone } from '../../domain/value-objects/phone.vo';
import { EmployeeStatus } from '../../domain/enums/employee-status.enum';

export class CreateEmployeeUseCase {
  constructor(
    private readonly employeeRepository: EmployeeRepository,
    private readonly itRoleRepository: ITRoleRepository,
  ) {}

  async execute(
    id: string,
    firstName: string,
    lastName: string,
    emailVal?: string,
    phonesVal?: { type: string; number: string }[],
    status: EmployeeStatus = EmployeeStatus.Active,
    itRoleId: string | null = null,
    managementId: string | null = null,
    workingFromId: string | null = null,
    skills: string[] = [],
  ): Promise<Employee> {
    const email = emailVal ? new Email(emailVal) : undefined;
    const phones =
      phonesVal?.map((p) => new Phone(p.type, p.number)) || [];
    const personalInfo = new PersonalInformation({
      firstName,
      lastName,
      email,
      phones,
    });

    let itRoleName: string | null = null;
    if (itRoleId) {
      const itRole = await this.itRoleRepository.findById(itRoleId);
      if (!itRole) {
        throw new Error(`ITRole with ID ${itRoleId} not found`);
      }
      itRoleName = itRole.name;
    }

    const employee = new Employee(
      id,
      personalInfo,
      status,
      itRoleId,
      itRoleName,
      managementId,
      workingFromId,
      skills,
    );

    await this.employeeRepository.save(employee);
    return employee;
  }
}
