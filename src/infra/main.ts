import { LoggerService } from '@mpgxc/logger';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestApplication, NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';
import { InfraModule } from './infra.module';

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
    const document = SwaggerModule.createDocument(
      app,
      new DocumentBuilder()
        .setTitle('VamoJogar API')
        .setDescription('Monolithic API for VamoJogar')
        .setVersion('1.0')
        .addTag('VamoJogar')
        .build(),
    );

    /**
     * Apenas um experimento
     */
    SwaggerModule.setup('/api/docs', app, document);
  }

  await app.listen(+config.getOrThrow('PORT'), '0.0.0.0');

  logger.debug(`Application running 🚀: ${await app.getUrl()}/api/docs`);
})();
