# 02 — Pendências após a fase 1 (registradas em 2026-10-25, depois da T30)

Estado: T00–T30 concluídas. `typecheck`, `lint`, `test` (45) e `build` passam.
Cada item abaixo é uma task independente, no mesmo formato das anteriores: leia `00-CONTEXTO.md` antes. Itens marcados **[paralelo]** não compartilham arquivos entre si e podem rodar ao mesmo tempo.

| ID | Prioridade | Título | Origem |
|---|---|---|---|
| P01 | Alta | Desempenho da landing no mobile (78 → ≥ 90) | T30 / T00 / T05 |
| P02 | Média | Duas seções cinza seguidas na landing | T30 / T11 / T12 |
| P03 | Média | Blocos do calendário cobrindo as células | T30 / T23 |
| P04 | Média | Conectar/desconectar canal não persiste | T26 / T02 |
| P05 | Média | Campos do cadastro que não existem no tipo `Property` | T22 / T02 |
| P06 | Baixa | Cores fora dos tokens | T30 / T16 / T04 |
| P07 | Baixa | Tema escuro do app vaza para o site público | T06 / T30 |
| P08 | Baixa | Alvos de toque pequenos no mobile | T30 / T20 / T21 / T17 |
| P09 | Baixa | Padronizar `document.title` | T30 |
| P10 | Baixa | `theme-color` | T30 / T00 |
| P11 | — | Verificações que não foram feitas | T30 |

---

## P01 — Desempenho da landing no mobile
- **Problema:** Lighthouse mobile da landing = 78 (meta ≥ 90). FCP 3,5s, LCP 4,1s, TBT 120ms, CLS 0,012. Desktop = 99.
- **Causa medida:** cadeia `index` → rota lazy → `MarketingLayout` → `Landing` carrega ~190 KB gz de JS antes do primeiro conteúdo; chunk `ui` 301 KB e `index` 286 KB (sem gzip).
- **Arquivos:** `vite.config.ts`, `src/router.tsx`, `src/main.tsx`, `index.html`, possivelmente `src/pages/marketing/Landing.tsx`.
- **O que fazer:**
  1. Rodar `npx vite-bundle-visualizer` (ou `rollup-plugin-visualizer` temporário) e listar o que entra no chunk inicial.
  2. `build.rollupOptions.output.manualChunks`: separar `recharts` (só app), `embla-carousel`, `motion`, Radix/shadcn.
  3. Tirar o `lazy` da rota `/` e do `MarketingLayout` (import direto) para eliminar uma cascata; manter `lazy` nas demais.
  4. `<link rel="modulepreload">` para o chunk da landing; `fetchpriority="high"` na primeira imagem do hero (se houver) e `font-display: swap` já está nas fontes, mas pré-carregar Inter 400/600 e Inter Tight 600 (`<link rel="preload" as="font" crossorigin>`).
  5. Seções abaixo da dobra (`Bento`, `BeforeAfter`, `FeatureGrid`, `Steps`, `AppShowcase`, `PricingSection`, `Faq`, `FinalCta`) com `React.lazy` + `Suspense` e fallback de altura fixa (evitar CLS).
- **Aceite:** Lighthouse mobile da landing ≥ 90 em 3 execuções no `npm run preview`; CLS ≤ 0,05; nenhuma regressão de acessibilidade (100).

## P02 — Duas seções cinza seguidas na landing **[paralelo]**
- **Problema:** `Highlights` (`bg-bg-alt`) é seguida por `ChannelExplorer` (`bg-bg-alt` com painel branco). Quebra a regra de alternar fundos.
- **Arquivos:** `src/components/marketing/explorer/ChannelExplorer.tsx`, `ExplorerList.tsx`, `ListingPreview.tsx`.
- **O que fazer:** mudar a seção do explorador para `bg-bg` e o painel interno para `bg-bg-alt`; ajustar o cartão da pílula ativa (hoje `bg-bg-alt`) para `bg-surface`, e fundos internos do celular que dependiam do contraste.
- **Aceite:** sequência da landing alterna branco/cinza (exceto seções escuras); contraste AA mantido.

## P03 — Blocos do calendário cobrindo as células **[paralelo]**
- **Problema:** Lighthouse aponta `target-size`: as células-botão ficam parcialmente sob os blocos de reserva; dias livres vizinhos a reservas ficam difíceis de tocar.
- **Arquivos:** `src/components/app/calendar/TimelineRow.tsx`, `ReservationBlock.tsx`, `TimelineGrid.tsx`.
- **O que fazer:** células livres só recebem foco/clique onde não há bloco (`pointer-events: none` nas células ocupadas e desabilitar seleção nelas), ou reduzir a camada de blocos para não cobrir meio-dia livre; garantir área mínima 24×24px por alvo.
- **Aceite:** Lighthouse `/app/calendario` acessibilidade 100; clicar num dia livre ao lado de uma reserva seleciona o dia certo.

## P04 — Conectar/desconectar canal não persiste **[paralelo]**
- **Problema:** em `/app/canais`, o estado conectado/desconectado é local da página e some ao trocar de rota; o wizard (T22) também simula conexão só localmente.
- **Arquivos:** `src/mocks/api.ts`, `src/pages/app/Channels.tsx`, `src/components/app/channels/*`, `src/components/app/wizard/steps/StepChannels.tsx`.
- **O que fazer:** adicionar em `api.ts` `setChannelConnected(id: ChannelId, connected: boolean): Promise<Channel>` (estado do módulo) e `syncChannel(id)` (atualiza `lastSyncAt`); usar nas duas telas; o cabeçalho "N de 6 conectados" passa a refletir o estado do mock.
- **Aceite:** desconectar o Vrbo, ir ao dashboard e voltar: continua desconectado; o wizard mostra o Vrbo como "Conectar".

