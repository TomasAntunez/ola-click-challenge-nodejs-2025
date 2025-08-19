import { Injectable } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/sequelize';
import { Op, Sequelize } from 'sequelize';

import { CreateOrderDto } from './dtos/create-order.dto';
import { Order, OrderStatus } from './entities/order.entity';
import { OrderItem } from './entities/order-item.entity';

@Injectable()
export class OrdersService {
  constructor(
    @InjectModel(Order)
    private readonly orderModel: typeof Order,
    @InjectConnection() private readonly sequelize: Sequelize,
  ) {}

  getOrders() {
    return this.orderModel.findAll({
      where: { status: { [Op.ne]: OrderStatus.DELIVERED } },
    });
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
}
