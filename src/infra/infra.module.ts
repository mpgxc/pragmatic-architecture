import { LoggerModule } from '@mpgxc/logger';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TerminusModule } from '@nestjs/terminus';
import { GetEstablishment } from '@usecases/establishments/get-establishment';
import { ListEstablishments } from '@usecases/establishments/list-establishments';
import { RegisterEstablishment } from '@usecases/establishments/register-establishment';
import { EstablishmentController } from './controllers/establishment.controller';
import { HealthCheckController } from './controllers/health.controller';
import { ThirdPartyController } from './controllers/third-party.controller';
import { DatabaseModule } from './database/database.module';
import { ProvidersModule } from './providers/providers.module';
import { UpdateEstablishment } from '@usecases/establishments/update-establishment';

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
  ],
  controllers: [
    EstablishmentController,
    HealthCheckController,
    ThirdPartyController,
  ],
})
export class InfraModule {}
