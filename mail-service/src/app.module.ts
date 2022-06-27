import { Module } from '@nestjs/common';
import { HealthCheckController } from './Controllers/health-check.controller';
import { HealthCheckService } from './Services/health-check.service';
import { MailController } from './Controllers/mail.controller';
import { MailService } from './Services/mail.service';
import { ConfigModule } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';
import { HttpMail } from './Http/http-mail';

@Module({
  imports: [ConfigModule.forRoot(), HttpModule],
  controllers: [HealthCheckController, MailController],
  providers: [HealthCheckService, MailService, HttpMail],
})
export class AppModule {}
