import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const html = await readFile(new URL("../vercel-dist/index.html", import.meta.url), "utf8");

test("production metadata targets quasarmotion.com.br", () => {
  assert.match(html, /<title>Quasar Motion — 3D, Motion, VFX, AI Video &amp; Websites<\/title>/i);
  assert.match(html, /name="description"/i);
  assert.match(html, /rel="canonical" href="https:\/\/quasarmotion\.com\.br\/"/i);
  assert.match(html, /property="og:image" content="https:\/\/quasarmotion\.com\.br\/assets\/quasar-hero-final\.webp"/i);
  assert.doesNotMatch(html, /Quasar Motion \| Preview/i);
});

test("production HTML has no temporary preview asset hosts", () => {
  assert.doesNotMatch(html, /quasar-preview-assets\.floot\.app/i);
  assert.doesNotMatch(html, /quasarmotion-site-final\.vercel\.app/i);
});

test("studio markup is fail-safe visible without JavaScript", () => {
  assert.match(html, /<section id="studio" class="studio reveal">/i);
  assert.doesNotMatch(html, /studio-armed/i);
});
