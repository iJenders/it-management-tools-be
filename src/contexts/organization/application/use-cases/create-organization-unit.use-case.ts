import { OrganizationUnit } from '../../domain/models/organization-unit';
import { OrganizationUnitRepository } from '../../domain/ports/organization-unit-repository.interface';
import { HierarchyValidatorService } from '../../domain/services/hierarchy-validator.service';
import { OrganizationName } from '../../domain/value-objects/organization-name.vo';
import { GeographicLocation } from '../../domain/value-objects/geographic-location.vo';
import { TimeZone } from '../../domain/value-objects/timezone.vo';
import { OrganizationType } from '../../domain/enums/organization-type.enum';
import { IdGeneratorPort } from '../../../../shared/domain/ports/id-generator.port';

export class CreateOrganizationUnitUseCase {
  constructor(
    private readonly orgUnitRepository: OrganizationUnitRepository,
    private readonly hierarchyValidator: HierarchyValidatorService,
    private readonly idGenerator: IdGeneratorPort,
  ) {}

  async execute(
    type: OrganizationType,
    nameVal: string,
    country: string,
    city: string,
    address: string,
    timeZoneVal?: string,
    parentOrganizationId: string | null = null,
  ): Promise<OrganizationUnit> {
    const id = this.idGenerator.generate();
    const name = new OrganizationName(nameVal);
    const location = new GeographicLocation(country, city, address);
    const timeZone = timeZoneVal ? new TimeZone(timeZoneVal) : null;

    if (parentOrganizationId) {
      const parent =
        await this.orgUnitRepository.findById(parentOrganizationId);
      if (!parent) {
        throw new Error('The given parent organization unit does not exist.');
      }
    }

    const parentAncestors = parentOrganizationId
      ? await this.hierarchyValidator.getOrganizationUnitAncestors(
          parentOrganizationId,
        )
      : [];

    const unit = new OrganizationUnit(id, type, name, location, timeZone, null);

    unit.changeParent(parentOrganizationId, parentAncestors);

    await this.orgUnitRepository.save(unit);
    return unit;
  }
}
