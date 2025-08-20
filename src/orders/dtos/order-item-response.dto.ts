interface OrderItemResponseDtoConstructor {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
}

export class OrderItemResponseDto {
  readonly id: string;
  readonly description: string;
  readonly quantity: number;
  readonly unitPrice: number;

  constructor(data: OrderItemResponseDtoConstructor) {
    this.id = data.id;
    this.description = data.description;
    this.quantity = data.quantity;
    this.unitPrice = data.unitPrice;
  }
}
