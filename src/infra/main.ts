import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter({
      logger: true,
    }),
    {
      cors: true,
    },
  );

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidUnknownValues: true,
      forbidNonWhitelisted: true,
      validateCustomDecorators: true,
    }),
  );

  const config = app.get<ConfigService>(ConfigService);

  app.setGlobalPrefix('/api');

  await app.listen(+config.getOrThrow('PORT'), '0.0.0.0');

  console.log(`Application running 🚀: ${await app.getUrl()}/api`);
}
bootstrap();
