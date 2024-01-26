import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { DatabaseModule } from './infra/database/database.module';
import { RegisterEstablishment } from './use-cases/register-establishment';
import { EstablishmentController } from './controller';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), DatabaseModule],
  providers: [RegisterEstablishment],
  controllers: [EstablishmentController],
})
export class AppModule {}
