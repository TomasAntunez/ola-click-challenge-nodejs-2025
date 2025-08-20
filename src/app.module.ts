import KeyvRedis from '@keyv/redis';
import { CacheModule } from '@nestjs/cache-manager';
import { Logger, Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { SequelizeModule } from '@nestjs/sequelize';
import Keyv from 'keyv';

import { HttpLoggingInterceptor } from './common';
import { OrdersModule } from './orders';
import { SeedModule } from './seed';

@Module({
  imports: [
    SequelizeModule.forRoot({
      dialect: 'postgres',
      host: process.env.POSTGRES_HOST,
      port: Number(process.env.POSTGRES_PORT),
      username: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DB,
      autoLoadModels: true,
      synchronize: true,
    }),

    CacheModule.register({
      isGlobal: true,
      ttl: Number(process.env.REDIS_DEFAULT_TTL),
      stores: [
        new Keyv({
          store: new KeyvRedis({
            socket: { host: process.env.REDIS_HOST, port: Number(process.env.REDIS_PORT) },
          }),
        }),
      ],
    }),

    OrdersModule,
    SeedModule,
  ],
  providers: [Logger, { provide: APP_INTERCEPTOR, useClass: HttpLoggingInterceptor }],
})
export class AppModule {}
