import { LoggerModule } from '@mpgxc/logger';
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TerminusModule } from '@nestjs/terminus';
import { GetEstablishment } from '@usecases/establishments/get-establishment';
import { ListEstablishments } from '@usecases/establishments/list-establishments';
import { RegisterEstablishment } from '@usecases/establishments/register-establishment';
import { UpdateEstablishment } from '@usecases/establishments/update-establishment';
import { UpdateEstablishmentPicture } from '@usecases/establishments/update-establishment-picture';
import { GetSpot } from '@usecases/spots/get-spot';
import { ListSpots } from '@usecases/spots/list-spots';
import { RegisterSpot } from '@usecases/spots/register-spot';
import { UpdateSpot } from '@usecases/spots/update-spot';
import { EstablishmentController } from './controllers/establishment.controller';
import { HealthCheckController } from './controllers/health.controller';
import { SpotController } from './controllers/spot.controller';
import { ThirdPartyController } from './controllers/third-party.controller';
import { DatabaseModule } from './database/database.module';
import { PartnerMiddleware } from './middlewares/partner.middleware';
import { ProvidersModule } from './providers/providers.module';
import { RegisterPartner } from '@usecases/partner/register-partner';
import { PartnerController } from './controllers/partner.controller';
import { CreateSchedule } from '@usecases/schedule/create-schedule';
import { ScheduleController } from './controllers/schedule.controller';

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
    // Establishment
    RegisterEstablishment,
    GetEstablishment,
    ListEstablishments,
    UpdateEstablishment,
    UpdateEstablishmentPicture,
    // Spot
    RegisterSpot,
    GetSpot,
    ListSpots,
    UpdateSpot,
    // Partner
    RegisterPartner,
    // Schedule
    CreateSchedule,
  ],
  controllers: [
    EstablishmentController,
    HealthCheckController,
    ThirdPartyController,
    SpotController,
    PartnerController,
    ScheduleController,
  ],
})
export class InfraModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(PartnerMiddleware)
      .forRoutes(EstablishmentController, SpotController);
  }
}
