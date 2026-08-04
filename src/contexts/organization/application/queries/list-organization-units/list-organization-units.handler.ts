import { OrganizationUnit } from '../../../domain/models/organization-unit';
import { OrganizationUnitRepository } from '../../../domain/ports/organization-unit-repository.interface';
import { ListOrganizationUnitsQuery } from './list-organization-units.query';

export class ListOrganizationUnitsHandler {
  constructor(
    private readonly orgUnitRepository: OrganizationUnitRepository,
  ) {}

  async execute(
    query?: ListOrganizationUnitsQuery,
  ): Promise<OrganizationUnit[]> {
    return this.orgUnitRepository.findAll();
  }
}
