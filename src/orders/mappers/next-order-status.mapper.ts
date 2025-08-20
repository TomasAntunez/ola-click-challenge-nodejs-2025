import { OrderStatus } from '../entities/order.entity';

export const nextOrderStatusMapper: Partial<Record<OrderStatus, OrderStatus>> = {
  [OrderStatus.INITIATED]: OrderStatus.SENT,
  [OrderStatus.SENT]: OrderStatus.DELIVERED,
};
