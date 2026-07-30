import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';

describe('organization.context (http-api)', () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/organization-units (POST should return 201)', () => {
    return request(app.getHttpServer())
      .post('/organization-units')
      .send({
        name: 'IT Role',
        description: 'IT Role',
      })
      .expect(201);
  });

  afterEach(async () => {
    await app.close();
  });
});
