const PRODUCES = ['text/html', 'text/markdown'];

const MARKDOWN_NOT_FOUND = `# 404: Page not found

No Routeup page exists at this URL.

- [Routeup documentation](https://routeup.dev/docs/)
- [Agent documentation index](https://routeup.dev/llms.txt)
- [Sitemap](https://routeup.dev/sitemap-index.xml)
`;

function parseAccept(header) {
  return header
    .split(',')
    .map((raw) => {
      const parts = raw.trim().split(';').map((part) => part.trim());
      const type = parts[0].toLowerCase();
      if (!type) return null;

      let q = 1;
      for (const parameter of parts.slice(1)) {
        const [name, value] = parameter.split('=').map((part) => part.trim());
        if (name.toLowerCase() !== 'q') continue;

        const parsed = Number(value);
        if (!Number.isNaN(parsed)) q = Math.max(0, Math.min(1, parsed));
      }

      const specificity = type === '*/*' ? 0 : type.endsWith('/*') ? 1 : 2;
      return { type, q, specificity };
    })
    .filter(Boolean);
}

function matches(entry, candidate) {
  if (entry.type === '*/*') return true;
  if (entry.type.endsWith('/*')) return candidate.startsWith(entry.type.slice(0, -1));
  return entry.type === candidate;
}

function preferredType(header, produces = PRODUCES) {
  if (!header) return produces[0] ?? null;

  const entries = parseAccept(header);
  if (entries.length === 0) return produces[0] ?? null;

  let bestType = null;
  let bestQ = -1;
  let bestPosition = Infinity;

  for (const candidate of produces) {
    let matched = null;
    let matchedPosition = Infinity;

    for (let index = 0; index < entries.length; index++) {
      const entry = entries[index];
      if (!matches(entry, candidate)) continue;

      if (
        matched === null ||
        entry.specificity > matched.specificity ||
        (entry.specificity === matched.specificity && index < matchedPosition)
      ) {
        matched = entry;
        matchedPosition = index;
      }
    }

    if (matched === null || matched.q <= 0) continue;

    if (matched.q > bestQ || (matched.q === bestQ && matchedPosition < bestPosition)) {
      bestType = candidate;
      bestQ = matched.q;
      bestPosition = matchedPosition;
    }
  }

  return bestType;
}

function markdownPath(pathname) {
  const clean = pathname.replace(/\/+$/, '') || '/';
  if (clean === '/') return '/index.md';
  if (clean === '/privacy') return '/privacy.md';
  if (clean === '/docs') return '/docs/index.md';
  if (clean.startsWith('/docs/')) return `${clean}.md`;
  return null;
}

function isNegotiable(request) {
  if (request.method !== 'GET' && request.method !== 'HEAD') return false;

  const pathname = new URL(request.url).pathname;
  if (pathname === '/api' || pathname.startsWith('/api/')) return false;

  return !/\.[a-z0-9]+$/i.test(pathname);
}

function mutableResponse(response) {
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers: response.headers,
  });
}

function appendVaryAccept(headers) {
  const existing = headers.get('Vary');
  if (!existing) {
    headers.set('Vary', 'Accept');
    return;
  }

  const tokens = existing.split(',').map((token) => token.trim().toLowerCase());
  if (!tokens.includes('accept')) headers.set('Vary', `Accept, ${existing}`);
}

function appendLink(headers, value) {
  const existing = headers.get('Link');
  if (!existing) {
    headers.set('Link', value);
    return;
  }

  if (!existing.includes(value)) headers.set('Link', `${existing}, ${value}`);
}

function negotiatedResponse(response, alternatePath = null) {
  const result = mutableResponse(response);
  appendVaryAccept(result.headers);
  appendLink(result.headers, '</llms.txt>; rel="describedby"');

  if (
    alternatePath &&
    result.status >= 200 &&
    result.status < 300 &&
    result.headers.get('Content-Type')?.includes('text/html')
  ) {
    appendLink(
      result.headers,
      `<${alternatePath}>; rel="alternate"; type="text/markdown"`,
    );
  }

  return result;
}

function errorResponse(request, body, status, contentType = 'text/plain; charset=utf-8') {
  const response = new Response(request.method === 'HEAD' ? null : body, {
    status,
    headers: {
      'Cache-Control': 'no-store',
      'Content-Type': contentType,
    },
  });
  return negotiatedResponse(response);
}

export async function onRequest(context) {
  const { request } = context;
  const url = new URL(request.url);

  if (
    (request.method === 'GET' || request.method === 'HEAD') &&
    url.pathname.endsWith('.md')
  ) {
    const response = mutableResponse(await context.next());
    appendLink(response.headers, '</llms.txt>; rel="describedby"');
    return response;
  }

  if (!isNegotiable(request)) return context.next();

  const accept = request.headers.get('Accept');
  const chosen = preferredType(accept);

  if (chosen === null && accept) {
    const response = await context.next();
    if (response.status === 404) return negotiatedResponse(response);

    return errorResponse(
      request,
      `Not Acceptable\n\nAvailable representations:\n- text/html\n- text/markdown\n\nRequested: ${accept}\n`,
      406,
    );
  }

  const alternatePath = markdownPath(url.pathname);

  if (chosen === 'text/markdown' && alternatePath) {
    const markdownUrl = new URL(url);
    markdownUrl.pathname = alternatePath;
    const markdownRequest = new Request(markdownUrl, {
      method: request.method,
      headers: request.headers,
    });
    const markdownAsset = await context.env.ASSETS.fetch(markdownRequest);

    if (
      (markdownAsset.status >= 200 && markdownAsset.status < 300) ||
      markdownAsset.status === 304
    ) {
      const response = mutableResponse(markdownAsset);
      response.headers.set('Content-Type', 'text/markdown; charset=utf-8');
      return negotiatedResponse(response);
    }
  }

  const htmlResponse = await context.next();

  if (chosen === 'text/markdown') {
    if (htmlResponse.status === 404) {
      return errorResponse(
        request,
        MARKDOWN_NOT_FOUND,
        404,
        'text/markdown; charset=utf-8',
      );
    }

    if (!preferredType(accept, ['text/html'])) {
      return errorResponse(
        request,
        'Not Acceptable\n\nA Markdown representation is not available. Available: text/html\n',
        406,
      );
    }
  }

  return negotiatedResponse(htmlResponse, alternatePath);
}