## P05 — Campos do cadastro fora do tipo `Property` **[paralelo]**
- **Problema:** rua, número, complemento, CEP, camas, "permite festas" e "proibido fumar" existem só no rascunho do wizard e não vão para o imóvel criado.
- **Arquivos:** `src/mocks/types.ts` (contrato), `src/mocks/properties.ts`, `src/mocks/api.ts`, `src/components/app/wizard/*`, `src/components/app/properties/tabs/OverviewTab.tsx`.
- **O que fazer:** estender `Property` com `address: { cep; street; number; complement? }`, `beds: number`, `rules: { pets: boolean; parties: boolean; smoking: boolean }` (atualizar o `00-CONTEXTO.md` item 8 junto); preencher os 7 imóveis; `createProperty` grava os campos; a aba Visão geral exibe regras e endereço resumido (bairro e cidade; endereço completo só depois da reserva).
- **Aceite:** imóvel criado pelo wizard mostra camas e regras no detalhe; testes da T02 atualizados.

## P06 — Cores fora dos tokens **[paralelo]**
- **Problema:** selo "Mais escolhido" usa `text-[#3a2c05]` sobre `bg-ouro` (T16); `LaptopFrame` usa cinzas hex na base (T04); bezel `#1d1d1f` e `#3a3a3c` são exceções previstas.
- **Arquivos:** `src/styles/tokens.css` (novo token `--on-ouro`), `src/styles/globals.css` (`--color-on-ouro`), `src/components/marketing/pricing/PlanCard.tsx`, `src/components/mockups/LaptopFrame.tsx`.
- **O que fazer:** criar `--on-ouro: #3a2c05` (claro e escuro) e usar `text-on-ouro`; criar `--device-metal`/`--device-metal-2` para a base do notebook.
- **Aceite:** `grep -rE "#[0-9a-fA-F]{3,6}" src --include=*.tsx` só retorna `#1d1d1f` e `#3a3a3c` das molduras.

## P07 — Tema escuro vaza para o site público **[paralelo]**
- **Problema:** `data-theme="dark"` fica no `<html>` ao sair do app para a landing.
- **Decisão pendente (perguntar ao cliente):** (a) site público sempre claro; ou (b) site segue o tema escolhido. Recomendação: (a), porque os mockups aprovados do site são claros.
- **Arquivos:** `src/lib/theme.ts`, `src/layouts/MarketingLayout.tsx`.
- **O que fazer (opção a):** `MarketingLayout` força `data-theme="light"` ao montar e restaura a preferência do app ao desmontar; `AppLayout` reaplica a preferência salva.
- **Aceite:** escolher escuro no app, abrir `/`: site claro; voltar ao app: escuro.

## P08 — Alvos de toque pequenos no mobile **[paralelo]**
- **Problema:** links de texto com ~17–20px de altura nas listas do dashboard e de imóveis; switches decorativos 51×31 no mockup de `/como-funciona` acusados pelo Lighthouse.
- **Arquivos:** `src/components/app/dashboard/{AttentionList,UpcomingArrivals}.tsx`, `src/components/app/properties/{PropertyCard,PropertyRow}.tsx`, `src/components/marketing/how/ChapterMockups.tsx`.
- **O que fazer:** links em listas com `py-2.5 -my-2.5` (área ≥ 44px sem mudar o visual) ou `min-h-11 inline-flex items-center`; no mockup, garantir `inert` + `aria-hidden` no bloco decorativo para sair da auditoria.
- **Aceite:** nenhuma ocorrência de `target-size` no Lighthouse dessas rotas.

## P09 — Padronizar `document.title` **[paralelo]**
- **Arquivos:** `src/pages/marketing/{Pricing,HowItWorks,Login,Signup}.tsx`.
- **O que fazer:** trocar o `document.title = …` manual por `useDocumentTitle` (`src/hooks/useDocumentTitle.ts`).
- **Aceite:** nenhum `document.title =` fora do hook.

## P10 — `theme-color` **[paralelo]**
- **Arquivo:** `index.html`.
- **O que fazer:** `<meta name="theme-color" content="#ffffff" media="(prefers-color-scheme: light)">` e `content="#0b0f0d"` para dark (a barra do navegador segue o fundo, como na Apple).
- **Aceite:** meta válida nos dois esquemas.

## P11 — Verificações que não foram feitas
Não são correções, são conferências pendentes (fazer com o app aberto no navegador):
- Comparar cada tela com os mockups aprovados (https://claude.ai/artifact/5QAY5xtY7af2VNQVnR6cn9), lado a lado.
- Navegação completa só por teclado em todos os fluxos (carrossel, explorador, FAQ, preços, login, cadastro, wizard inteiro, calendário, reservas, mensagens).
- Leitor de tela (NVDA no Windows): landing, wizard e calendário.
- Wizard percorrido no navegador até o passo Canais e a publicação; arrastar fotos com mouse e toque reais; rascunho restaurado após recarregar.
- Carrossel: arrasto real por toque e mouse; `prefers-reduced-motion` no DevTools em todas as animações.
- Animação do `CalendarMerge` (células caindo na linha Morada) alinhada visualmente.

## Fora do escopo do frontend (registrado para a fase com backend)
- Integração real com os canais (exige parceria/Channel Manager homologado em cada plataforma).
- Autenticação real, upload real de fotos, pagamentos, persistência de dados.
- Números do produto: os mocks dão receita de outubro ≈ R$ 131 mil para 7 imóveis (os R$ 48 mil dos mockups eram ilustrativos e foram descartados por não baterem com as reservas).
