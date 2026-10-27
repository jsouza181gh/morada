# T01 — Primitivos de UI e página /styleguide

- **Onda:** 1 (paralela a T02–T06)
- **Depende de:** T00
- **Leitura obrigatória:** `00-CONTEXTO.md` itens 6, 7, 10, 11, 12

## Objetivo

Implementar os componentes base da marca Morada com as APIs **exatas** do item 7 do contexto, substituindo os stubs, e uma página `/styleguide` que mostra todos com seus estados.

## Posse

`src/components/ui/{Button,Pill,Badge,ChannelBadge,Card,Headline,KpiCard,Section,Switch,SegmentedControl,IconButton,Skeleton,EmptyState,Avatar}.tsx`, `src/components/ui/index.ts`, `src/pages/Styleguide.tsx`, testes `src/components/ui/__tests__/*`.
Não altere os arquivos gerados pelo shadcn.

## Especificação por componente

Use `cn()` de `@/lib/cn`. Todos aceitam `className` e repassam `...rest` ao elemento raiz. Use `forwardRef` em Button, Pill, IconButton, Card.

**Button**
- Base: `inline-flex items-center justify-center gap-1.5 rounded-pill font-sans transition-colors active:scale-[.98] disabled:opacity-40 disabled:pointer-events-none select-none`.
- Tamanhos: sm `text-[14px] px-[15px] py-[7px]`; md `text-[17px] px-[21px] py-[11px]`; lg `text-[17px] px-7 py-4`. Mobile: altura mínima 44px em md/lg.
- Variantes: primary `bg-verde text-on-verde hover:bg-verde-strong`; secondary `border border-verde text-verde hover:bg-verde-soft`; link `text-verde px-0 hover:underline` e acrescenta `<span aria-hidden> ›</span>` depois dos children; ghost `text-ink hover:bg-bg-alt`; on-dark `border border-on-dark-2 text-on-dark hover:bg-white/10`.
- `href` começando com `/` → `<Link to>` do react-router; outro `href` → `<a>`; sem href → `<button type="button">` (respeitar `type` passado).
- `fullWidth` → `w-full`.

**Pill**
- `h-10 inline-flex items-center gap-2 pl-2.5 pr-4 rounded-pill border border-line-strong bg-surface text-ink text-[14px] font-medium hover:bg-bg-alt`.
- `icon` num círculo `size-[22px] rounded-pill border-[1.5px] border-current` à esquerda.
- `active`: `bg-verde border-verde text-on-verde`. `aria-pressed={active}`. Transição de cor 200ms.

**Badge**
- `inline-flex items-center gap-1 rounded-pill px-2.5 py-1 t-caption whitespace-nowrap`.
- neutral `bg-bg-alt text-ink-2`; verde `bg-verde-soft text-verde`; ouro `bg-ouro-soft text-ouro-ink`; warning `bg-warning-soft text-warning`; danger `bg-danger-soft text-danger`; dark `bg-surface-dark text-on-dark`.

**ChannelBadge**
- Contêiner `inline-flex items-center gap-2 rounded-pill border border-line bg-surface pl-3 pr-1 py-1 text-[14px]` (sm: `text-[12px] pl-2.5`).
- Nome via `CHANNEL_NAMES[channel]`, depois `Badge` conforme status: published `✓ Publicado` verde; pending `• Em análise` warning; error `! Erro` danger; off `– Desligado` neutral. Marca com `aria-hidden`.
- `title` = "Booking.com: Publicado".

**Card**
- `tone`: surface `bg-surface text-ink`; alt `bg-bg-alt text-ink`; dark `bg-surface-dark text-on-dark`.
- `size`: landing `rounded-card p-8 sm:p-12`; app `rounded-lg p-6`. Default: landing. `as` default `div`.

