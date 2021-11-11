import awilix, { asValue, Lifetime, ModuleDescriptor } from 'awilix';
import { camelCase, pascalCase } from 'change-case';
import { MongoClient } from 'mongodb';

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
export interface AppCradle {
  name: string;
}

const container = awilix.createContainer<AppCradle>();

export type AppContainer = awilix.AwilixContainer<AppCradle>;

export const initializeContainer = async () => {
  await container.loadModules(
    [
      ['**/providers/*.js', { lifetime: Lifetime.SINGLETON }],
      [
        '**/providers/database.js',
        {
          lifetime: Lifetime.SINGLETON,
          async dispose(database: AppCradle['database']) {
            await database.then((client) => client.close());
          },
        },
      ],
      '**/*.model.js',
      '**/*.router.js',
    ],
    {
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
        // console.log(name, descriptor);

        if (name.endsWith('.model')) {
          return pascalCase(name);
        }

        return camelCase(name);
      },
    },
  );

  return container;
};
