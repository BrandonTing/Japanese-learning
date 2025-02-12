import type { StandardSchemaV1 } from '@standard-schema/spec';
import { loadEnv, type Plugin } from 'vite';
export function envValidatePlugin(schema: StandardSchemaV1): Plugin {
  return {
    name: 'vite-plugin-env-validate',
    async configResolved(config) {
      const resolvedRoot = process.cwd();
      const env = loadEnv(config.mode, resolvedRoot, '')
      // Validate the environment variables against the schema
      let result = schema['~standard'].validate(env);
      if (result instanceof Promise) result = await result;
      // if the `issues` field exists, the validation failed
      if (result.issues) {
        throw new Error(JSON.stringify(result.issues.map(issue => issue.message), null, 2));
      }
    }
  };
}