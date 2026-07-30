import { AggregateRoot } from '../../../../shared/domain/models/aggregate-root';
import { PersonalInformation } from '../value-objects/personal-information.vo';
import { EmployeeStatus } from '../enums/employee-status.enum';

export class Employee extends AggregateRoot {
  constructor(
    public readonly id: string,
    public personalInfo: PersonalInformation,
    public status: EmployeeStatus,
    public itRoleId: string | null = null,
    public itRoleName: string | null = null, // Cached for invariant checks
    public managementId: string | null = null,
    public workingFromId: string | null = null, // physical office location reference
    public readonly skills: string[] = [],
  ) {
    super();
    this.validateInvariants();
  }

  public updateStatus(newStatus: EmployeeStatus): void {
    this.status = newStatus;
    this.validateInvariants();
  }

  public assignManagement(managementId: string | null): void {
    this.managementId = managementId;
    this.validateInvariants();
  }

  public assignITRole(
    itRoleId: string | null,
    itRoleName: string | null,
  ): void {
    this.itRoleId = itRoleId;
    this.itRoleName = itRoleName;
    this.validateInvariants();
  }

  public updatePersonalInfo(personalInfo: PersonalInformation): void {
    this.personalInfo = personalInfo;
    this.validateInvariants();
  }

  private validateInvariants(): void {
    // Invariant 1: An employee must have a valid corporate email
    if (!this.personalInfo.email) {
      throw new Error(
        'An employee cannot exist without a valid corporate email',
      );
    }

    // Invariant 2: Active employees must have a Management ID unless they are CEO or CIO
    if (this.status === EmployeeStatus.Active) {
      const isExecutive =
        this.itRoleName?.toUpperCase() === 'CEO' ||
        this.itRoleName?.toUpperCase() === 'CIO';
      if (!this.managementId && !isExecutive) {
        throw new Error(
          'An active employee must be assigned to a management unit (unless they are the CEO/CIO)',
        );
      }
    }
  }
}
