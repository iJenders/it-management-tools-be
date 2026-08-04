import { OrganizationUnit } from '../../../domain/models/organization-unit';
import { OrganizationUnitRepository } from '../../../domain/ports/organization-unit-repository.interface';
import { HierarchyValidatorService } from '../../../domain/services/hierarchy-validator.service';
import { OrganizationName } from '../../../domain/value-objects/organization-name.vo';
import { GeographicLocation } from '../../../domain/value-objects/geographic-location.vo';
import { TimeZone } from '../../../domain/value-objects/timezone.vo';
import { IdGeneratorPort } from '../../../../../shared/domain/ports/id-generator.port';
import { CreateOrganizationUnitCommand } from './create-organization-unit.command';

export class CreateOrganizationUnitHandler {
  constructor(
    private readonly orgUnitRepository: OrganizationUnitRepository,
    private readonly idGenerator: IdGeneratorPort,
  ) {}

  async execute(
    command: CreateOrganizationUnitCommand,
  ): Promise<OrganizationUnit> {
    const id = this.idGenerator.generate();
    const name = new OrganizationName(command.nameVal);
    const location = new GeographicLocation(
      command.country,
      command.city,
      command.address,
    );
    const timeZone = command.timeZoneVal
      ? new TimeZone(command.timeZoneVal)
      : null;

    if (command.parentOrganizationId) {
      const parent = await this.orgUnitRepository.findById(
        command.parentOrganizationId,
      );
      if (!parent) {
        throw new Error('The given parent organization unit does not exist.');
      }
    }

    const parentAncestors = command.parentOrganizationId
      ? await this.orgUnitRepository.findAncestors(command.parentOrganizationId)
      : [];

    HierarchyValidatorService.validateNoCycle(
      id,
      command.parentOrganizationId,
      parentAncestors,
    );

    const unit = new OrganizationUnit(
      id,
      command.type,
      name,
      location,
      timeZone,
      null,
    );

    unit.changeParent(command.parentOrganizationId, parentAncestors);

    await this.orgUnitRepository.save(unit);
    return unit;
  }
}
