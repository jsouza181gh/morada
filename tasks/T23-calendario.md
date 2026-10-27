# T23 — App: Calendário multicanal

- **Onda:** 2
- **Depende de:** T01, T02, T06
- **Leitura obrigatória:** `00-CONTEXTO.md` inteiro

## Posse

`src/pages/app/Calendar.tsx`, `src/components/app/calendar/{TimelineGrid.tsx,TimelineRow.tsx,ReservationBlock.tsx,CalendarToolbar.tsx,BlockDatesDialog.tsx,ReservationPopover.tsx,Legend.tsx,useTimeline.ts}`.

## Objetivo

Visão "linha do tempo": linhas = imóveis, colunas = dias. Reservas de todos os canais aparecem como blocos. É a prova visual de "um calendário só".

## Dados
`getProperties()`, `getReservations({ from, to })` do período visível. Filtro opcional `?imovel=<id>` (destaca a linha e rola até ela).

## Toolbar (`CalendarToolbar`)
- `PageHeader title="Calendário" subtitle="Todos os canais num só lugar. Sincronizado há 1 min."`.
- Controles: `IconButton` ‹ e › (anterior/próximo período), botão "Hoje", rótulo do período ("24 out a 6 nov"), `SegmentedControl` "2 semanas" | "Mês", filtro de canal (`Select`: Todos os canais + 6), `Button variant="secondary" size="sm"` "Bloquear datas".
- Estado (início do período, visão, canal) na URL.

## Grade (`TimelineGrid`)
- Card `bg-surface rounded-lg` com `overflow-x-auto`; conteúdo `min-w-[980px]` (2 semanas) ou `min-w-[1600px]` (mês).
- Coluna fixa de imóveis (sticky left, 180px, `bg-surface` com sombra à direita ao rolar): nome (peso 500, truncado) e cidade (`t-caption text-ink-2`), link para o imóvel.
- Cabeçalho sticky top: dia da semana abreviado ("sáb") e número; hoje em `text-verde` com coluna inteira `bg-verde-soft`; fins de semana `bg-bg-alt`.
- Linhas 68px com `border-b border-line`; células com `border-l border-line`.
- Blocos (`ReservationBlock`), posicionados via CSS grid (`grid-column: start / span n`), altura 44px, raio 10px, `px-2.5`, duas linhas truncadas: hóspede (13px 500) e canal (12px):
  - confirmada: `bg-verde text-on-verde`;
  - pendente de pagamento: `bg-verde-soft text-ink ring-1 ring-inset ring-verde`;
  - bloqueio: hachurado `repeating-linear-gradient(135deg, var(--bg-alt) 0 6px, var(--line) 6px 8px)` `text-ink-2`, texto "Fechado" + nota;
  - cancelada: não aparece.
  - Reservas que começam antes ou terminam depois do período ficam cortadas com borda reta no lado cortado e seta "‹"/"›".
  - Check-out no meio do dia: o bloco termina na metade da última coluna e o seguinte pode começar na metade (visual de "virada"): implemente com grade de meio-dias (2 subcolunas por dia).
  - Cada bloco é um `<button>` com `aria-label="Marina Costa, Airbnb, 25 a 28 out, confirmada"` que abre `ReservationPopover` (shadcn Popover): hóspede, canal, datas, noites, hóspedes, valor, status e link "Ver reserva ›" (`/app/reservas?id=`).
- Selecionar intervalo vazio: arrastar com o mouse numa linha (ou Shift+setas com foco numa célula) seleciona dias livres e abre `BlockDatesDialog` com datas preenchidas.
- Teclado: as células de cada linha formam um grid navegável (setas), Enter abre a criação de bloqueio.

## BlockDatesDialog
- Campos: Imóvel (`Select`), De / Até (inputs `type=date` restritos ao período ≥ TODAY), Motivo (`Select`: Manutenção, Uso próprio, Outro) e Observação. Botão "Bloquear datas" chama `blockDates`; sucesso → fecha, toast "Datas bloqueadas em todos os canais." e o bloco aparece; erro de sobreposição → mensagem no dialog.

## Legenda
Abaixo do card: amostras "Reserva confirmada", "Aguardando pagamento", "Bloqueado por você".

## Mobile (< 734px)
- Troca para visão em **lista por dia**: seletor de imóvel no topo e lista de dias (do período) com as reservas de cada dia em cartões; o mesmo popover/sheet para detalhes.

## Critérios de aceite
- [ ] Bate com o mockup "App — Calendário".
- [ ] Navegação de período e visões funcionam; URL reflete estado.
- [ ] Criar bloqueio funciona e impede sobreposição.
- [ ] Rolagem horizontal só dentro do card; coluna de imóveis e cabeçalho grudados.
- [ ] Typecheck, lint e build passam.
