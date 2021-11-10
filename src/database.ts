import { asValue, AwilixContainer } from 'awilix';
import { MongoClient } from 'mongodb';

declare module '#app/container.js' {
  interface AppCradle {
    client: MongoClient;
  }
}

export const registerDatabaseConnection = async (
  container: AwilixContainer,
) => {
  const client = await MongoClient.connect(
    'mongodb://tantor:elephant@localhost:27017',
  );

  container.register({
    client: asValue(client),
  });
};
