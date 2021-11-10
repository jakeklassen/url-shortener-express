import { build } from '#app/app.js';
import { initializeContainer } from '#app/container.js';
import { ShortUrl } from '#app/modules/short-url/short-url.model.js';
import { asValue } from 'awilix';
import { StatusCodes } from 'http-status-codes';
import { ObjectId } from 'mongodb';
import request from 'supertest';
import { anything, instance, mock, when } from 'ts-mockito';
import { suite } from 'uvu';

const testContainer = await initializeContainer();

const MockShortUrl: ShortUrl = mock<ShortUrl>();
when(MockShortUrl.insertOne(anything())).thenResolve({
  _id: new ObjectId(),
  shortCode: 'test',
  url: 'https://google.ca',
  updatedAt: new Date(),
  createdAt: new Date(),
});

const ShortUrlMock = instance(MockShortUrl);

const shorturlSuite = suite('/api/shorturl');

testContainer.register({
  ShortUrlModel: asValue(ShortUrlMock),
});

const { app, container } = build({
  container: testContainer,
  logger: false,
});

shorturlSuite('should return Bad Request', async () => {
  await request(app).post('/api/shorturl').expect(StatusCodes.BAD_REQUEST);
});

shorturlSuite('should return a valid response', async () => {
  await request(app)
    .post('/api/shorturl')
    .send({
      url: 'https://google.ca',
    })
    .expect(StatusCodes.OK);
});

shorturlSuite.after(async () => {
  await container.cradle.client.close();
});

shorturlSuite.run();
