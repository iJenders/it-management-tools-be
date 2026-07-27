import { Controller, Post, Body, Get, Inject } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiCreatedResponse, ApiOkResponse } from '@nestjs/swagger';
import { CreateManagementUseCase } from '../../application/use-cases/create-management.use-case';
import type { ManagementRepository } from '../../domain/ports/management-repository.interface';
import { CreateManagementDto } from '../dtos/create-management.dto';

@ApiTags('Management Units')
@Controller('managements')
export class ManagementController {
  constructor(
    private readonly createManagementUseCase: CreateManagementUseCase,
    @Inject('ManagementRepository')
    private readonly managementRepository: ManagementRepository,
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
    const management = await this.createManagementUseCase.execute(
      dto.id,
      dto.name,
      dto.managerId,
      dto.costCenter,
      dto.organizationId,
      dto.parentManagementId ?? null,
    );
    return {
      id: management.id,
      name: management.name.value,
      managerId: management.managerId,
      costCenter: management.costCenter.code,
      organizationId: management.organizationId,
      parentManagementId: management.parentManagementId,
    };
  }

  @Get()
  @ApiOperation({ summary: 'List all management units' })
  @ApiOkResponse({ description: 'List of management units' })
  async findAll(): Promise<any[]> {
    const managements = await this.managementRepository.findAll();
    return managements.map((m) => ({
      id: m.id,
      name: m.name.value,
      managerId: m.managerId,
      costCenter: m.costCenter.code,
      organizationId: m.organizationId,
      parentManagementId: m.parentManagementId,
    }));
  }
}
