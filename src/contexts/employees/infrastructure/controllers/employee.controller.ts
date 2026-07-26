import { Controller, Post, Body, Get, Inject } from '@nestjs/common';
import { CreateEmployeeUseCase } from '../../application/use-cases/create-employee.use-case';
import type { EmployeeRepository } from '../../domain/ports/employee-repository.interface';

@Controller('employees')
export class EmployeeController {
  constructor(
    private readonly createEmployeeUseCase: CreateEmployeeUseCase,
    @Inject('EmployeeRepository')
    private readonly employeeRepository: EmployeeRepository,
  ) {}

  @Post()
  async create(
    @Body('id') id: string,
    @Body('name') name: string,
  ): Promise<any> {
    const employee = await this.createEmployeeUseCase.execute(id, name);
    return {
      id: employee.id,
      name: employee.name,
      assignedAssetIds: employee.assignedAssetIds,
    };
  }

  @Get()
  async findAll(): Promise<any[]> {
    const employees = await this.employeeRepository.findAll();
    return employees.map((emp) => ({
      id: emp.id,
      name: emp.name,
      assignedAssetIds: emp.assignedAssetIds,
    }));
  }
}
