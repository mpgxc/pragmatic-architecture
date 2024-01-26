import { ConfigService } from '@nestjs/config';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { Injectable } from '@nestjs/common';

@Injectable()
export class DynamoDBService extends DynamoDBClient {
  constructor(config: ConfigService) {
    super({
      endpoint: config.getOrThrow('AWS_URL'),
      region: config.getOrThrow('AWS_REGION'),
    });
  }
}
