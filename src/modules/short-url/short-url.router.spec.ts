import { build } from '#app/app.js';
import { initializeContainer } from '#app/container.js';
import { ShortUrl } from '#app/modules/short-url/short-url.model.js';
import { asValue } from 'awilix';
import { StatusCodes } from 'http-status-codes';
import request from 'supertest';
import { suite } from 'uvu';

const testContainer = await initializeContainer();

const shorturlSuite = suite('/api/shorturl');

testContainer.register({
  ShortUrlModel: asValue(
    Promise.resolve({
      async insertOne() {
        return {};
      },
    } as unknown as ShortUrl),
  ),
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
  await container.dispose();
});

shorturlSuite.run();
