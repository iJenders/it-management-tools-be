import { Controller, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiCreatedResponse } from '@nestjs/swagger';
import { PlaceOrderHandler } from '../../application/commands/place-order/place-order.handler';
import { PlaceOrderCommand } from '../../application/commands/place-order/place-order.command';

@ApiTags('[TEST] Order Placement')
@Controller('test/orders')
export class OrderController {
  constructor(private readonly placeOrderHandler: PlaceOrderHandler) {}

  @Post()
  @ApiOperation({
    summary: '[TEST] Place a new order',
    description:
      'Creates an order and publishes an OrderPlacedEvent through the EventBus.',
  })
  @ApiCreatedResponse({ description: 'Order placed successfully' })
  async placeOrder(
    @Body() body: { customerName: string; totalAmount: number },
  ): Promise<any> {
    const command = new PlaceOrderCommand(
      body.customerName,
      body.totalAmount,
    );
    const orderId = await this.placeOrderHandler.execute(command);
    return { orderId, message: 'Order placed. Event published.' };
  }
}
