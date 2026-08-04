import { Controller, Post, Body, Get } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiCreatedResponse,
  ApiOkResponse,
} from '@nestjs/swagger';
import { CreateOrganizationUnitHandler } from '../../application/commands/create-organization-unit/create-organization-unit.handler';
import { CreateOrganizationUnitCommand } from '../../application/commands/create-organization-unit/create-organization-unit.command';
import { ListOrganizationUnitsHandler } from '../../application/queries/list-organization-units/list-organization-units.handler';
import { ListOrganizationUnitsQuery } from '../../application/queries/list-organization-units/list-organization-units.query';
import { CreateOrganizationUnitDto } from '../dtos/create-organization-unit.dto';

@ApiTags('Organization Units')
@Controller('organization-units')
export class OrganizationUnitController {
  constructor(
    private readonly createOrgUnitHandler: CreateOrganizationUnitHandler,
    private readonly listOrgUnitsHandler: ListOrganizationUnitsHandler,
  ) {}

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
    const command = new CreateOrganizationUnitCommand(
      dto.type,
      dto.name,
      dto.country,
      dto.city,
      dto.address,
      dto.timeZone,
      dto.parentOrganizationId ?? null,
    );
    const unit = await this.createOrgUnitHandler.execute(command);

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
    const query = new ListOrganizationUnitsQuery();
    const units = await this.listOrgUnitsHandler.execute(query);
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
