import { Body, Controller, Get, HttpCode, Param, ParseUUIDPipe, Post } from '@nestjs/common';

import { CreateOrderDto } from './dtos/create-order.dto';
import { OrdersService } from './orders.service';

@Controller('/orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Get('/')
  getOrders() {
    return this.ordersService.getOrders();
  }

  @Post('/')
  createOrder(@Body() dto: CreateOrderDto) {
    return this.ordersService.createOrder(dto);
  }

  @HttpCode(204)
  @Post('/:id/advance')
  advanceOrderStatus(@Param('id', new ParseUUIDPipe({ version: '4' })) id: string) {
    return this.ordersService.advanceOrderStatus(id);
  }
}
