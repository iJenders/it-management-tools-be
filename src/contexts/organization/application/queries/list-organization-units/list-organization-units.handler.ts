import { OrganizationUnit } from '../../../domain/models/organization-unit';
import { OrganizationUnitRepository } from '../../../domain/ports/organization-unit-repository.interface';
import { ListOrganizationUnitsQuery } from './list-organization-units.query';

export class ListOrganizationUnitsHandler {
  constructor(
    private readonly organizationUnitRepository: OrganizationUnitRepository,
  ) {}

  async execute(
    query?: ListOrganizationUnitsQuery,
  ): Promise<OrganizationUnit[]> {
    // temporary use query to prevent tsc error unused variable. remove this when query is implemented
    console.log('Query without filter or sorting implemented :>> ', query);
    return this.organizationUnitRepository.findAll();
  }
}
