import assert from "node:assert/strict";
import test from "node:test";

const brandedDocumentMeta = [
  /<title>QUASAR MOTION COMPANY — 3D, Websites &amp; AI Video<\/title>/i,
  /<meta(?=[^>]*\bname=["']description["'])(?=[^>]*\bcontent=["']Produtora criativa brasileira especializada em 3D, websites e AI Video\.?["'])[^>]*>/i,
];

test("renders branded document metadata", async () => {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  const response = await worker.fetch(
    new Request("http://localhost/", {
      headers: { accept: "text/html" },
    }),
    {
      ASSETS: {
        fetch: async () => new Response("Not found", { status: 404 }),
      },
    },
    {
      waitUntil() {},
      passThroughOnException() {},
    },
  );

  assert.equal(response.status, 200);
  assert.match(
    response.headers.get("content-type") ?? "",
    /^text\/html\b/i,
  );
  const html = await response.text();
  for (const expectedMeta of brandedDocumentMeta) {
    assert.match(html, expectedMeta);
  }
});
