import { AppCradle } from '#app/container.js';
import Papr from 'papr';

declare module '#app/container.js' {
  interface AppCradle {
    papr: Promise<Papr>;
  }
}

export const resolvePapr = async ({ config, database }: AppCradle) => {
  const client = await database;

  const papr = new Papr();

  papr.initialize(client.db(config.get('mongoDb')));

  await papr.updateSchemas();

  return papr;
};

export default resolvePapr;
