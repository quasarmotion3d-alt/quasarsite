const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
const revealNodes = Array.from(document.querySelectorAll<HTMLElement>('.reveal'));

if (reducedMotion || !('IntersectionObserver' in window)) {
  revealNodes.forEach((node) => node.classList.add('is-visible'));
} else {
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
      });
    },
    { threshold: 0.1, rootMargin: '0px 0px -7% 0px' },
  );
  revealNodes.forEach((node) => revealObserver.observe(node));
}

const header = document.querySelector<HTMLElement>('.topbar');
const progress = document.querySelector<HTMLElement>('.scroll-progress span');
const syncScroll = () => {
  header?.classList.toggle('is-scrolled', window.scrollY > 24);
  if (!progress) return;
  const max = Math.max(document.documentElement.scrollHeight - window.innerHeight, 1);
  progress.style.transform = `scaleX(${Math.min(window.scrollY / max, 1)})`;
};
syncScroll();
window.addEventListener('scroll', syncScroll, { passive: true });

document.querySelectorAll<HTMLAnchorElement>('a[href^="#"]').forEach((link) => {
  link.addEventListener('click', (event) => {
    if (link.matches('.project, .vertical')) return;
    const selector = link.getAttribute('href');
    if (!selector || selector === '#') return;
    const target = document.querySelector<HTMLElement>(selector);
    if (!target) return;
    event.preventDefault();
    target.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth', block: 'start' });
  });
});

const contactForm = document.querySelector<HTMLFormElement>('#contactForm');
const contactStatus = document.querySelector<HTMLElement>('#contactStatus');
const contactButton = contactForm?.querySelector<HTMLButtonElement>('button[type="submit"]');

contactForm?.addEventListener('submit', async (event) => {
  event.preventDefault();
  if (!contactForm || !contactButton) return;

  const data = new FormData(contactForm);
  const payload = {
    name: String(data.get('name') || '').trim(),
    email: String(data.get('email') || '').trim(),
    message: String(data.get('message') || '').trim(),
    website: String(data.get('website') || '').trim(),
  };

  contactButton.disabled = true;
  contactButton.dataset.originalText ||= contactButton.innerHTML;
  contactButton.innerHTML = 'Enviando…';
  if (contactStatus) {
    contactStatus.textContent = 'Enviando sua mensagem…';
    contactStatus.className = 'contact-status is-sending';
  }

  try {
    const response = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const result = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(result?.error || 'Falha no envio');

    contactForm.reset();
    if (contactStatus) {
      contactStatus.textContent = 'Mensagem enviada. Obrigado — responderemos pelo e-mail informado.';
      contactStatus.className = 'contact-status is-success';
    }
  } catch (error) {
    console.error('Contact form error', error);
    if (contactStatus) {
      contactStatus.textContent = 'Não foi possível enviar agora. Tente novamente em alguns minutos.';
      contactStatus.className = 'contact-status is-error';
    }
  } finally {
    contactButton.disabled = false;
    contactButton.innerHTML = contactButton.dataset.originalText || 'Enviar mensagem <b>↗</b>';
  }
});

