import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { LoggerModule } from '@mpgxc/logger';
import { RegisterEstablishment } from '@usecases/establishments/register-establishment';
import { EstablishmentController } from './controllers/establishment.controller';
import { DatabaseModule } from './database/database.module';
import { GetEstablishment } from '@usecases/establishments/get-establishment';
import { ListEstablishments } from '@usecases/establishments/list-establishments';

@Module({
  imports: [
    LoggerModule.forRoot({
      isGlobal: true,
    }),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    DatabaseModule,
  ],
  providers: [RegisterEstablishment, GetEstablishment, ListEstablishments],
  controllers: [EstablishmentController],
})
export class InfraModule {}
