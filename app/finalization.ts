const friedThumb = 'https://quasar-preview-assets.floot.app/_cdn/static/ec65c13e-30c7-4e99-8fa6-a44868d68e17-fried-canvas-thumb-optimized.webp';
const quasarAiThumb = 'https://quasar-preview-assets.floot.app/_cdn/static/6831520b-8802-4b73-8d96-6cd184b2e6de-quasar-motion-thumb-v2.webp';

type FinalVideo = { id: string; title: string; thumb: string };

const extraAiVideos: FinalVideo[] = [
  { id: '1227778074', title: 'Quasar Motion', thumb: quasarAiThumb },
  { id: '1227841926', title: 'Fried Canvas', thumb: friedThumb },
];

function removeHintCopy() {
  document.querySelectorAll<HTMLElement>('span,small,p,div').forEach((el) => {
    if (el.children.length === 0 && el.textContent?.trim() === 'Passe o mouse para explorar') {
      el.remove();
    }
  });
}

function removeLargeReel() {
  document.querySelector<HTMLElement>('#reel')?.remove();
}

function removeHeroMeta() {
  document.querySelector<HTMLElement>('.hero .meta')?.remove();
}

function reorderWebsites() {
  const grid = document.querySelector<HTMLElement>('.websites-grid');
  if (!grid) return;
  const order = ['Logic Automação', 'WLobo', 'Calende'];
  const cards = [...grid.querySelectorAll<HTMLElement>('.website-card')];
  order.forEach((title) => {
    const card = cards.find((item) => item.querySelector('h3')?.textContent?.trim() === title);
    if (card) grid.appendChild(card);
  });
}

function createVideoCard(video: FinalVideo) {
  const card = document.createElement('button');
  card.type = 'button';
  card.className = 'final-video-card tile-vertical';
  card.dataset.finalVideo = video.id;
  card.setAttribute('aria-label', `Reproduzir ${video.title}`);
  card.innerHTML = `
    <img src="${video.thumb}" alt="${video.title}" loading="lazy" decoding="async" />
    <span class="tile-shade"></span>
    <span class="tile-info"><small>AI VIDEO</small><strong>${video.title}</strong></span>
    <span class="tile-arrow" aria-hidden="true"></span>
  `;
  card.addEventListener('click', () => openVideo(video));
  return card;
}

function openVideo(video: FinalVideo) {
  document.querySelector('.final-video-overlay')?.remove();
  const overlay = document.createElement('div');
  overlay.className = 'final-video-overlay';
  overlay.setAttribute('role', 'dialog');
  overlay.setAttribute('aria-modal', 'true');
  overlay.setAttribute('aria-label', video.title);
  const playerUrl = `https://player.vimeo.com/video/${video.id}?autoplay=1&loop=1&title=0&byline=0&portrait=0&badge=0&pip=0&dnt=1`;
  overlay.innerHTML = `
    <div class="final-video-panel">
      <button class="final-video-close" type="button" aria-label="Fechar vídeo">×</button>
      <iframe src="${playerUrl}" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen title="${video.title}"></iframe>
    </div>
  `;
  const close = () => {
    overlay.remove();
    document.body.style.removeProperty('overflow');
    document.removeEventListener('keydown', onKey);
  };
  const onKey = (event: KeyboardEvent) => {
    if (event.key === 'Escape') close();
  };
  overlay.querySelector<HTMLButtonElement>('.final-video-close')?.addEventListener('click', close);
  overlay.addEventListener('click', (event) => {
    if (event.target === overlay) close();
  });
  document.body.style.overflow = 'hidden';
  document.addEventListener('keydown', onKey);
  document.body.appendChild(overlay);
}

function finalizeAiSection() {
  const section = document.querySelector<HTMLElement>('#work-ai-video');
  const grid = section?.querySelector<HTMLElement>('.mosaic');
  if (!grid) return;
  grid.querySelectorAll('.ai-placeholder').forEach((item) => item.remove());
  extraAiVideos.forEach((video) => {
    if (!grid.querySelector(`[data-final-video="${video.id}"]`)) grid.appendChild(createVideoCard(video));
  });
  const count = section?.querySelector<HTMLElement>('.portfolio-bar span');
  if (count) count.textContent = '4 projetos';
}

