import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }));

  const logger = app.get(Logger);

  const port = process.env.PORT ?? 3000;
  if (process.env.NODE_ENV === 'local') {
    logger.log(`App running on port ${port}`, bootstrap.name);
  }

  await app.listen(port);
}

bootstrap();
