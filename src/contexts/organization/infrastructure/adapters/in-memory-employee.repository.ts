import { Injectable } from '@nestjs/common';
import { Employee } from '../../domain/models/employee';
import { EmployeeRepository } from '../../domain/ports/employee-repository.interface';

@Injectable()
export class InMemoryEmployeeRepository implements EmployeeRepository {
  private readonly employees = new Map<string, Employee>();

  async findById(id: string): Promise<Employee | null> {
    const employee = this.employees.get(id);
    if (!employee) {
      return null;
    }
    return new Employee(
      employee.id,
      employee.personalInfo,
      employee.status,
      employee.itRoleId,
      employee.itRoleName,
      employee.managementId,
      employee.workingFromId,
      [...employee.skills],
    );
  }

  async save(employee: Employee): Promise<void> {
    this.employees.set(
      employee.id,
      new Employee(
        employee.id,
        employee.personalInfo,
        employee.status,
        employee.itRoleId,
        employee.itRoleName,
        employee.managementId,
        employee.workingFromId,
        [...employee.skills],
      ),
    );
  }

  async findAll(): Promise<Employee[]> {
    return Array.from(this.employees.values()).map(
      (employee) =>
        new Employee(
          employee.id,
          employee.personalInfo,
          employee.status,
          employee.itRoleId,
          employee.itRoleName,
          employee.managementId,
          employee.workingFromId,
          [...employee.skills],
        ),
    );
  }
}
