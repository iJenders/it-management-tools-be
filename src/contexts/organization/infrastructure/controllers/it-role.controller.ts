import { Controller, Post, Body, Get, Inject } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiCreatedResponse, ApiOkResponse } from '@nestjs/swagger';
import { CreateITRoleUseCase } from '../../application/use-cases/create-it-role.use-case';
import type { ITRoleRepository } from '../../domain/ports/it-role-repository.interface';
import { CreateITRoleDto } from '../dtos/create-it-role.dto';

@ApiTags('IT Roles')
@Controller('it-roles')
export class ITRoleController {
  constructor(
    private readonly createITRoleUseCase: CreateITRoleUseCase,
    @Inject('ITRoleRepository')
    private readonly itRoleRepository: ITRoleRepository,
  ) {}

  @Post()
  @ApiOperation({
    summary: 'Create a configurable IT role',
    description:
      'Registers a new IT role (e.g. DevOps Engineer, SysAdmin, HelpDesk L1). ' +
      'Roles are referenced by employees and control executive-level business invariants (CEO, CIO).',
  })
  @ApiCreatedResponse({ description: 'IT role created successfully' })
  async create(@Body() dto: CreateITRoleDto): Promise<any> {
    const role = await this.createITRoleUseCase.execute(
      dto.id,
      dto.name,
      dto.description,
    );
    return {
      id: role.id,
      name: role.name,
      description: role.description,
    };
  }

  @Get()
  @ApiOperation({ summary: 'List all available IT roles' })
  @ApiOkResponse({ description: 'List of IT roles' })
  async findAll(): Promise<any[]> {
    const roles = await this.itRoleRepository.findAll();
    return roles.map((r) => ({
      id: r.id,
      name: r.name,
      description: r.description,
    }));
  }
}
