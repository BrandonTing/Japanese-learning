import { sentrySvelteKit } from '@sentry/sveltekit';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import { envValidatePlugin } from './vite/envValidatePlugin';
import { envSchema } from './vite/schema';

export default defineConfig({
  plugins: [
    envValidatePlugin(envSchema),
    sentrySvelteKit({
      sourceMapsUploadOptions: {
        org: 'brandon-ting',
        project: 'javascript-sveltekit',
      }
    }),
    sveltekit()
  ]
});
