import awilix, { AwilixContainer } from 'awilix';
import Papr from 'papr';

declare module '#app/container.js' {
  interface AppCradle {
    papr: Papr;
  }
}

export const registerPapr = (container: AwilixContainer) => {
  const papr = new Papr();

  container.register({
    papr: awilix.asValue(papr),
  });
};
