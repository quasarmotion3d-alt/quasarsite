# Quasar Motion Finalização Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Consolidar as alterações visuais de 17/09/2026 e preparar um formulário de contato real antes de promover a versão para `main`.

**Architecture:** Manter a página React atual intacta e aplicar a finalização por uma camada cliente pequena importada pelo entrypoint da Vercel. O formulário usa `POST /api/contact`, implementado como Vercel Function, e envia via Resend com segredo somente no ambiente.

**Tech Stack:** React 19, Vite 8, TypeScript, Vercel Functions, Resend HTTP API.

**Spec:** Solicitações do cliente no chat de 17/09/2026.

## Global Constraints

- Não alterar `main` sem validação do preview.
- Destinatário: `contato@quasarmotion.com.br`.
- Thumb Fried Canvas: WebP otimizado do arquivo fornecido.
- Vídeos novos: autoplay + loop até o viewer ser fechado.
- Ordem de websites: Logic Automação, WLobo, Calende.

---

### Task 1: Finalização visual

**Files:**
- Create: `app/finalization.css`
- Create: `app/finalization.ts`
- Modify: `vercel-main.tsx`

- [x] Remover reel grande e texto auxiliar de exploração.
- [x] Reordenar websites.
- [x] Inserir Quasar Motion e Fried Canvas em AI Video.
- [x] Centralizar play e aplicar gradiente azul/violeta.
- [x] Remover escurecimento de thumbnails.
- [x] Ajustar transparência do header e escala do logo.
- [x] Atualizar parceiros Lumos e Fried Canvas.

### Task 2: Formulário real

**Files:**
- Create: `api/contact.ts`
- Create: `.env.example`

- [x] Validar nome, e-mail e mensagem.
- [x] Adicionar honeypot antispam.
- [x] Enviar via Resend usando `RESEND_API_KEY`.
- [x] Retornar mensagens de sucesso/erro para a UI.
- [ ] Configurar `RESEND_API_KEY` e `CONTACT_FROM_EMAIL` na Vercel após validar domínio de envio.

### Task 3: Validação e promoção

- [x] Criar branch `site-2026-09-17-finalizacao`.
- [x] Confirmar build da Vercel no head da branch.
- [x] Abrir PR draft contra `main`.
- [ ] Validar visualmente o preview da Vercel.
- [ ] Testar envio real após configurar segredo.
- [ ] Somente então promover para `main`.
