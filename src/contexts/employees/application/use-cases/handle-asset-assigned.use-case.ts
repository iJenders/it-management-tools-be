import { EmployeeRepository } from '../../domain/ports/employee-repository.interface';

export class HandleAssetAssignedUseCase {
  constructor(private readonly employeeRepository: EmployeeRepository) {}

  async execute(employeeId: string, assetId: string): Promise<void> {
    const employee = await this.employeeRepository.findById(employeeId);
    if (!employee) {
      console.warn(
        `[Employees Context] Employee with ID ${employeeId} not found. Cannot assign asset ${assetId}`,
      );
      return;
    }

    employee.assignAsset(assetId);
    await this.employeeRepository.save(employee);
    console.log(
      `[Employees Context] Asset ${assetId} successfully linked to Employee ${employeeId} (${employee.name})`,
    );
  }
}