**Headline**
- Estrutura: `<header>` com `eyebrow` (`t-eyebrow`), título (`t-hero` / `t-section` / `t-section-xl` / `t-title` conforme size; tag padrão h1 para hero, h2 para outros) e `children` num `<p className="t-lead text-ink-2 mt-4">` (`tone="dark"` → `text-on-dark-2`).
- `align="center"` (padrão): `text-center mx-auto max-w-[720px]`; `start`: `text-left`.
- Dentro do parágrafo, `<b>`/`<strong>` ficam `text-ink font-medium` (dark: `text-on-dark`).

**KpiCard**
- Card app `bg-surface rounded-lg p-6`. Label `t-body-sm text-ink-2`; valor `font-display text-[34px] leading-[38px] font-medium tracking-[-0.02em] mt-2`; delta `t-body-sm font-medium mt-2` com `↑`/`↓` (`aria-hidden`) verde/danger + `caption` em `text-ink-2 font-normal`.
- `loading`: Skeletons no lugar do valor e do delta.

**Section**
- `<section id>` com `py-20 sm:py-30` e fundo conforme tone. Container interno: text `max-w-[980px]`, media `max-w-[1260px]`, full sem container; sempre `mx-auto px-4`.

**Switch**
- `<button role="switch" aria-checked aria-label>` 51×31, `rounded-pill`, fundo `bg-line-strong` / ligado `bg-verde`; "thumb" branco 27×27 com sombra, animado com `motion.span` `layout` usando `springs.snappy` (de `@/components/motion`; se ainda for stub, use `{ type:'spring', stiffness:400, damping:30 }` local).
- Espaço e Enter alternam. `disabled` → opacidade 40%.

**SegmentedControl**
- Contêiner `inline-flex p-1 rounded-pill bg-line/60`, `role="radiogroup"` + `aria-label`. Opções `role="radio" aria-checked`, `h-10 px-5 rounded-pill t-body-sm`. Indicador branco com sombra leve que desliza (`motion.span layoutId`). Setas ←/→ mudam a opção.

**IconButton**
- Circular; sm 32, md 44, lg 56. `glass`: `bg-line/55 backdrop-blur-xl text-ink`; `solid`: `bg-verde text-on-verde`; `ghost`: `hover:bg-bg-alt`. `aria-label={label}` sempre.

**Skeleton**: `animate-pulse rounded-md bg-bg-alt` (sem pulse com reduced motion: use `motion-safe:animate-pulse`).

**EmptyState**: centrado, ícone opcional não; título `t-headline`, descrição `t-body-sm text-ink-2`, ação abaixo.

**Avatar**: círculo com iniciais (2 letras, maiúsculas, do primeiro e último nome), `size` px (default 40), tones: verde `bg-verde-soft text-verde`, dark `bg-surface-dark text-on-dark`, neutral `bg-bg-alt text-ink-2`. `aria-label={name}` e `role="img"`.

## Página /styleguide

`pages/Styleguide.tsx` (sem layout): seções com título para Cores (amostras de todos os tokens do item 6.1 com nome e hex lidos via `getComputedStyle`), Tipografia (cada classe `.t-*` com o texto de exemplo), Botões (todas variantes × tamanhos + disabled), Pílulas (grupo com uma ativa, clicável), Badges, ChannelBadges (6 canais × 4 status), Cards (3 tons), Headline (hero/section/title), KpiCards (normal, down, loading), Switch e SegmentedControl funcionando, IconButtons, Avatar, EmptyState, Skeleton. Um botão no topo alterna `data-theme` entre `light` e `dark` no `<html>`.

## Testes (vitest + testing-library)

- Button: renderiza `<a>` com href externo, `Link` com href interno, `›` na variante link.
- ChannelBadge: texto "Booking.com" e "Em análise" para pending.
- Switch: clique e tecla Espaço alternam `aria-checked` e chamam `onCheckedChange`.
- SegmentedControl: seta → muda valor.

## Critérios de aceite

- [ ] APIs idênticas ao contrato (outras tasks compilam sem ajustes).
- [ ] `/styleguide` mostra tudo, nos dois temas, sem texto com contraste ruim.
- [ ] Testes passam. Typecheck, lint e build passam.
