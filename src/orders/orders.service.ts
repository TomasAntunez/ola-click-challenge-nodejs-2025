import { Injectable } from '@nestjs/common';

@Injectable()
export class OrdersService {
  getExample() {
    return 'This is an example';
  }
}
