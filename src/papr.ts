import { AppContainer } from '#app/container.js';
import awilix from 'awilix';
import Papr from 'papr';

declare module '#app/container.js' {
  interface AppCradle {
    papr: Papr;
  }
}

export const registerPapr = async (container: AppContainer) => {
  const papr = new Papr();

  papr.initialize(container.cradle.client.db('tantor'));

  await papr.updateSchemas();

  container.register({
    papr: awilix.asValue(papr),
  });
};
