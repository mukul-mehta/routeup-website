# routeup-website

Marketing site and docs for [routeup](https://github.com/mukul-mehta/routeup).

Built with [Astro](https://astro.build) + [Starlight](https://starlight.astro.build).

Lives at `routeup.dev`:

- `/`: marketing landing (custom Astro page)
- `/docs/*`: docs (Starlight)
- `/app/*`: future dashboard (token CRUD + route list, when it ships)
- `/llms.txt`: short LLM index
- `/llms-full.txt`: every docs page concatenated

The routeup Go binary is at `../routeup`. This repo is intentionally separate so JS tooling never touches the Go workflow.

## Develop

```bash
pnpm install         # or npm install / bun install
pnpm dev             # http://localhost:4321
pnpm build           # static output in ./dist
pnpm preview         # preview the production build
pnpm check           # astro type/diagnostic check
```

Pagefind search (Cmd/Ctrl+K on docs pages) is wired by Starlight automatically. Per-page Markdown actions are injected by `public/docs-markdown-actions.js`.

## Repo layout

```txt
routeup-website/
├── astro.config.mjs              # Starlight + sitemap integrations, sidebar
├── package.json
├── tsconfig.json
├── public/
│   ├── CNAME
│   ├── favicon.svg
│   ├── og.png
│   └── robots.txt
└── src/
    ├── assets/
    │   └── logo.svg
    ├── content.config.ts         # Starlight docs collection
    ├── content/
    │   └── docs/
    │       └── docs/             # nested so URLs are /docs/*
    │           ├── index.mdx
    │           ├── getting-started/
    │           ├── concepts/
    │           ├── configuration/
    │           ├── cli-reference/
    │           ├── recipes/
    │           ├── self-hosting/
    │           ├── architecture/
    │           └── faq.mdx
    ├── pages/
    │   ├── index.astro           # marketing landing
    │   ├── llms.txt.ts           # /llms.txt endpoint
    │   └── llms-full.txt.ts      # /llms-full.txt endpoint
    └── styles/
        └── global.css            # Starlight CSS overrides
```

Why docs are nested at `src/content/docs/docs/`: Starlight maps content-collection paths 1:1 to URLs. Putting docs files under a `docs/` subdirectory inside the collection makes them render at `/docs/*`, leaving `/` free for the marketing landing.

## Adding content

### A new docs page

1. Add an MDX file under the right section in `src/content/docs/docs/...`.
2. Required frontmatter: `title`, `description`.
3. If the page belongs to a section not yet in the sidebar, add an `autogenerate` entry in `astro.config.mjs`.

Starlight picks up the file on save. Sidebar updates automatically for `autogenerate`d sections.

### A new top-level marketing page

Add an `.astro` file under `src/pages/`. Astro picks up the route by filename. Starlight will not interfere with non-`/docs/*` routes.

### A new dashboard page (later)

When the dashboard ships:

1. Switch Astro to SSR or hybrid mode (`output: 'server'` / `'hybrid'`) and add an adapter (Cloudflare / Node / Vercel).
2. Add an auth integration (Better-Auth, Clerk, etc.).
3. Build pages under `src/pages/app/*`, likely React islands mounted on Astro pages.
4. Add middleware in `src/middleware.ts` to gate `/app/*`.

This stays a single project; the marketing and docs routes can remain statically prerendered while `/app/*` renders on demand.

## Deployment

Designed for GitHub Pages via `.github/workflows/deploy.yml`.

The site uses Astro's default static output. When the dashboard is added, switch to a hybrid output and pick an adapter.

DNS plan:

- `routeup.dev` -> website (this app)
- `*.routeup.dev` -> routeup public server (the Go binary, on a different machine)
- `routeup.dev` and `routeup.dev/docs` are served by this site; the wildcard catches everything else for user tunnels.

## Launch gating

Before launch, verify the Homebrew tap, curl installer, GitHub Pages settings, apex DNS, and wildcard public-server DNS.

Milestones tracked in `../routeup/docs/MILESTONES.md`.

## Followups

Not built yet, deliberately deferred:

- Hosted account signup or token self-service.
- Analytics: none planned; routeup is zero-telemetry by design and the site should match.

## License

MIT.
