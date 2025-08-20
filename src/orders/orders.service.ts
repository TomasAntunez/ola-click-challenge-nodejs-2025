import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/sequelize';
import { Op, Sequelize } from 'sequelize';

import { CreateOrderDto } from './dtos/create-order.dto';
import { Order, OrderStatus } from './entities/order.entity';
import { OrderItem } from './entities/order-item.entity';
import { nextOrderStatusMapper } from './mappers/next-order-status.mapper';

@Injectable()
export class OrdersService {
  private readonly logger = new Logger(OrdersService.name);

  constructor(
    @InjectModel(Order)
    private readonly orderModel: typeof Order,
    @InjectConnection() private readonly sequelize: Sequelize,
  ) {}

  getOrders() {
    return this.orderModel.findAll({
      // TODO: map this entity
      where: { status: { [Op.ne]: OrderStatus.DELIVERED } },
    });
  }

  countOrders() {
    return this.orderModel.count();
  }

  async getOrderById(id: string) {
    const order = await this.orderModel.findByPk(id);

    if (!order) {
      this.logger.error(`Order with id ${id} not found`);
      throw new NotFoundException('Order not found');
    }

    return order;
  }

  async createOrder(dto: CreateOrderDto) {
    await this.sequelize.transaction(async (transaction) => {
      await this.orderModel.create(
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
    });
  }

  async advanceOrderStatus(orderId: string) {
    const order = await this.getOrderById(orderId);

    const nextOrderStatus = nextOrderStatusMapper[order.status];

    if (!nextOrderStatus) {
      this.logger.error(`Order with id ${orderId} has no next status - status: ${order.status}`);
      return;
    }

    order.status = nextOrderStatus;

    await order.save();
  }
}
