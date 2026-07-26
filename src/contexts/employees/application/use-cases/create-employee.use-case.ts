import { Employee } from '../../domain/models/employee';
import { EmployeeRepository } from '../../domain/ports/employee-repository.interface';

export class CreateEmployeeUseCase {
  constructor(private readonly employeeRepository: EmployeeRepository) {}

  async execute(id: string, name: string): Promise<Employee> {
    const employee = new Employee(id, name);
    await this.employeeRepository.save(employee);
    return employee;
  }
}
