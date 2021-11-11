import { AppCradle } from '#app/container.js';
import { MongoClient } from 'mongodb';

declare module '#app/container.js' {
  interface AppCradle {
    database: Promise<MongoClient>;
  }
}

export const resolveDatabaseConnection = async ({ config }: AppCradle) => {
  const client = await MongoClient.connect(config.get('mongoUrl'));

  return client;
};

export default resolveDatabaseConnection;
