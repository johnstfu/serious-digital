import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';

export default defineConfig({
  site: 'https://serious-digital.fr',
  integrations: [
    tailwind({ applyBaseStyles: true }),
  ],
  output: 'static',
  build: {
    inlineStylesheets: 'auto',
  },
});
