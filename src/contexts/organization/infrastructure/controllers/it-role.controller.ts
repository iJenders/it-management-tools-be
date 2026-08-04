import { Controller, Post, Body, Get } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiCreatedResponse,
  ApiOkResponse,
} from '@nestjs/swagger';
import { CreateITRoleHandler } from '../../application/commands/create-it-role/create-it-role.handler';
import { CreateITRoleCommand } from '../../application/commands/create-it-role/create-it-role.command';
import { ListITRolesHandler } from '../../application/queries/list-it-roles/list-it-roles.handler';
import { ListITRolesQuery } from '../../application/queries/list-it-roles/list-it-roles.query';
import { CreateITRoleDto } from '../dtos/create-it-role.dto';

@ApiTags('IT Roles')
@Controller('it-roles')
export class ITRoleController {
  constructor(
    private readonly createITRoleHandler: CreateITRoleHandler,
    private readonly listITRolesHandler: ListITRolesHandler,
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
    const command = new CreateITRoleCommand(dto.name, dto.description);
    const role = await this.createITRoleHandler.execute(command);

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
    const query = new ListITRolesQuery();
    const roles = await this.listITRolesHandler.execute(query);
    return roles.map((r) => ({
      id: r.id,
      name: r.name,
      description: r.description,
    }));
  }
}
