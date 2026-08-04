export class PlaceOrderCommand {
  constructor(
    public readonly customerName: string,
    public readonly totalAmount: number,
  ) {}
}
