# Quasar Vercel Release Candidate Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Prepare a non-production Vercel-ready release candidate that matches the validated 2026-09-17 preview, fixes Fried Canvas media behavior, and replaces the mailto form with a real Resend-backed contact endpoint.

**Architecture:** Preserve the current Vite deployment model, but make the release branch use the validated static preview source as the browser UI. Add a Vercel Function at `/api/contact` for server-side validation and Resend delivery. Keep production `main` untouched until explicit promotion.

**Tech Stack:** Vite, TypeScript, Vercel Functions, Resend HTTP API, Vimeo embeds.

**Spec:** User-approved preview state from 2026-09-17 and current task conversation.

## Global Constraints

- Do not modify `main`.
- Contact destination is `contato@quasarmotion.com.br`.
- Fried Canvas project name must be `Fried Canvas` and use Vimeo `1227841926`.
- Fried Canvas card uses the optimized WebP thumbnail and centered play control.
- Vimeo viewer uses autoplay and loop until the viewer closes.
- Header is slightly more transparent; thumbnails do not darken.
- Website card order is Logic Automação, WLobo, Calende.
- Large top reel is removed.
- Contact form must submit on-site, never rely on `mailto:`.
- `RESEND_API_KEY` must be server-only.

---

### Task 1: Release-branch regression tests

**Files:**
- Create: `tests/release-candidate.test.mjs`

**Interfaces:**
- Consumes: built HTML/source files.
- Produces: assertions for requested copy, order, Fried Canvas media, and real contact form plumbing.

- [ ] Write tests that fail against the current branch because the release source and contact endpoint do not exist yet.
- [ ] Run `node --test tests/release-candidate.test.mjs` and verify failure is due to missing release behavior.
- [ ] Commit the failing tests.

### Task 2: Port the validated preview UI

**Files:**
- Modify: `index.html`
- Create: `src/main.ts`
- Create: `src/styles.css`
- Modify: `package.json`
- Modify: `vite.vercel.config.ts`

**Interfaces:**
- Consumes: static assets under `public/assets` plus externally hosted optimized Fried Canvas WebP assets.
- Produces: the validated browser UI and Vimeo viewer behavior.

- [ ] Replace the old React entry page with the validated preview markup.
- [ ] Add the validated DOM interaction code, including centered play button and autoplay+loop viewer.
- [ ] Add the validated CSS refinements.
- [ ] Run tests and build until green.
- [ ] Commit the UI port.

### Task 3: Real contact endpoint

**Files:**
- Create: `api/contact.ts`
- Modify: `src/main.ts`
- Modify: `index.html`
- Modify: `src/styles.css`

**Interfaces:**
- Consumes: JSON `{name,email,message,website}` and server env `RESEND_API_KEY`.
- Produces: POST `/api/contact` with validation, Resend delivery, visible success/error states.

- [ ] Extend tests for backend route/source contract and failure-visible UI.
- [ ] Verify tests fail before endpoint implementation.
- [ ] Implement server validation, honeypot, Resend API call, and frontend POST state handling.
- [ ] Run tests and build until green.
- [ ] Commit contact backend.

### Task 4: Vercel release readiness

**Files:**
- Modify: `vercel.json` only if needed.
- Modify: `README.md` with release instructions and required `RESEND_API_KEY`.

**Interfaces:**
- Consumes: branch build.
- Produces: a Vercel preview/release candidate that can later be promoted to production.

- [ ] Verify `npm run build` succeeds.
- [ ] Verify GitHub/Vercel deployment status for the release branch.
- [ ] Verify `main` remains unchanged.
- [ ] Document the one remaining environment requirement: `RESEND_API_KEY` in Vercel Preview/Production.
- [ ] Commit release documentation.
