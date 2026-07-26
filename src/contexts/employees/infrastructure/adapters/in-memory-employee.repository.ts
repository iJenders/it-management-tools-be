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
    // Return a clone to mimic DB retrieval
    return new Employee(employee.id, employee.name, [...employee.assignedAssetIds]);
  }

  async save(employee: Employee): Promise<void> {
    this.employees.set(
      employee.id,
      new Employee(employee.id, employee.name, [...employee.assignedAssetIds]),
    );
  }

  async findAll(): Promise<Employee[]> {
    return Array.from(this.employees.values()).map(
      (emp) => new Employee(emp.id, emp.name, [...emp.assignedAssetIds]),
    );
  }
}
