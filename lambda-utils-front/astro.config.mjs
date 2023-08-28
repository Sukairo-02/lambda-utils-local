import { defineConfig } from 'astro/config';
import aws from 'astro-sst/lambda';
import svelte from '@astrojs/svelte';

// https://astro.build/config
export default defineConfig({
  integrations: [svelte()],
  output: 'server',
  adapter: aws()
});