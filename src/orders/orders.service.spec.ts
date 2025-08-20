import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { ConfigService } from '@nestjs/config';
import { getConnectionToken, getModelToken } from '@nestjs/sequelize';
import { Test } from '@nestjs/testing';

import { ORDER_LIST_KEY } from './constants/cache';
import { Order, OrderStatus } from './entities/order.entity';
import { OrdersService } from './orders.service';

const createOrderMock = (status: OrderStatus) => ({
  id: 'order-1',
  status: status,
  destroy: jest.fn().mockResolvedValue(undefined),
  save: jest.fn().mockResolvedValue(undefined),
});

describe('OrdersService', () => {
  let ordersService: OrdersService;

  const cacheMock = {
    del: jest.fn().mockResolvedValue(undefined),
  };

  const orderModelMock = {};
  const sequelizeMock = {};
  const configServiceMock = {};

  beforeEach(async () => {
    jest.clearAllMocks();

    const moduleRef = await Test.createTestingModule({
      providers: [
        OrdersService,
        { provide: CACHE_MANAGER, useValue: cacheMock },
        { provide: getModelToken(Order), useValue: orderModelMock },
        { provide: getConnectionToken(), useValue: sequelizeMock },
        { provide: ConfigService, useValue: configServiceMock },
      ],
    }).compile();

    ordersService = moduleRef.get(OrdersService);
  });

  describe('advanceOrderStatus', () => {
    it('should advance the order status from initiated to sent', async () => {
      const orderMock = createOrderMock(OrderStatus.INITIATED);

      jest.spyOn(ordersService, 'getOrderById').mockResolvedValue(orderMock as unknown as Order);

      await ordersService.advanceOrderStatus(orderMock.id);

      expect(cacheMock.del).toHaveBeenCalledTimes(1);
      expect(cacheMock.del).toHaveBeenCalledWith(ORDER_LIST_KEY);

      expect(orderMock.destroy).not.toHaveBeenCalled();

      expect(orderMock.status).toBe(OrderStatus.SENT);
      expect(orderMock.save).toHaveBeenCalledTimes(1);
      expect(orderMock.save).toHaveBeenCalledWith();
    });

    it('should advance the order status from sent to delivered', async () => {
      const orderMock = createOrderMock(OrderStatus.SENT);

      jest.spyOn(ordersService, 'getOrderById').mockResolvedValue(orderMock as unknown as Order);

      await ordersService.advanceOrderStatus(orderMock.id);

      expect(cacheMock.del).toHaveBeenCalledTimes(1);
      expect(cacheMock.del).toHaveBeenCalledWith(ORDER_LIST_KEY);

      expect(orderMock.destroy).toHaveBeenCalledTimes(1);
      expect(orderMock.destroy).toHaveBeenCalledWith();

      expect(orderMock.save).not.toHaveBeenCalled();
    });

    it('should not advance the order status if there is no next status', async () => {
      const orderMock = createOrderMock(OrderStatus.DELIVERED);

      jest.spyOn(ordersService, 'getOrderById').mockResolvedValue(orderMock as unknown as Order);

      await ordersService.advanceOrderStatus(orderMock.id);

      expect(cacheMock.del).not.toHaveBeenCalled();
      expect(orderMock.destroy).not.toHaveBeenCalled();
      expect(orderMock.save).not.toHaveBeenCalled();
    });
  });
});
