import { Controller, Post, Body, Get, Inject } from '@nestjs/common';
import { CreateOrganizationUnitUseCase } from '../../application/use-cases/create-organization-unit.use-case';
import type { OrganizationUnitRepository } from '../../domain/ports/organization-unit-repository.interface';
import { OrganizationType } from '../../domain/enums/organization-type.enum';

@Controller('organization-units')
export class OrganizationUnitController {
  constructor(
    private readonly createOrgUnitUseCase: CreateOrganizationUnitUseCase,
    @Inject('OrganizationUnitRepository')
    private readonly orgUnitRepository: OrganizationUnitRepository,
  ) {}

  @Post()
  async create(
    @Body('id') id: string,
    @Body('type') type: OrganizationType,
    @Body('name') name: string,
    @Body('country') country: string,
    @Body('city') city: string,
    @Body('address') address: string,
    @Body('timeZone') timeZone?: string,
    @Body('parentOrganizationId') parentOrganizationId: string | null = null,
  ): Promise<any> {
    const unit = await this.createOrgUnitUseCase.execute(
      id,
      type,
      name,
      country,
      city,
      address,
      timeZone,
      parentOrganizationId,
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
