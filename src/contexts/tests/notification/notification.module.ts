import { Module } from '@nestjs/common';
import { SharedModule } from '../../../shared/shared.module';
import { OrderPlacedListener } from './infrastructure/listeners/order-placed.listener';

@Module({
  imports: [SharedModule],
  providers: [OrderPlacedListener],
})
export class NotificationModule {}
