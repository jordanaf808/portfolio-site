import { defineConfig } from 'astro/config';
import cloudflare from '@astrojs/cloudflare';
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  // TODO: replace with the production URL before deploying to Cloudflare Pages.
  // SEOHead.astro uses this to build absolute canonical and og:image URLs.
  site: 'https://thecommerceboutique.com',
  adapter: cloudflare(),
  integrations: [react()],
  vite: {
    plugins: [tailwindcss()],
  },
});
