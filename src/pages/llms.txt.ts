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
  lines.push('publicly at a named URL such as https://example-app.mukul.routeup.dev when needed.');
  lines.push('');
  lines.push('## Docs');
  lines.push('');

  for (const doc of docs) {
    const title = doc.data.title;
    const desc = doc.data.description ?? '';
    const url = `https://routeup.dev/${doc.id}`;
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
