import { Controller, Post, Body, Get, Inject } from '@nestjs/common';
import { CreateEmployeeUseCase } from '../../application/use-cases/create-employee.use-case';
import type { EmployeeRepository } from '../../domain/ports/employee-repository.interface';
import { EmployeeStatus } from '../../domain/enums/employee-status.enum';

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
    @Body('firstName') firstName: string,
    @Body('lastName') lastName: string,
    @Body('email') email?: string,
    @Body('phones') phones?: { type: string; number: string }[],
    @Body('status') status: EmployeeStatus = EmployeeStatus.Active,
    @Body('itRoleId') itRoleId: string | null = null,
    @Body('managementId') managementId: string | null = null,
    @Body('workingFromId') workingFromId: string | null = null,
    @Body('skills') skills: string[] = [],
  ): Promise<any> {
    const employee = await this.createEmployeeUseCase.execute(
      id,
      firstName,
      lastName,
      email,
      phones,
      status,
      itRoleId,
      managementId,
      workingFromId,
      skills,
    );
    return {
      id: employee.id,
      firstName: employee.personalInfo.firstName,
      lastName: employee.personalInfo.lastName,
      email: employee.personalInfo.email?.value,
      status: employee.status,
      itRoleId: employee.itRoleId,
      managementId: employee.managementId,
      workingFromId: employee.workingFromId,
      skills: employee.skills,
    };
  }

  @Get()
  async findAll(): Promise<any[]> {
    const employees = await this.employeeRepository.findAll();
    return employees.map((employee) => ({
      id: employee.id,
      firstName: employee.personalInfo.firstName,
      lastName: employee.personalInfo.lastName,
      email: employee.personalInfo.email?.value,
      status: employee.status,
      itRoleId: employee.itRoleId,
      managementId: employee.managementId,
      workingFromId: employee.workingFromId,
      skills: employee.skills,
    }));
  }
}
