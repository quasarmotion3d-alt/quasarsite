# Quasar Motion

Site da Quasar Motion.

## Release candidate 2026-09-17

A branch `release/quasar-site-2026-09-17` contém a versão candidata preparada para Vercel. A `main` permanece intacta até promoção explícita.

### Incluído

- ordem de websites: Logic Automação → WLobo → Calende;
- reel grande do topo removido;
- header mais transparente e logo levemente maior;
- thumbnails sem escurecimento artificial;
- play azul/ciano/violeta centralizado;
- viewer Vimeo com autoplay + loop e encerramento ao fechar;
- AI Video `Fried Canvas` usando Vimeo `1227841926` e thumbnail WebP otimizada;
- parceiros Lumos e Fried Canvas corrigidos;
- e-mail `contato@quasarmotion.com.br` com ícone/hover;
- formulário real via `POST /api/contact`, sem `mailto:` para envio;
- validação server-side, honeypot e estados visuais de envio/sucesso/erro;
- favicon e metadados para `quasarmotion.com.br`.

### Vercel / Resend

Antes de promover esta branch para produção, configure na Vercel a variável de ambiente server-only:

`RESEND_API_KEY`

O domínio `quasarmotion.com.br` também precisa estar validado no Resend para que o remetente `Quasar Motion <contato@quasarmotion.com.br>` possa enviar normalmente.

Depois disso, faça um envio real pelo formulário no preview da Vercel e confirme o recebimento em `contato@quasarmotion.com.br` antes de promover a branch para `main`.

### Verificação

O comando de build executa primeiro os testes da release:

```bash
npm run build
```

Equivale a:

```bash
npm run test:release && vite build --config vite.vercel.config.ts
```
