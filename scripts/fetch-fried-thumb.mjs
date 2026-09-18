import { mkdir, writeFile } from 'node:fs/promises';

const source = 'https://quasar-motion-preview-0n0g1e.v2.appdeploy.ai/resources/fried-canvas-thumb-final.png';
const target = new URL('../public/assets/fried-canvas-thumb.png', import.meta.url);

const response = await fetch(source);
if (!response.ok) {
  throw new Error(`Failed to fetch Fried Canvas thumbnail: ${response.status} ${response.statusText}`);
}

await mkdir(new URL('../public/assets/', import.meta.url), { recursive: true });
await writeFile(target, Buffer.from(await response.arrayBuffer()));
console.log('Fried Canvas thumbnail prepared for Vercel build.');
