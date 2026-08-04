import { AggregateRoot } from '../../../../../shared/domain/models/aggregate-root';
import { OrderPlacedEvent } from '../events/order-placed.event';

export class Order extends AggregateRoot {
  constructor(
    public readonly id: string,
    public readonly customerName: string,
    public readonly totalAmount: number,
  ) {
    super();
    if (!id) {
      throw new Error('Order ID cannot be empty');
    }
    if (totalAmount <= 0) {
      throw new Error('Order total must be greater than zero');
    }

    // Record domain event on creation
    this.addDomainEvent(
      new OrderPlacedEvent(this.id, this.customerName, this.totalAmount),
    );
  }
}
