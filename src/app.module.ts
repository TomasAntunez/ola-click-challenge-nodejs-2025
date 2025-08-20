import KeyvRedis from '@keyv/redis';
import { CacheModule } from '@nestjs/cache-manager';
import { Logger, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { SequelizeModule } from '@nestjs/sequelize';
import Keyv from 'keyv';

import { EnvironmentVariables, HttpLoggingInterceptor, validateConfig } from './common';
import { OrdersModule } from './orders';
import { SeedModule } from './seed';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validate: validateConfig,
    }),

    SequelizeModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService<EnvironmentVariables, true>) => ({
        dialect: 'postgres',
        host: configService.get<string>('POSTGRES_HOST'),
        port: configService.get<number>('POSTGRES_PORT'),
        username: configService.get<string>('POSTGRES_USER'),
        password: configService.get<string>('POSTGRES_PASSWORD'),
        database: configService.get<string>('POSTGRES_DB'),
        autoLoadModels: true,
        synchronize: true,
      }),
    }),

    CacheModule.registerAsync({
      isGlobal: true,
      inject: [ConfigService],
      useFactory: (configService: ConfigService<EnvironmentVariables, true>) => ({
        ttl: configService.get<number>('REDIS_DEFAULT_TTL'),
        stores: [
          new Keyv({
            store: new KeyvRedis({
              socket: {
                host: configService.get<string>('REDIS_HOST'),
                port: configService.get<number>('REDIS_PORT'),
              },
            }),
          }),
        ],
      }),
    }),

    OrdersModule,
    SeedModule,
  ],
  providers: [Logger, { provide: APP_INTERCEPTOR, useClass: HttpLoggingInterceptor }],
})
export class AppModule {}
