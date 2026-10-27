# T14 — Landing: "Feito para quem vive de temporada." (grade bento)

- **Onda:** 2
- **Depende de:** T01, T02, T03
- **Leitura obrigatória:** `00-CONTEXTO.md` inteiro
- **Skill sugerida:** `frontend-design`

## Objetivo

Grade de blocos de tamanhos diferentes (estilo "Explore os detalhes" da Apple) com gráficos e números vivos, mostrando os recursos do produto.

## Posse

`src/components/marketing/bento/{Bento.tsx,PriceChartTile.tsx,RatingTile.tsx,SyncTile.tsx,RevenueDonutTile.tsx,PhotosTile.tsx,SecurityTile.tsx,TeamTile.tsx}`. Export nomeado `Bento`.

## Layout
- `<section id="recursos" className="bg-bg py-36 px-4">`, `max-w-[1100px] mx-auto flex flex-col gap-12`.
- `<h2 className="t-section-xl text-center">Feito para quem<br/>vive de temporada.</h2>`.
- Grade `grid grid-cols-6 gap-5`; < 1068px: `grid-cols-2`; < 734px: `grid-cols-1` (cada tile ocupa a linha toda).
- Tiles `rounded-card p-8 sm:p-10`, fundo `bg-bg-alt` exceto SyncTile (`bg-surface-dark text-on-dark`). Todos entram com `RevealGroup` (stagger 0.08).

| Tile | Desktop | Tablet |
|---|---|---|
| PriceChartTile | col-span-4 row-span-2 (min-h 520) | col-span-2 |
| RatingTile | col-span-2 | col-span-1 |
| SyncTile | col-span-2 | col-span-1 |
| RevenueDonutTile | col-span-3 | col-span-2 |
| PhotosTile | col-span-3 | col-span-2 |
| SecurityTile | col-span-2 | col-span-1 |
| TeamTile | col-span-4 | col-span-1 |

## Conteúdo dos tiles

**PriceChartTile** — `<h3>` 28/32 semibold "Preço que acompanha a demanda." + `t-body text-ink-2 max-w-[46ch]` "Fins de semana e feriados sobem sozinhos. Dias parados ganham desconto. Você aprova antes."
Gráfico SVG próprio (não Recharts) `viewBox="0 0 600 260"`, `role="img"`, `aria-label="Gráfico da diária ao longo de novembro, com picos nos fins de semana e no feriado de 15 de novembro"`:
- Linhas de grade horizontais em y 80/150/220 (`stroke var(--line)`).
- 30 pontos (1–30 nov/2026): base 420; sex e sáb +110; `+ round(sin(d/3)*18)`; dia 15 = 690; dias 14 e 16 = 600. Escala y: `220 - (v-380)*0.6`. Linha `stroke var(--verde)` 3px com `stroke-linejoin round`; área abaixo `fill var(--verde-soft)`.
- Marcador no dia 15 (círculo 7px branco com borda verde) + balão escuro (`rect` 128×44 rx 10 `fill var(--surface-dark)`): "Feriado, 15 nov" (12px on-dark-2) e "R$ 690 por noite" (15px semibold branco).
- Eixo: "1 nov" e "30 nov".
- Animação ao entrar: a linha se desenha (`pathLength` 0→1, 1,2s) e o balão aparece no fim. Hover/foco no gráfico: uma régua vertical segue o mouse mostrando dia e preço (tooltip acessível via teclado com ←/→ quando o SVG tem foco, `tabIndex=0`).

**RatingTile** — 5 estrelas `fill-ouro` 22px no topo; embaixo `t-stat` "4,92" (com `CountUp` de 4,00 a 4,92) e `t-body-sm text-ink-2` "Sua nota média, somando as avaliações de todos os canais." Valor de `dashboardSummary.rating` se disponível.

**SyncTile** (escuro) — ícone de sincronizar (lucide `RefreshCw` 40px, girando 360° uma vez ao entrar); "Em segundos." display 40px semibold; "Reserva entrou num canal, a data fecha nos outros." (on-dark-2).

**RevenueDonutTile** — donut SVG `viewBox 0 0 42 42`, r 15.9, stroke 5: Airbnb 41% `var(--verde)`, Booking.com 29% `var(--verde-strong)`, Vrbo 13% `var(--ouro)`, Outros 17% `var(--line-strong)` (use `metrics` de out/2026 se disponível e recalcule %). Centro "R$ 48,9 mil" / "outubro". Ao lado: `<h3>` "Relatórios claros." e legenda (bolinha + nome + %). `role="img"` com `aria-label` listando os valores. Segmentos animam (`stroke-dasharray`) ao entrar.

**PhotosTile** — `<h3>` "Fotos uma vez." + `<span className="text-ink-2">No tamanho que cada canal pede.</span>`. Mosaico 4 colunas: 1 foto grande 2×2 e 4 pequenas (fotos reais da Casa da Lagoa via picsum, `rounded-[14px] aspect-square object-cover`), a última com overlay "+19". Ao passar o mouse, as fotos mostram por 1s rótulos de proporção ("16:9", "4:3", "1:1") como se fossem recortadas para cada canal.

**SecurityTile** — ícone cadeado (lucide `Lock`, 36px, `text-verde`), `<h3>` 21px "Suas senhas não passam por aqui." e "Você autoriza a conexão direto no site de cada canal e pode revogar quando quiser."

**TeamTile** — à esquerda `<h3>` "A equipe toda no mesmo painel." e "Limpeza, check-in e financeiro, cada um vendo só o que precisa."; à direita avatares sobrepostos (`Avatar` 48px com borda 3px `border-bg-alt`, margem -10px) de `getTeam()` (4 primeiros) + círculo "+1".

## Critérios de aceite
- [ ] Grade correta em desktop, tablet e mobile.
- [ ] Gráficos com descrição acessível e navegação por teclado no gráfico de preço.
- [ ] Animações uma vez, reduced motion desliga.
- [ ] Typecheck, lint e build passam.
