const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function clean(value: unknown, max: number) {
  return String(value ?? '').trim().slice(0, max);
}

function escapeHtml(value: string) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

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

  const name = clean(body.name, 120);
  const email = clean(body.email, 180);
  const message = clean(body.message, 5000);
  const website = clean(body.website, 200);

  if (website) return res.status(200).json({ ok: true });
  if (!name || !EMAIL_RE.test(email) || message.length < 3) {
    return res.status(400).json({ error: 'Preencha nome, e-mail e mensagem corretamente.' });
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return res.status(503).json({
      error: 'Envio online ainda não foi ativado neste ambiente.',
      code: 'EMAIL_NOT_CONFIGURED',
    });
  }

  const to = process.env.CONTACT_TO_EMAIL || 'contato@quasarmotion.com.br';
  const from = process.env.CONTACT_FROM_EMAIL || 'Quasar Motion <onboarding@resend.dev>';
  const subject = `Novo contato pelo site — ${name}`;
  const html = `
    <div style="font-family:Arial,sans-serif;line-height:1.55;color:#111">
      <h2>Novo contato pelo site</h2>
      <p><strong>Nome:</strong> ${escapeHtml(name)}</p>
      <p><strong>E-mail:</strong> ${escapeHtml(email)}</p>
      <p><strong>Mensagem:</strong></p>
      <p style="white-space:pre-wrap">${escapeHtml(message)}</p>
    </div>
  `;

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from,
        to: [to],
        subject,
        html,
        reply_to: email,
      }),
    });

    const result = await response.json().catch(() => ({}));
    if (!response.ok) {
      console.error('Resend contact error', response.status, result);
      return res.status(502).json({ error: 'O serviço de e-mail recusou o envio. Tente novamente em instantes.' });
    }

    return res.status(200).json({ ok: true, id: result?.id ?? null });
  } catch (error) {
    console.error('Contact API error', error);
    return res.status(500).json({ error: 'Falha temporária ao enviar. Tente novamente em instantes.' });
  }
}
