import { Injectable } from '@nestjs/common';
import { Order } from '../../domain/models/order';
import { OrderRepository } from '../../domain/ports/order-repository.interface';

@Injectable()
export class InMemoryOrderRepository implements OrderRepository {
  private readonly orders = new Map<string, Order>();

  async save(order: Order): Promise<void> {
    this.orders.set(order.id, order);
  }
}
