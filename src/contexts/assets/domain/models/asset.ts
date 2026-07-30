import { AggregateRoot } from '../../../../shared/domain/models/aggregate-root';
import { AssetAssignedEvent } from '../events/asset-assigned.event';

export class Asset extends AggregateRoot {
  constructor(
    public readonly id: string,
    public name: string,
    public sku: string,
    public assignedToId: string | null = null,
  ) {
    super();
  }

  assignTo(employeeId: string): void {
    if (this.assignedToId === employeeId) {
      return;
    }
    this.assignedToId = employeeId;
    this.addDomainEvent(
      new AssetAssignedEvent(this.id, employeeId, new Date()),
    );
  }
}
