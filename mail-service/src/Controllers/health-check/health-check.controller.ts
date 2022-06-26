import { Controller, Get } from '@nestjs/common';
import { HealthCheckService } from './health-check.service';

@Controller()
export class HealthCheckController {
  constructor(private readonly appService: HealthCheckService) {}

  @Get('/health-check')
  healthCheck(): string {
    return this.appService.healthCheck();
  }
}
