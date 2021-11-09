import { build } from '#app/app.js';
import { container } from '#app/container.js';
import { MongoClient } from 'mongodb';

const papr = container.cradle.papr;

const connection = await MongoClient.connect(
  'mongodb://tantor:elephant@localhost:27017',
);
papr.initialize(connection.db('tantor'));

await papr.updateSchemas();

const app = build({
  logger: true,
});

const port = process.env.PORT || 3000;

const server = app.listen(port, () => {
  console.log(`Server listening on http://localhost:${port} 🚀`);
});

const cleanup = async () => {
  if (server.listening) {
    await new Promise<void>((resolve, reject) =>
      server.close((err) => {
        if (err) {
          reject(err);
        } else {
          console.log('Process terminated');
          resolve();
        }
      }),
    );
  }

  await connection.close();

  process.exit(0);
};

// https://www.baeldung.com/linux/sigint-and-other-termination-signals#how-sigint-relates-to-sigterm-sigquit-and-sigkill
process.on('SIGINT', async () => {
  await cleanup();
});

process.on('SIGTERM', async () => {
  await cleanup();
});
