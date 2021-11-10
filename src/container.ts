import { registerDatabaseConnection } from '#app/database.js';
import { registerPapr } from '#app/papr.js';
import awilix, { ModuleDescriptor } from 'awilix';
import { camelCase, pascalCase } from 'change-case';

/**
 * App service container interface. When adding types, extend the interface.
 * @example
 * ```
 * declare module '#app/container.js' {
 *   interface AppCradle {
 *     prop: type;
 *   }
 * }
 * ```
 */
export interface AppCradle {}

const container = awilix.createContainer<AppCradle>();

export type AppContainer = awilix.AwilixContainer<AppCradle>;

export const initializeContainer = async () => {
  await registerDatabaseConnection(container);
  await registerPapr(container);

  await container.loadModules(['**/*.model.js', '**/*.router.js'], {
    esModules: true,
    /**
     * This method will determine the name in the container.
     * We'll favour pascal case for things like models.
     * The rest will be camel case.
     * @param name
     * @param descriptor
     * @returns
     */
    formatName(name: string, descriptor: ModuleDescriptor): string {
      if (name.endsWith('.model')) {
        return pascalCase(name);
      }

      return camelCase(name);
    },
  });

  return container;
};
