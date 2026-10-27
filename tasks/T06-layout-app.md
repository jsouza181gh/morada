# T06 — Layout do app: sidebar, topbar e navegação mobile

- **Onda:** 1 (paralela)
- **Depende de:** T00 (programar contra contratos de T01/T02)
- **Leitura obrigatória:** `00-CONTEXTO.md` itens 5, 6 (incluindo `.app-scope`), 7, 8, 12

## Objetivo

Shell das telas internas (`/app/*`), com tipografia mais leve (pedido do cliente: preto menos chamativo).

## Posse

`src/layouts/AppLayout.tsx`, `src/components/app/shell/{Sidebar,Topbar,MobileNav,PageHeader,index}.tsx`.

## AppLayout
```tsx
<div className="app-scope min-h-dvh bg-bg-alt text-ink md:flex">
  <Sidebar />                      // só md+ (≥1068px)
  <div className="flex-1 min-w-0 flex flex-col">
    <Topbar />
    <main id="conteudo" className="flex-1 px-4 sm:px-8 lg:px-14 pt-8 pb-14"><Outlet /></main>
  </div>
  <MobileNav />                    // só < md
</div>
```
Inclua link "Pular para o conteúdo".

## Sidebar (≥ 1068px)
- `w-60 shrink-0 bg-surface-dark text-on-dark px-4 py-7 flex flex-col gap-8 sticky top-0 h-dvh`.
- Topo: "Morada" `font-display text-[22px] font-medium tracking-[-0.02em] px-3`.
- Navegação (`<nav aria-label="App">`), `NavLink`s 14px `px-3 py-2.5 rounded-sm text-on-dark-2 hover:text-on-dark`; ativo: `bg-white/10 text-on-dark font-medium` + `aria-current="page"`. Ícones lucide 18px à esquerda:
  - Visão geral `/app` (LayoutGrid) — `end`
  - Imóveis `/app/imoveis` (Home)
  - Calendário `/app/calendario` (CalendarDays)
  - Reservas `/app/reservas` (ClipboardList)
  - Mensagens `/app/mensagens` (MessageCircle) + contador de não lidas (soma de `unread` de `getConversations()`), pílula `bg-on-dark text-surface-dark text-[12px] font-medium px-2`
  - Canais `/app/canais` (Link2)
  - Relatórios `/app/relatorios` (BarChart3)
- Rodapé: "Configurações" `/app/configuracoes` (Settings) e bloco `t-caption text-on-dark-2`: "Plano Pro" / "7 de 10 imóveis" com barra de progresso 4px (`bg-white/15`, preenchimento `bg-on-dark` 70%).

## Topbar
- `h-16 px-4 sm:px-8 lg:px-14 flex items-center gap-4 border-b border-line bg-bg-alt/80 backdrop-blur sticky top-0 z-30`.
- Esquerda (< md): "Morada" em display 19px.
- Busca: `input` com ícone Search, placeholder "Buscar imóvel, hóspede ou reserva", `rounded-pill bg-surface border border-line h-10 pl-10 w-full max-w-[420px] t-body-sm`, `<label className="sr-only">`. Atalho visual "⌘K" à direita do input (só decorativo).
- Direita: IconButton sino (`label="Notificações"`) com ponto verde se houver alerta; avatar "Ana Souza" (`Avatar` tone dark) que abre `DropdownMenu` com: Ana Souza / ana@exemplo.com.br (desabilitado), Configurações, Ver site (`/`), Sair (`/entrar`).
- Tema: item "Tema escuro" no dropdown com `Switch` que alterna `data-theme` no `<html>` e salva em `localStorage` na chave `morada:theme` (valores `light` | `dark` | `auto`, try/catch). Ao montar o AppLayout, aplique o valor salvo (`auto` segue `prefers-color-scheme`).

## MobileNav (< 1068px)
- Barra inferior fixa `fixed bottom-0 inset-x-0 h-[68px] bg-surface/90 backdrop-blur border-t border-line grid grid-cols-5` com `pb-[env(safe-area-inset-bottom)]`.
- Itens: Visão geral, Calendário, Reservas, Mensagens (com contador), Mais. "Mais" abre `Sheet` de baixo com Imóveis, Canais, Relatórios, Configurações.
- Item: ícone 22px + rótulo 11px; ativo em `text-verde`.
- Adicione `pb-24` ao `<main>` no mobile para não cobrir conteúdo.

## PageHeader (para as páginas do app usarem)
```ts
type PageHeaderProps = { title: string; subtitle?: string; actions?: React.ReactNode; breadcrumb?: { label: string; href: string } };
```
- `flex flex-wrap items-end justify-between gap-4 mb-8`. Título `<h1>` `font-display text-[32px] sm:text-[40px] leading-[1.1] font-medium tracking-[-0.02em]`; subtitle `t-body-sm text-ink-2 mt-1`; breadcrumb acima do título como link `t-body-sm text-ink-2` com "‹ ".
- Exporte de `components/app/shell/index.ts`.

## Critérios de aceite
- [ ] Sidebar em ≥1068px; barra inferior abaixo disso; nada sobreposto.
- [ ] `NavLink` ativo correto em todas as rotas (Visão geral só em `/app` exato).
- [ ] Tema escuro alterna e persiste; todo o app segue os tokens.
- [ ] Texto principal do app em `#3a3a3c` (via `.app-scope`), títulos peso 500.
- [ ] Typecheck, lint e build passam.
