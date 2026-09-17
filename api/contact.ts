type ContactBody = {
  name?: string;
  email?: string;
  message?: string;
  website?: string;
};

const clean = (value: unknown, max: number) => String(value ?? '').trim().slice(0, max);

const escapeHtml = (value: string) =>
  value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');

const sendJson = (res: any, status: number, body: Record<string, unknown>) => {
  res.status(status).setHeader('Content-Type', 'application/json; charset=utf-8');
  res.end(JSON.stringify(body));
};

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return sendJson(res, 405, { error: 'Método não permitido.' });
  }

  const payload = (req.body ?? {}) as ContactBody;
  const name = clean(payload.name, 120);
  const emailAddress = clean(payload.email, 180);
  const message = clean(payload.message, 5000);
  const honeypot = clean(payload.website, 200);

  if (honeypot) return sendJson(res, 200, { ok: true });
  if (name.length < 2) return sendJson(res, 400, { error: 'Informe seu nome.' });
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailAddress)) {
    return sendJson(res, 400, { error: 'Informe um e-mail válido.' });
  }
  if (message.length < 5) {
    return sendJson(res, 400, { error: 'Escreva uma mensagem um pouco mais detalhada.' });
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error('RESEND_API_KEY is not configured');
    return sendJson(res, 503, {
      error: 'Envio temporariamente indisponível. Tente novamente em alguns minutos.',
    });
  }

  const resendResponse = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: 'Quasar Motion <contato@quasarmotion.com.br>',
      to: ['contato@quasarmotion.com.br'],
      reply_to: emailAddress,
      subject: `Novo contato pelo site | ${name}`,
      text: `Nome: ${name}\nE-mail: ${emailAddress}\n\nProjeto / mensagem:\n${message}`,
      html: `<div style="font-family:Arial,sans-serif;line-height:1.6;color:#111"><h2>Novo contato pelo site</h2><p><strong>Nome:</strong> ${escapeHtml(name)}</p><p><strong>E-mail:</strong> ${escapeHtml(emailAddress)}</p><p><strong>Projeto / mensagem:</strong></p><p style="white-space:pre-wrap">${escapeHtml(message)}</p></div>`,
    }),
  });

  const result = await resendResponse.json().catch(() => ({}));

  if (!resendResponse.ok) {
    console.error('Resend contact error', resendResponse.status, result);
    return sendJson(res, 502, {
      error: 'Não foi possível enviar agora. Tente novamente em alguns minutos.',
    });
  }

  return sendJson(res, 200, {
    ok: true,
    id: (result as { id?: string }).id ?? null,
  });
}
