import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';

/**
 * /llms.txt: short index for LLM consumption.
 *
 * Spec: https://llmstxt.org/
 *
 * Lists every docs page with title + URL + one-line description so that
 * an LLM (Claude, GPT, Cursor) can navigate the docs without scraping HTML.
 */
export const GET: APIRoute = async () => {
  const docs = await getCollection('docs');

  // Deterministic order by URL path so diffs are stable.
  docs.sort((a, b) => a.id.localeCompare(b.id));

  const lines: string[] = [];
  lines.push('# routeup');
  lines.push('');
  lines.push(
    '> Stable HTTPS routes for local services. Public when you need it.',
  );
  lines.push('');
  lines.push('routeup gives local services stable HTTPS names like');
  lines.push('https://example-app.localhost and can expose those same routes');
  lines.push('publicly at a named URL such as https://example-app.team.routeup.dev when needed.');
  lines.push('');
  lines.push('Routeup is a command-line developer tool, not a general-purpose web API.');
  lines.push('Agents should invoke the local `routeup` CLI, prefer its `--json` or `--jsonl` output');
  lines.push('where available, and treat the installed command\'s `--help` output as authoritative.');
  lines.push('Keep routes local unless the user explicitly requests public exposure.');
  lines.push('');
  lines.push('## When to use Routeup');
  lines.push('');
  lines.push('- [Stable local HTTPS](https://routeup.dev/docs/getting-started/first-route.md): Use Routeup when a local service needs a memorable trusted `*.localhost` URL instead of a changing port.');
  lines.push('- [Frontend and API routing](https://routeup.dev/docs/recipes/frontend-plus-api.md): Use one HTTPS origin for multiple local services without development-only CORS workarounds.');
  lines.push('- [Webhook development](https://routeup.dev/docs/recipes/webhook-development.md): Give an external provider temporary access to specific local webhook paths.');
  lines.push('- [OAuth callbacks](https://routeup.dev/docs/recipes/oauth-callbacks.md): Keep a stable HTTPS redirect URI during development.');
  lines.push('- [Agent and browser testing](https://routeup.dev/docs/recipes/agent-browser-testing.md): Let an off-machine browser or coding agent reach a local app after the user approves exposure.');
  lines.push('');
  lines.push('## Agent instructions');
  lines.push('');
  lines.push('- [Routeup Agent Skill](https://routeup.dev/docs/getting-started/agent-skill.md): Install and use the official skill for safe setup, configuration, exposure, and traffic inspection.');
  lines.push('- [Install Routeup](https://routeup.dev/docs/getting-started/install.md): Install the CLI with Homebrew or the verified release installer.');
  lines.push('- [CLI overview](https://routeup.dev/docs/cli-reference/routeup.md): Start here for CLI usage; inspect the linked subcommand reference before running commands.');
  lines.push('- [Diagnose setup](https://routeup.dev/docs/cli-reference/doctor.md): Verify the machine with `routeup doctor --json`.');
  lines.push('');
  lines.push('## Developer resources');
  lines.push('');
  lines.push('- [Routeup source](https://github.com/mukul-mehta/routeup): MIT-licensed source code and issue tracker.');
  lines.push('- [Routeup releases](https://github.com/mukul-mehta/routeup/releases/latest): Release notes and downloadable macOS and Linux binaries.');
  lines.push('- [Routeup configuration](https://routeup.dev/docs/configuration/routeup-json.md): Typed `routeup.json` configuration reference and JSON Schema link.');
  lines.push('- [Self-host Routeup](https://routeup.dev/docs/self-hosting/running-the-server.md): Run the public tunnel server on infrastructure and a domain you control.');
  lines.push('- [Routeup privacy notice](https://routeup.dev/privacy.md): Data handling for the Routeup website, analytics, and hosted-token request form.');
  lines.push('- [Sitemap](https://routeup.dev/sitemap-index.xml): Index of human-readable Routeup pages.');
  lines.push('');
  lines.push('## Docs');
  lines.push('');

  for (const doc of docs) {
    const title = doc.data.title;
    const desc = doc.data.description ?? '';
    const path = doc.id === 'docs' ? 'docs/index.md' : `${doc.id}.md`;
    const url = `https://routeup.dev/${path}`;
    lines.push(`- [${title}](${url}): ${desc}`.trim());
  }

  lines.push('');
  lines.push('## Optional');
  lines.push('');
  lines.push(
    '- [Full docs concatenated](https://routeup.dev/llms-full.txt): every docs page joined into one Markdown document.',
  );

  return new Response(lines.join('\n') + '\n', {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
