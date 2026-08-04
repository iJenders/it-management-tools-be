import { Controller, Post, Body, Get } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiCreatedResponse,
  ApiOkResponse,
} from '@nestjs/swagger';
import { CreateManagementHandler } from '../../application/commands/create-management/create-management.handler';
import { CreateManagementCommand } from '../../application/commands/create-management/create-management.command';
import { ListManagementsHandler } from '../../application/queries/list-managements/list-managements.handler';
import { ListManagementsQuery } from '../../application/queries/list-managements/list-managements.query';
import { CreateManagementDto } from '../dtos/create-management.dto';

@ApiTags('Management Units')
@Controller('managements')
export class ManagementController {
  constructor(
    private readonly createManagementHandler: CreateManagementHandler,
    private readonly listManagementsHandler: ListManagementsHandler,
  ) {}

  @Post()
  @ApiOperation({
    summary: 'Create a management unit (Gerencia)',
    description:
      'Creates a management unit. Name must be at least 3 characters. ' +
      'A parent management unit can optionally be provided — circular hierarchies are rejected.',
  })
  @ApiCreatedResponse({ description: 'Management unit created successfully' })
  async create(@Body() dto: CreateManagementDto): Promise<any> {
    const command = new CreateManagementCommand(
      dto.name,
      dto.managerId ?? null,
      dto.organizationId,
      dto.parentManagementId ?? null,
    );
    const management = await this.createManagementHandler.execute(command);

    return {
      id: management.id,
      name: management.name.value,
      managerId: management.managerId,
      organizationId: management.organizationId,
      parentManagementId: management.parentManagementId,
    };
  }

  @Get()
  @ApiOperation({ summary: 'List all management units' })
  @ApiOkResponse({ description: 'List of management units' })
  async findAll(): Promise<any[]> {
    const query = new ListManagementsQuery();
    const managements = await this.listManagementsHandler.execute(query);
    return managements.map((m) => ({
      id: m.id,
      name: m.name.value,
      managerId: m.managerId,
      organizationId: m.organizationId,
      parentManagementId: m.parentManagementId,
    }));
  }
}
