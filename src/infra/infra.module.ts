import { LoggerModule } from '@mpgxc/logger';
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TerminusModule } from '@nestjs/terminus';
import { GetEstablishment } from '@usecases/establishments/get-establishment';
import { ListEstablishments } from '@usecases/establishments/list-establishments';
import { RegisterEstablishment } from '@usecases/establishments/register-establishment';
import { UpdateEstablishment } from '@usecases/establishments/update-establishment';
import { EstablishmentController } from './controllers/establishment.controller';
import { HealthCheckController } from './controllers/health.controller';
import { ThirdPartyController } from './controllers/third-party.controller';
import { DatabaseModule } from './database/database.module';
import { PartnerMiddleware } from './middlewares/partner.middleware';
import { ProvidersModule } from './providers/providers.module';
import { UpdateEstablishmentPicture } from '@usecases/establishments/update-establishment-picture';

@Module({
  imports: [
    LoggerModule.forRoot({
      isGlobal: true,
    }),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    DatabaseModule,
    TerminusModule,
    ProvidersModule,
  ],
  providers: [
    RegisterEstablishment,
    GetEstablishment,
    ListEstablishments,
    UpdateEstablishment,
    UpdateEstablishmentPicture,
  ],
  controllers: [
    EstablishmentController,
    HealthCheckController,
    ThirdPartyController,
  ],
})
export class InfraModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(PartnerMiddleware).forRoutes(EstablishmentController);
  }
}
