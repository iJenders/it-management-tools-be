import { Order } from '../../../domain/models/order';
import { OrderRepository } from '../../../domain/ports/order-repository.interface';
import { EventBus } from '../../../../../../shared/domain/events/event-bus.interface';
import { IdGeneratorPort } from '../../../../../../shared/domain/ports/id-generator.port';
import { PlaceOrderCommand } from './place-order.command';

export class PlaceOrderHandler {
  constructor(
    private readonly orderRepository: OrderRepository,
    private readonly eventBus: EventBus,
    private readonly idGenerator: IdGeneratorPort,
  ) {}

  async execute(command: PlaceOrderCommand): Promise<string> {
    const id = this.idGenerator.generate();

    // 1. Create aggregate (business rules are enforced in constructor)
    const order = new Order(id, command.customerName, command.totalAmount);

    // 2. Persist the aggregate
    await this.orderRepository.save(order);

    // 3. Extract recorded domain events and publish them through the EventBus
    await this.eventBus.publishAll(order.domainEvents);

    // 4. Clear events from the aggregate after publishing
    order.clearDomainEvents();

    return order.id;
  }
}
