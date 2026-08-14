import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import mdx from '@astrojs/mdx';

export default defineConfig({
  site: 'https://wadekarg.github.io',
  base: '/system_design_101/',
  vite: {
    plugins: [tailwindcss()],
  },
  integrations: [mdx()],
});
