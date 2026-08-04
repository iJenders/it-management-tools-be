import { Management } from '../../../domain/models/management';
import { ManagementRepository } from '../../../domain/ports/management-repository.interface';
import { HierarchyValidatorService } from '../../../domain/services/hierarchy-validator.service';
import { ManagementName } from '../../../domain/value-objects/management-name.vo';
import { IdGeneratorPort } from '../../../../../shared/domain/ports/id-generator.port';
import { CreateManagementCommand } from './create-management.command';

export class CreateManagementHandler {
  constructor(
    private readonly managementRepository: ManagementRepository,
    private readonly idGenerator: IdGeneratorPort,
  ) {}

  async execute(command: CreateManagementCommand): Promise<Management> {
    const id = this.idGenerator.generate();
    const name = new ManagementName(command.nameVal);

    if (command.parentManagementId) {
      const parent = await this.managementRepository.findById(
        command.parentManagementId,
      );
      if (!parent) {
        throw new Error('The given parent management does not exist.');
      }
    }

    const parentAncestors = command.parentManagementId
      ? await this.managementRepository.findAncestors(command.parentManagementId)
      : [];

    HierarchyValidatorService.validateNoCycle(
      id,
      command.parentManagementId,
      parentAncestors,
    );

    const management = new Management(
      id,
      name,
      command.managerId,
      command.organizationId,
      null,
    );

    // Enforce hierarchical cycle validation
    management.changeParent(command.parentManagementId, parentAncestors);

    await this.managementRepository.save(management);
    return management;
  }
}
