import { Employee } from '../../../domain/models/employee';
import { EmployeeRepository } from '../../../domain/ports/employee-repository.interface';
import { ListEmployeesQuery } from './list-employees.query';

export class ListEmployeesHandler {
  constructor(private readonly employeeRepository: EmployeeRepository) {}

  async execute(query?: ListEmployeesQuery): Promise<Employee[]> {
    return this.employeeRepository.findAll();
  }
}
