import { OrderStatus } from '../entities/order.entity';
import { OrderItemResponseDto } from './order-item-response.dto';

interface OrderResponseDtoConstructor {
  id: string;
  clientName: string;
  status: OrderStatus;
  createdAt: Date;
  items?: OrderItemResponseDto[];
}

export class OrderResponseDto {
  readonly id: string;
  readonly clientName: string;
  readonly status: OrderStatus;
  readonly createdAt: Date;
  readonly items?: OrderItemResponseDto[];

  constructor(data: OrderResponseDtoConstructor) {
    this.id = data.id;
    this.clientName = data.clientName;
    this.status = data.status;
    this.createdAt = data.createdAt;
    this.items = data.items;
  }
}
