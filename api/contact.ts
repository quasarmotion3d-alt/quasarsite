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

const json = (data: unknown, status = 200) =>
  Response.json(data, { status, headers: { 'Cache-Control': 'no-store' } });

export async function POST(request: Request) {
  let body: ContactBody = {};
  try {
    body = await request.json() as ContactBody;
  } catch {
    return json({ error: 'Dados inválidos.' }, 400);
  }

  const name = clean(body.name, 120);
  const emailAddress = clean(body.email, 180);
  const message = clean(body.message, 5000);
  const honeypot = clean(body.website, 200);

  if (honeypot) return json({ ok: true });
  if (name.length < 2) return json({ error: 'Informe seu nome.' }, 400);
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailAddress)) return json({ error: 'Informe um e-mail válido.' }, 400);
  if (message.length < 5) return json({ error: 'Escreva uma mensagem um pouco mais detalhada.' }, 400);

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error('RESEND_API_KEY is not configured');
    return json({ error: 'Envio temporariamente indisponível. Tente novamente em alguns minutos.' }, 503);
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
      return json({ error: 'Não foi possível enviar agora. Tente novamente em alguns minutos.' }, 502);
    }

    return json({ ok: true, id: (result as { id?: string }).id ?? null });
  } catch (error) {
    console.error('Contact API error', error);
    return json({ error: 'Falha temporária ao enviar. Tente novamente em alguns minutos.' }, 500);
  }
}

export function ALL() {
  return json({ error: 'Método não permitido.' }, 405);
}
