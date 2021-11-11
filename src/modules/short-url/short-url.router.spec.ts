import { build } from '#app/app.js';
import { initializeContainer } from '#app/container.js';
import { ShortUrl } from '#app/modules/short-url/short-url.model.js';
import { asValue } from 'awilix';
import { StatusCodes } from 'http-status-codes';
import request from 'supertest';
import { suite } from 'uvu';
import * as assert from 'uvu/assert';

const testContainer = await initializeContainer();

// REGISTER mocks
// testContainer.register({
//   ShortUrlModel: asValue(
//     Promise.resolve({
//       async insertOne() {
//         return {};
//       },
//     } as unknown as ShortUrl),
//   ),
// });

const shorturlSuite = suite('/api/shorturl');

const { app, container } = build({
  container: testContainer,
  logger: false,
});

shorturlSuite.before(async () => {
  const ShortUrl = await container.cradle.ShortUrlModel;
  await ShortUrl.deleteMany({});
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

  const ShortUrl = await container.cradle.ShortUrlModel;
  const count = await ShortUrl.countDocuments({});

  assert.is(count, 1);
});

shorturlSuite.after(async () => {
  const client = await container.cradle.database;
  await client.db(container.cradle.config.get('mongoDb')).dropDatabase();

  await container.dispose();
});

shorturlSuite.run();
