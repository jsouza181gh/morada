# T21 — App: Imóveis (lista) e detalhe do imóvel

- **Onda:** 2
- **Depende de:** T01, T02, T06
- **Leitura obrigatória:** `00-CONTEXTO.md` inteiro
- **Skill sugerida:** `shadcn` (Tabs, Select, DropdownMenu)

## Posse

`src/pages/app/{Properties.tsx,PropertyDetail.tsx}`, `src/components/app/properties/{PropertyCard.tsx,PropertyRow.tsx,PropertyFilters.tsx,ChannelStatusList.tsx,PhotoGallery.tsx,PriceByChannel.tsx,MiniCalendar.tsx,tabs/*}`.

## 1. /app/imoveis — lista

- `PageHeader title="Imóveis" subtitle="7 de 10 imóveis no plano Pro"` + ação `Button href="/app/imoveis/novo"` "Cadastrar imóvel".
- Barra de filtros (`PropertyFilters`): busca por nome/cidade (input), `Select` "Todos os status" | "Com pendência" | "Tudo publicado", `SegmentedControl` Grade | Lista (ícones + rótulo sr-only). Estado na URL (`?q=&status=&view=`) via `useSearchParams`.
- **Grade** (padrão): `grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-5`. `PropertyCard`:
  - Foto de capa `aspect-[4/3] rounded-t-lg object-cover` com selo de nota no canto (estrela ouro + "4,92").
  - Corpo `p-5`: nome (17px peso 500) link para `/app/imoveis/<id>` (link cobre o card inteiro com `after:absolute after:inset-0`), "Bairro, Cidade" `t-body-sm text-ink-2`, "4 hóspedes · 2 quartos" → use vírgulas: "4 hóspedes, 2 quartos".
  - Linha de status dos canais: 6 pontos/mini rótulos — use `ChannelStatusList variant="compact"`: 6 quadradinhos 8px com cor por status + texto resumo "5 de 6 publicados" e, se houver erro, "1 com erro" em `text-danger`.
  - Rodapé: "R$ 480 por noite (você recebe)" e próxima reserva "Próxima chegada 25 out".
- **Lista**: tabela com colunas Imóvel (thumb 48px + nome + cidade), Canais (resumo), Diária, Ocupação 30 dias (barra), Próxima chegada, menu "…" (`DropdownMenu`: Abrir, Ver no calendário, Duplicar (toast "Em breve"), Pausar anúncios (toast)).
- Vazio após filtro: `EmptyState title="Nenhum imóvel encontrado." description="Tente outro nome ou limpe os filtros." action={<Button variant="secondary">Limpar filtros</Button>}`.

## 2. /app/imoveis/:id — detalhe

- Carrega `getProperty(id)`; não encontrado → `EmptyState` "Imóvel não encontrado." + link para a lista.
- `PageHeader breadcrumb={{label:'Imóveis', href:'/app/imoveis'}} title={name} subtitle="Lagoa da Conceição, Florianópolis/SC"` + ações: `Button variant="secondary"` "Ver no calendário" (`/app/calendario?imovel=<id>`) e `Button` "Editar anúncio" (toast "Edição chega na próxima versão.").
- `PhotoGallery`: mosaico 1 grande (2/3) + 4 pequenas (grid), raio `rounded-card` no conjunto; botão "Ver as 24 fotos" abre `Dialog` com carrossel simples (setas e teclado).
- `Tabs` (shadcn, estilizadas como `SegmentedControl` em pílula), aba na URL `?aba=`:
  - **Visão geral**: descrição, comodidades em chips (`Badge neutral` com ícone lucide), regras (check-in/out, mínimo de noites, taxa de limpeza) em lista de definição `dl`, nota e número de avaliações.
  - **Canais** (`ChannelStatusList variant="full"`): uma linha por canal (`bg-surface rounded-lg p-5`): nome, `ChannelBadge`, título usado naquele canal com contador "32/50" quando há limite, preço no canal, taxa (`feeLabel`), "Sincronizado há 2 min", e `Switch` "Publicar no {canal}" que chama `setListingStatus(id, canal, on ? 'published' : 'off')` com atualização otimista e toast "Publicado no Airbnb." / "Removido do Airbnb.". Linhas com `issue` mostram caixa `bg-danger-soft text-danger` com a issue e `Button variant="link"` "Corrigir".
  - **Preços** (`PriceByChannel`): campo "Quero receber por noite" (input numérico com máscara BRL) que recalcula a tabela de preço por canal ao vivo (`ceil(net/(1-fee)/5)*5`), mostrando taxa e valor final; nota "Os preços são enviados aos canais quando você salvar." + Button "Salvar preços" (toast).
  - **Calendário** (`MiniCalendar`): mês atual (out/2026) e próximo lado a lado (empilhados no mobile), dias reservados destacados com cor por status (confirmada `bg-verde text-on-verde`, pendente `bg-verde-soft ring-1 ring-verde`, bloqueio hachurado). Tooltip com hóspede e canal. Link "Abrir calendário completo ›".
  - **Fotos**: grade com as 6 fotos, a capa marcada com `Badge tone="dark"` "Capa", botões por foto "Definir como capa" (estado local).

## Critérios de aceite
- [ ] Filtros e aba refletidos na URL (recarregar mantém).
- [ ] Switches de canal atualizam o status na hora e após recarregar a rota (estado do módulo de mocks).
- [ ] Galeria em Dialog navegável por teclado; foco devolvido ao fechar.
- [ ] Typecheck, lint e build passam.
