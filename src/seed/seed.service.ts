import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { OrdersService } from 'src/orders';

import { initialOrdersData } from './data';

@Injectable()
export class SeedService implements OnApplicationBootstrap {
  private readonly THIRD_PART = Math.floor(initialOrdersData.length / 3);

  constructor(private readonly ordersService: OrdersService) {}

  async onApplicationBootstrap() {
    if (process.env.NODE_ENV !== 'local') return;

    const orderCount = await this.ordersService.countOrders();
    if (orderCount > 0) return;

    for (let i = 0; i < initialOrdersData.length; i++) {
      const orderData = initialOrdersData[i];
      const createdOrder = await this.ordersService.createOrder(orderData);

      if (i < this.THIRD_PART) {
        await this.ordersService.advanceOrderStatus(createdOrder.id);
      }
    }
  }
}
