import { build } from '#app/app.js';
import { StatusCodes } from 'http-status-codes';
import request from 'supertest';
import { suite } from 'uvu';

const app = build();

const shorturlSuite = suite('/api/shorturl');

shorturlSuite('should return Bad Request', async () => {
  await request(app).post('/api/shorturl').expect(StatusCodes.BAD_REQUEST);
});

shorturlSuite('should return a valid response', async () => {
  await request(app).post('/api/shorturl').expect(StatusCodes.BAD_REQUEST);
});

shorturlSuite.run();
