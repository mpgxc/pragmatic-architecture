import { LoggerModule } from '@mpgxc/logx';
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TerminusModule } from '@nestjs/terminus';
import { GetEstablishment } from '@usecases/establishments/get-establishment';
import { ListEstablishments } from '@usecases/establishments/list-establishments';
import { RegisterEstablishment } from '@usecases/establishments/register-establishment';
import { UpdateEstablishment } from '@usecases/establishments/update-establishment';
import { UpdateEstablishmentPicture } from '@usecases/establishments/update-establishment-picture';
import { RegisterPartner } from '@usecases/partner/register-partner';
import { RegisterSchedule } from '@usecases/schedule/register-schedule';
import { GetSpot } from '@usecases/spots/get-spot';
import { GetSpotsAvailability } from '@usecases/spots/get-spots-availability';
import { ListSpots } from '@usecases/spots/list-spots';
import { RegisterSpot } from '@usecases/spots/register-spot';
import { UpdateSpot } from '@usecases/spots/update-spot';
import { EstablishmentController } from './controllers/establishment.controller';
import { HealthCheckController } from './controllers/health.controller';
import { PartnerController } from './controllers/partner.controller';
import { ScheduleController } from './controllers/schedule.controller';
import { SpotController } from './controllers/spot.controller';
import { ThirdPartyController } from './controllers/third-party.controller';
import { DatabaseModule } from './database/database.module';
import { PartnerMiddleware } from './middlewares/partner.middleware';
import { ProvidersModule } from './providers/providers.module';

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
    GetSpotsAvailability,
    // Partner
    RegisterPartner,
    // Schedule
    RegisterSchedule,
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
      .forRoutes(EstablishmentController, SpotController, ScheduleController);
  }
}
