import { container } from '#app/container.js';
import bodyParser from 'body-parser';
import express from 'express';
import pino from 'pino-http';
import { router } from 'typera-express';

interface BuildOptions {
  logger?: boolean;
}

/**
 * App factory
 */
export const build = (opts: BuildOptions = { logger: false }) => {
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

  return app;
};
