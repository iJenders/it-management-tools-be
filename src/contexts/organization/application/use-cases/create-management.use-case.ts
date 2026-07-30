import { Management } from '../../domain/models/management';
import { ManagementRepository } from '../../domain/ports/management-repository.interface';
import { HierarchyValidatorService } from '../../domain/services/hierarchy-validator.service';
import { ManagementName } from '../../domain/value-objects/management-name.vo';
import { IdGeneratorPort } from 'src/shared/domain/ports/id-generator.port';

export class CreateManagementUseCase {
  constructor(
    private readonly managementRepository: ManagementRepository,
    private readonly hierarchyValidator: HierarchyValidatorService,
    private readonly idGenerator: IdGeneratorPort,
  ) {}

  async execute(
    nameVal: string,
    managerId: string | null = null,
    organizationId: string,
    parentManagementId: string | null = null,
  ): Promise<Management> {
    const id = this.idGenerator.generate();
    const name = new ManagementName(nameVal);

    if (parentManagementId) {
      const parent =
        await this.managementRepository.findById(parentManagementId);
      if (!parent) {
        throw new Error('The given parent management does not exist.');
      }
    }

    const parentAncestors = parentManagementId
      ? await this.hierarchyValidator.getManagementAncestors(parentManagementId)
      : [];

    const management = new Management(
      id,
      name,
      managerId,
      organizationId,
      null,
    );

    // Enforce hierarchical cycle validation
    management.changeParent(parentManagementId, parentAncestors);

    await this.managementRepository.save(management);
    return management;
  }
}
