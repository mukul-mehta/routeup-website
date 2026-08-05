import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import sitemap from '@astrojs/sitemap';

// Marketing landing lives at src/pages/index.astro and renders at `/`.
// Starlight content lives under src/content/docs/docs/* so it renders at `/docs/*`.

export default defineConfig({
  site: 'https://routeup.dev',
  integrations: [
    starlight({
      title: 'routeup',
      description:
        'Stable HTTPS routes for local services. Public when you need it.',
      logo: {
        src: './src/assets/logo.svg',
        replacesTitle: false,
      },
      // Default social-card image for every docs page. Per-page title and
      // description are set by Starlight; this just guarantees an og:image.
      head: [
        {
          tag: 'meta',
          attrs: { property: 'og:image', content: 'https://routeup.dev/og.png' },
        },
        {
          tag: 'meta',
          attrs: { property: 'og:image:width', content: '1200' },
        },
        {
          tag: 'meta',
          attrs: { property: 'og:image:height', content: '630' },
        },
        {
          tag: 'meta',
          attrs: { name: 'twitter:card', content: 'summary_large_image' },
        },
        {
          tag: 'meta',
          attrs: { name: 'twitter:image', content: 'https://routeup.dev/og.png' },
        },
      ],
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
          // Explicit order: a newcomer should hit Install first, not the
          // alphabetical autogenerate order.
          items: [
            'docs/getting-started/install',
            'docs/getting-started/first-route',
            'docs/getting-started/using-a-token',
            'docs/getting-started/exposing-publicly',
          ],
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
          'https://github.com/mukul-mehta/routeup-website/edit/main/',
      },
      lastUpdated: true,
      // Pagefind powers the built-in search (Cmd/Ctrl+K opens it).
    }),
    // Generates /sitemap-index.xml from the `site` URL above.
    sitemap(),
  ],
});
