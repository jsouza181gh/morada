# T00 — Setup do projeto, tokens, contratos e stubs

- **Onda:** 0 (roda sozinha, antes de tudo)
- **Depende de:** nada
- **Desbloqueia:** todas as outras
- **Leitura obrigatória:** `00-CONTEXTO.md` inteiro

## Objetivo

Criar o projeto `morada-web/` compilando, com tokens, Tailwind, fontes, shadcn, rotas, utilitários, tipos dos mocks e **um stub para cada arquivo** que as outras tasks vão preencher. Ao final, `npm run dev` abre a landing com seções-stub e todas as rotas navegáveis.

## Posse

Tudo na raiz de `morada-web/` (configs), `src/main.tsx`, `src/router.tsx`, `src/styles/*`, `src/lib/*`, `src/mocks/types.ts`, `src/components/ui/<arquivos gerados pelo shadcn>`, `src/pages/marketing/Landing.tsx`, e a **criação inicial** dos stubs listados no passo 9 (depois eles passam a ser das tasks donas).

## Passos

### 1. Scaffold
```bash
npm create vite@latest morada-web -- --template react-ts
cd morada-web
npm i react-router motion embla-carousel-react recharts lucide-react clsx tailwind-merge @fontsource/inter @fontsource/inter-tight
npm i -D tailwindcss @tailwindcss/vite vitest @testing-library/react @testing-library/user-event @testing-library/jest-dom jsdom @types/node prettier
```
- `tsconfig.app.json`: `"strict": true`, `"noUncheckedIndexedAccess": true`, `"baseUrl": "."`, `"paths": { "@/*": ["./src/*"] }`.
- `vite.config.ts`: plugins `react()` e `tailwindcss()`; `resolve.alias: { '@': path.resolve(__dirname, 'src') }`; `test: { environment: 'jsdom', setupFiles: ['./src/test/setup.ts'], globals: true }` (criar `src/test/setup.ts` com `import '@testing-library/jest-dom'`).
- `package.json` scripts: `dev`, `build` (`tsc -b && vite build`), `preview`, `lint` (eslint do template), `typecheck` (`tsc -b --noEmit`), `test` (`vitest run`), `format` (`prettier --write src`).
- `.prettierrc`: `{ "singleQuote": true, "printWidth": 120, "semi": true }`.
- `index.html`: `lang="pt-BR"`, `<title>Morada — Um anúncio. Todos os lugares.</title>`, meta description "Cadastre seu imóvel uma vez e publique no Airbnb, Booking.com, Vrbo e mais.", `<meta name="theme-color" content="#006437">`.
- Apague `App.tsx`, `App.css`, `index.css` e assets do template.

### 2. shadcn
```bash
npx shadcn@latest init        # estilo default, base color neutral, CSS em src/styles/globals.css, alias @/components, @/lib/utils
npx shadcn@latest add accordion dialog sheet tabs select tooltip dropdown-menu popover checkbox input label textarea table sonner
```
- Se o shadcn criar `src/lib/utils.ts` com `cn`, mantenha e crie também `src/lib/cn.ts` que reexporta: `export { cn } from './utils';`.
- O shadcn escreve variáveis próprias no CSS. Substitua os **valores** delas por aliases dos nossos tokens (passo 3), para que os componentes Radix sigam a marca.

