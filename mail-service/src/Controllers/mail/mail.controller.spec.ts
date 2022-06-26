import { Test, TestingModule } from '@nestjs/testing';
import { MailController } from './mail.controller';
import { MailService } from './mail.service';
import * as nock from 'nock';
import * as assert from 'assert';
import { ConfigModule, ConfigService } from '@nestjs/config';

describe('MailController', () => {
  let controller: MailController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule.forRoot()],
      controllers: [MailController],
      providers: [MailService, ConfigService],
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

      const nockSendMail = nock('https://api.sendgrid.com', {
        reqheaders: {
          Authorization: 'Bearer SG.testApiKey',
        },
      })
        .post('/v3/mail/send')
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

      const nockSendMail = nock('https://api.sendgrid.com', {
        reqheaders: {
          Authorization: 'Bearer SG.testApiKey',
        },
      })
        .post('/v3/mail/send')
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

      const nockSendMail = nock('https://api.sendgrid.com', {
        reqheaders: {
          Authorization: 'Bearer SG.testApiKey',
        },
      })
        .post('/v3/mail/send')
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

      const nockSendMail = nock('https://api.sendgrid.com', {
        reqheaders: {
          Authorization: 'Bearer SG.testApiKey',
        },
      })
        .post('/v3/mail/send')
        .reply(500, {});

      const response = await controller.sendMailTemplate(mailTemplate);

      expect(response).toStrictEqual({
        status: 500,
        error: 'Error sending mail',
      });
      assert.equal(nockSendMail.isDone(), true);
    });
  });

  afterAll(async () => {
    nock.restore();
  });
});
