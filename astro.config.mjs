import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://smf.az',
  trailingSlash: 'always',
  integrations: [sitemap()],
});
