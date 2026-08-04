import { Module } from '@nestjs/common';
import { SharedModule } from '../../../shared/shared.module';

import { InMemoryOrderRepository } from './infrastructure/adapters/in-memory-order.repository';
import { UuidGeneratorAdapter } from '../../../shared/infrastructure/adapters/uuid-generator.adapter';
import { NestEventBus } from '../../../shared/infrastructure/event-bus/nest-event-bus';

import { PlaceOrderHandler } from './application/commands/place-order/place-order.handler';
import { OrderController } from './infrastructure/controllers/order.controller';

@Module({
  imports: [SharedModule],
  controllers: [OrderController],
  providers: [
    {
      provide: 'OrderRepository',
      useClass: InMemoryOrderRepository,
    },
    {
      provide: 'IdGeneratorPort',
      useClass: UuidGeneratorAdapter,
    },
    {
      provide: PlaceOrderHandler,
      useFactory: (
        orderRepo: InMemoryOrderRepository,
        eventBus: NestEventBus,
        idGenerator: UuidGeneratorAdapter,
      ) => {
        return new PlaceOrderHandler(orderRepo, eventBus, idGenerator);
      },
      inject: ['OrderRepository', 'EventBus', 'IdGeneratorPort'],
    },
  ],
})
export class OrderPlacementModule {}
