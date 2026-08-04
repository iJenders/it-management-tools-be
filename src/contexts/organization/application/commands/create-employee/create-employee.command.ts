import { EmployeeStatus } from '../../../domain/enums/employee-status.enum';


export class CreateEmployeeCommand {
  constructor(
    public readonly firstName: string,
    public readonly lastName: string,
    public readonly email?: string,
    public readonly phones?: { type: string; number: string }[],
    public readonly status: EmployeeStatus = EmployeeStatus.Active,
    public readonly itRoleId: string | null = null,
    public readonly managementId: string | null = null,
    public readonly workingFromId: string | null = null,
    public readonly skills: string[] = [],
  ) {}
}
