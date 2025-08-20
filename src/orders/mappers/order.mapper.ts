import { OrderItemResponseDto } from '../dtos/order-item-response.dto';
import { OrderResponseDto } from '../dtos/order-response.dto';
import { Order } from '../entities/order.entity';

export class OrderMapper {
  static toResponseDto = (order: Order): OrderResponseDto => {
    return new OrderResponseDto({
      id: order.id,
      clientName: order.clientName,
      status: order.status,
      createdAt: order.createdAt as Date,
      items: order.items?.map((item) => new OrderItemResponseDto(item)),
    });
  };
}
