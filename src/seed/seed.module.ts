import { Module } from '@nestjs/common';
import { OrdersModule } from 'src/orders/orders.module';

import { SeedService } from './seed.service';

@Module({
  imports: [OrdersModule],
  providers: [SeedService],
})
export class SeedModule {}
