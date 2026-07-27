import { AggregateRoot } from '../../../../shared/domain/models/aggregate-root';
import { OrganizationType } from '../enums/organization-type.enum';
import { OrganizationName } from '../value-objects/organization-name.vo';
import { GeographicLocation } from '../value-objects/geographic-location.vo';
import { TimeZone } from '../value-objects/timezone.vo';

export class OrganizationUnit extends AggregateRoot {
  constructor(
    public readonly id: string,
    public readonly type: OrganizationType,
    public name: OrganizationName,
    public location: GeographicLocation,
    public timeZone: TimeZone | null = null,
    public parentOrganizationId: string | null = null,
  ) {
    super();
    if (!id) {
      throw new Error('OrganizationUnit ID cannot be empty');
    }
    this.validateInvariants();
  }

  public changeParent(parentId: string | null, parentAncestors: string[]): void {
    if (parentId === this.id) {
      throw new Error('An organization unit cannot report to itself');
    }
    if (parentId && parentAncestors.includes(this.id)) {
      throw new Error(
        'Circular dependency detected: The proposed parent reports to a descendant of this organization unit',
      );
    }
    this.parentOrganizationId = parentId;
  }

  private validateInvariants(): void {
    if (this.type === OrganizationType.Office && !this.timeZone) {
      throw new Error('A physical office (Office) must have a valid timezone');
    }
  }
}
