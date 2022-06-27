import { Body, Controller, Get, Post } from '@nestjs/common';
import { MailService } from '../Services/mail.service';
import { SendGridTemplate } from '../Models/SendGridTemplate';
import { SendGridCommon } from '../Models/SendGridCommon';
import { GeneralResponse } from '../Models/GeneralResponse';

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
