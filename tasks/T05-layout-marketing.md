# T05 — Layout de marketing: GlobalNav, LocalNav (pílula fixa) e Footer

- **Onda:** 1 (paralela)
- **Depende de:** T00 (usa contratos de T01; se ainda forem stubs, tudo bem)
- **Leitura obrigatória:** `00-CONTEXTO.md` itens 6, 7, 9, 10, 12

## Objetivo

Moldura das páginas públicas, no estilo Apple: barra global fina, barra local em pílula flutuante que gruda no topo ao rolar, e rodapé denso.

## Posse

`src/layouts/MarketingLayout.tsx`, `src/components/marketing/{GlobalNav,LocalNav,Footer}.tsx`.

## MarketingLayout
```tsx
<>
  <a href="#conteudo" className="sr-only focus:not-sr-only ...">Pular para o conteúdo</a>
  <GlobalNav />
  <LocalNav />
  <main id="conteudo"><Outlet /></main>
  <Footer />
  <ScrollRestoration />
</>
```

## GlobalNav (não fixa)
- Altura 44px, fundo `color-mix(in srgb, var(--bg-alt) 85%, transparent)`, `t-caption` 12px, links `text-ink/80 hover:text-ink`.
- Conteúdo `max-w-[1024px] mx-auto px-4 flex items-center justify-between`.
- Esquerda: ícone casa (SVG: `M3 11L12 4l9 7` + `M6 9.5V20h12V9.5`, stroke 1.8, 20px) com `aria-label="Morada, início"` linkando `/`.
- Centro (≥ 734px): links distribuídos: Produto (`/#produto`), Canais (`/#canais`), Recursos (`/#recursos`), Preços (`/precos`), App (`/#app`), Para administradoras (`/precos#anfitriao`), Ajuda (`/#duvidas`).
- Direita: ícone de busca (botão, `aria-label="Buscar"`, sem ação) e link "Entrar" (`/entrar`).
- Mobile (< 734px): esconde os links do centro; aparece botão de menu (ícone 2 traços) que abre `Sheet` (shadcn) de cima com os mesmos links em `t-headline`, empilhados.

## LocalNav (sticky)
- Wrapper `sticky top-0 z-40 px-4 py-2`.
- Pílula: `max-w-[980px] mx-auto min-h-[52px] rounded-pill pl-6 pr-2 py-1.5 flex flex-wrap items-center gap-x-6 gap-y-2`, fundo `color-mix(in srgb, var(--surface) 78%, transparent)`, `backdrop-filter: saturate(180%) blur(20px)`, `shadow-float`.
- Esquerda: "Morada" em `font-display text-[21px] font-semibold tracking-[-0.02em]` (link `/`), `flex-1`.
- Meio (≥ 734px): links 12px "Visão geral" (`/#produto`), "Recursos" (`/#recursos`), "Preços" (`/precos`).
- Direita: `Button variant="secondary" size="sm" href="/#produto"` "Explorar" e `Button variant="primary" size="sm" href="/cadastro"` "Começar".
- Comportamento: a pílula só ganha a sombra e o fundo translúcido depois que o usuário rolou 8px (antes, fundo transparente, sem sombra). Animação 200ms. Use `useScroll` do motion ou listener passivo.
- Links com âncora (`/#canais`) devem rolar suavemente até o id quando já se está em `/` (respeitar reduced motion), compensando 80px da barra.

## Footer
- `bg-bg-alt t-caption text-ink-2 pt-8 pb-12 px-4`, conteúdo `max-w-[980px] mx-auto`.
- Linha 1 (com borda inferior `border-line`): "Preços e taxas mostrados são exemplos. Morada é independente e não tem vínculo com Airbnb, Booking.com, Vrbo, Trivago, Decolar ou Expedia."
- Grade `grid-cols-[repeat(auto-fit,minmax(150px,1fr))] gap-6`, 5 colunas com título `text-ink font-semibold` e links:
  - Produto: Visão geral, Calendário, Preços por canal, Mensagens, Relatórios
  - Canais: Airbnb, Booking.com, Vrbo, Trivago, Decolar, Expedia
  - Para você: Anfitriões, Administradoras, Equipes de limpeza, App Morada
  - Ajuda: Central de ajuda, Status dos canais, Fale conosco, Comunidade
  - Morada: Sobre, Carreiras, Imprensa, Segurança
  - Links apontam para `#` por enquanto, `hover:underline`.
- Mobile (< 734px): cada coluna vira um `Accordion` (shadcn) fechado, como no rodapé da Apple.
- Linha final (borda superior): "Copyright 2026 Morada. Todos os direitos reservados." | Privacidade · Termos de uso · Cookies · Mapa do site (separados por gap, sem ponto) | "Brasil".

## Critérios de aceite
- [ ] LocalNav gruda no topo e fica translúcida com blur ao rolar.
- [ ] Menu mobile abre/fecha por teclado, foco preso no Sheet, Esc fecha.
- [ ] "Pular para o conteúdo" aparece ao focar com Tab.
- [ ] Rodapé vira acordeões no mobile.
- [ ] Typecheck, lint e build passam.
