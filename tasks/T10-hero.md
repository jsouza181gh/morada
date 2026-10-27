# T10 — Landing: Hero (notebook + celular + canais flutuando + barra de preço)

- **Onda:** 2
- **Depende de:** T01, T03, T04 (programe contra os contratos se ainda forem stubs)
- **Leitura obrigatória:** `00-CONTEXTO.md` inteiro
- **Skills sugeridas:** `frontend-design`, `apple-design`

## Objetivo

A primeira dobra da landing. É o elemento mais memorável da página: mostra a promessa ("um anúncio, todos os lugares") com um notebook exibindo o painel da Morada, um celular recebendo "Nova reserva" e os seis canais flutuando em volta.

## Posse

`src/components/marketing/hero/{Hero.tsx,HeroStage.tsx,MiniDashboard.tsx,LockScreen.tsx,FloatingChannels.tsx,PriceBar.tsx}`. Export nomeado `Hero` em `Hero.tsx`.

## Layout (desktop ≥ 1068px)

```
            Morada para anfitriões                (t-eyebrow)
        Um anúncio.                               (t-hero, 2 linhas, <h1>)
        Todos os lugares.
  Cadastre o imóvel uma vez. Publique no ...       (t-lead text-ink-2, max 620px)

 [Airbnb ✓]                                 [Trivago ✓]
           ┌──────────── notebook ───────────┐
 [Booking ✓]│  painel Morada (MiniDashboard) │   ┌celular┐
           │                                 │   │ 9:41  │
 [Vrbo •]  └─────────────────────────────────┘   │notifs │
        [Decolar ✓]              [Expedia ✓]      └───────┘

      ( A partir de R$ 49 por mês ou R$ 490 por ano. 14 dias grátis.  [Começar] )
```

- Seção `bg-bg`, `pt-14 pb-24 px-4 overflow-hidden`, conteúdo centralizado `max-w-[1260px]`.
- Textos:
  - Eyebrow: "Morada para anfitriões"
  - H1: "Um anúncio." `<br/>` "Todos os lugares."
  - Lead: "Cadastre o imóvel uma vez. Publique no Airbnb, Booking.com, Vrbo e mais, com **calendário e preço sincronizados** em todos." (o trecho em negrito: `text-ink font-medium`).
- Stage (`HeroStage`): `relative w-full max-w-[1180px] h-[640px] mt-12`, `role="img"` com `aria-label="Painel da Morada num notebook e um celular recebendo uma nova reserva, cercados pelos canais conectados"`; tudo dentro `aria-hidden`.
  - `LaptopFrame` centralizado, `w-[min(860px,100%)]`, top 20px, contendo `MiniDashboard`.
  - `PhoneFrame width={238}` absoluto `right-[2%] top-[150px]` contendo `LockScreen`.
  - `FloatingChannels`: 6 `ChannelBadge` absolutos com `shadow-float rounded-pill`: Airbnb (left 0, top 70), Booking.com (left 3%, top 250), Vrbo pending (left 0, top 430), Trivago (right 0, top 40), Decolar (left 12%, top 560), Expedia (right 22%, top 580).
- PriceBar: pílula `mt-6 flex items-center gap-7 pl-7 pr-2.5 py-2.5 rounded-pill bg-bg-alt/85 backdrop-blur t-body-sm`: "A partir de **R$ 49 por mês** ou R$ 490 por ano. 14 dias grátis." + `Button size="sm" href="/cadastro"` "Começar". Em telas grandes, a barra fica `sticky bottom-6` enquanto o hero está visível (some ao sair do hero: use `useInView` no stage).

## MiniDashboard (dentro do notebook; tudo decorativo, tamanhos pequenos)
- Flex: sidebar 150px `bg-surface-dark` com "Morada" (14px display) + itens 10px (Visão geral ativo com `bg-white/12`, Imóveis, Calendário, Reservas, Mensagens, Canais); conteúdo `p-5 gap-3.5`.
- "Boa tarde, Ana." display 20px peso 500 cor `#3a3a3c`.
- 4 KPIs (grid 4): Receita de outubro R$ 48.920 +12%; Ocupação 87% +4 p.p.; Diária média R$ 412 +3%; Avaliação 4,92 +0,04 (rótulo 9px ink-2, valor 18px display 500, delta 9px verde). Use `dashboardSummary` da T02 se disponível; senão esses valores.
- Linha inferior: card "Receita por mês" (12 barras, a última `bg-verde`, as outras `color-mix(in srgb, var(--verde) 30%, var(--bg-alt))`, alturas 38–96%) e card "Canais" (6 linhas: nome + "Publicado" verde 9px semibold, Vrbo "Em análise" warning).

## LockScreen (dentro do celular)
- Fundo `bg-verde-soft`. Data "sábado, 24 de outubro" 12px e hora "9:41" display 58px peso 500 `text-verde-strong`, centralizados, `pt-[54px]`.
- 2 notificações empilhadas (`rounded-[18px] p-2.5 bg-surface/88` e a segunda `/70`): ícone quadrado 30px `bg-surface-dark` com "M" branco; texto 11px:
  1. **Nova reserva** / "Thomas, 26 a 30 out, via Booking.com. Datas fechadas nos outros 5 canais."
  2. **Marina via Airbnb** / "Tem estacionamento?"

## Movimento (T03)
- Ao carregar (uma única sequência orquestrada, não scroll): eyebrow, H1 e lead entram com fade + y 16 (stagger 0.08); depois o notebook sobe de y 40 com `springs.gentle`; o celular entra da direita (x 40) 150ms depois; os chips aparecem um a um (stagger 0.06) com escala 0.9→1.
- Depois de 1,2s, a primeira notificação do celular "cai" de cima (y -20 → 0) para reforçar "Nova reserva".
- Parallax leve (`Parallax offset={30}`) no notebook ao rolar.
- Reduced motion: tudo já visível, sem animação.

## Responsivo
- < 1068px: stage `h-auto`; chips viram uma fileira centralizada com `flex-wrap gap-2` abaixo do notebook (não absolutos); celular escondido.
- < 734px: H1 56/58px (classe já trata), notebook continua, MiniDashboard pode esconder a coluna "Canais".

## Critérios de aceite
- [ ] Confere com o mockup (tela "Landing", topo).
- [ ] Um único `<h1>` na página.
- [ ] Sem rolagem horizontal em 375px.
- [ ] Sequência de entrada roda uma vez; reduced motion desliga.
- [ ] Typecheck, lint e build passam.
