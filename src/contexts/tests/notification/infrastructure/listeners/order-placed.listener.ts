import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { OrderPlacedEvent } from '../../../order-placement/domain/events/order-placed.event';

/**
 * Infrastructure-level event listener that subscribes to OrderPlacedEvent
 * from the order-placement bounded context.
 *
 * This demonstrates cross-context communication via events:
 * - Context A (order-placement) publishes OrderPlacedEvent through the EventBus.
 * - Context B (notification) listens to it here and triggers a side-effect.
 *
 * NOTE: The @OnEvent decorator is NestJS infrastructure — this class lives
 * in the infrastructure layer, NOT in the application layer.
 */
@Injectable()
export class OrderPlacedListener {
  private readonly logger = new Logger(OrderPlacedListener.name);

  @OnEvent('order.placed')
  async handleOrderPlaced(event: OrderPlacedEvent): Promise<void> {
    this.logger.log(
      `[NOTIFICATION] 📧 Order received! ` +
        `OrderId: ${event.orderId}, ` +
        `Customer: ${event.customerName}, ` +
        `Amount: $${event.totalAmount}, ` +
        `At: ${event.occurredAt.toISOString()}`,
    );

    // In a real scenario, this would:
    // - Call a SendNotificationHandler (application layer command)
    // - Send an email via an EmailService adapter
    // - Push to a WebSocket, SMS gateway, etc.
  }
}
