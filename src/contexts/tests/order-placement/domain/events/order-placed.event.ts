import { DomainEvent } from '../../../../../shared/domain/events/domain-event.interface';


export class OrderPlacedEvent implements DomainEvent {
  public readonly occurredAt: Date;

  constructor(
    public readonly orderId: string,
    public readonly customerName: string,
    public readonly totalAmount: number,
  ) {
    this.occurredAt = new Date();
  }

  getEventName(): string {
    return 'order.placed';
  }
}
