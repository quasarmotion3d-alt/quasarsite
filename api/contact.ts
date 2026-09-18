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

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Método não permitido.' });
  }

  let body = req.body ?? {};
  if (typeof body === 'string') {
    try {
      body = JSON.parse(body);
    } catch {
      return res.status(400).json({ error: 'Dados inválidos.' });
    }
  }

  const payload = body as ContactBody;
  const name = clean(payload.name, 120);
  const emailAddress = clean(payload.email, 180);
  const message = clean(payload.message, 5000);
  const honeypot = clean(payload.website, 200);

  if (honeypot) return res.status(200).json({ ok: true });
  if (name.length < 2) return res.status(400).json({ error: 'Informe seu nome.' });
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailAddress)) return res.status(400).json({ error: 'Informe um e-mail válido.' });
  if (message.length < 5) return res.status(400).json({ error: 'Escreva uma mensagem um pouco mais detalhada.' });

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error('RESEND_API_KEY is not configured');
    return res.status(503).json({ error: 'Envio temporariamente indisponível. Tente novamente em alguns minutos.' });
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
      return res.status(502).json({ error: 'Não foi possível enviar agora. Tente novamente em alguns minutos.' });
    }

    return res.status(200).json({ ok: true, id: (result as { id?: string }).id ?? null });
  } catch (error) {
    console.error('Contact API error', error);
    return res.status(500).json({ error: 'Falha temporária ao enviar. Tente novamente em alguns minutos.' });
  }
}
