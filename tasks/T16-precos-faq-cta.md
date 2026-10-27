# T16 — Landing: preços, perguntas frequentes, chamada final + página /precos

- **Onda:** 2
- **Depende de:** T01, T02, T03
- **Leitura obrigatória:** `00-CONTEXTO.md` inteiro

## Posse

`src/components/marketing/pricing/{PricingSection.tsx,PlanCard.tsx,ComparisonTable.tsx,Faq.tsx,FinalCta.tsx}`, `src/pages/marketing/Pricing.tsx`. Exports nomeados `PricingSection`, `Faq`, `FinalCta`; `Pricing.tsx` export default.

## 1. PricingSection
- `<section id="precos" className="bg-bg-alt pt-40 pb-36 px-4">`, `max-w-[1100px] mx-auto flex flex-col items-center gap-12`.
- `<h2 className="t-section">Escolha seu plano.</h2>` + "Todos com os seis canais e calendário sincronizado." (19/28 ink-2).
- `SegmentedControl` (`ariaLabel="Período de cobrança"`): Mensal | "Anual, 2 meses grátis". Estado local, padrão Mensal.
- 3 `PlanCard` de `getPlans()` em `flex flex-wrap gap-5 items-stretch` (cada `flex: 1 1 280px`):
  - Card `rounded-card p-10 flex flex-col gap-6`; Essencial e Anfitrião+ `bg-surface`; Pro `bg-surface-dark text-on-dark` com `-translate-y-3` no desktop e selo `bg-ouro text-[#3a2c05] t-caption font-semibold rounded-pill px-2.5 py-1` "Mais escolhido".
  - Nome `<h3>` 24/28 semibold; descrição 15/21 (ink-2 / on-dark-2).
  - Preço `font-display text-[52px] leading-[54px] font-semibold tracking-[-0.03em]`: "R$ 49" + `<span>` 15px normal " por mês" ou "R$ 490" + " por ano"; Anfitrião+: "Sob consulta". Troca de período com o número fazendo crossfade vertical (y 8 → 0).
  - Lista de recursos com check SVG.
  - CTA no fim (`mt-auto`): Pro `Button primary fullWidth`; outros `secondary fullWidth`; Anfitrião+ "Falar com vendas" (href `#vendas`), outros `href="/cadastro?plano=<id>"`.
- Card do plano Anfitrião+ com `id="anfitriao"` (âncora usada pela navegação).

## 2. Faq
- `<section id="duvidas" className="bg-bg py-36 px-4">`, `max-w-[820px] mx-auto`.
- `<h2 className="t-section">Perguntas frequentes.</h2>` (no mobile 40px).
- `Accordion` do shadcn `type="multiple"`, itens de `getFaq()`, estilizado: borda superior no grupo e inferior em cada item (`border-line`), gatilho `py-6 text-[19px] leading-[26px] font-semibold text-left`, ícone "+" à direita que gira 45° quando aberto (substitua o chevron padrão), conteúdo `t-body text-ink-2 max-w-[64ch] pb-6`. Animação de altura do Radix mantida (desligar com reduced motion).
- Adicione JSON-LD `FAQPage` num `<script type="application/ld+json">` com as perguntas.

## 3. FinalCta
- `<section id="comecar" className="relative overflow-hidden bg-surface-dark text-on-dark py-40 px-4">`.
- Padrão de fundo decorativo (`aria-hidden`, `opacity-[.08]`): grade 12 colunas de blocos 64px de altura `bg-on-dark`, raio 14px, e a cada 5º bloco raio pílula — 48 blocos.
- Conteúdo centralizado relativo: `<h2 className="t-section-xl">Seu próximo hóspede<br/>já está procurando.</h2>`; lead on-dark-2 "Coloque o imóvel em todos os canais ainda hoje. Os primeiros 14 dias são por nossa conta."; botões `Button size="lg" href="/cadastro"` "Cadastrar meu imóvel" e `Button variant="on-dark" size="lg" href="#vendas"` "Falar com vendas".
- Ao entrar na viewport, os blocos do fundo acendem aleatoriamente (opacidade 0→1 com stagger aleatório determinístico, uma vez). Reduced motion: estático.

## 4. Página /precos (`pages/marketing/Pricing.tsx`)
- Topo: `Headline size="hero" title="Planos para cada tamanho." ` com lead "Todos incluem os seis canais, calendário sincronizado e caixa de entrada única. Teste 14 dias grátis."
- Reutilize `PricingSection` (sem o h2 duplicado: aceite prop `hideTitle`).
- `ComparisonTable`: tabela com cabeçalho fixo (sticky) e 3 colunas de plano, agrupada em: Canais (6 canais ✓✓✓; novos canais ✓✓✓), Imóveis (2 / 10 / Ilimitados), Calendário (sincronizado ✓✓✓; bloqueios manuais ✓✓✓), Preço (ajuste por taxa ✓✓✓; preço que acompanha a demanda –✓✓), Mensagens (caixa única ✓✓✓; respostas prontas –✓✓), Relatórios (básico ✓; por canal –✓✓), Equipe (usuários 1 / 2 / Ilimitados; permissões ––✓), Suporte (e-mail ✓✓; dedicado ––✓). ✓ = ícone check verde com `<span class="sr-only">Incluído</span>`; – = `<span class="sr-only">Não incluído</span>` + traço `text-ink-2`. Mobile: caixa com `overflow-x-auto`.
- Depois: `Faq` e `FinalCta`.
- `document.title = 'Preços — Morada'`.

## Critérios de aceite
- [ ] Alternar Mensal/Anual atualiza os preços com animação suave.
- [ ] Accordion acessível por teclado; JSON-LD válido.
- [ ] Tabela comparativa legível por leitor de tela (cabeçalhos `th scope`).
- [ ] Typecheck, lint e build passam.
