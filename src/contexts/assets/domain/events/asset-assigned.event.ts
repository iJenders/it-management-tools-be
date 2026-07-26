import { DomainEvent } from '../../../../shared/domain/events/domain-event.interface';

export class AssetAssignedEvent implements DomainEvent {
  static readonly EVENT_NAME = 'assets.asset-assigned';
  occurredAt: Date;

  constructor(
    public readonly assetId: string,
    public readonly employeeId: string,
    occurredAt: Date,
  ) {
    this.occurredAt = occurredAt;
  }

  getEventName(): string {
    return AssetAssignedEvent.EVENT_NAME;
  }
}
