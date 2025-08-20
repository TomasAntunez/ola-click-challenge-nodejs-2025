import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';

import { AppModule } from './app.module';
import { Environment, EnvironmentVariables } from './common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }));

  const logger = app.get(Logger);
  const configService = app.get(ConfigService<EnvironmentVariables, true>);

  const nodeEnv = configService.get<Environment>('NODE_ENV');
  const port = configService.get<number>('PORT');

  if (nodeEnv === Environment.LOCAL) {
    logger.log(`App running on port ${port}`, bootstrap.name);
  }

  await app.listen(port);
}

bootstrap();
