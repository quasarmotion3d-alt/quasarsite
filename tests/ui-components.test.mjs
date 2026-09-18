import assert from "node:assert/strict";
import { readFile, readdir } from "node:fs/promises";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("..", import.meta.url));

async function readBuiltAsset(ext) {
  const dir = path.join(root, "vercel-dist", "assets");
  const files = await readdir(dir);
  const name = files.find(file => file.endsWith(ext));
  assert.ok(name, "expected built " + ext + " asset");
  return readFile(path.join(dir, name), "utf8");
}

test("AI video play button uses geometric centering without inset reset", async () => {
  const css = await readBuiltAsset(".css");
  const rule = css.match(/\.vertical\.video-capable\s+\.card-play-indicator\{[^}]*\}/i)?.[0] ?? "";
  assert.ok(rule);
  assert.match(rule, /(?:left:50%!important[^}]*top:50%!important|inset:50% auto auto 50%!important)/i);
  assert.match(rule, /translate\(-50%,-50%\)/i);
  assert.doesNotMatch(rule, /inset:(?:0|auto)!important/i);
});

test("studio motion is fail-safe and scroll-triggered", async () => {
  const js = await readBuiltAsset(".js");
  const css = await readBuiltAsset(".css");
  assert.match(js, /studio-motion-ready/);
  assert.ok(js.includes("0px 0px -28% 0px"));
  assert.match(css, /\.studio-motion-ready\.studio-play/);
});

test("contact form posts to the same-origin production API", async () => {
  const js = await readBuiltAsset(".js");
  assert.ok(js.includes("/api/contact"));
  assert.doesNotMatch(js, /quasar-motion-final-preview\.vercel\.app/);
});