### 3. `src/styles/tokens.css` (copiar exatamente)
```css
:root, [data-theme="light"] {
  --bg: #ffffff; --bg-alt: #f5f5f7; --surface: #ffffff; --surface-dark: #0b2e1c;
  --line: #d2d2d7; --line-strong: #86868b;
  --ink: #1d1d1f; --ink-2: #6e6e73; --on-dark: #ffffff; --on-dark-2: #b5c9bd;
  --verde: #006437; --verde-strong: #004d2a; --verde-soft: #e6f2ec; --on-verde: #ffffff;
  --ouro: #c9a646; --ouro-ink: #7a5f14; --ouro-soft: #f7efd6;
  --warning: #9a5b00; --warning-soft: #fdf1dc; --danger: #b42318; --danger-soft: #fdecea;
  --shadow-float: 0 8px 32px rgba(0, 0, 0, 0.12);
}
[data-theme="dark"] {
  --bg: #0b0f0d; --bg-alt: #151a17; --surface: #1c221f; --surface-dark: #0f3a24;
  --line: #2e3430; --line-strong: #6b736e;
  --ink: #f5f5f7; --ink-2: #a1a1a6;
  --verde: #3fb27a; --verde-strong: #2f9a66; --verde-soft: #12301f; --on-verde: #04140c;
  --ouro: #d9b85a; --ouro-ink: #e2c46e; --ouro-soft: #2c2410;
  --warning: #f0b44c; --warning-soft: #2e2108; --danger: #ff8a7a; --danger-soft: #33130f;
  --shadow-float: 0 8px 32px rgba(0, 0, 0, 0.5);
}
.app-scope { --ink: #3a3a3c; }
[data-theme="dark"] .app-scope { --ink: #e5e5ea; }

/* aliases para shadcn */
:root {
  --background: var(--bg); --foreground: var(--ink);
  --card: var(--surface); --card-foreground: var(--ink);
  --popover: var(--surface); --popover-foreground: var(--ink);
  --primary: var(--verde); --primary-foreground: var(--on-verde);
  --secondary: var(--bg-alt); --secondary-foreground: var(--ink);
  --muted: var(--bg-alt); --muted-foreground: var(--ink-2);
  --accent: var(--verde-soft); --accent-foreground: var(--verde);
  --destructive: var(--danger); --border: var(--line); --input: var(--line-strong); --ring: var(--verde);
  --radius: 12px;
}
```

### 4. `src/styles/globals.css`
```css
@import "tailwindcss";
@import "./tokens.css";
@import "@fontsource/inter/400.css"; @import "@fontsource/inter/500.css"; @import "@fontsource/inter/600.css";
@import "@fontsource/inter-tight/500.css"; @import "@fontsource/inter-tight/600.css";

@theme inline {
  --breakpoint-*: initial;
  --breakpoint-sm: 734px; --breakpoint-md: 1068px; --breakpoint-lg: 1440px;
  --color-bg: var(--bg); --color-bg-alt: var(--bg-alt); --color-surface: var(--surface); --color-surface-dark: var(--surface-dark);
  --color-line: var(--line); --color-line-strong: var(--line-strong);
  --color-ink: var(--ink); --color-ink-2: var(--ink-2); --color-on-dark: var(--on-dark); --color-on-dark-2: var(--on-dark-2);
  --color-verde: var(--verde); --color-verde-strong: var(--verde-strong); --color-verde-soft: var(--verde-soft); --color-on-verde: var(--on-verde);
  --color-ouro: var(--ouro); --color-ouro-ink: var(--ouro-ink); --color-ouro-soft: var(--ouro-soft);
  --color-warning: var(--warning); --color-warning-soft: var(--warning-soft); --color-danger: var(--danger); --color-danger-soft: var(--danger-soft);
  --radius-sm: 8px; --radius-md: 12px; --radius-lg: 18px; --radius-card: 28px; --radius-pill: 999px;
  --shadow-float: var(--shadow-float);
  --font-display: "Inter Tight", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  --font-sans: Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
}
```
Acrescente, em `@layer base`: `html { -webkit-font-smoothing: antialiased; }`, `body { @apply bg-bg text-ink font-sans; }`, `:focus-visible { outline: 2px solid var(--verde); outline-offset: 2px; }`, `@media (prefers-reduced-motion: reduce) { *, *::before, *::after { scroll-behavior: auto !important; } }`.
Em `@layer components`, as classes de tipografia da tabela 6.3 do contexto (`.t-hero`, `.t-section`, `.t-section-xl`, `.t-title`, `.t-stat`, `.t-headline`, `.t-eyebrow`, `.t-lead`, `.t-body`, `.t-body-sm`, `.t-caption`), cada uma com a versão mobile em `@media (max-width: 733px)`.

Mescle com o CSS que o shadcn gerou: mantenha imports/plugins que ele precisar (ex.: `tw-animate-css`), remova os valores de cor dele (os aliases do passo 3 substituem).

### 5. `src/lib/date.ts`
```ts
export const TODAY = '2026-10-24';
export function addDays(iso: string, n: number): string;        // 'YYYY-MM-DD'
export function diffDays(a: string, b: string): number;         // b - a em dias
export function eachDay(from: string, to: string): string[];    // inclusivo
export function isWeekend(iso: string): boolean;
```
Use datas em UTC para evitar fuso (`new Date(iso + 'T00:00:00Z')`).

