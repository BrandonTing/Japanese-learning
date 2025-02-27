import { sentrySvelteKit } from '@sentry/sveltekit';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import { envValidatePlugin } from './vite/envValidatePlugin';

export default defineConfig({
  plugins: [
    envValidatePlugin(),
    sentrySvelteKit({
      sourceMapsUploadOptions: {
        org: 'brandon-ting',
        project: 'javascript-sveltekit',
      }
    }),
    sveltekit()
  ]
});
