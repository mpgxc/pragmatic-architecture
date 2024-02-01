import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TerminusModule } from '@nestjs/terminus';

import { LoggerModule } from '@mpgxc/logger';
import { HttpModule } from '@nestjs/axios';
import { GetEstablishment } from '@usecases/establishments/get-establishment';
import { ListEstablishments } from '@usecases/establishments/list-establishments';
import { RegisterEstablishment } from '@usecases/establishments/register-establishment';
import { EstablishmentController } from './controllers/establishment.controller';
import { HealthCheckController } from './controllers/health.controller';
import { DatabaseModule } from './database/database.module';

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
    HttpModule,
  ],
  providers: [RegisterEstablishment, GetEstablishment, ListEstablishments],
  controllers: [EstablishmentController, HealthCheckController],
})
export class InfraModule {}
