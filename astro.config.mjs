import { defineConfig } from 'astro/config';
import cloudflare from '@astrojs/cloudflare';
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  // TODO: replace with the production URL before deploying to Cloudflare Pages.
  // SEOHead.astro uses this to build absolute canonical and og:image URLs.
  site: 'https://thecommerceboutique.com',
  // 'compile' optimizes images with Sharp at build time for prerendered routes.
  // The v13 default ('cloudflare-binding') defers to a runtime binding, which does
  // nothing for this fully-static site. Every page here is prerendered.
  adapter: cloudflare({ imageService: 'compile' }),
  integrations: [react()],
  vite: {
    plugins: [tailwindcss()],
  },
});
