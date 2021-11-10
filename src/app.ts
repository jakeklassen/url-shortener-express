import { AppCradle } from '#app/container.js';
import { AwilixContainer } from 'awilix';
import bodyParser from 'body-parser';
import express from 'express';
import pino from 'pino-http';
import { router } from 'typera-express';

interface BuildOptions {
  container: AwilixContainer<AppCradle>;
  logger?: boolean;
}

/**
 * App factory
 */
export const build = (opts: BuildOptions) => {
  const { container } = opts;

  const app = express();

  if (opts.logger === true) {
    app.use(
      pino({
        transport: {
          target: 'pino-pretty',
        },
      }),
    );
  }

  app.use(bodyParser.json());

  app.use('/api', router(container.cradle.shortUrlRouter).handler());

  return { app, container };
};
