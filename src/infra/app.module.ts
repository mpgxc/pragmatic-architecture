import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { EstablishmentController } from '../controller';
import { RegisterEstablishment } from '../use-cases/register-establishment';
import { DatabaseModule } from './database/database.module';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), DatabaseModule],
  providers: [RegisterEstablishment],
  controllers: [EstablishmentController],
})
export class AppModule {}
