# T24 — App: Reservas (tabela filtrável + detalhe em painel lateral)

- **Onda:** 2
- **Depende de:** T01, T02, T06
- **Leitura obrigatória:** `00-CONTEXTO.md` inteiro
- **Skill sugerida:** `shadcn` (Table, Sheet, Select)

## Posse

`src/pages/app/Reservations.tsx`, `src/components/app/reservations/{ReservationFilters.tsx,ReservationTable.tsx,ReservationSheet.tsx,StatusBadge.tsx,ReservationsSummary.tsx}`.

## Dados
`getReservations()` (todas), `getProperties()`, `getConversations()` (para o link de conversa).

## Página
- `PageHeader title="Reservas"` + ação `Button variant="secondary"` "Exportar CSV" (gera CSV das linhas filtradas no cliente e baixa via `Blob` + `a[download]`, nome `reservas-morada.csv`).
- `ReservationsSummary`: 4 números pequenos em linha (`t-body-sm`): "Próximos 30 dias: 18 reservas", "R$ 31.240 a receber", "3 aguardando pagamento", "1 cancelada no mês" — calculados dos dados filtrados por período padrão.
- `ReservationFilters` (estado na URL): busca por hóspede, período (`Select`: Próximos 30 dias (padrão), Este mês, Mês passado, Todos), imóvel (`Select`), canal (`Select`), status (chips `Pill`: Todas, Confirmadas, Aguardando pagamento, Canceladas, Bloqueios). Botão "Limpar filtros" aparece quando há filtro diferente do padrão.
- `ReservationTable` (shadcn `Table` em `overflow-x-auto`, `min-w-[820px]`):
  - Colunas: Hóspede (nome peso 500 + "2 hóspedes" `t-caption`), Imóvel, Check-in, Check-out, Noites, Canal (`Badge neutral`), Status (`StatusBadge`: confirmada verde "Confirmada", pendente warning "Aguardando pagamento", cancelada neutral "Cancelada", bloqueio dark "Bloqueio"), Valor (direita).
  - Ordenação clicável em Check-in (padrão crescente), Valor e Hóspede (`aria-sort` no `th`, botão no cabeçalho).
  - Paginação: 20 por página, "Mostrando 1–20 de 64" + botões Anterior/Próxima.
  - Linha selecionável: o nome do hóspede é um `<button>` que abre o `ReservationSheet` e atualiza `?id=`.
  - Vazio: `EmptyState title="Nenhuma reserva com esses filtros."`.
- Mobile (< 734px): tabela vira lista de cartões (hóspede, datas, imóvel, canal, status, valor).

## ReservationSheet (shadcn `Sheet` lado direito, 440px; no mobile de baixo)
- Abre se `?id=` existir ao carregar.
- Conteúdo: hóspede (display 28px 500), `StatusBadge`, canal; bloco de datas (check-in/out com horários do imóvel, noites); imóvel com miniatura e link; valores: diária no canal × noites, taxa do canal estimada (feePct), "Você recebe" (peso 500, verde); linha do tempo de eventos mock ("Reserva criada no Booking.com", "Datas fechadas em 5 canais", "Pagamento confirmado"); ações: "Abrir conversa ›" (se houver conversa: `/app/mensagens?c=<id>`), `Button variant="secondary"` "Ver no calendário", e para pendentes `Button variant="ghost"` "Lembrar hóspede do pagamento" (toast "Lembrete enviado pelo Booking.com.").
- Fechar limpa `?id`. Foco volta para o botão que abriu.

## Critérios de aceite
- [ ] Filtros, ordenação, paginação e reserva aberta refletidos na URL.
- [ ] CSV exportado com cabeçalhos em português e valores numéricos sem "R$".
- [ ] `aria-sort` correto; Sheet acessível.
- [ ] Typecheck, lint e build passam.
