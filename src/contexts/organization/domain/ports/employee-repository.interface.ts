import { Employee } from '../models/employee';

export interface EmployeeRepository {
  findById(id: string): Promise<Employee | null>;
  save(employee: Employee): Promise<void>;
  findAll(): Promise<Employee[]>;
}
