import { Test, TestingModule } from '@nestjs/testing';
import { MailController } from '../Controllers/mail.controller';
import { MailService } from '../Services/mail.service';
import * as nock from 'nock';
import * as assert from 'assert';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';
import { HttpMail } from '../Http/http-mail';

describe('MailController', () => {
  let controller: MailController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule.forRoot(), HttpModule],
      controllers: [MailController],
      providers: [MailService, ConfigService, HttpMail],
    }).compile();

    controller = module.get<MailController>(MailController);
  });

  describe('Send Mail Test', () => {
    it('Should send email with html code', async () => {
      const mailHtml = {
        from: 'test@mail.com',
        to: 'destination@mail.com',
        subject: 'Test Mail with HTML',
        html: `<h1> Test Mail</h1>`,
      };

      const nockSendMail = nock('https://api.sendgrid.com/v3', {
        reqheaders: {
          Authorization: 'Bearer SG.testApiKey',
        },
      })
        .post('/mail/send')
        .reply(200, { statusCode: 200, body: {} });

      const response = await controller.sendMail(mailHtml);

      expect(response).toStrictEqual({
        status: 200,
      });
      assert.equal(nockSendMail.isDone(), true);
    });

    it('Should send email with html code with error', async () => {
      const mailHtml = {
        from: 'test@mail.com',
        to: 'destination@mail.com',
        subject: 'Test Mail with HTML',
        html: `<h1> Test Mail</h1>`,
      };

      const nockSendMail = nock('https://api.sendgrid.com/v3', {
        reqheaders: {
          Authorization: 'Bearer SG.testApiKey',
        },
      })
        .post('/mail/send')
        .reply(404, {
          status: 500,
          error: 'Error sending mail',
        });

      const response = await controller.sendMail(mailHtml);

      expect(response).toStrictEqual({
        status: 500,
        error: 'Error sending mail',
      });
      assert.equal(nockSendMail.isDone(), true);
    });

    it('Should send email with template', async () => {
      const mailTemplate = {
        from: 'test@mail.com',
        to: 'destination@mail.com',
        subject: 'Test Mail with HTML',
        template_id: 'testIdTemplate1232d1d213123',
        template_data: {},
      };

      const nockSendMail = nock('https://api.sendgrid.com/v3', {
        reqheaders: {
          Authorization: 'Bearer SG.testApiKey',
        },
      })
        .post('/mail/send')
        .reply(200, {});

      const response = await controller.sendMailTemplate(mailTemplate);

      expect(response).toStrictEqual({
        status: 200,
      });
      assert.equal(nockSendMail.isDone(), true);
    });

    it('Should send email with template error', async () => {
      const mailTemplate = {
        from: 'test@mail.com',
        to: 'destination@mail.com',
        subject: 'Test Mail with HTML',
        template_id: 'testIdTemplate1232d1d213123',
        template_data: {},
      };

      const nockSendMail = nock('https://api.sendgrid.com/v3', {
        reqheaders: {
          Authorization: 'Bearer SG.testApiKey',
        },
      })
        .post('/mail/send')
        .reply(500, {});

      const response = await controller.sendMailTemplate(mailTemplate);

      expect(response).toStrictEqual({
        status: 500,
        error: 'Error sending mail',
      });
      assert.equal(nockSendMail.isDone(), true);
    });

    it('Should get all templates from SendGrid', async () => {
      const templates = [
        {
          template_id: 'jaksjsjak212',
          html: `<h1>Template</h1>`,
        },
      ];

      const nockGetTemplates = nock('https://api.sendgrid.com/v3', {
        reqheaders: {
          Authorization: 'Bearer SG.testApiKey',
          'Content-Type': 'application/json',
        },
      })
        .get('/templates')
        .query({
          generations: 'dynamic',
        })
        .reply(200, templates);

      const response = await controller.getAllTemplates();

      expect(response).toStrictEqual({
        status: 200,
        data: templates,
      });
      assert.equal(nockGetTemplates.isDone(), true);
    });

    it('Should get all templates from SendGrid with error', async () => {
      const nockGetTemplates = nock('https://api.sendgrid.com/v3', {
        reqheaders: {
          Authorization: 'Bearer SG.testApiKey',
          'Content-Type': 'application/json',
        },
      })
        .get('/templates')
        .query({
          generations: 'dynamic',
        })
        .reply(500);

      const response = await controller.getAllTemplates();

      expect(response).toStrictEqual({
        status: 500,
        data: [],
      });
      assert.equal(nockGetTemplates.isDone(), true);
    });
  });

  afterAll(async () => {
    nock.restore();
  });
});