### 6. `src/lib/format.ts`
Implementar com `Intl` em `pt-BR`: `formatBRL`, `formatBRLFull`, `formatPct`, `formatDateShort`, `formatRange`, `formatWeekday`, `formatRelative` (contrato no item 8 do contexto; meses abreviados minúsculos sem ponto: jan fev mar abr mai jun jul ago set out nov dez). Escreva `src/lib/format.test.ts` com um teste por função.

### 7. `src/mocks/types.ts`
Copie exatamente os tipos e constantes do item 8 do `00-CONTEXTO.md`.

### 8. Roteamento
- `src/main.tsx`: importa `./styles/globals.css`, renderiza `<RouterProvider router={router} />` dentro de `<StrictMode>`; adiciona `<Toaster />` do sonner.
- `src/router.tsx`: `createBrowserRouter` com todas as rotas do item 5 do contexto; páginas via `lazy: () => import(...).then(m => ({ Component: m.default }))`; rota `*` com página 404 simples inline ("Página não encontrada." + Button link "Voltar ao início ›" para `/`).
- `ScrollRestoration` no MarketingLayout é responsabilidade da T05; aqui não.

### 9. Stubs (criar todos; cada um exporta o nome indicado e renderiza `<section data-stub="Nome" className="p-8 text-ink-2">Nome</section>`)

Layouts (export default, renderizam `<Outlet />` dentro de `<main>`): `layouts/MarketingLayout.tsx`, `layouts/AppLayout.tsx` (o de app já com `className="app-scope"`).

Páginas (export default): todas do item 5 do contexto, exceto `Landing.tsx`, que é escrita já completa conforme `01-ORQUESTRACAO.md`.

Seções nomeadas (export nomeado):
- `components/marketing/GlobalNav.tsx` → `GlobalNav`; `LocalNav.tsx` → `LocalNav`; `Footer.tsx` → `Footer`
- `components/marketing/hero/Hero.tsx` → `Hero`
- `components/marketing/highlights/Highlights.tsx` → `Highlights`
- `components/marketing/explorer/ChannelExplorer.tsx` → `ChannelExplorer`
- `components/marketing/story/OverbookingStory.tsx` → `OverbookingStory`; `story/BeforeAfter.tsx` → `BeforeAfter`
- `components/marketing/bento/Bento.tsx` → `Bento`
- `components/marketing/features/FeatureGrid.tsx` → `FeatureGrid`; `features/Steps.tsx` → `Steps`; `features/AppShowcase.tsx` → `AppShowcase`
- `components/marketing/pricing/PricingSection.tsx` → `PricingSection`; `pricing/Faq.tsx` → `Faq`; `pricing/FinalCta.tsx` → `FinalCta`

Primitivos (stubs mínimos que já respeitam as props do contrato e renderizam algo funcional simples, para que tasks da onda 2 compilem mesmo antes da T01): todos os do item 7 do contexto em `components/ui/`, mais `components/ui/index.ts` reexportando. Ex.: `Button` stub renderiza `<button className="rounded-pill bg-verde text-on-verde px-5 py-2">`.

Motion (stubs): `components/motion/index.ts` com `springs`, `Reveal` (renderiza `children` sem animar); `hooks/useReducedMotion.ts` (retorna `false`); `hooks/useAutoplay.ts` (estado simples sem timer).

Mockups (stubs): `components/mockups/index.ts` com `LaptopFrame`, `PhoneFrame`, `BrowserFrame` renderizando `div` com borda.

Mocks (stubs): `mocks/api.ts` com todas as funções do contrato retornando arrays vazios / `undefined`; `hooks/useMock.ts` funcional (é simples; a T02 pode reescrever).

## Critérios de aceite

- [ ] `npm run dev` abre `/` mostrando os 12 stubs da landing em ordem.
- [ ] Todas as rotas do contexto abrem sem erro; `/app/*` aparece dentro do AppLayout com `.app-scope`.
- [ ] Classes `bg-verde`, `rounded-card`, `font-display`, `t-hero`, `sm:` (734px) funcionam (teste rápido numa página stub e remova depois).
- [ ] Componentes shadcn gerados usam o verde da marca (`--primary`).
- [ ] `npm run typecheck`, `lint`, `build`, `test` passam.
- [ ] Repositório git inicializado com commit "chore: scaffold morada-web" (se o usuário tiver pedido commits; caso contrário só deixe os arquivos).
