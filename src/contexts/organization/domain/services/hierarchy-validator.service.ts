import { ManagementRepository } from '../ports/management-repository.interface';
import { OrganizationUnitRepository } from '../ports/organization-unit-repository.interface';

export class HierarchyValidatorService {
  constructor(
    private readonly managementRepository: ManagementRepository,
    private readonly orgUnitRepository: OrganizationUnitRepository,
  ) {}

  public async getManagementAncestors(
    parentManagementId: string | null,
  ): Promise<string[]> {
    const ancestors: string[] = [];
    let currentId = parentManagementId;

    while (currentId) {
      ancestors.push(currentId);
      const parent = await this.managementRepository.findById(currentId);
      currentId = parent ? parent.parentManagementId : null;
      if (ancestors.length > 100) {
        throw new Error(
          'Hierarchy tree is too deep, possible corruption or cyclic loop.',
        );
      }
    }
    return ancestors;
  }

  public async getOrganizationUnitAncestors(
    parentId: string | null,
  ): Promise<string[]> {
    const ancestors: string[] = [];
    let currentId = parentId;

    while (currentId) {
      ancestors.push(currentId);
      const parent = await this.orgUnitRepository.findById(currentId);
      currentId = parent ? parent.parentOrganizationId : null;
      if (ancestors.length > 100) {
        throw new Error(
          'Hierarchy tree is too deep, possible corruption or cyclic loop.',
        );
      }
    }
    return ancestors;
  }
}
