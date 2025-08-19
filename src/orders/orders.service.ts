import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';

import { Order, OrderStatus } from './entities/order.entity';

@Injectable()
export class OrdersService {
  constructor(
    @InjectModel(Order)
    private readonly orderModel: typeof Order,
  ) {}

  getOrders() {
    return this.orderModel.findAll({
      where: { status: { [Op.ne]: OrderStatus.DELIVERED } },
    });
  }
}
