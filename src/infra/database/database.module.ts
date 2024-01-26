import { Module } from '@nestjs/common';
import { DynamoDBService } from './dynamo/dynamo.service';

@Module({
  providers: [DynamoDBService],
})
export class DatabaseModule {}
