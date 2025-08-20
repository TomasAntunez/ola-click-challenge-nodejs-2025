import { Body, Controller, Get, HttpCode, Param, Post } from '@nestjs/common';
import { UuidV4Pipe } from 'src/common';

import { CreateOrderDto } from './dtos/create-order.dto';
import { OrdersService } from './orders.service';

@Controller('/orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Get('/')
  getOrders() {
    return this.ordersService.getOrders();
  }

  @Get('/:id')
  getOrderById(@Param('id', UuidV4Pipe) id: string) {
    return this.ordersService.getOrderById(id);
  }

  @Post('/')
  createOrder(@Body() dto: CreateOrderDto) {
    this.ordersService.createOrder(dto);
  }

  @HttpCode(204)
  @Post('/:id/advance')
  advanceOrderStatus(@Param('id', UuidV4Pipe) id: string) {
    return this.ordersService.advanceOrderStatus(id);
  }
}
