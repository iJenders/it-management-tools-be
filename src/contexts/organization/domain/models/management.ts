import { AggregateRoot } from '../../../../shared/domain/models/aggregate-root';
import { ManagementName } from '../value-objects/management-name.vo';

export class Management extends AggregateRoot {
  constructor(
    public readonly id: string,
    public name: ManagementName,
    public managerId: string | null = null, // Reference to Employee ID
    public organizationId: string, // Reference to OrganizationUnit ID
    public parentManagementId: string | null = null,
  ) {
    super();
    if (!id) {
      throw new Error('Management ID cannot be empty');
    }
  }

  public updateName(name: ManagementName): void {
    this.name = name;
  }

  public updateManager(managerId: string): void {
    this.managerId = managerId;
  }

  public assignToOrganization(organizationId: string): void {
    this.organizationId = organizationId;
  }

  public changeParent(
    parentManagementId: string | null,
    parentAncestors: string[],
  ): void {
    if (parentManagementId === this.id) {
      throw new Error('A management unit cannot report to itself');
    }
    if (parentManagementId && parentAncestors.includes(this.id)) {
      throw new Error(
        'Circular dependency detected: The proposed parent reports to a descendant of this management unit',
      );
    }
    this.parentManagementId = parentManagementId;
  }
}
