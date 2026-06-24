import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import react from '@astrojs/react';

// Marketing landing lives at src/pages/index.astro and renders at `/`.
// Starlight content lives under src/content/docs/docs/* so it renders at `/docs/*`.
// Future dashboard will live under src/pages/app/* and render at `/app/*`.

export default defineConfig({
  site: 'https://routeup.dev',
  integrations: [
    react(),
    starlight({
      title: 'routeup',
      description:
        'Stable HTTPS routes for local services. Public when you need them.',
      logo: {
        // TODO: replace with real logo
        src: './src/assets/logo.svg',
        replacesTitle: false,
      },
      social: [
        {
          icon: 'github',
          label: 'GitHub',
          href: 'https://github.com/mukul-mehta/routeup',
        },
      ],
      sidebar: [
        {
          label: 'Getting Started',
          autogenerate: { directory: 'docs/getting-started' },
        },
        {
          label: 'Concepts',
          autogenerate: { directory: 'docs/concepts' },
        },
        {
          label: 'Configuration',
          autogenerate: { directory: 'docs/configuration' },
        },
        {
          label: 'CLI Reference',
          autogenerate: { directory: 'docs/cli-reference' },
        },
        {
          label: 'Recipes',
          autogenerate: { directory: 'docs/recipes' },
        },
        {
          label: 'Self-Hosting',
          autogenerate: { directory: 'docs/self-hosting' },
        },
        {
          label: 'Architecture',
          autogenerate: { directory: 'docs/architecture' },
        },
        { label: 'FAQ', link: '/docs/faq' },
      ],
      customCss: ['./src/styles/global.css'],
      editLink: {
        baseUrl:
          'https://github.com/mukul-mehta/routeup-web/edit/main/',
      },
      lastUpdated: true,
      // Pagefind powers the built-in search (Cmd/Ctrl+K opens it).
      // A custom cmdk-based command palette can replace this later.
    }),
  ],
});
