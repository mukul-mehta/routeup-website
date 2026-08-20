# routeup-website

Marketing site and docs for [routeup](https://github.com/mukul-mehta/routeup).

Built with [Astro](https://astro.build) + [Starlight](https://starlight.astro.build).

Lives at `routeup.dev`:

- `/`: marketing landing (custom Astro page)
- `/docs/*`: docs (Starlight)
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

Pagefind search (Cmd/Ctrl+K on docs pages) is wired by Starlight automatically. Plain-page Markdown files are served at `/docs/<path>.md` by `src/pages/docs/[...slug].md.ts`, and `llms.txt` / `llms-full.txt` by `src/pages/llms*.txt.ts`.

## Repo layout

```txt
routeup-website/
├── astro.config.mjs              # Starlight + sitemap integrations, sidebar
├── package.json
├── tsconfig.json
├── scripts/
│   └── gen-og.mjs                # regenerates public/og.png (1200×630 social card)
├── public/
│   ├── CNAME
│   ├── favicon.svg               # fork mark; adapts to browser UI color scheme
│   ├── og.png
│   └── robots.txt
└── src/
    ├── assets/
    │   ├── logo-dark.svg         # fork mark on dark backgrounds
    │   └── logo-light.svg        # ink + deep teal variant for light
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
    │   ├── 404.astro             # branded 404 (Starlight's default is disabled)
    │   ├── llms.txt.ts           # /llms.txt endpoint
    │   └── llms-full.txt.ts      # /llms-full.txt endpoint
    └── styles/
        └── global.css            # Starlight skin (paper + forest-ink themes)
```

Design system: paper light theme and forest-ink dark theme, Space Grotesk +
JetBrains Mono (self-hosted via @fontsource), mint = local/trusted, amber =
public/exposed. Theme follows the OS by default; a user override persists in
`localStorage` (`routeup-theme`, kept in sync with Starlight's
`starlight-theme` so landing and docs agree).
Plain terminal output shown on the landing page mirrors the real CLI's text,
order, spacing, and blank lines. Full-screen TUI samples state the terminal
width and focus used for the shown frame. See "Content boundaries" below before
editing snippets.

Why docs are nested at `src/content/docs/docs/`: Starlight maps content-collection paths 1:1 to URLs. Putting docs files under a `docs/` subdirectory inside the collection makes them render at `/docs/*`, leaving `/` free for the marketing landing.

## Adding content

### Content boundaries

The landing page and docs have different jobs:

- **Landing page**: explain the product promise, one-time setup, both daily
  operating modes, the common compose/expose/observe workflows, public URL
  lifetimes, a high-level request flow, and install/documentation calls to
  action.
- **Docs**: own exact command behavior, complete flag lists, configuration
  schemas, lifecycle details, failure modes, security boundaries, recipes,
  self-hosting operations, and protocol/architecture internals.

Keep landing-page snippets real and runnable. Complete the common path on the
landing page, then link to docs for edge cases, full schemas, and flag details.
When behavior changes, update the CLI reference and task guide first, then update
any canonical snippet repeated on the landing page.

### A new docs page

1. Add an MDX file under the right section in `src/content/docs/docs/...`.
2. Required frontmatter: `title`, `description`.
3. If the page belongs to a section not yet in the sidebar, add an `autogenerate` entry in `astro.config.mjs`.

Starlight picks up the file on save. Sidebar updates automatically for `autogenerate`d sections.

### A new top-level marketing page

Add an `.astro` file under `src/pages/`. Astro picks up the route by filename. Starlight will not interfere with non-`/docs/*` routes.

## Deployment

Designed for GitHub Pages via `.github/workflows/deploy.yml`.

The site uses Astro's default static output.

DNS plan:

- `routeup.dev` -> website (this app)
- `*.routeup.dev` -> public server; covers `edge.routeup.dev` and root-tier routes
- `*.try.routeup.dev` -> public server for the hosted token-less namespace
- `*.<namespace>.routeup.dev` -> public server for each token namespace
- `get.routeup.dev` -> installer host, as an exact override of the wildcard

The apex and `/docs` are served by this site. The root wildcard handles the
control host and flat public routes; nested public and token namespaces require
their own wildcard DNS records.

## Launch gating

Before launch:

1. Verify every documented command and output block against the release binary.
2. Compare CLI-reference flags with `routeup <command> --help`.
3. Verify Homebrew, the curl installer, GitHub Pages, apex DNS, the hosted
   `edge.routeup.dev` control host, and every public/token namespace wildcard.
4. Run `pnpm check`, `pnpm build`, an internal-link crawl, and desktop/mobile
   accessibility scans.
5. Review the landing page after docs are final so its canonical snippets cannot
   drift from the reference.

Milestones tracked in `../routeup/docs/MILESTONES.md`.

## Followups

Not built yet, deliberately deferred:

- Hosted account signup or token self-service.
- Analytics: none planned; routeup is zero-telemetry by design and the site should match.

## License

MIT.
