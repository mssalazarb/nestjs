import { Module } from '@nestjs/common';
import { HealthCheckController } from './controllers/health-check.controller';
import { HealthCheckService } from './services/health-check.service';
import { MailController } from './controllers/mail.controller';
import { MailService } from './services/mail.service';
import { ConfigModule } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';
import { HttpMail } from './services/http/http-mail';

@Module({
  imports: [ConfigModule.forRoot(), HttpModule],
  controllers: [HealthCheckController, MailController],
  providers: [HealthCheckService, MailService, HttpMail],
})
export class AppModule {}
