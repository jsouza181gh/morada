# T02 — Dados mockados, API simulada e hook useMock

- **Onda:** 1 (paralela a T01, T03–T06)
- **Depende de:** T00 (`mocks/types.ts`, `lib/date.ts`)
- **Leitura obrigatória:** `00-CONTEXTO.md` itens 8 e 9

## Objetivo

Popular dados coerentes e realistas (Brasil, temporada) e a API simulada do contrato. Os mesmos dados alimentam landing e app, então números precisam bater entre si (ex.: receita de outubro no dashboard = soma das reservas de outubro).

## Posse

`src/mocks/{channels,properties,reservations,messages,metrics,plans,faq,team,api}.ts`, `src/mocks/__tests__/*`, `src/hooks/useMock.ts`. **Não** edite `mocks/types.ts`.

## Dados

### channels.ts — `export const channels: Channel[]`
| id | feePct | feeLabel | titleMaxLength | connected | accountLabel | health | blurb |
|---|---|---|---|---|---|---|---|
| airbnb | 0.03 | 3% do anfitrião | 50 | true | ana.anfitria | ok | O anúncio sai com título de até 50 caracteres, fotos em ordem de capa e regras da casa já preenchidas. |
| booking | 0.15 | 15% de comissão | null | true | Casa da Lagoa | ok | Entra como casa de temporada, com política de cancelamento e taxa de limpeza separadas. |
| vrbo | 0.05 | 5% do anfitrião | 80 | true | ana.souza | warning ("1 anúncio em análise") | O Vrbo revisa anúncios novos. A Morada avisa quando ele for aprovado. |
| trivago | 0 | Sem taxa própria | null | true | via Booking.com | ok | Aparece no comparador usando os dados do Booking.com, sem cadastro extra. |
| decolar | 0.12 | 12% de comissão | null | true | Ana Souza | ok | Publicado como aluguel de temporada para quem viaja pela América Latina. |
| expedia | 0.15 | 15% de comissão | null | true | Ana Souza | error ("2 fotos abaixo da resolução mínima") | Leva o anúncio para viajantes de fora do Brasil, com descrição em inglês. |

`lastSyncAt`: entre 1 e 6 minutos antes de `2026-10-24T15:00:00-03:00`.

### properties.ts — `export const properties: Property[]` (7 imóveis; plano Pro "7 de 10")
| id | name | type | city/UF | bairro | hósp/qts/banh | nightlyNet | rating (reviews) |
|---|---|---|---|---|---|---|---|
| lagoa | Casa da Lagoa | casa | Florianópolis/SC | Lagoa da Conceição | 4/2/2 | 480 | 4.92 (128) |
| pinheiros | Loft Pinheiros | loft | São Paulo/SP | Pinheiros | 2/1/1 | 520 | 4.88 (94) |
| gramado | Chalé Gramado | chale | Gramado/RS | Planalto | 4/2/1 | 640 | 4.95 (61) |
| leblon | Apto Leblon | apartamento | Rio de Janeiro/RJ | Leblon | 5/2/2 | 910 | 4.81 (143) |
| trancoso | Casa Trancoso | casa | Porto Seguro/BA | Trancoso | 8/4/3 | 1450 | 4.97 (52) |
| savassi | Studio Savassi | studio | Belo Horizonte/MG | Savassi | 2/1/1 | 260 | 4.76 (38) |
| paraty | Casa Paraty | casa | Paraty/RJ | Centro Histórico | 6/3/2 | 780 | 4.90 (77) |

- `photos`: 6 por imóvel, `https://picsum.photos/seed/morada-<id>-<n>/1200/800`, n = 1..6. `coverIndex` 0.
- `amenities`: 5–9 de: Wi-Fi, Ar-condicionado, Cozinha completa, Estacionamento, Piscina, Churrasqueira, Lareira, Vista para o mar, Deck, Aceita pets, Máquina de lavar, Espaço de trabalho.
- `description`: 2–3 frases específicas do imóvel, em pt-BR.
- `cleaningFee` 120–350; `minNights` 2–3 (Trancoso 4); checkIn "15:00", checkOut "11:00".
- `channels`: para cada canal, `price = Math.ceil(nightlyNet / (1 - feePct) / 5) * 5` e `title` adequado ao canal (Airbnb ≤ 50 caracteres, Expedia em inglês). Status: tudo `published`, exceto: `lagoa.vrbo = pending`, `lagoa.expedia = error` (issue "Faltam 2 fotos em alta resolução"), `pinheiros.vrbo = pending`, `savassi.decolar = off`, `savassi.expedia = off`, `paraty.trivago = off`.
- `createdAt` entre 2025-03 e 2026-08.

