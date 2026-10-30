# Morada — hub de anúncios para aluguel por temporada

**Demo:** https://jsouza181gh.github.io/morada/

O anfitrião cadastra o imóvel uma vez e publica em vários canais (Airbnb, Booking.com, Vrbo, Trivago, Decolar, Expedia), com calendário, preços e mensagens unificados.

Fase atual: **só frontend**, com dados mockados (sem backend e sem autenticação real). Os mocks ficam atrás de uma camada `api` com hooks, pronta para trocar por uma API real.

## Como foi construído

Do zero ao deploy em **1 dia**, orquestrando **agentes de IA (Claude Code) em paralelo**:

- **Planejamento** em [`PLANO.md`](PLANO.md): referência visual, tokens de design, stack e mapa de páginas.
- **23 tarefas** em [`tasks/`](tasks/), executadas em **4 ondas** com **até 15 agentes ao mesmo tempo** no mesmo checkout.
- **Contrato compartilhado** ([`tasks/00-CONTEXTO.md`](tasks/00-CONTEXTO.md)) lido por toda tarefa: stack, comandos, estrutura de pastas e regras para agentes simultâneos.
- **Posse de arquivos por tarefa** e grafo de dependências em [`tasks/01-ORQUESTRACAO.md`](tasks/01-ORQUESTRACAO.md), para os agentes não editarem os mesmos arquivos.
- Regra do contrato: toda tarefa termina com typecheck, lint e build passando; uma tarefa final faz o QA.

## Páginas (15)

- **Marketing:** landing, preços, como funciona, entrar, cadastro.
- **App:** dashboard, imóveis, detalhe do imóvel, cadastro em etapas, calendário multicanal, reservas, mensagens, canais, relatórios, configurações.

## Stack

React 19 · TypeScript (strict) · Vite · Tailwind CSS v4 · shadcn/ui (Radix) · Motion · React Router 7 · Recharts · Embla Carousel · Vitest + Testing Library · oxlint · deploy no GitHub Pages via GitHub Actions.

## Rodar

```bash
cd morada-web
npm install
npm run dev      # desenvolvimento
npm run test     # testes
npm run build    # build de produção
```
