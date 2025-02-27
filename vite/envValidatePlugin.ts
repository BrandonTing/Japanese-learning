import { loadEnv, type Plugin } from 'vite';
import { validateEnv } from './schema';
export function envValidatePlugin(): Plugin {
  return {
    name: 'vite-plugin-env-validate',
    async configResolved(config) {
      const resolvedRoot = process.cwd();
      const env = loadEnv(config.mode, resolvedRoot, '')
      // Validate the environment variables against the schema
      validateEnv(env)
    }
  };
}