type ProjectMedia = { videos?: string[]; images?: string[] };
const assetUrl = (name: string) => `/assets/${name}`;
const portfolioMedia: Record<string, ProjectMedia> = {
  'Tesla solar panels': { videos: ['1222178036'] },
  EquipeAgro: { videos: ['1222188457'] },
  Verdure: { videos: ['1222171295'] },
  ClemarMDC: { videos: ['1222182732'] },
  'Thermal Cam': { videos: ['1222175646'] },
  'D2D Motors': {
    images: [
      'img_bd01.jpg',
      'img_bd02e.webp',
      'img_bd03.jpg',
      'img_bd04.jpg',
      'img_bd05.webp',
      'img_bd08.jpg',
      'img_bd13.webp',
      'img_bd12c.jpg',
      'img_bd14b.jpg',
      'img_bd11.jpg',
      'img_bd11b.webp',
      'img_bd10.webp',
      'img_bd09.jpg',
    ].map(assetUrl),
  },
  Rockport: {
    videos: ['1222193899'],
    images: ['img_reebok03.webp', 'img_reebok01.webp', 'img_reebok04.webp'].map(assetUrl),
  },
  '3M Automotive': {
    videos: ['1222166294'],
    images: [
      'pg_3m_auto03.jpg',
      'pg_3m_auto02.jpg',
      'pg_3m_auto04.jpg',
      'pg_3m_auto05.jpg',
      'pg_3m_auto06.jpg',
      'pg_3m_auto07.jpg',
    ].map(assetUrl),
  },
  Biometal: { videos: ['1221985270'] },
  'Super Flex HP': { videos: ['1222222107'] },
  Chargerchip: { videos: ['1222209201'] },
  'Estufa de defumação': { videos: ['1222213889'] },
  'Acoustic Masking': { videos: ['1222377474'] },
  Goodpack: { videos: ['1222592700'] },
  Minerals: { videos: ['1222379988'] },
  'Robotic Arm': { videos: ['1222381118'] },
  'Lumos Marketing': { videos: ['1222372317'] },
  'Dig. click': { videos: ['1222388045'] },
  'Quasar Motion': { videos: ['1227778074'] },
  'Fried Canvas': { videos: ['1227841926'] },
};

const portfolioCards = Array.from(document.querySelectorAll<HTMLAnchorElement>('.project, .vertical'));
const viewer = document.createElement('div');
viewer.className = 'project-viewer';
viewer.setAttribute('aria-hidden', 'true');
viewer.innerHTML = '<div class="project-viewer__backdrop" data-viewer-close></div><section class="project-viewer__panel" role="dialog" aria-modal="true" aria-labelledby="projectViewerTitle"><button class="project-viewer__close" type="button" aria-label="Fechar projeto" data-viewer-close>×</button><div class="project-viewer__media"></div><div class="project-viewer__meta"><small class="project-viewer__eyebrow"></small><strong id="projectViewerTitle"></strong></div></section>';
document.body.appendChild(viewer);

const viewerMedia = viewer.querySelector<HTMLElement>('.project-viewer__media');
const viewerTitle = viewer.querySelector<HTMLElement>('#projectViewerTitle');
const viewerEyebrow = viewer.querySelector<HTMLElement>('.project-viewer__eyebrow');
const viewerClose = viewer.querySelector<HTMLButtonElement>('.project-viewer__close');
let lastViewerTrigger: HTMLElement | null = null;

const appendViewerVideo = (videoId: string, title: string) => {
  if (!viewerMedia) return;
  const wrap = document.createElement('div');
  wrap.className = 'project-viewer__video';
  const iframe = document.createElement('iframe');
  iframe.src = `https://player.vimeo.com/video/${videoId}?autoplay=1&loop=1&autopause=0&controls=1&title=0&byline=0&portrait=0&badge=0&dnt=1`;
  iframe.title = `${title} — vídeo`;
  iframe.allow = 'autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media; web-share';
  iframe.referrerPolicy = 'strict-origin-when-cross-origin';
  iframe.setAttribute('allowfullscreen', '');
  wrap.appendChild(iframe);
  viewerMedia.appendChild(wrap);
};

const appendViewerImage = (src: string, title: string, index: number) => {
  if (!viewerMedia) return;
  const image = document.createElement('img');
  image.src = src;
  image.alt = `${title} — imagem ${index + 1}`;
  image.loading = 'lazy';
  viewerMedia.appendChild(image);
};

const closeViewer = () => {
  if (!viewer.classList.contains('is-open')) return;
  viewer.classList.remove('is-open');
  viewer.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('viewer-open');
  if (viewerMedia) viewerMedia.innerHTML = '';
  window.setTimeout(() => lastViewerTrigger?.focus(), reducedMotion ? 0 : 220);
};

