import { defineConfig } from 'astro/config';
import cloudflare from '@astrojs/cloudflare';
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';

// 'compile' runs Sharp at build time (Node) to pre-optimize prerendered images.
// The v13 dev server runs inside workerd, where Sharp's CommonJS entry throws
// "module is not defined". 'passthrough' serves unoptimized originals in dev (no Sharp);
// production builds still get full optimization.
const isDev = process.argv.includes('dev');

export default defineConfig({
  // TODO: replace with the production URL before deploying to Cloudflare Pages.
  // SEOHead.astro uses this to build absolute canonical and og:image URLs.
  site: 'https://thecommerceboutique.com',
  adapter: cloudflare({ imageService: isDev ? 'passthrough' : 'compile' }),
  integrations: [react()],
  vite: {
    plugins: [tailwindcss()],
  },
});
