function enforceLoop(frame: HTMLIFrameElement) {
  if (!frame.src.includes('player.vimeo.com/video/')) return;
  const url = new URL(frame.src, window.location.href);
  const required: Record<string, string> = {
    autoplay: '1',
    loop: '1',
    autopause: '0',
    title: '0',
    byline: '0',
    portrait: '0',
    badge: '0',
    dnt: '1',
  };
  const needsUpdate = Object.entries(required).some(([key, value]) => url.searchParams.get(key) !== value);
  if (!needsUpdate) return;
  Object.entries(required).forEach(([key, value]) => url.searchParams.set(key, value));
  frame.src = url.toString();
  frame.allow = 'autoplay; fullscreen; picture-in-picture';
}

function scan() {
  document.querySelectorAll<HTMLIFrameElement>('iframe[src*="player.vimeo.com/video/"]').forEach(enforceLoop);
}

const observer = new MutationObserver((mutations) => {
  for (const mutation of mutations) {
    for (const node of mutation.addedNodes) {
      if (!(node instanceof HTMLElement)) continue;
      if (node instanceof HTMLIFrameElement) enforceLoop(node);
      node.querySelectorAll?.<HTMLIFrameElement>('iframe[src*="player.vimeo.com/video/"]').forEach(enforceLoop);
    }
  }
});

observer.observe(document.documentElement, { childList: true, subtree: true });
scan();
