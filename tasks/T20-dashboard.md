# T20 — App: Visão geral (Dashboard)

- **Onda:** 2
- **Depende de:** T01, T02, T06 (programe contra contratos)
- **Leitura obrigatória:** `00-CONTEXTO.md` inteiro (atenção ao `.app-scope`: títulos peso 500, texto `#3a3a3c`)

## Posse

`src/pages/app/Dashboard.tsx`, `src/components/app/dashboard/{KpiRow.tsx,RevenueByChannel.tsx,RevenueTrend.tsx,AttentionList.tsx,UpcomingArrivals.tsx,TodayPanel.tsx}`.

## Dados
`getDashboardSummary()`, `getMetrics()`, `getReservations({ from: TODAY, to: addDays(TODAY, 14) })`, `getProperties()`, `getChannels()`. Use `useMock`. Cada bloco tem estado de carregamento com `Skeleton` do mesmo tamanho.

## Layout (≥1068px), gap 20px

```
PageHeader: h1 "Boa tarde, Ana." + subtitle "Sábado, 24 de outubro" | ação [Cadastrar imóvel]
[KPI][KPI][KPI][KPI]                                   (grid auto-fit minmax(200px,1fr))
[ Receita por canal (2fr) ][ Precisa de atenção (1fr) ]
[ Tendência 12 meses (2fr)  ][ Hoje (1fr)               ]
[ Próximas chegadas — tabela larga                       ]
```

- `PageHeader title="Boa tarde, Ana." subtitle="Sábado, 24 de outubro" actions={<Button href="/app/imoveis/novo">Cadastrar imóvel</Button>}`.

### KpiRow
4 `KpiCard`: "Receita de outubro" `formatBRL(revenueMonth)` delta `+12%` caption "vs. setembro"; "Ocupação" `formatPct` delta "4 p.p."; "Diária média" delta com `trend="down"` se negativo; "Avaliação média" `4,92` delta "0,04" caption "em 30 dias". Deltas vêm do summary.

### RevenueByChannel
Card app `bg-surface rounded-lg p-6`. Título `<h2>` 21px peso 500 "Receita por canal" + "Outubro" (ink-2) à direita. Lista de barras horizontais (não Recharts): grid `110px 1fr 90px`, nome / trilho 12px `bg-bg-alt rounded-pill` com preenchimento (`bg-verde` no maior, `bg-verde-strong/75` nos demais, largura proporcional) / valor `formatBRL` peso 500 alinhado à direita. Ordem decrescente. Barras animam a largura ao montar (respeitar reduced motion).

### AttentionList
Card "Precisa de atenção". Gere itens a partir dos dados: listings com `status: 'error'` (ChannelBadge error + `issue` + `Button variant="link" size="sm" href="/app/imoveis/<id>?aba=canais"` "Corrigir"), `pending` (ChannelBadge pending + "{imóvel} está em análise pelo canal. Prazo médio de 2 dias."), canais com `health: 'warning'|'error'`. Sem itens: `EmptyState title="Tudo em dia."`.

### RevenueTrend
Card "Receita nos últimos 12 meses". Recharts `AreaChart` responsivo (altura 240): área empilhada por canal agrupando Airbnb, Booking.com e "Outros"; cores `var(--verde)`, `var(--verde-strong)`, `var(--line-strong)` com opacidade 0.85; eixo X meses abreviados ("nov", "dez"…); eixo Y em "R$ 20 mil"; grade horizontal `var(--line)` tracejada; tooltip personalizado (card `bg-surface shadow-float rounded-md p-3 t-body-sm`) com total e por canal. Legenda própria embaixo. Forneça tabela `sr-only` com os mesmos dados.

### TodayPanel
Card "Hoje": linhas de agenda com hora em `t-caption text-ink-2` e texto `t-body-sm`: check-ins e check-outs de TODAY a partir das reservas (ex.: "15h Chegada — Família Moreira, Casa Trancoso"), limpezas derivadas dos check-outs (11h saída → 12h limpeza). Sem itens: "Nenhuma chegada ou saída hoje."

### UpcomingArrivals
Card com título "Próximas chegadas" + `Button variant="link" size="sm" href="/app/reservas"` "Ver todas as reservas". Tabela (shadcn `Table`) dentro de `overflow-x-auto`, `min-w-[640px]`: Hóspede (peso 500), Imóvel, Datas (`formatRange`, ink-2), Canal (`Badge neutral`), Valor (direita, peso 500). Próximas 6 reservas confirmadas/pendentes a partir de TODAY, ordenadas por check-in. Linha clicável? Não: o nome do hóspede é um link para `/app/reservas?id=<id>`.

## Responsivo
- < 1068px: tudo em uma coluna; KPIs 2×2; < 734px KPIs 1 por linha.

## Critérios de aceite
- [ ] Números batem com os mocks (mesma fonte).
- [ ] Skeletons durante carregamento, sem saltos de layout.
- [ ] Gráfico tem alternativa textual.
- [ ] Peso de fonte 500 nos títulos; nenhum texto em `#1d1d1f` puro (usa `--ink` do escopo).
- [ ] Typecheck, lint e build passam.
