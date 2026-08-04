import { Employee } from '../../../domain/models/employee';
import { EmployeeRepository } from '../../../domain/ports/employee-repository.interface';
import { ListEmployeesQuery } from './list-employees.query';

export class ListEmployeesHandler {
  constructor(private readonly employeeRepository: EmployeeRepository) {}

  async execute(query?: ListEmployeesQuery): Promise<Employee[]> {
    // temporary use query to prevent tsc error unused variable. remove this when query is implemented
    console.log('Query without filter or sorting implemented :>> ', query);
    return this.employeeRepository.findAll();
  }
}
