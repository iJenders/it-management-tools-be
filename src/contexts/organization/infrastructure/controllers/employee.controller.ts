import { Controller, Post, Body, Get, Inject } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiCreatedResponse,
  ApiOkResponse,
} from '@nestjs/swagger';
import { CreateEmployeeUseCase } from '../../application/use-cases/create-employee.use-case';
import type { EmployeeRepository } from '../../domain/ports/employee-repository.interface';
import { EmployeeStatus } from '../../domain/enums/employee-status.enum';
import { CreateEmployeeDto } from '../dtos/create-employee.dto';

@ApiTags('Employees')
@Controller('employees')
export class EmployeeController {
  constructor(
    private readonly createEmployeeUseCase: CreateEmployeeUseCase,
    @Inject('EmployeeRepository')
    private readonly employeeRepository: EmployeeRepository,
  ) {}

  @Post()
  @ApiOperation({
    summary: 'Create a new employee',
    description:
      'Creates an employee. Domain invariants are enforced: a valid corporate email is required, ' +
      'and active employees must have a managementId unless their IT role is CEO or CIO.',
  })
  @ApiCreatedResponse({ description: 'Employee created successfully' })
  async create(@Body() dto: CreateEmployeeDto): Promise<any> {
    const employee = await this.createEmployeeUseCase.execute(
      dto.firstName,
      dto.lastName,
      dto.email,
      dto.phones,
      dto.status ?? EmployeeStatus.Active,
      dto.itRoleId ?? null,
      dto.managementId ?? null,
      dto.workingFromId ?? null,
      dto.skills ?? [],
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
  @ApiOperation({ summary: 'List all employees' })
  @ApiOkResponse({ description: 'List of employees' })
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
