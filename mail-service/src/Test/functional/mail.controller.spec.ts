import * as nock from 'nock';
import * as assert from 'assert';
import * as supertest from 'supertest';
import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AppModule } from '../../app.module';

describe('MailController', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
    nock.restore();
  });

  describe('Send Mail test', () => {
    it('Should send email with html code', async () => {
      const mailHtml = {
        from: 'test@mail.com',
        to: 'destination@mail.com',
        subject: 'test Mail with HTML',
        html: `<h1> Test Mail</h1>`,
      };

      const nockSendMail = nock('https://api.sendgrid.com/v3', {
        reqheaders: {
          Authorization: 'Bearer SG.testApiKey',
        },
      })
        .post('/mail/send')
        .reply(200, { statusCode: 200, body: {} });

      const { body } = await supertest(app.getHttpServer())
        .post('/mail')
        .send(mailHtml);

      expect(body).toStrictEqual({
        statusCode: 200,
      });
      assert.equal(nockSendMail.isDone(), true);
    });

    it('Should send email with html code with error', async () => {
      const mailHtml = {
        from: 'test@mail.com',
        to: 'destination@mail.com',
        subject: 'test Mail with HTML',
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

      const { body } = await supertest(app.getHttpServer())
        .post('/mail')
        .send(mailHtml);

      expect(body).toStrictEqual({
        statusCode: 500,
        message: 'An error occurred while sending mail',
      });
      assert.equal(nockSendMail.isDone(), true);
    });

    it('Should send email with template', async () => {
      const mailTemplate = {
        from: 'test@mail.com',
        to: 'destination@mail.com',
        subject: 'test Mail with HTML',
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

      const { body } = await supertest(app.getHttpServer())
        .post('/mail/template')
        .send(mailTemplate);

      expect(body).toStrictEqual({
        statusCode: 200,
      });
      assert.equal(nockSendMail.isDone(), true);
    });

    it('Should send email with template error', async () => {
      const mailTemplate = {
        from: 'test@mail.com',
        to: 'destination@mail.com',
        subject: 'test Mail with HTML',
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

      const { body } = await supertest(app.getHttpServer())
        .post('/mail/template')
        .send(mailTemplate);

      expect(body).toStrictEqual({
        statusCode: 500,
        message: 'An error occurred while sending mail',
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

      const { body } = await supertest(app.getHttpServer())
        .get('/mail/templates')
        .send();

      expect(body).toStrictEqual({
        statusCode: 200,
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

      const { body } = await supertest(app.getHttpServer())
        .get('/mail/templates')
        .send();

      expect(body).toStrictEqual({
        statusCode: 500,
        message: 'An error occurred while search templates',
      });
      assert.equal(nockGetTemplates.isDone(), true);
    });
  });
});
