import { LoggerService } from '@mpgxc/logger';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { InfraModule } from './infra.module';

(async () => {
  const app = await NestFactory.create<NestFastifyApplication>(
    InfraModule,
    new FastifyAdapter({
      logger: true,
    }),
    {
      cors: true,
    },
  );

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

  app.useLogger(logger);
  app.setGlobalPrefix('api');

  const document = SwaggerModule.createDocument(
    app,
    new DocumentBuilder()
      .setTitle('VamoJogar API')
      .setDescription('Monolithic API for VamoJogar')
      .setVersion('1.0')
      .addTag('VamoJogar')
      .build(),
  );

  SwaggerModule.setup('api', app, document);

  await app.listen(+config.getOrThrow('PORT'), '0.0.0.0');

  console.log(`Application running 🚀: ${await app.getUrl()}/api`);
})();
