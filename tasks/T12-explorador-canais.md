# T12 — Landing: "Explore os canais." (pílulas + celular com prévia)

- **Onda:** 2
- **Depende de:** T01, T02, T03, T04
- **Leitura obrigatória:** `00-CONTEXTO.md` inteiro
- **Skills sugeridas:** `apple-design`, `frontend-design`

## Objetivo

Equivalente ao explorador "Design dobrável" da Apple: à esquerda, uma lista vertical de pílulas (uma por canal); a ativa se expande num cartão com explicação. À direita, um celular mostra o mesmo anúncio (Casa da Lagoa) do jeito que aparece naquele canal.

## Posse

`src/components/marketing/explorer/{ChannelExplorer.tsx,ExplorerList.tsx,ListingPreview.tsx}`. Export nomeado `ChannelExplorer`.

## Dados
`getChannels()` (blurb, feeLabel) e `getProperty('lagoa')` (listing por canal: status, price, title). Enquanto carrega, mostre a estrutura com `Skeleton`.

Complementos fixos por canal (no componente):
| canal | subtítulo | CTA | tags |
|---|---|---|---|
| airbnb | Casa inteira em Florianópolis | Reservar | 4 hóspedes, 2 quartos, Wi-Fi |
| booking | Casa de temporada, Lagoa da Conceição | Ver disponibilidade | Cancelamento grátis, Estacionamento |
| vrbo | Casa, 4 hóspedes, Florianópolis | Solicitar reserva | Ideal para famílias, Deck |
| trivago | Comparado com 2 ofertas | Ver oferta | Melhor preço |
| decolar | Aluguel de temporada, Florianópolis | Reservar | Parcelamento |
| expedia | Vacation home in Florianópolis | Reserve | Free Wi-Fi, Deck |

## Layout
- `<section id="canais" className="bg-bg-alt py-28 px-4">`; título `<h2 className="t-section max-w-[980px] mx-auto mb-10">Explore os canais.</h2>`.
- Painel `max-w-[1180px] mx-auto bg-surface rounded-card px-[clamp(24px,5vw,72px)] py-14 min-h-[680px] flex flex-wrap items-center gap-12`.
- **ExplorerList** (`flex: 1 1 280px; max-width: 360px`), `role="tablist" aria-orientation="vertical"`:
  - Inativa: `Pill icon="+"` com o nome (`role="tab" aria-selected=false`).
  - Ativa: cartão `bg-bg-alt rounded-3xl px-5.5 py-4.5` com círculo verde 22px "✓" + nome (17px semibold) e o `blurb` abaixo (15/22px ink-2). `role="tab" aria-selected=true`.
  - Transição: a pílula ativa vira cartão com `layout` + `layoutId={'chip-'+id}` (`springs.layout`); o texto entra com fade 0.2s depois.
  - Teclado: ↑/↓ movem entre canais e ativam; Home/End.
- **ListingPreview** (`flex: 999 1 380px; justify-center`), `role="tabpanel"`, `aria-live="polite"`: `PhoneFrame width={300}` com:
  - Barra do app do canal (`pt-[52px] px-4.5 pb-3 border-b border-line`): nome do canal 13px semibold + badge de status ("Publicado" verde-soft/verde ou "Em análise" warning-soft/warning ou "Erro" danger-soft/danger).
  - Foto: `img` cover da Casa da Lagoa, altura 210px, `object-cover`, com contador "1 de 24" no canto (`bg-black/55 text-white rounded-pill text-[11px] px-2.5 py-0.5`).
  - Corpo: título do anúncio daquele canal (18/23px semibold), subtítulo (13px ink-2), estrelas "4,92 (128 avaliações)" com estrela `fill-ouro`, tags em pílulas `bg-bg-alt 11px`.
  - Rodapé fixo: "**R$ 495** noite" (preço do canal) + botão falso verde com o CTA do canal (é um `span`, não botão — decorativo dentro do mockup).
  - Troca de canal: conteúdo da tela faz crossfade (`AnimatePresence mode="wait"`, 0.4s, `easeApple`), a moldura do celular não se move.
- Abaixo do painel (fora dele), linha `t-body-sm text-ink-2 text-center mt-6`: "Taxa do canal: {feeLabel}. Você recebe R$ 480 por noite em todos." (atualiza com o canal).

## Responsivo
- < 1068px: lista vira uma linha horizontal rolável de pílulas acima do celular (`overflow-x-auto snap-x`), a ativa vira pílula preenchida (sem cartão expandido) e o blurb aparece abaixo do celular.

## Critérios de aceite
- [ ] Clique, toque e teclado trocam o canal; prévia e texto de taxa atualizam.
- [ ] Semântica de tabs correta (testar com leitor de tela ou axe).
- [ ] Reduced motion: troca instantânea.
- [ ] Typecheck, lint e build passam.
