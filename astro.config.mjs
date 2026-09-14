import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://www.fm6mhz.com',
  output: 'static',
  trailingSlash: 'always',
  devToolbar: { enabled: false },
  integrations: [sitemap({ filter: (page) => !page.endsWith('/404/') })],
});
