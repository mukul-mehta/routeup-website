import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';

export const getStaticPaths = async () => {
  const docs = await getCollection('docs');

  return docs.map((doc) => ({
    params: { slug: doc.id === 'docs' ? 'index' : doc.id.replace(/^docs\//, '') },
  }));
};

export const GET: APIRoute = async ({ params }) => {
  const slug = params.slug ?? 'index';
  const id = slug === 'index' ? 'docs' : `docs/${slug}`;
  const docs = await getCollection('docs');
  const doc = docs.find((entry) => entry.id === id);

  if (!doc) {
    return new Response('Not found\n', { status: 404 });
  }

  const lines = [
    `# ${doc.data.title}`,
    '',
    doc.data.description ? `> ${doc.data.description}` : '',
    '',
    (doc.body ?? '').trim(),
    '',
  ].filter((line, index, all) => line !== '' || all[index - 1] !== '');

  return new Response(lines.join('\n'), {
    headers: { 'Content-Type': 'text/markdown; charset=utf-8' },
  });
};
