import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';

/**
 * /llms-full.txt: every docs page concatenated as one Markdown document.
 *
 * Designed so a user can paste a single URL into Claude / GPT / Cursor
 * and have the model fetch the entire routeup docs corpus at once.
 */
export const GET: APIRoute = async () => {
  const docs = await getCollection('docs');
  docs.sort((a, b) => a.id.localeCompare(b.id));

  const parts: string[] = [];
  parts.push('# routeup: full docs\n');
  parts.push(
    '> Stable HTTPS routes for local services. Public when you need it.\n',
  );
  parts.push(
    'This file is the concatenation of every published docs page.',
  );
  parts.push('Source: https://routeup.dev\n');

  for (const doc of docs) {
    const title = doc.data.title;
    const path = doc.id === 'docs' ? 'docs/index.md' : `${doc.id}.md`;
    const url = `https://routeup.dev/${path}`;
    parts.push('\n---\n');
    parts.push(`## ${title}\n`);
    parts.push(`Source: ${url}\n`);
    parts.push((doc.body ?? '').trim() + '\n');
  }

  return new Response(parts.join('\n'), {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
