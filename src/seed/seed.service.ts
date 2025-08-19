import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { OrdersService } from 'src/orders/orders.service';

import { initialOrdersData } from './data';

@Injectable()
export class SeedService implements OnApplicationBootstrap {
  constructor(private readonly ordersService: OrdersService) {}

  async onApplicationBootstrap() {
    if (process.env.NODE_ENV !== 'local') return;

    const orderCount = await this.ordersService.countOrders();
    if (orderCount > 0) return;

    for (const order of initialOrdersData) {
      await this.ordersService.createOrder(order);
    }
  }
}