### reservations.ts — `export const reservations: Reservation[]`
- Gere **determinísticamente** (PRNG com seed fixa, ex.: mulberry32(42)) reservas de 2025-11-01 a 2026-12-31 para os 7 imóveis, sem sobreposição por imóvel, ocupação mensal média ~70–90% em alta temporada (dez–fev, jul) e ~55–75% no resto.
- Distribuição de canais: Airbnb 41%, Booking 29%, Vrbo 13%, Decolar 9%, Expedia 6%, Trivago 2%.
- `total = noites × channels[c].price` do imóvel (± 0). `guests` ≤ capacidade. Nomes brasileiros variados e alguns estrangeiros (Thomas Weber, Emma Johnson).
- Incluir **obrigatoriamente** (usadas nos mockups):
  - lagoa: Marina Costa, Airbnb, 2026-10-25 a 2026-10-28, confirmed; Pedro Lima, Airbnb, 2026-11-02 a 2026-11-04, confirmed; Ana Paula Ramos, Booking, 2026-11-04 a 2026-11-07, pending_payment.
  - Reservas sem status explícito abaixo são `confirmed`.
  - pinheiros: Thomas Weber, Booking, 2026-10-26 a 2026-10-30, confirmed; Camila Torres, Expedia, 2026-11-01 a 2026-11-05.
  - gramado: bloqueio manual (channelId null, status blocked, guestName "Fechado", note "Manutenção") 2026-10-24 a 2026-10-26; Lucas Andrade, Vrbo, 2026-10-31 a 2026-11-03.
  - leblon: Rafael Dias, Airbnb, 2026-10-27 a 2026-10-29, pending_payment; Juliana Reis, Decolar, 2026-11-01 a 2026-11-06.
  - trancoso: Família Moreira, Airbnb, 2026-10-24 a 2026-10-31; bloqueio "Uso próprio" 2026-11-03 a 2026-11-07.
  - savassi: Bruno Alves, Booking, 2026-10-29 a 2026-10-31.
- ~3% cancelled espalhadas no passado.

### messages.ts — `export const conversations: Conversation[]` (10 conversas)
Inclua: Marina (lagoa, Airbnb, "Oi! Tem vaga na garagem para um carro?", resposta do anfitrião "Tem sim, Marina. A vaga é a 12, coberta.", unread 0); Thomas (pinheiros, Booking, em inglês "We arrive at 10 pm, is that ok?", unread 1); Rafael (leblon, Airbnb, pergunta sobre check-in antecipado, unread 1); Juliana (leblon, Decolar, pergunta sobre roupa de cama, unread 1); outras 6 com 2–6 mensagens, horários nos últimos 5 dias.

### metrics.ts — `export const metrics: MonthlyMetric[]`
Derive **das reservas** (não invente separado): 12 meses de 2025-11 a 2026-10; `revenueByChannel` = soma de `total` das reservas confirmadas com check-in no mês; `occupancy` = noites ocupadas / noites disponíveis; `adr` = receita / noites. Exporte também `dashboardSummary: DashboardSummary` calculado de out vs set (rating = média ponderada dos imóveis). Se os números ficarem muito diferentes de "receita de outubro ≈ R$ 48 mil, ocupação ≈ 87%", ajuste a geração (não os números finais) até ficar próximo.

### plans.ts
| id | name | description | monthly | yearly | featured | cta | features |
|---|---|---|---|---|---|---|---|
| essencial | Essencial | Para quem tem 1 ou 2 imóveis. | 49 | 490 | false | Começar com Essencial | Até 2 imóveis; Os 6 canais; Calendário sincronizado; Caixa de entrada única |
| pro | Pro | Para quem vive de aluguel por temporada. | 129 | 1290 | true | Começar com Pro | Até 10 imóveis; Tudo do Essencial; Preço que acompanha a demanda; Relatórios por canal; App com alertas |
| anfitriao | Anfitrião+ | Para administradoras e equipes. | null | null | false | Falar com vendas | Imóveis ilimitados; Tudo do Pro; Equipe com permissões; Atendimento dedicado |

### faq.ts (6 itens, nesta ordem)
1. Preciso ter conta em cada plataforma? — Sim, cada canal exige uma conta de anfitrião. Você conecta essas contas uma vez na Morada e passa a gerenciar tudo daqui.
2. E se uma reserva entrar em dois canais ao mesmo tempo? — Assim que a primeira reserva é confirmada, a Morada fecha a data nos outros canais em segundos.
3. Posso ter preços diferentes em cada canal? — Pode. Por padrão, a diária é ajustada pela taxa de cada canal para você receber o mesmo valor, e você muda isso quando quiser.
4. A Morada cobra comissão sobre as reservas? — Não. Você paga só o plano. As taxas de cada canal continuam sendo cobradas por eles.
5. Quais canais estão disponíveis? — Airbnb, Booking.com, Vrbo, Trivago, Decolar e Expedia. Novos canais entram sem custo extra.
6. Posso cancelar quando quiser? — Sim. Seus anúncios continuam nas plataformas, só deixam de ser sincronizados pela Morada.

### team.ts
Ana Souza (proprietario), Joana Mendes (limpeza), Rita Carvalho (limpeza), Lucas Tavares (checkin), Paulo Reis (financeiro).

## api.ts

Implementar todas as funções do contrato (item 8). Detalhes:
- `delay()` aleatório 300–600ms, 0 em teste.
- Retorne **cópias** (`structuredClone`) para a UI não mutar o estado.
- Estado mutável do módulo para as mutações (`setListingStatus`, `sendMessage` — adiciona mensagem `from:'host'` com `sentAt` agora e zera `unread`; `createProperty` — gera id slug do nome; `blockDates` — valida sobreposição e rejeita com `Error('Essas datas já têm reserva.')`).
- `getReservations` filtra por interseção de período `[from, to]`.

## useMock.ts

`useMock(fn, deps)` com `loading`, `data`, `error`, `reload`; ignora resposta de chamada antiga se deps mudaram (flag `cancelled`).

## Testes

- Nenhuma sobreposição de reservas por imóvel (exceto canceladas).
- As 12 reservas obrigatórias existem com as datas exatas.
- `metrics` de 2026-10 bate com a soma das reservas.
- `blockDates` rejeita sobreposição.

## Critérios de aceite

- [ ] Dados determinísticos (mesma saída a cada execução).
- [ ] `dashboardSummary.revenueMonth` entre 40.000 e 56.000 e `occupancy` entre 0,8 e 0,92.
- [ ] Testes, typecheck, lint e build passam.
