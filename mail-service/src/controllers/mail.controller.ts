import { Body, Controller, Get, Post } from '@nestjs/common';
import { MailService } from '../services/mail.service';
import { SendGridTemplate } from '../models/send-grid-template';
import { SendGridCommon } from '../models/send-grid-common';
import { GeneralResponse } from '../models/general-response';

@Controller('mail')
export class MailController {
  constructor(private readonly mailService: MailService) {}

  @Post('/')
  sendMail(@Body() sendGrid: SendGridCommon): Promise<GeneralResponse> {
    return this.mailService.sendMail(sendGrid);
  }

  @Post('/template')
  sendMailTemplate(
    @Body() sendGrid: SendGridTemplate,
  ): Promise<GeneralResponse> {
    return this.mailService.sendMailTemplate(sendGrid);
  }

  @Get('/templates')
  getAllTemplates(): Promise<GeneralResponse> {
    return this.mailService.getAllTemplates();
  }
}
