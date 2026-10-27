# T26 — App: Canais, Relatórios e Configurações

- **Onda:** 2
- **Depende de:** T01, T02, T06
- **Leitura obrigatória:** `00-CONTEXTO.md` inteiro

## Posse

`src/pages/app/{Channels.tsx,Reports.tsx,Settings.tsx}`, `src/components/app/channels/*`, `src/components/app/reports/*`, `src/components/app/settings/*`.

## 1. /app/canais
- `PageHeader title="Canais" subtitle="6 de 6 conectados. Última sincronização há 1 min."`.
- Faixa de saúde no topo (se algum canal `health !== 'ok'`): card `bg-warning-soft` ou `bg-danger-soft` com ícone, texto do problema mais grave e link "Ver detalhes ›" que rola até o canal.
- Grade `grid-cols-[repeat(auto-fill,minmax(320px,1fr))] gap-5` de `ChannelCard` (`bg-surface rounded-lg p-6 flex flex-col gap-4`):
  - Topo: nome do canal (21px 500) + `Badge` de saúde (ok "Funcionando" verde; warning "Atenção" warning; error "Com erro" danger).
  - Linhas `dl`: Conta (`accountLabel`), Taxa (`feeLabel`), Limite de título (`titleMaxLength` ou "Sem limite"), Imóveis publicados ("6 de 7" contando listings `published`), Última sincronização (`formatRelative`).
  - `healthNote` em caixa colorida quando existir.
  - Ações: `Button variant="secondary" size="sm"` "Sincronizar agora" (spinner 1s, atualiza "há poucos segundos", toast), `DropdownMenu` "…" com "Ver anúncios neste canal" (`/app/imoveis?canal=`), "Desconectar" → `Dialog` de confirmação: "Desconectar o Vrbo? Seus anúncios continuam no Vrbo, mas deixam de ser sincronizados pela Morada." botões "Cancelar" e "Desconectar" (`variant` danger: crie localmente um botão com `bg-danger text-white`; não altere o Button da T01). Desconectado: card esmaecido com `Button` "Conectar" (Dialog de autorização como na T22, passo 6).
- Abaixo: seção "Canais em breve" com 3 cartões desabilitados (Google Vacation Rentals, Hoteis.com, Tripadvisor) e `Badge` "Em breve".

## 2. /app/relatorios
- `PageHeader title="Relatórios"` + `SegmentedControl` período "3 meses" | "6 meses" | "12 meses" (padrão 12) e `Button variant="secondary"` "Exportar PDF" (toast "Exportação chega na próxima versão.").
- KPIs do período (4 `KpiCard`): Receita total, Noites vendidas, Ocupação média, Diária média.
- Gráficos (Recharts, cores dos tokens, tooltips no estilo do T20, tabelas `sr-only` equivalentes):
  1. "Receita por mês e canal" — `BarChart` empilhado (Airbnb `var(--verde)`, Booking.com `var(--verde-strong)`, Vrbo `var(--ouro)`, Outros `var(--line-strong)`), altura 320.
  2. "Ocupação por imóvel" — barras horizontais (não Recharts, como no T20) com % e noites.
  3. "Participação dos canais" — donut (Recharts `PieChart` innerRadius 70%) com legenda ao lado e total no centro.
  4. "Diária média por mês" — `LineChart` com ponto destacado no maior valor.
- Tabela "Desempenho por imóvel": Imóvel, Receita, Noites, Ocupação, Diária média, Nota — ordenável, com linha de total.
- Layout: KPIs em linha; gráficos 1 e 3 lado a lado (2fr/1fr) ≥1068px; demais em largura total.

## 3. /app/configuracoes
- `PageHeader title="Configurações"`.
- Navegação lateral interna (≥1068px; no mobile `Select`): Perfil, Plano e cobrança, Notificações, Equipe, Aparência. Seção ativa em `?secao=`.
- **Perfil**: Nome, E-mail, Telefone (máscara), Idioma (`Select` Português (Brasil)), botão "Salvar alterações" (toast "Alterações salvas.").
- **Plano e cobrança**: card do plano atual (Pro, R$ 129 por mês, "7 de 10 imóveis" com barra), próximos vencimentos (lista mock 3 faturas com "Baixar" desabilitado), `Button variant="secondary" href="/precos"` "Mudar de plano".
- **Notificações**: tabela de preferências por evento (Nova reserva, Mensagem de hóspede, Erro de sincronização, Resumo semanal) × canais de aviso (E-mail, App, WhatsApp) com `Switch` em cada célula (rótulo acessível "Nova reserva por e-mail").
- **Equipe**: lista de `getTeam()` com `Avatar`, nome, papel (`Select` Proprietário/Limpeza/Check-in/Financeiro, desabilitado para o proprietário) e "Remover"; botão "Convidar pessoa" abre `Dialog` com e-mail + papel (toast "Convite enviado para …").
- **Aparência**: `SegmentedControl` Claro | Escuro | Automático que define `data-theme` no `<html>` (Automático segue `prefers-color-scheme`) e salva em `localStorage` (mesma chave que a T06 usar: `morada:theme`).

## Critérios de aceite
- [ ] Desconectar/conectar canal altera o estado e a contagem do cabeçalho.
- [ ] Gráficos com alternativa textual e cores dos tokens nos dois temas.
- [ ] Seção de configurações na URL.
- [ ] Typecheck, lint e build passam.
