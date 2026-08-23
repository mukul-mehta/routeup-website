const CORS_ORIGINS = ['https://routeup.dev', 'http://localhost:4321', 'http://localhost:4322'];

function corsHeaders(origin) {
  const allowed = CORS_ORIGINS.includes(origin) ? origin : 'https://routeup.dev';
  return {
    'Access-Control-Allow-Origin': allowed,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };
}

export async function onRequestOptions({ request }) {
  return new Response(null, { status: 204, headers: corsHeaders(request.headers.get('Origin') || '') });
}

export async function onRequestPost({ request, env }) {
  const origin = request.headers.get('Origin') || '';
  const headers = { 'Content-Type': 'application/json', ...corsHeaders(origin) };

  let body;
  try {
    body = await request.json();
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid JSON' }), { status: 400, headers });
  }

  const email = (body.email || '').trim();
  const namespace = (body.namespace || '').trim().toLowerCase();

  if (!email || !namespace) {
    return new Response(JSON.stringify({ error: 'email and namespace are required' }), { status: 400, headers });
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return new Response(JSON.stringify({ error: 'Invalid email' }), { status: 400, headers });
  }

  if (!/^[a-z0-9-]+$/.test(namespace)) {
    return new Response(JSON.stringify({ error: 'Namespace must be lowercase letters, numbers, and hyphens only' }), { status: 400, headers });
  }

  const resendRes = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${env.RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: 'tokens@routeup.dev',
      to: ['hello+routeup@mukul-mehta.in'],
      reply_to: email,
      subject: `Token request: ${namespace}.routeup.dev`,
      text: [
        'New hosted token request via routeup.dev',
        '',
        `Email:     ${email}`,
        `Namespace: ${namespace}.routeup.dev`,
      ].join('\n'),
    }),
  });

  if (!resendRes.ok) {
    const detail = await resendRes.text().catch(() => '');
    console.error('Resend error', resendRes.status, detail);
    return new Response(JSON.stringify({ error: 'Failed to send' }), { status: 500, headers });
  }

  return new Response(JSON.stringify({ ok: true }), { headers });
}
