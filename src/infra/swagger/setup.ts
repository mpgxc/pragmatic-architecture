import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export function setupSwagger(app: INestApplication): void {
  const builder = new DocumentBuilder()
    .setTitle('VamoJogar API')
    .setDescription('Monolithic API for VamoJogar')
    .setVersion('1.0')
    .addTag('VamoJogar')
    .build();

  const document = SwaggerModule.createDocument(app, builder, {});

  SwaggerModule.setup('/api/docs', app, document);
}
