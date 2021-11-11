import { MongoClient } from 'mongodb';

declare module '#app/container.js' {
  interface AppCradle {
    database: Promise<MongoClient>;
  }
}

export const registerDatabaseConnection = async () => {
  const client = await MongoClient.connect(
    'mongodb://tantor:elephant@localhost:27017',
  );

  return client;
};

export default registerDatabaseConnection;
