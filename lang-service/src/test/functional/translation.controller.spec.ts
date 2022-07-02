import * as supertest from 'supertest';
import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AppModule } from '../../app.module';
import * as assert from 'assert';
import { DataSource } from 'typeorm';
import { Translations } from '../../entities/translations.entity';

describe('TranslationController', () => {
  let app: INestApplication;
  let dataSource: DataSource;
  let repository;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();
    dataSource = moduleRef.get<DataSource>(DataSource);
    repository = dataSource.getRepository(Translations);
  });

  afterEach(async () => {
    await app.close();
  });

  describe('Create Translations', () => {
    it('Should create correct translations', async () => {
      const translations = [
        {
          group: 'TEST',
          lang: 'es',
          keyWord: 'test_key',
          value: 'Hola',
        },
      ];

      const { body } = await supertest(app.getHttpServer())
        .post('/translations')
        .send(translations);

      assert.equal(body.statusCode, 201);

      await repository.delete({ id: body.data[0].id });
    });

    it('Should create translations when exists', async () => {
      const translations = [
        {
          group: 'TEST',
          lang: 'es',
          keyWord: 'test_key',
          value: 'Hola',
        },
      ];

      const response = await repository.save(translations);

      const { body } = await supertest(app.getHttpServer())
        .post('/translations')
        .send(translations);

      assert.deepEqual(body, {
        statusCode: 409,
        message: 'Error saving translations, the key word already exists',
      });

      await repository.delete({ id: response[0].id });
    });

    it('Should update translation when exists', async () => {
      const translations = [
        {
          group: 'TEST',
          lang: 'es',
          keyWord: 'test_key',
          value: 'Hola',
        },
      ];

      const response = await repository.save(translations);

      const { body } = await supertest(app.getHttpServer())
        .put('/translations')
        .send(response[0]);

      assert.equal(body.statusCode, 200);

      await repository.delete({ id: response[0].id });
    });

    it('Should update translation without id', async () => {
      const translations = [
        {
          group: 'TEST',
          lang: 'es',
          keyWord: 'test_key',
          value: 'Hola',
        },
      ];

      const response = await repository.save(translations);

      const { body } = await supertest(app.getHttpServer())
        .put('/translations')
        .send({});

      assert.equal(body.statusCode, 409);

      await repository.delete({ id: response[0].id });
    });

    it('Should update translation with invalid id', async () => {
      const translations = [
        {
          group: 'TEST',
          lang: 'es',
          keyWord: 'test_key',
          value: 'Hola',
        },
      ];

      const response = await repository.save(translations);

      const { body } = await supertest(app.getHttpServer())
        .put('/translations')
        .send({ id: 99999 });

      assert.equal(body.statusCode, 409);

      await repository.delete({ id: response[0].id });
    });

    it('Should get translations by group', async () => {
      const translations = [
        {
          group: 'TEST-GROUP',
          lang: 'es',
          keyWord: 'test_key',
          value: 'Hola',
        },
      ];

      const response = await repository.save(translations);

      const { body } = await supertest(app.getHttpServer())
        .get('/translations/group')
        .query({ group: 'TEST-GROUP' })
        .send();

      assert.equal(body.statusCode, 200);

      await repository.delete({ id: response[0].id });
    });

    it('Should get translations by key', async () => {
      const translations = [
        {
          group: 'TEST-GROUP',
          lang: 'es',
          keyWord: 'test_key',
          value: 'Hola',
        },
      ];

      const response = await repository.save(translations);

      const { body } = await supertest(app.getHttpServer())
        .get('/translations/key')
        .query({ key: 'test_key' })
        .send();

      assert.equal(body.statusCode, 200);

      await repository.delete({ id: response[0].id });
    });

    it('Should delete translation by id', async () => {
      const translations = [
        {
          group: 'TEST-GROUP',
          lang: 'es',
          keyWord: 'test_key',
          value: 'Hola',
        },
      ];

      const response = await repository.save(translations);

      const { body } = await supertest(app.getHttpServer())
        .delete('/translations')
        .query({ id: response[0].id })
        .send();

      assert.equal(body.statusCode, 200);

      await repository.delete({ id: response[0].id });
    });
  });
});
