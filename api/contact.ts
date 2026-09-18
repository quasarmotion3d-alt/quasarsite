export const runtime = 'nodejs';

type ContactBody = {
  name?: string;
  email?: string;
  message?: string;
  website?: string;
};

const clean = (value: unknown, max: number) => String(value ?? '').trim().slice(0, max);
const escapeHtml = (value: string) => value
  .replaceAll('&', '&amp;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;')
  .replaceAll('"', '&quot;')
  .replaceAll("'", '&#039;');

const allowedOrigins = new Set([
  'https://quasarmotion.com.br',
  'https://www.quasarmotion.com.br',
  'https://quasar-motion-final-preview.vercel.app',
]);

const corsHeaders = (request?: Request) => {
  const origin = request?.headers.get('origin') || '';
  return {
    'Cache-Control': 'no-store',
    ...(allowedOrigins.has(origin) ? { 'Access-Control-Allow-Origin': origin, 'Vary': 'Origin' } : {}),
  };
};

const json = (data: unknown, status = 200, request?: Request) =>
  Response.json(data, { status, headers: corsHeaders(request) });

export async function POST(request: Request) {
  let body: ContactBody = {};
  try {
    body = await request.json() as ContactBody;
  } catch {
    return json({ error: 'Dados inválidos.' }, 400, request);
  }

  const name = clean(body.name, 120);
  const emailAddress = clean(body.email, 180);
  const message = clean(body.message, 5000);
  const honeypot = clean(body.website, 200);

  if (honeypot) return json({ ok: true }, 200, request);
  if (name.length < 2) return json({ error: 'Informe seu nome.' }, 400, request);
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailAddress)) return json({ error: 'Informe um e-mail válido.' }, 400, request);
  if (message.length < 5) return json({ error: 'Escreva uma mensagem um pouco mais detalhada.' }, 400, request);

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error('RESEND_API_KEY is not configured');
    return json({ error: 'Envio temporariamente indisponível. Tente novamente em alguns minutos.' }, 503, request);
  }

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: process.env.CONTACT_FROM_EMAIL || 'Quasar Motion <contato@quasarmotion.com.br>',
        to: [process.env.CONTACT_TO_EMAIL || 'contato@quasarmotion.com.br'],
        reply_to: emailAddress,
        subject: `Novo contato pelo site | ${name}`,
        text: `Nome: ${name}\nE-mail: ${emailAddress}\n\nProjeto / mensagem:\n${message}`,
        html: `<div style="font-family:Arial,sans-serif;line-height:1.6;color:#111"><h2>Novo contato pelo site</h2><p><strong>Nome:</strong> ${escapeHtml(name)}</p><p><strong>E-mail:</strong> ${escapeHtml(emailAddress)}</p><p><strong>Projeto / mensagem:</strong></p><p style="white-space:pre-wrap">${escapeHtml(message)}</p></div>`,
      }),
    });

    const result = await response.json().catch(() => ({}));
    if (!response.ok) {
      console.error('Resend contact error', response.status, result);
      return json({ error: 'Não foi possível enviar agora. Tente novamente em alguns minutos.' }, 502, request);
    }

    return json({ ok: true, id: (result as { id?: string }).id ?? null }, 200, request);
  } catch (error) {
    console.error('Contact API error', error);
    return json({ error: 'Falha temporária ao enviar. Tente novamente em alguns minutos.' }, 500, request);
  }
}

export function OPTIONS(request: Request) {
  return new Response(null, { status: 204, headers: { ...corsHeaders(request), 'Access-Control-Allow-Methods': 'POST, OPTIONS', 'Access-Control-Allow-Headers': 'Content-Type' } });
}

export function ALL(request: Request) {
  return json({ error: 'Método não permitido.' }, 405, request);
}
