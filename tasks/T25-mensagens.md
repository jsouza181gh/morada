# T25 — App: Mensagens (caixa de entrada unificada)

- **Onda:** 2
- **Depende de:** T01, T02, T06
- **Leitura obrigatória:** `00-CONTEXTO.md` inteiro

## Posse

`src/pages/app/Messages.tsx`, `src/components/app/messages/{ConversationList.tsx,ConversationItem.tsx,Thread.tsx,MessageBubble.tsx,Composer.tsx,QuickReplies.tsx,GuestPanel.tsx}`.

## Dados
`getConversations()`, `getConversation(id)`, `sendMessage(id, text)`, `getProperties()`, `getReservations()`.

## Layout (≥1068px): três colunas dentro de um card alto
`h-[calc(100dvh-64px-64px)]` (descontando topbar e paddings), `bg-surface rounded-lg overflow-hidden grid grid-cols-[320px_1fr_300px]`.

### ConversationList (coluna 1, `border-r border-line`)
- Topo: título `<h1>` "Mensagens" (24px 500) + filtro `SegmentedControl` "Todas" | "Não lidas"; busca por hóspede.
- Itens (`ConversationItem`, `<button>`, `aria-current` no aberto): `Avatar` 40px, nome (peso 500 se não lida), canal em `t-caption text-ink-2` ("via Airbnb"), prévia da última mensagem (1 linha, ink-2), horário relativo à direita (`formatRelative`), bolinha verde com número se `unread > 0`. Selecionado: `bg-bg-alt`.
- Ordenado pela última mensagem. Conversa selecionada em `?c=`; padrão: a primeira não lida.

### Thread (coluna 2)
- Cabeçalho: nome do hóspede, linha "via Booking.com, Loft Pinheiros", datas da reserva vinculada; `IconButton` "Mais opções" (menu: Marcar como não lida, Arquivar — toasts).
- Mensagens agrupadas por dia ("Hoje", "Ontem", "22 out") com separador central `t-caption text-ink-2`.
- `MessageBubble`: hóspede à esquerda `bg-bg-alt` raio 18/18/18/6; anfitrião à direita `bg-verde text-on-verde` raio 18/18/6/18; horário pequeno abaixo do grupo. Mensagens em inglês mostram link "Traduzir" (substitui por tradução mock em pt-BR: um dicionário fixo para as mensagens do mock).
- Lista com `role="log" aria-live="polite"`; rola para o fim ao abrir e ao enviar.
- Ao abrir uma conversa com `unread`, zera o contador (estado local + lista).

### Composer
- `Textarea` autoexpansível (1–6 linhas), placeholder "Responder ao Thomas pelo Booking.com", Enter envia, Shift+Enter quebra linha; botão circular verde com seta (`aria-label="Enviar"`), desabilitado com texto vazio.
- `QuickReplies` acima do campo: chips "Instruções de check-in", "Senha do Wi-Fi", "Regras da casa", "Obrigado pela estadia" que inserem textos prontos (com nome do hóspede e dados do imóvel interpolados).
- Envio: otimista (bolha aparece com estado "Enviando…" e depois o horário); chama `sendMessage`. Mostra "Enviado pelo Booking.com" abaixo da última mensagem do anfitrião.

### GuestPanel (coluna 3, `border-l border-line`, `bg-bg-alt/40`)
- Avatar grande, nome, "Hóspede via Booking.com"; card da reserva (imóvel com miniatura, datas, hóspedes, valor, status) com link "Ver reserva ›"; seção "Imóvel" com check-in/out e endereço resumido; atalhos "Enviar instruções de check-in".

## Responsivo
- 734–1067px: duas colunas (lista + conversa); GuestPanel vira `Sheet` aberto por botão "Detalhes".
- < 734px: lista ocupa a tela; abrir conversa navega para a thread em tela cheia com botão "‹ Mensagens".

## Critérios de aceite
- [ ] Enviar mensagem funciona, persiste ao trocar de conversa e voltar (estado de mocks).
- [ ] Contadores de não lidas da lista e da sidebar (T06 lê de `getConversations`) ficam coerentes após abrir.
- [ ] Teclado: ↑/↓ na lista, Enter abre; foco no composer ao abrir.
- [ ] Typecheck, lint e build passam.
