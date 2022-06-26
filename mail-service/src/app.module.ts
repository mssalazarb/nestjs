import { Module } from '@nestjs/common';
import { HealthCheckController } from './Controllers/health-check/health-check.controller';
import { HealthCheckService } from './Controllers/health-check/health-check.service';
import { MailController } from './Controllers/mail/mail.controller';
import { MailService } from './Controllers/mail/mail.service';
import { APP_FILTER } from '@nestjs/core';
import { HttpExceptionFilter } from './Exceptions/http-exception.filter';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule.forRoot()],
  controllers: [HealthCheckController, MailController],
  providers: [
    HealthCheckService,
    MailService,
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
  ],
})
export class AppModule {}
