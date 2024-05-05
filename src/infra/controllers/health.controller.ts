import { LoggerInject, LoggerService } from '@mpgxc/logx';
import { Controller, Get } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ApiTags } from '@nestjs/swagger';
import {
  HealthCheck,
  HealthCheckService,
  HttpHealthIndicator,
} from '@nestjs/terminus';

@ApiTags('Health')
@Controller('health')
export class HealthCheckController {
  constructor(
    @LoggerInject(HealthCheckController.name)
    private readonly logger: LoggerService,
    private readonly config: ConfigService,
    private readonly health: HealthCheckService,
    private readonly http: HttpHealthIndicator,
  ) {}

  @Get('/check')
  @HealthCheck()
  async handle() {
    this.logger.log('Health check > triggered');

    return this.health.check([
      () => this.http.pingCheck('github', 'https://github.com'),
      () => ({
        root: {
          status: 'up',
          message: `API is up and running on <${this.config.get<string>('NODE_ENV').toUpperCase()}> stage`,
        },
      }),
    ]);
  }
}
