import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { SendGridTemplate } from '../models/send-grid-template';
import { SendGridCommon } from '../models/send-grid-common';
import { GeneralResponse } from '../models/general-response';
import { ConfigService } from '@nestjs/config';
import * as SendGrid from '@sendgrid/mail';
import { HttpMail } from './http/http-mail';

@Injectable()
export class MailService {
  constructor(
    private readonly configService: ConfigService,
    private readonly httpMail: HttpMail,
  ) {}

  async sendMail(sendGrid: SendGridCommon): Promise<GeneralResponse> {
    let response;
    SendGrid.setApiKey(this.configService.get<string>('SEND_GRID_API_KEY'));

    try {
      response = await SendGrid.send(
        {
          from: sendGrid.from,
          to: sendGrid.to,
          html: sendGrid.html,
          subject: sendGrid.subject,
          attachments: [],
        },
        false,
      );
    } catch (e) {
      throw new HttpException(
        'An error occurred while sending mail',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    return {
      status: response[0].statusCode,
    };
  }

  async sendMailTemplate(sendGrid: SendGridTemplate): Promise<GeneralResponse> {
    let response;
    SendGrid.setApiKey(this.configService.get<string>('SEND_GRID_API_KEY'));

    try {
      response = await SendGrid.send(
        {
          from: sendGrid.from,
          to: sendGrid.to,
          templateId: sendGrid.template_id,
          dynamicTemplateData: sendGrid.template_data,
          subject: sendGrid.subject,
          attachments: [],
        },
        false,
      );
    } catch (e) {
      throw new HttpException(
        'An error occurred while sending mail',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    return {
      status: response[0].statusCode,
    };
  }

  async getAllTemplates(): Promise<GeneralResponse> {
    try {
      const response = await this.httpMail.getAllTemplates();

      return {
        status: HttpStatus.OK,
        data: response.data,
      };
    } catch (e) {
      throw new HttpException(
        'An error occurred while search templates',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