const openViewer = (card: HTMLAnchorElement) => {
  if (!viewerMedia || !viewerTitle || !viewerEyebrow) return;
  const href = card.getAttribute('href') || '';
  const fallbackVimeo = href.match(/vimeo\.com\/(\d+)/)?.[1];
  const sourceImage = card.querySelector<HTMLImageElement>('img');
  const title = card.querySelector('strong')?.textContent?.trim() || sourceImage?.alt || 'Quasar Motion';
  const media = portfolioMedia[title] || {};
  const videos = media.videos || (fallbackVimeo ? [fallbackVimeo] : []);
  const images = media.images || (videos.length === 0 && sourceImage ? [sourceImage.currentSrc || sourceImage.src] : []);
  const eyebrow = card.querySelector('small')?.textContent?.trim() || (videos.length ? 'VIDEO' : 'PROJETO');

  viewerMedia.innerHTML = '';
  videos.forEach((videoId) => appendViewerVideo(videoId, title));
  images.forEach((src, index) => appendViewerImage(src, title, index));
  viewerTitle.textContent = title;
  viewerEyebrow.textContent = eyebrow;
  lastViewerTrigger = card;
  viewer.classList.add('is-open');
  viewer.setAttribute('aria-hidden', 'false');
  document.body.classList.add('viewer-open');
  viewerMedia.scrollTop = 0;
  viewerClose?.focus();
};

portfolioCards.forEach((card) => {
  const title = card.querySelector('strong')?.textContent?.trim() || '';
  const href = card.getAttribute('href') || '';
  const hasVideo = Boolean(portfolioMedia[title]?.videos?.length || href.match(/vimeo\.com\/(\d+)/));
  card.removeAttribute('target');
  card.removeAttribute('rel');
  card.setAttribute('aria-haspopup', 'dialog');

  if (hasVideo) {
    card.classList.add('video-capable');
    const indicator = document.createElement('span');
    indicator.className = 'card-play-indicator';
    indicator.setAttribute('aria-hidden', 'true');
    indicator.textContent = '▶';
    card.appendChild(indicator);
  }

  card.addEventListener('click', (event) => {
    event.preventDefault();
    openViewer(card);
  });
});

viewer.addEventListener('click', (event) => {
  const target = event.target as HTMLElement;
  if (target.closest('[data-viewer-close]')) closeViewer();
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && viewer.classList.contains('is-open')) closeViewer();
});

if (!reducedMotion && finePointer) {
  const cursor = document.querySelector<HTMLElement>('.ambient-cursor');
  window.addEventListener(
    'pointermove',
    (event) => {
      if (cursor) cursor.style.transform = `translate3d(${event.clientX}px, ${event.clientY}px, 0)`;
    },
    { passive: true },
  );

  document.querySelectorAll<HTMLElement>('.project, .service-grid a, .web-grid article, .vertical').forEach((card) => {
    card.addEventListener('pointermove', (event) => {
      const rect = card.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width;
      const y = (event.clientY - rect.top) / rect.height;
      card.style.setProperty('--px', `${x * 100}%`);
      card.style.setProperty('--py', `${y * 100}%`);
      card.style.setProperty('--rx', `${(0.5 - y) * 2.4}deg`);
      card.style.setProperty('--ry', `${(x - 0.5) * 2.4}deg`);
    });
    card.addEventListener('pointerleave', () => {
      card.style.removeProperty('--rx');
      card.style.removeProperty('--ry');
    });
  });

  const heroArt = document.querySelector<HTMLElement>('.hero-art');
  heroArt?.addEventListener('pointermove', (event) => {
    const rect = heroArt.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    heroArt.style.setProperty('--mx', `${x * 12}px`);
    heroArt.style.setProperty('--my', `${y * 12}px`);
  });
  heroArt?.addEventListener('pointerleave', () => {
    heroArt.style.setProperty('--mx', '0px');
    heroArt.style.setProperty('--my', '0px');
  });
}
