# T11 — Landing: "Comece pelos destaques." (carrossel com autoplay)

- **Onda:** 2
- **Depende de:** T01, T03 (useAutoplay), T02 opcional
- **Leitura obrigatória:** `00-CONTEXTO.md` inteiro
- **Skills sugeridas:** `apple-design`, `frontend-design`

## Objetivo

Recriar o carrossel de destaques da Apple: cards grandes (720×560) deslizando na horizontal, alternando claro e escuro, cada um com uma mini interface detalhada, controle em pílula com pontos e botão play/pause.

## Posse

`src/components/marketing/highlights/{Highlights.tsx,HighlightCard.tsx,slides/PublishSlide.tsx,slides/CalendarSlide.tsx,slides/PriceSlide.tsx,slides/InboxSlide.tsx,slides/ReportsSlide.tsx,CarouselControls.tsx}`. Export nomeado `Highlights`.

## Estrutura

- `<section id="produto" className="bg-bg-alt pt-28 pb-24 overflow-hidden">`.
- Cabeçalho `max-w-[980px] mx-auto px-4 mb-10 flex flex-wrap items-end justify-between gap-4`: `<h2 className="t-section">Comece pelos destaques.</h2>` e link "Assistir ao filme" com ícone play em círculo (SVG 18px) — `href="#filme"`, sem ação real.
- Trilho: Embla (`embla-carousel-react`) com `align: 'start'`, `containScroll: 'trimSnaps'`, `loop: false`; viewport com `padding-left: max(16px, calc((100% - 980px)/2))` para alinhar o primeiro card ao texto; slides `flex: 0 0 min(720px, 86vw)`, gap 24px; arrastar com mouse/toque habilitado.
- Integração com `useAutoplay({ count: 5 })`: quando `index` muda, `emblaApi.scrollTo(index)`; quando o usuário arrasta (`select` do Embla), `setIndex(emblaApi.selectedScrollSnap())` (isso pausa).
- Pausa também em `mouseenter`/`focusin` no trilho; retoma em `mouseleave`/`focusout` só se não foi pausado manualmente.

## HighlightCard
`<article>` `h-[560px] rounded-card p-12 flex flex-col gap-8 overflow-hidden`, tone light (`bg-surface`) ou dark (`bg-surface-dark text-on-dark`). Título `<h3>` `font-display text-[32px] leading-[36px] font-semibold tracking-[-0.02em] max-w-[460px]` com duas partes: a primeira na cor do texto, a segunda em `text-ink-2` (dark: `text-on-dark-2`). Conteúdo visual em `mt-auto`, `aria-hidden`. Mobile: `h-[520px] p-8`, título 26/30px.

## Os 5 slides (textos exatos)

1. **PublishSlide** (light) — "Publique em seis canais." / "Com um botão."
   Caixa `bg-bg-alt rounded-[20px] p-6`: linha "Publicando Casa da Lagoa" e "5 de 6" (13px ink-2); barra de progresso 6px (83%, verde, anima de 0 a 83% quando o slide fica ativo); grade 2×3 de linhas `bg-surface rounded-xl px-3.5 py-3` com nome do canal e status ("✓ Publicado" verde 12px semibold; Vrbo "Em análise" warning).
2. **CalendarSlide** (dark) — "Um calendário." / "Que se atualiza sozinho."
   Cabeçalho dom…sáb (11px on-dark-2) e grade 7×5 de dias de novembro/2026 (o dia 1 cai num domingo), células 44px `rounded-xl`: livres `bg-white/8 text-on-dark-2`, reservadas `bg-on-dark text-surface-dark font-semibold` (dias 3–5, 11–12, 18–21, 26–27). Quando ativo, as reservadas aparecem em sequência (stagger 0.04).
3. **PriceSlide** (light) — "Você define quanto quer receber." / "A Morada calcula o resto."
   Esquerda: caixa com "Quero receber por noite", valor "R$ 480" (display 48px peso 500), slider decorativo (trilho 6px, preenchimento 58% verde, polegar branco 24px com sombra), escala "R$ 200" / "R$ 800". Direita: lista de 5 linhas (nome do canal / preço) — Airbnb R$ 495, Booking.com R$ 565, Vrbo R$ 505, Decolar R$ 545, Expedia R$ 565 (calcule com a fórmula da T02 se disponível).
4. **InboxSlide** (light) — "Todos os hóspedes." / "Numa caixa de entrada."
   Caixa `bg-bg-alt rounded-[20px] p-5` com balões: Marina via Airbnb "Oi! Tem vaga na garagem para um carro?" (esq., `bg-surface`, raio 18/18/18/6); resposta "Tem sim, Marina. A vaga é a 12, coberta." (dir., `bg-verde text-on-verde`, raio 18/18/6/18); Thomas via Booking.com "We arrive at 10 pm, is that ok?"; campo "Responder ao Thomas" com botão circular verde com seta para cima.
5. **ReportsSlide** (dark) — "Saiba de onde vem cada real." / "Por canal, por mês."
   6 colunas (mai…out), cada uma com 3 blocos empilhados de alturas crescentes (`bg-on-dark`, `bg-on-dark-2`, `bg-white/25`, raio 8px) e rótulo do mês; altura total 260px. Use `metrics` da T02 se disponível (Airbnb / Booking.com / outros); senão valores proporcionais crescentes.

## CarouselControls
- Centralizado `mt-8 flex items-center gap-3`.
- Pílula de pontos: `h-14 px-5.5 rounded-pill bg-line/55 backdrop-blur-xl flex items-center gap-2.5`, `role="group" aria-label="Escolher destaque"`. Cada ponto é `<button>` 8px de altura; ativo com largura 48px e `bg-ink`, inativo 8px `bg-line-strong`; transição de largura com spring. `aria-label="Destaque 2 de 5: Calendário"`, `aria-current` no ativo. Opcional: no ponto ativo, um preenchimento que cresce durante os 5s do autoplay (como a Apple).
- `IconButton size="lg" variant="glass"` play/pause com `label` "Pausar destaques" / "Reproduzir destaques".
- Setas ←/→ do teclado com foco no trilho mudam de slide.

## Critérios de aceite
- [ ] Autoplay de 5s, pausa ao interagir, retoma pelo botão.
- [ ] Arrastar funciona no toque e no mouse; pontos sincronizam.
- [ ] Reduced motion: sem autoplay, trocas sem animação.
- [ ] Leitores de tela: cada slide é um `<article>` com `aria-roledescription="slide"` e `aria-label="2 de 5"`; trilho com `aria-roledescription="carrossel"`.
- [ ] Typecheck, lint e build passam.
