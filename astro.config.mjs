import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import sitemap from '@astrojs/sitemap';

// Marketing landing lives at src/pages/index.astro and renders at `/`.
// Starlight content lives under src/content/docs/docs/* so it renders at `/docs/*`.

export default defineConfig({
  site: 'https://routeup.dev',
  server: {
    "allowedHosts": ["routeup-website.mukul.routeup.dev", "routeup-website.routeup.dev"]
  },
  integrations: [
    starlight({
      title: 'routeup',
      description:
        'Stable HTTPS routes for local services. Public when you need it.',
      logo: {
        light: './src/assets/logo-light.svg',
        dark: './src/assets/logo-dark.svg',
        replacesTitle: false,
      },
      components: {
        MobileMenuToggle: './src/components/MobileMenuToggle.astro',
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
        {
          tag: 'meta',
          attrs: { name: 'theme-color', media: '(prefers-color-scheme: dark)', content: '#101512' },
        },
        {
          tag: 'meta',
          attrs: { name: 'theme-color', media: '(prefers-color-scheme: light)', content: '#E9E3D2' },
        },
        // Mirror Starlight theme-select changes into the landing page's
        // `routeup-theme` key so the choice carries across the whole site
        // ('auto' clears the override; the landing then follows the OS).
        {
          tag: 'script',
          content: `
            (function () {
              function updateThemeColor(theme) {
                var resolved = theme === 'auto'
                  ? (matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark')
                  : theme;
                var color = resolved === 'light' ? '#E9E3D2' : '#101512';
                document.querySelectorAll('meta[name="theme-color"]').forEach(function (meta) {
                  meta.setAttribute('content', color);
                });
              }

              document.addEventListener('change', function (event) {
                var select = event.target;
                if (!select || !select.closest || !select.closest('starlight-theme-select')) return;
                try {
                  if (select.value === 'auto') localStorage.removeItem('routeup-theme');
                  else localStorage.setItem('routeup-theme', select.value);
                } catch (_) {}
                updateThemeColor(select.value);
              }, true);

              document.addEventListener('DOMContentLoaded', function () {
                updateThemeColor(document.documentElement.dataset.theme || 'auto');
              });
            })();
          `,
        },
        {
          tag: 'script',
          content: `
            (function () {
              function enhanceDocs() {
                document.querySelectorAll('.expressive-code pre, .sl-markdown-content > pre').forEach(function (pre) {
                  if (pre.scrollWidth > pre.clientWidth) pre.setAttribute('tabindex', '0');
                  else pre.removeAttribute('tabindex');
                });
              }

              document.addEventListener('DOMContentLoaded', enhanceDocs);
              document.addEventListener('astro:page-load', enhanceDocs);
              window.addEventListener('resize', enhanceDocs);
            })();
          `,
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
            {
              label: 'Agent Skill',
              link: '/docs/getting-started/agent-skill',
            },
            'docs/getting-started/first-route',
            'docs/getting-started/exposing-publicly',
            'docs/getting-started/using-a-token',
            {
              label: 'Observe and debug requests',
              link: '/docs/getting-started/observe-and-debug',
            },
          ],
        },
        {
          label: 'Concepts',
          items: [{ autogenerate: { directory: 'docs/concepts' } }],
        },
        {
          label: 'Configuration',
          items: [{ autogenerate: { directory: 'docs/configuration' } }],
        },
        {
          label: 'Recipes',
          items: [{ autogenerate: { directory: 'docs/recipes' } }],
        },
        {
          label: 'CLI Reference',
          items: [
            'docs/cli-reference/routeup',
            {
              label: 'Start',
              items: [
                'docs/cli-reference/exec',
                'docs/cli-reference/expose',
                'docs/cli-reference/serve',
                'docs/cli-reference/stop',
              ],
            },
            {
              label: 'Observe',
              items: [
                'docs/cli-reference/config',
                'docs/cli-reference/dashboard',
                'docs/cli-reference/doctor',
                'docs/cli-reference/inspect',
                'docs/cli-reference/logs',
                'docs/cli-reference/routes',
              ],
            },
            {
              label: 'Manage',
              items: [
                'docs/cli-reference/completion',
                'docs/cli-reference/setup',
                'docs/cli-reference/update-uninstall',
              ],
            },
            {
              label: 'Operators',
              items: ['docs/cli-reference/operator'],
            },
          ],
        },
        {
          label: 'Self-Hosting',
          items: [{ autogenerate: { directory: 'docs/self-hosting' } }],
        },
        {
          label: 'Architecture',
          items: [{ autogenerate: { directory: 'docs/architecture' } }],
        },
        { label: 'FAQ', link: '/docs/faq' },
      ],
      customCss: ['./src/styles/global.css'],
      // The branded 404 lives at src/pages/404.astro; drop Starlight's default.
      disable404Route: true,
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