function iconMarkup() {
  return '<svg class="final-mail-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M3.5 5.5h17v13h-17z"></path><path d="m4 6.5 8 6 8-6"></path></svg>';
}

function finalizeContact() {
  const block = document.querySelector<HTMLElement>('.contact-block');
  if (!block) return;
  const emailLink = block.querySelector<HTMLAnchorElement>('a');
  if (emailLink) {
    emailLink.href = 'mailto:contato@quasarmotion.com.br';
    emailLink.innerHTML = `${iconMarkup()}<span>contato@quasarmotion.com.br</span><span aria-hidden="true">→</span>`;
  }
  if (block.querySelector('.final-contact-form')) return;
  const form = document.createElement('form');
  form.className = 'final-contact-form';
  form.innerHTML = `
    <div class="final-contact-row">
      <label>Nome<input name="name" autocomplete="name" required maxlength="120" /></label>
      <label>E-mail<input name="email" type="email" autocomplete="email" required maxlength="180" /></label>
    </div>
    <label>Projeto / mensagem<textarea name="message" rows="6" required maxlength="5000"></textarea></label>
    <label class="final-honeypot" aria-hidden="true">Website<input name="website" tabindex="-1" autocomplete="off" /></label>
    <button type="submit">Enviar mensagem ↗</button>
    <div class="final-contact-status" role="status" aria-live="polite"></div>
  `;
  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const button = form.querySelector<HTMLButtonElement>('button[type="submit"]');
    const status = form.querySelector<HTMLElement>('.final-contact-status');
    const data = new FormData(form);
    const payload = {
      name: String(data.get('name') || '').trim(),
      email: String(data.get('email') || '').trim(),
      message: String(data.get('message') || '').trim(),
      website: String(data.get('website') || '').trim(),
    };
    if (button) {
      button.disabled = true;
      button.textContent = 'Enviando...';
    }
    if (status) {
      status.className = 'final-contact-status';
      status.textContent = '';
    }
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(result?.error || 'Não foi possível enviar agora.');
      if (status) {
        status.className = 'final-contact-status is-success';
        status.textContent = 'Mensagem enviada. Obrigado!';
      }
      form.reset();
    } catch (error) {
      if (status) {
        status.className = 'final-contact-status is-error';
        status.textContent = error instanceof Error ? error.message : 'Não foi possível enviar agora.';
      }
    } finally {
      if (button) {
        button.disabled = false;
        button.textContent = 'Enviar mensagem ↗';
      }
    }
  });
  block.appendChild(form);
}

function finalizePartners() {
  const lumos = document.querySelector<HTMLElement>('.footer-partner');
  if (!lumos) return;
  const brand = lumos.querySelector<HTMLElement>('.footer-partner-brand');
  if (brand && !brand.querySelector('.final-partner-name')) {
    const name = document.createElement('strong');
    name.className = 'final-partner-name';
    name.textContent = 'Lumos';
    brand.appendChild(name);
  }
  if (document.querySelector('.footer-partner.final-fried-partner')) return;
  const fried = document.createElement('div');
  fried.className = 'footer-partner final-fried-partner is-visible';
  fried.innerHTML = `
    <div class="footer-partner-brand">
      <span>Parceiros:</span>
      <img class="final-partner-avatar" src="${friedThumb}" alt="Fried Canvas" loading="lazy" decoding="async" />
      <strong class="final-partner-name">Fried Canvas</strong>
    </div>
    <a class="lumos-whatsapp" href="https://wa.me/5519981797288" target="_blank" rel="noreferrer">
      <span>Falar com a Fried Canvas no WhatsApp</span><span class="lumos-native-arrow" aria-hidden="true">→</span>
    </a>
  `;
  lumos.insertAdjacentElement('afterend', fried);
}

function applyFinalization() {
  removeHintCopy();
  removeLargeReel();
  removeHeroMeta();
  reorderWebsites();
  finalizeAiSection();
  finalizeContact();
  finalizePartners();
}

let runs = 0;
const timer = window.setInterval(() => {
  applyFinalization();
  runs += 1;
  if (runs >= 20) window.clearInterval(timer);
}, 150);

window.addEventListener('load', applyFinalization, { once: true });
