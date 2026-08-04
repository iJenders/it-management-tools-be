import { Order } from '../../domain/models/order';

export interface OrderRepository {
  save(order: Order): Promise<void>;
}
