import { Module } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { NestEventBus } from './infrastructure/event-bus/nest-event-bus';

@Module({
  imports: [
    EventEmitterModule.forRoot({
      // We can configure EventEmitter2 options here if needed
      wildcard: true,
      delimiter: '.',
    }),
  ],
  providers: [
    {
      provide: 'EventBus',
      useClass: NestEventBus,
    },
  ],
  exports: ['EventBus'],
})
export class SharedModule {}
