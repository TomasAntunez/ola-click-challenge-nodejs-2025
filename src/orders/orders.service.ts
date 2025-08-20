import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/sequelize';
import { Includeable, Op, Sequelize } from 'sequelize';

import { CreateOrderDto } from './dtos/create-order.dto';
import { OrderResponseDto } from './dtos/order-response.dto';
import { Order, OrderStatus } from './entities/order.entity';
import { OrderItem } from './entities/order-item.entity';
import { nextOrderStatusMapper } from './mappers/next-order-status.mapper';
import { OrderMapper } from './mappers/order.mapper';

@Injectable()
export class OrdersService {
  private readonly logger = new Logger(OrdersService.name);

  constructor(
    @InjectModel(Order)
    private readonly orderModel: typeof Order,
    @InjectConnection() private readonly sequelize: Sequelize,
  ) {}

  async getOrders(): Promise<OrderResponseDto[]> {
    const orders = await this.orderModel.findAll({
      where: { status: { [Op.ne]: OrderStatus.DELIVERED } },
    });

    return orders.map(OrderMapper.toResponseDto);
  }

  countOrders(): Promise<number> {
    return this.orderModel.count();
  }

  async getOrderById(id: string, includeItems?: boolean): Promise<Order> {
    let includable: Includeable | undefined;
    if (includeItems) {
      includable = { model: OrderItem, as: 'items' };
    }

    const order = await this.orderModel.findByPk(id, { include: includable });

    if (!order) {
      this.logger.error(`Order with id ${id} not found`);
      throw new NotFoundException('Order not found');
    }

    return order;
  }

  createOrder(dto: CreateOrderDto): Promise<OrderResponseDto> {
    return this.sequelize.transaction(async (transaction) => {
      const order = await this.orderModel.create(
        {
          clientName: dto.clientName,
          items: dto.items.map((item) => ({
            description: item.description,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
          })),
        },
        {
          include: [{ model: OrderItem, as: 'items' }],
          transaction: transaction,
        },
      );

      return OrderMapper.toResponseDto(order);
    });
  }

  async advanceOrderStatus(orderId: string): Promise<void> {
    const order = await this.getOrderById(orderId);

    this.logger.log(`Advancing order: ${JSON.stringify(order, null, 2)}`);

    const nextOrderStatus = nextOrderStatusMapper[order.status];

    if (!nextOrderStatus) {
      this.logger.error(`Order with id ${orderId} has no next status - status: ${order.status}`);
      return;
    }

    if (nextOrderStatus === OrderStatus.DELIVERED) {
      await order.destroy();
      return;
    }

    order.status = nextOrderStatus;

    await order.save();
  }
}
