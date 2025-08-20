import { Body, Controller, Get, HttpCode, Param, Post } from '@nestjs/common';
import { UuidV4Pipe } from 'src/common';

import { CreateOrderDto } from './dtos/create-order.dto';
import { OrderMapper } from './mappers/order.mapper';
import { OrdersService } from './orders.service';

@Controller('/orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Get('/')
  getOrders() {
    return this.ordersService.getOrders();
  }

  @Get('/:id')
  async getOrderById(@Param('id', UuidV4Pipe) id: string) {
    const order = await this.ordersService.getOrderById(id, true);
    return OrderMapper.toResponseDto(order);
  }

  @Post('/')
  createOrder(@Body() dto: CreateOrderDto) {
    return this.ordersService.createOrder(dto);
  }

  @HttpCode(204)
  @Post('/:id/advance')
  advanceOrderStatus(@Param('id', UuidV4Pipe) id: string) {
    return this.ordersService.advanceOrderStatus(id);
  }
}
