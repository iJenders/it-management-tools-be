import { Controller, Post, Body, Get } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiCreatedResponse,
  ApiOkResponse,
} from '@nestjs/swagger';
import { CreateEmployeeHandler } from '../../application/commands/create-employee/create-employee.handler';
import { CreateEmployeeCommand } from '../../application/commands/create-employee/create-employee.command';
import { ListEmployeesHandler } from '../../application/queries/list-employees/list-employees.handler';
import { ListEmployeesQuery } from '../../application/queries/list-employees/list-employees.query';
import { EmployeeStatus } from '../../domain/enums/employee-status.enum';
import { CreateEmployeeDto } from '../dtos/create-employee.dto';

@ApiTags('Employees')
@Controller('employees')
export class EmployeeController {
  constructor(
    private readonly createEmployeeHandler: CreateEmployeeHandler,
    private readonly listEmployeesHandler: ListEmployeesHandler,
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
    const command = new CreateEmployeeCommand(
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
    const employee = await this.createEmployeeHandler.execute(command);

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
    const query = new ListEmployeesQuery();
    const employees = await this.listEmployeesHandler.execute(query);
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
