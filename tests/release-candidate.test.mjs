import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const read = (path) => fs.readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');
const exists = (path) => fs.existsSync(new URL(`../${path}`, import.meta.url));

test('release UI uses the requested website ordering and removes the large reel', () => {
  const html = read('index.html');
  assert.equal(html.includes('id="reel"'), false, 'large top reel must be removed');
  assert.match(html, /Logic Automação[\s\S]*WLobo[\s\S]*Calende/, 'website order must be Logic, WLobo, Calende');
});

test('Fried Canvas AI card uses optimized WebP and Vimeo 1227841926', () => {
  assert.equal(exists('src/main.ts'), true, 'release interaction source must exist');
  const html = read('index.html');
  const main = read('src/main.ts');
  assert.match(html, /Fried Canvas/);
  assert.match(html, /fried-canvas[^"']*\.webp/i);
  assert.match(main, /1227841926/);
  assert.match(main, /autoplay=1&loop=1/);
});

test('contact form submits on-site to a real Vercel API endpoint', () => {
  assert.equal(exists('api/contact.ts'), true, 'contact Vercel Function must exist');
  const html = read('index.html');
  const main = read('src/main.ts');
  const api = read('api/contact.ts');
  assert.match(html, /id="contactForm"/);
  assert.equal(html.includes('O envio abre seu aplicativo de e-mail'), false);
  assert.match(main, /\/api\/contact/);
  assert.equal(main.includes('mailto:'), false);
  assert.match(api, /RESEND_API_KEY/);
  assert.match(api, /contato@quasarmotion\.com\.br/);
});

test('release source contains current partner and contact polish', () => {
  assert.equal(exists('src/styles.css'), true, 'release stylesheet must exist');
  const html = read('index.html');
  const css = read('src/styles.css');
  assert.match(html, /contato@quasarmotion\.com\.br/);
  assert.match(html, /<strong>Lumos<\/strong>/);
  assert.match(html, /<strong>Fried Canvas<\/strong>/);
  assert.match(css, /card-play-indicator[\s\S]*left:\s*50%/);
  assert.match(css, /translate\(-50%,-50%\)/);
});
