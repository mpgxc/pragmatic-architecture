import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { LoggerModule } from '@mpgxc/logger';
import { RegisterEstablishment } from '@usecases/register-establishment';
import { EstablishmentController } from './controllers/establishment.controller';
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
  ],
  providers: [RegisterEstablishment],
  controllers: [EstablishmentController],
})
export class InfraModule {}
