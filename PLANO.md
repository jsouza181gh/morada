# Plano — Hub de anúncios de imóveis (codinome "Morada")

> Nome provisório. Um painel onde o proprietário cadastra o imóvel **uma vez** e publica em Airbnb, Booking.com, Trivago, Vrbo, Decolar, etc. Calendário, preços e mensagens unificados.
> Fase 1: **só frontend** (Vite + React), dados mockados, foco em design.

---

## 1. Referência: apple.com/br/iphone-duo — o que foi observado

### Estrutura da página
1. **Global nav** fina (~44px), links pequenos (12px), cinza escuro, centralizada.
2. **Local nav sticky** em "pílula" flutuante: nome do produto à esquerda + botões "Explorar" (outline) e "Comprar" (azul) à direita. Fundo branco translúcido com blur.
3. **Hero**: eyebrow pequeno ("iPhone Duo") + headline enorme e curta ("Alô. Olá."), imagem do produto centralizada ocupando a viewport, barra flutuante inferior com preço + CTA.
4. **"Comece pelos destaques."** — carrossel horizontal de cards grandes (radius ~28px, fundo branco sobre seção cinza #f5f5f7), com controle de paginação em pílula (dots + play/pause) e link "Assistir ao vídeo ▷".
5. **Explorador interativo** ("Design dobrável"): lista vertical de pílulas à esquerda (ícone ⊕ + rótulo; a ativa expande e fica azul) e imagem do produto à direita que troca conforme a pílula.
6. **Seções de storytelling**: headline gigante, imagem full-width, parágrafo centralizado estreito (~60ch) com trechos em **negrito** destacando palavras-chave.
7. **Mídia em escala dramática**: imagens/vídeos que extrapolam o container, com animações ao rolar (scroll-driven, fade/scale).
8. **Grid de features** ("Na forma que seu dia pedir"): cards com título h3 17px + texto curto.
9. **Acessórios/cross-sell**: eyebrow + headline 2 linhas + texto + link azul "Comprar acessórios ›", grid de 2 cards cinza.
10. **FAQ em accordion**: perguntas 17px semibold, divisórias finas, chevron à direita.
11. **Footer** denso, cinza claro (#f5f5f7), texto 12px.

### Tokens extraídos (computed styles)
| Item | Valor |
|---|---|
| Fonte | SF Pro Display/Text (fallback Helvetica/Arial) |
| H2 seção | 48px / 600 / lh 1.08 / letter-spacing -0.003em |
| H2 card | 25.5px (≈28px) / 600 / lh 1.47 |
| H3 / corpo | 17px / 400–600 / lh 1.23 / ls -0.022em |
| Texto principal | #1d1d1f |
| Texto secundário | #6e6e73 |
| Fundos | #ffffff alternando com #f5f5f7 (e #fafafc) |
| Botão primário | bg #0071e3, texto branco, radius 980px, padding 11px 21px, 17px |
| Pílulas secundárias | radius 999px, padding 0 16px, 14px, outline |
| Cards | radius ~28px, sem sombra (contraste só por cor de fundo) |
| Seções | altura 800–2200px, padding vertical generoso (~120–160px) |

### Princípios de design
- **Uma ideia por tela**. Headline curta, muito espaço em branco.
- **Hierarquia por tamanho, não por cor**. Quase monocromático; cor só no CTA.
- **Alternância de fundo** (branco/cinza) separa seções em vez de bordas.
- **Movimento a serviço do conteúdo**: reveal ao rolar, carrosséis com autoplay pausável, troca suave de imagem.
- **Navegação sempre à mão**: local nav sticky com CTA permanente.
- Tipografia apertada (letter-spacing negativo) em títulos grandes.

---

## 2. Identidade visual adaptada (Apple × Palmeiras)

Manter a sobriedade da Apple; trocar o azul de ação pelo verde Palmeiras e usar verde escuro em seções "dark".

```css
:root {
  /* Marca */
  --verde-700: #006437;   /* verde Palmeiras — CTA primário */
  --verde-800: #004D2A;   /* hover / pressed */
  --verde-900: #0B2E1C;   /* seções dark, hero alternativo */
  --verde-100: #E6F2EC;   /* fundos de destaque, badges */
  --ouro-500:  #C9A646;   /* acento raro: estrelas, "Premium", conquistas */

  /* Neutros (herdados da Apple) */
  --ink:        #1d1d1f;
  --ink-2:      #6e6e73;
  --bg:         #ffffff;
  --bg-alt:     #f5f5f7;
  --line:       #d2d2d7;

  /* Forma */
  --radius-card: 28px;
  --radius-pill: 999px;
  --nav-h: 44px;
}
```
Regras: verde só em CTA, link, estado ativo e 1–2 seções dark por página. Dourado com parcimônia (≤ 3 usos por tela). Contraste: branco sobre #006437 = 7.4:1 (AA ok).

Fonte: SF Pro não pode ser distribuída → usar **Inter** (ou "Inter Tight" para títulos) via `@fontsource/inter`, stack `-apple-system, BlinkMacSystemFont, "Inter", sans-serif` (Mac usa SF nativa).

---

## 3. Stack

| Camada | Escolha |
|---|---|
| Build | Vite + React 19 + TypeScript |
| Estilo | Tailwind CSS v4 (tokens acima em `@theme`) |
| Componentes base | shadcn/ui (Accordion, Dialog, Tabs, Select, Calendar, Tooltip) |
| Animação | Motion (`motion/react`) — springs, scroll-linked, layout animations |
| Rotas | React Router v7 |
| Ícones | lucide-react + SVGs próprios dos logos de canais (placeholders neutros) |
| Gráficos (dashboard) | Recharts |
| Carrossel | Embla Carousel |
| Mock | arquivos JSON/TS em `src/mocks` + hooks `useMock*` com delay simulado (pronto para trocar por API) |
| Qualidade | ESLint, Prettier, Vitest + Testing Library (componentes críticos) |

---

## 4. Mapa de páginas

### Públicas (marketing — estilo página de produto Apple)
1. **`/` Landing**
   - Global nav + local nav sticky ("Morada" · Como funciona · Preços · [Entrar] [Começar grátis]).
   - Hero: eyebrow "Para anfitriões", headline "Um anúncio. Todos os lugares.", mockup do dashboard em notebook/celular, barra flutuante "A partir de R$ 49/mês · Começar".
   - **"Comece pelos destaques."** — carrossel de cards: Publique em 1 clique · Calendário sincronizado · Preço inteligente · Inbox unificada · Relatórios.
   - **Explorador interativo** "Seu imóvel, em todo lugar": pílulas à esquerda (Airbnb, Booking.com, Trivago, Vrbo, Decolar, Google Vacation Rentals); à direita, prévia do anúncio formatado para aquele canal.
   - **Storytelling dark (verde-900)**: "Chega de overbooking." + animação de calendários se fundindo em um.
   - **Como funciona** em 3 passos com números grandes (Cadastre → Conecte canais → Publique).
   - **Números** (mock): "+12 canais", "−80% tempo de gestão", "0 overbooking".
   - **Depoimentos** carrossel.
   - **Preços**: 3 planos (Essencial, Pro, Anfitrião+), card do meio destacado em verde.
   - **FAQ accordion**.
   - **CTA final** + footer denso.
2. **`/precos`** — tabela comparativa detalhada.
3. **`/como-funciona`** — versão longa do storytelling, scroll-driven.
4. **`/entrar`** e **`/cadastro`** — telas visuais apenas (sem auth real).

### App (área logada — mock)
Layout: sidebar colapsável (verde-900 ou branco) + topbar com busca e avatar.
5. **`/app` Dashboard** — KPIs (ocupação, receita do mês, diária média, avaliação), gráfico de receita por canal, próximas reservas, alertas de sincronização.
6. **`/app/imoveis`** — grid/lista de imóveis com foto, status por canal (badges com logo: publicado/pendente/erro).
7. **`/app/imoveis/novo`** — **wizard de cadastro** (núcleo do produto):
   1. Tipo e localização (mapa estático mock)
   2. Detalhes (quartos, banheiros, hóspedes, comodidades com chips)
   3. Fotos (drag-and-drop, reordenar, capa)
   4. Título e descrição (com contador por limite de cada canal)
   5. Preço e regras (diária, limpeza, mínimo de noites, check-in/out)
   6. **Canais**: toggles por plataforma + preview de como fica em cada uma
   7. Revisão e publicar → animação de "publicando em 6 canais" com checks sequenciais
8. **`/app/imoveis/:id`** — detalhe com tabs: Visão geral · Canais · Calendário · Preços · Fotos.
9. **`/app/calendario`** — multicalendário (linhas = imóveis, colunas = dias), reservas coloridas por canal, bloqueios manuais.
10. **`/app/reservas`** — tabela filtrável (canal, status, período) + drawer de detalhe.
11. **`/app/mensagens`** — inbox unificada (lista à esquerda, conversa à direita, ícone do canal de origem).
12. **`/app/canais`** — cards de integração (conectado/desconectado, última sincronização, botão "Conectar" abre modal mock).
13. **`/app/relatorios`** — gráficos por período e canal.
14. **`/app/configuracoes`** — perfil, plano, notificações.

---

## 5. Componentes (design system)

**Primitivos**: `Button` (primary verde pill, secondary outline pill, link com "›"), `Pill`, `Badge` (status + canal), `Card` (radius 28, variantes white/alt/dark), `Eyebrow`, `Headline` (xl/lg/md com letter-spacing negativo), `Section` (props `tone="white|alt|dark"`), `Container` (max 980px texto / 1260px mídia).

**Marketing**: `GlobalNav`, `LocalNavSticky` (blur, aparece após hero), `Hero`, `FloatingPriceBar`, `HighlightsCarousel` (Embla + paginação em pílula + play/pause), `PillExplorer` (pílulas + mídia sincronizada, troca com crossfade), `ScrollReveal` (wrapper Motion), `StatBlock`, `PricingCard`, `FaqAccordion`, `Footer`.

**App**: `Sidebar`, `Topbar`, `KpiCard`, `ChannelBadge`, `ChannelToggle`, `PropertyCard`, `Stepper` (wizard), `PhotoUploader`, `MultiCalendar`, `ReservationTable`, `InboxList`/`ChatThread`, `EmptyState`, `Skeleton`.

---

## 6. Dados mockados (`src/mocks`)

- `channels.ts` — id, nome, cor, logo, status de conexão, taxas.
- `properties.ts` — 8 imóveis (SP, RJ, Floripa, Gramado, Trancoso…), fotos (Unsplash URLs fixas), comodidades, preço, canais ativos.
- `reservations.ts` — ~60 reservas distribuídas em 90 dias, canal de origem, hóspede fictício, valor.
- `messages.ts` — 10 conversas.
- `metrics.ts` — séries mensais de receita/ocupação por canal.
- `plans.ts`, `faq.ts`, `testimonials.ts`.
- `api.ts` — funções `getProperties()` etc. retornando `Promise` com `setTimeout` 300–600ms (exercita skeletons e facilita trocar por backend depois).

---

## 7. Movimento e interação (regras)

- Reveal ao rolar: fade + translateY 24px, spring (stiffness ~120, damping ~20), uma vez por elemento.
- Headlines hero: escala sutil 0.96→1 ligada ao scroll.
- Local nav: aparece com fade quando hero sai da viewport.
- PillExplorer: pílula ativa expande com `layout` do Motion; mídia em crossfade 400ms.
- Carrossel: autoplay 5s, pausa em hover/foco, botão play/pause acessível.
- Publicação no wizard: lista de canais com checks em sequência (stagger 250ms).
- **`prefers-reduced-motion`**: desliga todas as animações de scroll e autoplay.

---

## 8. Responsividade e acessibilidade

- Breakpoints: 734px (mobile), 1068px (tablet), 1440px (desktop) — mesmos da Apple.
- Mobile: headlines 48→32px, PillExplorer vira carrossel horizontal de pílulas sobre a imagem, sidebar do app vira bottom sheet/drawer.
- Foco visível (anel verde 2px), navegação por teclado no carrossel, accordion e wizard.
- `alt` em todas as imagens, labels em formulários, contraste AA.
- Dark mode opcional no app (tokens já preparados).

---

## 9. Estrutura de pastas

```
src/
  app/            # rotas, layouts (MarketingLayout, AppLayout)
  pages/          # marketing/* e app/*
  components/
    ui/           # shadcn + primitivos
    marketing/
    app/
  mocks/
  hooks/
  lib/            # utils, formatters (moeda BRL, datas pt-BR)
  styles/         # globals.css com @theme (tokens)
  assets/
```

---

## 10. Fases de implementação

| Fase | Entrega | Critério de pronto |
|---|---|---|
| 0 | Setup: Vite, TS, Tailwind v4, shadcn, Motion, Router, ESLint/Prettier, fontes | `npm run dev` com página em branco e tokens carregados |
| 1 | Design system: primitivos + página `/styleguide` interna | Todos os botões, cards, tipografia e cores visíveis |
| 2 | Landing completa (seção a seção, na ordem do item 4.1) | Fiel ao ritmo Apple, responsiva, animações com reduced-motion |
| 3 | Mocks + camada `api.ts` | Hooks retornam dados com delay |
| 4 | App shell (sidebar, topbar) + Dashboard | KPIs e gráficos com mocks |
| 5 | Imóveis: lista, detalhe, **wizard de cadastro/publicação** | Fluxo completo navegável |
| 6 | Calendário multicanal + Reservas | Interações de filtro e drawer |
| 7 | Mensagens, Canais, Relatórios, Configurações | Telas navegáveis |
| 8 | Polimento: a11y, performance (lazy routes, imagens `loading=lazy`), Lighthouse ≥ 90 | Revisão visual final |

---

## 11. Skills recomendadas (skills.sh)

| Skill | Por quê | Instalação |
|---|---|---|
| **apple-design** (emilkowalski) | Exatamente a referência: interfaces fluidas estilo Apple traduzidas para web (springs, gestos, momentum) | `npx skills add https://github.com/emilkowalski/skills --skill apple-design` |
| **frontend-design** (anthropics) | Direção estética forte, evita visual genérico de IA | `npx skills add https://github.com/anthropics/skills --skill frontend-design` |
| **web-design-guidelines** (vercel-labs) | Checklist de UI/a11y/UX para revisar telas | `npx skills add https://github.com/vercel-labs/agent-skills --skill web-design-guidelines` |
| **vercel-react-best-practices** (vercel-labs) | Padrões de performance React | `npx skills add https://github.com/vercel-labs/agent-skills --skill vercel-react-best-practices` |
| **shadcn** (shadcn-ui) | Uso correto dos componentes base | `npx skills add https://github.com/shadcn-ui/ui --skill shadcn` |
| **high-end-visual-design** / **design-taste-frontend** (leonxlnx) | Refinamento de "gosto" visual premium | `npx skills add https://github.com/leonxlnx/taste-skill --skill high-end-visual-design` |
| **tailwind-design-system** (wshobson) | Tokens e design system em Tailwind | `npx skills add https://github.com/wshobson/agents --skill tailwind-design-system` |
| **emil-design-eng** / **review-animations** (emilkowalski) | Engenharia de animação e revisão de motion | `npx skills add https://github.com/emilkowalski/skills --skill review-animations` |
| **impeccable** (pbakaus) — opcional | Comandos de polimento (`audit`, `critique`, `animate`, `colorize`) | `npx skills add https://github.com/pbakaus/impeccable --skill impeccable` |

Prioridade mínima: **apple-design + frontend-design + web-design-guidelines + shadcn**.
Comandos copiados do padrão exibido no skills.sh; confirmar repositório antes de instalar.

---

## 12. Status da execução (2026-10-25)

- Fase 1 implementada em `morada-web/` seguindo as tasks de `tasks/` (T00–T30, todas concluídas). `typecheck`, `lint`, `test` (45) e `build` passam.
- Mudanças em relação a este plano:
  - Lint: oxlint (template atual do Vite), não ESLint.
  - Números do produto vêm dos mocks: receita de outubro ≈ R$ 131 mil (não R$ 48 mil dos mockups).
  - Telas internas com texto `#3a3a3c` e títulos peso 500 (pedido do cliente).
  - Landing ampliada em relação ao item 4.1 (pedido do cliente): destaques em carrossel, explorador com celular, bento de recursos, antes/depois, app, preços com mensal/anual. Sem depoimentos e sem números de mercado inventados.
- **Pendências abertas:** ver `tasks/02-PENDENCIAS.md` (P01–P11, com prioridade, arquivos e critério de aceite).

## 13. Fora do escopo da fase 1
Backend, autenticação real, integrações reais com APIs dos canais (Airbnb/Booking exigem parceria/Channel Manager homologado), pagamentos, upload real de fotos.
