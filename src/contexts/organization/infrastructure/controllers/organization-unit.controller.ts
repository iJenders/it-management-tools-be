import { Controller, Post, Body, Get, Inject } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiCreatedResponse, ApiOkResponse } from '@nestjs/swagger';
import { CreateOrganizationUnitUseCase } from '../../application/use-cases/create-organization-unit.use-case';
import type { OrganizationUnitRepository } from '../../domain/ports/organization-unit-repository.interface';
import { CreateOrganizationUnitDto } from '../dtos/create-organization-unit.dto';

@ApiTags('Organization Units')
@Controller('organization-units')
export class OrganizationUnitController {
  constructor(
    private readonly createOrgUnitUseCase: CreateOrganizationUnitUseCase,
    @Inject('OrganizationUnitRepository')
    private readonly orgUnitRepository: OrganizationUnitRepository,
  ) { }

  @Post()
  @ApiOperation({
    summary: 'Create an organization unit',
    description:
      'Creates an organizational unit (LegalEntity, Subsidiary, Office, Branch). ' +
      'Office type units require a valid IANA timezone. ' +
      'Circular parent-child relationships are rejected.',
  })
  @ApiCreatedResponse({ description: 'Organization unit created successfully' })
  async create(@Body() dto: CreateOrganizationUnitDto): Promise<any> {
    const unit = await this.createOrgUnitUseCase.execute(
      dto.id,
      dto.type,
      dto.name,
      dto.country,
      dto.city,
      dto.address,
      dto.timeZone,
      dto.parentOrganizationId ?? null,
    );
    return {
      id: unit.id,
      type: unit.type,
      name: unit.name.value,
      location: {
        country: unit.location.country,
        city: unit.location.city,
        address: unit.location.address,
      },
      timeZone: unit.timeZone?.value,
      parentOrganizationId: unit.parentOrganizationId,
    };
  }

  @Get()
  @ApiOperation({ summary: 'List all organization units' })
  @ApiOkResponse({ description: 'List of organization units' })
  async findAll(): Promise<any[]> {
    const units = await this.orgUnitRepository.findAll();
    return units.map((u) => ({
      id: u.id,
      type: u.type,
      name: u.name.value,
      location: {
        country: u.location.country,
        city: u.location.city,
        address: u.location.address,
      },
      timeZone: u.timeZone?.value,
      parentOrganizationId: u.parentOrganizationId,
    }));
  }
}
