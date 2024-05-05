import helmet from 'helmet';

import { LoggerService } from '@mpgxc/logx';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestApplication, NestFactory } from '@nestjs/core';

import { InfraModule } from './infra.module';
import { setupSwagger } from './swagger/setup';

(async () => {
  const app = await NestFactory.create<NestApplication>(InfraModule);

  const logger = await app.resolve(LoggerService);
  const config = await app.resolve(ConfigService);

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidUnknownValues: true,
      forbidNonWhitelisted: true,
      validateCustomDecorators: true,
    }),
  );

  app.enableCors();
  app.use(helmet());

  app.useLogger(logger);
  app.setGlobalPrefix('api');

  const enableSwagger = ['dev', 'hml'].includes(config.getOrThrow('NODE_ENV'));

  if (enableSwagger) {
    setupSwagger(app);
  }

  await app.listen(+config.getOrThrow('PORT'), '0.0.0.0');

  logger.debug(`Application running 🚀: ${await app.getUrl()}/api/docs`);
})();
