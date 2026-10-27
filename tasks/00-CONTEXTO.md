# 00 — Contexto compartilhado (leitura obrigatória para TODA task)

Este arquivo é o contrato entre as tasks. Todas as tasks rodam em paralelo contra estas definições. **Não mude nada deste contrato dentro de uma task.** Se algo aqui estiver errado ou faltando, implemente o mínimo necessário dentro dos SEUS arquivos e registre no relatório final ("Desvios do contrato").

## 1. O produto

**Morada** é um hub para anfitriões de aluguel por temporada. O anfitrião cadastra o imóvel **uma vez** e publica em vários canais (Airbnb, Booking.com, Vrbo, Trivago, Decolar, Expedia). Calendário, preços e mensagens ficam unificados.

Fase atual: **só frontend**, Vite + React + TypeScript, **dados mockados** (sem backend, sem auth real). Objetivo: representar fielmente o design.

Referência visual: página de produto da Apple (apple.com/br/iphone-duo): uma ideia por tela, títulos enormes e curtos, muito espaço em branco, seções alternando fundo branco e cinza, cards grandes com cantos de 28px, botões em pílula, barra de navegação flutuante em pílula, carrosséis com controle de play/pause. Paleta: verde e branco (inspirada no Palmeiras), dourado como acento raro.

Mockups aprovados (referência visual, não é código para copiar): https://claude.ai/artifact/5QAY5xtY7af2VNQVnR6cn9
Design system: https://claude.ai/artifact/PSoEMBBQXff4smtmwzz4tk

## 2. Local e comandos

- Raiz do app: `morada-web/` (dentro da pasta do projeto).
- Gerenciador: `npm`.
- Rodar: `npm run dev`. Checar tipos: `npx tsc -b --noEmit` (ou `npm run typecheck`). Lint: `npm run lint`. Build: `npm run build`. Testes: `npm run test`.
- Toda task termina com `npm run typecheck`, `npm run lint` e `npm run build` passando.

### Notas do setup real (T00 concluída)
- Versões: react 19.3, vite 8.3, tailwindcss 4.3, react-router 7.18 (não atualizar para 8), motion 14.6, typescript 6.0, vitest 5.0.
- Lint é **oxlint** (não eslint).
- O botão do shadcn se chama `components/ui/shadcn-button.tsx` (no Windows `button.tsx` colide com `Button.tsx`). Ao rodar `npx shadcn add`, se ele gerar `button.tsx`, renomeie e ajuste imports. O `Button` da marca é o `components/ui/Button.tsx`.
- Tema escuro do shadcn usa `[data-theme="dark"]`, não `.dark`.
- `src/lib/date.ts` também exporta `NOW_ISO`; `src/lib/format.ts` também exporta `formatNumber`.
- `main.tsx` já envolve tudo em `TooltipProvider` e renderiza o `Toaster` (sonner).
- Vários agentes rodam ao mesmo tempo no mesmo checkout. Se `typecheck`/`build` falhar por causa de arquivo de OUTRA task (em andamento), não corrija: confirme que os SEUS arquivos não têm erros (`npx tsc -b --noEmit 2>&1 | grep <sua pasta>`) e registre no relatório.
- Não instale dependências novas sem necessidade; se precisar, registre no relatório (outro agente pode estar rodando `npm` ao mesmo tempo).

## 3. Stack (instalada pela T00)

| Camada | Pacote |
|---|---|
| Build | `vite` (template `react-ts`), React 19, TypeScript strict |
| Estilo | Tailwind CSS v4 via `@tailwindcss/vite` |
| Componentes base | shadcn/ui (Radix): accordion, dialog, sheet, tabs, select, tooltip, dropdown-menu, popover, checkbox, input, label, textarea, table, sonner |
| Animação | `motion` (import de `motion/react`) |
| Rotas | `react-router` v7 (modo biblioteca: `createBrowserRouter`) |
| Carrossel | `embla-carousel-react` |
| Gráficos | `recharts` |
| Ícones | `lucide-react` (stroke 1.5) |
| Fontes | `@fontsource/inter` (400, 500, 600) e `@fontsource/inter-tight` (500, 600) |
| Utilitários | `clsx`, `tailwind-merge` (função `cn` em `src/lib/cn.ts`) |
| Testes | `vitest`, `@testing-library/react`, `@testing-library/user-event`, `jsdom` |

Alias de import: `@/` → `src/`.

## 4. Estrutura de pastas (criada pela T00 com stubs)

```
morada-web/src/
  main.tsx                 # monta <RouterProvider>
  router.tsx               # todas as rotas (T00, ninguém mais edita)
  styles/
    tokens.css             # tokens (T00)
    globals.css            # tailwind + @theme + classes de tipografia (T00)
  lib/
    cn.ts                  # cn() (T00)
    format.ts              # moeda, datas, números pt-BR (T00)
    date.ts                # TODAY fixo e helpers de data (T00)
  mocks/                   # T02 (types.ts é da T00)
    types.ts  channels.ts  properties.ts  reservations.ts  messages.ts
    metrics.ts  plans.ts  faq.ts  team.ts  api.ts
  hooks/
    useMock.ts             # T02
    useReducedMotion.ts    # T03
    useAutoplay.ts         # T03
  components/
    ui/                    # primitivos Morada (T01) + shadcn gerados (T00)
    motion/                # Reveal, springs (T03)
    mockups/               # LaptopFrame, PhoneFrame, BrowserFrame (T04)
    marketing/             # nav, footer (T05) e seções da landing (T10–T16)
    app/                   # shell do app (T06) e componentes de páginas (T20–T26)
  layouts/
    MarketingLayout.tsx    # T05
    AppLayout.tsx          # T06
  pages/
    Styleguide.tsx         # T01
    marketing/  Landing.tsx (T00 compõe)  Pricing.tsx  HowItWorks.tsx  Login.tsx  Signup.tsx
    app/  Dashboard.tsx  Properties.tsx  PropertyDetail.tsx  PropertyNew.tsx  Calendar.tsx
          Reservations.tsx  Messages.tsx  Channels.tsx  Reports.tsx  Settings.tsx
```

**Regra de posse:** cada task lista os arquivos que pode criar/editar. Não edite arquivos de outra task. A T00 cria um **stub** para cada arquivo listado aqui (componente que renderiza `<section data-stub="NomeDoArquivo" />`); a task dona substitui o stub pelo conteúdo real mantendo **o mesmo nome de export**.

## 5. Rotas (definidas em `router.tsx` pela T00)

| Caminho | Layout | Página (export default) |
|---|---|---|
| `/` | MarketingLayout | `pages/marketing/Landing` |
| `/precos` | MarketingLayout | `pages/marketing/Pricing` |
| `/como-funciona` | MarketingLayout | `pages/marketing/HowItWorks` |
| `/entrar` | nenhum (tela cheia) | `pages/marketing/Login` |
| `/cadastro` | nenhum | `pages/marketing/Signup` |
| `/styleguide` | nenhum | `pages/Styleguide` |
| `/app` | AppLayout | `pages/app/Dashboard` |
| `/app/imoveis` | AppLayout | `pages/app/Properties` |
| `/app/imoveis/novo` | nenhum (tela cheia, wizard) | `pages/app/PropertyNew` |
| `/app/imoveis/:id` | AppLayout | `pages/app/PropertyDetail` |
| `/app/calendario` | AppLayout | `pages/app/Calendar` |
| `/app/reservas` | AppLayout | `pages/app/Reservations` |
| `/app/mensagens` | AppLayout | `pages/app/Messages` |
| `/app/canais` | AppLayout | `pages/app/Channels` |
| `/app/relatorios` | AppLayout | `pages/app/Reports` |
| `/app/configuracoes` | AppLayout | `pages/app/Settings` |

Páginas são carregadas com `lazy` do React Router. Layouts usam `<Outlet />`.

## 6. Tokens de design

### 6.1 Cores (CSS custom properties em `styles/tokens.css`)

| Token | Claro | Escuro | Uso |
|---|---|---|---|
| `--bg` | #ffffff | #0b0f0d | Fundo de página e seções brancas |
| `--bg-alt` | #f5f5f7 | #151a17 | Seções alternadas; fundo atrás de cards brancos |
| `--surface` | #ffffff | #1c221f | Cards sobre bg-alt, menus, barras flutuantes |
| `--surface-dark` | #0b2e1c | #0f3a24 | Seções/cards escuros de impacto (máx. 1–2 por página); sidebar do app |
| `--line` | #d2d2d7 | #2e3430 | Divisórias de 1px (decorativas) |
| `--line-strong` | #86868b | #6b736e | Borda de inputs, botão secondary, pílula inativa (3:1) |
| `--ink` | #1d1d1f | #f5f5f7 | Texto principal |
| `--ink-2` | #6e6e73 | #a1a1a6 | Texto secundário, legendas |
| `--on-dark` | #ffffff | #ffffff | Texto sobre surface-dark |
| `--on-dark-2` | #b5c9bd | #b5c9bd | Texto secundário sobre surface-dark |
| `--verde` | #006437 | #3fb27a | Cor de ação: CTA, link, ativo, foco |
| `--verde-strong` | #004d2a | #2f9a66 | Hover/pressed do CTA |
| `--verde-soft` | #e6f2ec | #12301f | Fundo de badge/realce; texto verde por cima |
| `--on-verde` | #ffffff | #04140c | Texto sobre fill verde |
| `--ouro` | #c9a646 | #d9b85a | Acento raro (estrelas, selo). Nunca texto. Máx. 3 por tela |
| `--ouro-ink` | #7a5f14 | #e2c46e | Texto dourado sobre ouro-soft |
| `--ouro-soft` | #f7efd6 | #2c2410 | Fundo de selo Premium |
| `--warning` | #9a5b00 | #f0b44c | Pendente / em análise |
| `--warning-soft` | #fdf1dc | #2e2108 | Fundo de badge pendente |
| `--danger` | #b42318 | #ff8a7a | Erro / destrutivo |
| `--danger-soft` | #fdecea | #33130f | Fundo de badge de erro |
| `--shadow-float` | 0 8px 32px rgba(0,0,0,.12) | 0 8px 32px rgba(0,0,0,.5) | Só elementos flutuantes (nav sticky, barra de preço, menus) |

Escopo do app (pedido do cliente: texto preto mais leve nas telas internas): o `AppLayout` aplica a classe `.app-scope`, que redefine `--ink: #3a3a3c` (escuro: `#e5e5ea`). Nas telas do app, títulos usam **peso 500** (não 600) e negrito de destaque usa 500.

### 6.2 Tailwind v4 (`@theme inline` em `globals.css`)

Classes disponíveis: `bg-bg`, `bg-bg-alt`, `bg-surface`, `bg-surface-dark`, `text-ink`, `text-ink-2`, `text-on-dark`, `text-on-dark-2`, `bg-verde`, `text-verde`, `bg-verde-strong`, `bg-verde-soft`, `text-on-verde`, `bg-ouro`, `text-ouro-ink`, `bg-ouro-soft`, `text-warning`, `bg-warning-soft`, `text-danger`, `bg-danger-soft`, `border-line`, `border-line-strong`, `shadow-float`, `rounded-sm`(8) `rounded-md`(12) `rounded-lg`(18) `rounded-card`(28) `rounded-pill`(999px), `font-display`, `font-sans`.
Espaçamento: escala padrão do Tailwind (unidade 4px). Seção: `py-30` = 120px desktop, `py-20` = 80px mobile.
Breakpoints (substituem os padrões): `sm` = 734px, `md` = 1068px, `lg` = 1440px.
Containers: texto/grids `max-w-[980px]`, mídia/carrosséis `max-w-[1260px]`, ambos `mx-auto px-4`.

### 6.3 Tipografia (classes em `globals.css`)

| Classe | Família | Desktop | Mobile (<734px) | Uso |
|---|---|---|---|---|
| `.t-hero` | display | 104/100px, 600, ls -0.035em | 56/58px | 1 por página |
| `.t-section` | display | 56/60px, 600, ls -0.025em | 40/44px | abre seção |
| `.t-section-xl` | display | 80/80px, 600, ls -0.035em | 48/50px | seções de impacto |
| `.t-title` | display | 32/36px, 600, ls -0.02em | 28/32px | título de card de destaque |
| `.t-stat` | display | 56/56px, 600, ls -0.03em | 44/44px | números grandes |
| `.t-headline` | sans | 21/28px, 600, ls -0.01em | igual | subtítulos |
| `.t-eyebrow` | sans | 21/25px, 600 | 17/21px | linha acima do hero |
| `.t-lead` | sans | 21/30px, 400 | 19/28px | parágrafo de abertura |
| `.t-body` | sans | 17/25px, 400, ls -0.01em | igual | corpo da landing |
| `.t-body-sm` | sans | 14/20px, 400 | igual | corpo do app |
| `.t-caption` | sans | 12/16px, 500 | igual | metadados, badges |

Display = `"Inter Tight"`; sans = `Inter`. Parágrafos com no máximo ~60ch.

## 7. Contratos de componentes (implementados pela T01; use exatamente estas APIs)

Arquivo único de export: `src/components/ui/index.ts` reexporta todos.

```ts
// Button.tsx
type ButtonProps = {
  variant?: 'primary' | 'secondary' | 'link' | 'ghost' | 'on-dark';   // default 'primary'
  size?: 'sm' | 'md' | 'lg';                                        // default 'md'
  href?: string;            // se presente renderiza <Link> (interno, começa com "/") ou <a>
  iconLeft?: React.ReactNode; iconRight?: React.ReactNode;
  fullWidth?: boolean;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;
// primary: bg-verde text-on-verde, hover verde-strong; secondary: borda verde, texto verde, hover verde-soft;
// link: texto verde com " ›" no fim; ghost: sem fundo, texto ink; on-dark: borda on-dark-2, texto on-dark (para fundos surface-dark)
// sizes: sm 14px py-[7px] px-[15px]; md 17px py-[11px] px-[21px]; lg 17px py-4 px-7. Sempre rounded-pill. active:scale-[.98]. disabled: opacity .4

// Pill.tsx  — botão de seleção em grupo
type PillProps = { active?: boolean; icon?: React.ReactNode } & React.ButtonHTMLAttributes<HTMLButtonElement>;
// altura 40, rounded-pill, borda line-strong, bg-surface; active: bg-verde text-on-verde; aria-pressed

// Badge.tsx
type BadgeProps = { tone?: 'neutral'|'verde'|'ouro'|'warning'|'danger'|'dark'; children: React.ReactNode; className?: string };

// ChannelBadge.tsx
type ChannelBadgeProps = { channel: ChannelId; status: ListingStatus; size?: 'sm'|'md'; className?: string };
// mostra nome do canal (de CHANNEL_NAMES) + Badge com marca e palavra: published ✓ Publicado (verde), pending • Em análise (warning),
// error ! Erro (danger), off – Desligado (neutral). Nunca depende só de cor.

// Card.tsx
type CardProps = { tone?: 'surface'|'alt'|'dark'; size?: 'landing'|'app'; as?: React.ElementType } & React.HTMLAttributes<HTMLElement>;
// landing: rounded-card p-12 (p-8 no mobile); app: rounded-lg p-6. Sem sombra. dark: bg-surface-dark text-on-dark

// Headline.tsx
type HeadlineProps = { eyebrow?: React.ReactNode; title: React.ReactNode; size?: 'hero'|'section'|'section-xl'|'title';
  align?: 'center'|'start'; as?: 'h1'|'h2'|'h3'; children?: React.ReactNode /* parágrafo de apoio */; className?: string; tone?: 'light'|'dark' };

// KpiCard.tsx
type KpiCardProps = { label: string; value: string; delta?: string; trend?: 'up'|'down'; caption?: string; loading?: boolean };
// valor em font-display 34px peso 500; delta com seta ↑ verde / ↓ danger

// Section.tsx  — wrapper de seção da landing
type SectionProps = { tone?: 'white'|'alt'|'dark'; id?: string; width?: 'text'|'media'|'full'; className?: string; children: React.ReactNode };
// py-20 sm:py-30; white=bg-bg, alt=bg-bg-alt, dark=bg-surface-dark text-on-dark; width controla o container interno

// Switch.tsx — interruptor iOS (51x31), role="switch", aria-checked, verde quando ligado, animação spring do "thumb"
type SwitchProps = { checked: boolean; onCheckedChange: (v: boolean) => void; label: string /* aria-label */; disabled?: boolean };

// SegmentedControl.tsx — ex.: Mensal / Anual
type SegmentedControlProps<T extends string> = { value: T; onChange: (v: T) => void; options: { value: T; label: string }[]; ariaLabel: string };

// IconButton.tsx — botão circular só com ícone; aria-label obrigatório
type IconButtonProps = { label: string; size?: 'sm'|'md'|'lg'; variant?: 'glass'|'solid'|'ghost' } & React.ButtonHTMLAttributes<HTMLButtonElement>;

// Skeleton.tsx
type SkeletonProps = { className?: string };   // bloco bg-bg-alt animate-pulse rounded-md

// EmptyState.tsx
type EmptyStateProps = { title: string; description?: string; action?: React.ReactNode };

// Avatar.tsx — iniciais em círculo
type AvatarProps = { name: string; size?: number; tone?: 'verde'|'dark'|'neutral' };
```

Componentes de mockup (T04), em `src/components/mockups/index.ts`:

```ts
type LaptopFrameProps = { children: React.ReactNode; className?: string };   // bezel #1d1d1f, tela 16:10, base cinza
type PhoneFrameProps  = { children: React.ReactNode; width?: number /* default 300 */; className?: string; tone?: 'light'|'dark' }; // bezel, ilha dinâmica
type BrowserFrameProps = { url: string; children: React.ReactNode; className?: string; style?: React.CSSProperties };
```

Motion (T03), em `src/components/motion/index.ts` e `src/hooks/`:

```ts
export const springs = { gentle: { type: 'spring', stiffness: 120, damping: 20 }, snappy: { type: 'spring', stiffness: 400, damping: 30 }, layout: { type: 'spring', stiffness: 300, damping: 32 } };
export function Reveal(props: { children: React.ReactNode; delay?: number; y?: number /* default 24 */; className?: string; as?: React.ElementType }): JSX.Element;
// fade + translateY ao entrar na viewport, uma vez. Com reduced motion: renderiza sem animação.
export function useReducedMotion(): boolean;
export function useAutoplay(opts: { count: number; intervalMs?: number /* 5000 */; enabled?: boolean }):
  { index: number; setIndex: (i: number) => void; playing: boolean; toggle: () => void; pause: () => void };
// pausa sozinho com reduced motion; não avança com aba oculta (document.hidden)
```

## 8. Dados mockados (tipos em `src/mocks/types.ts`, escritos pela T00; dados pela T02)

```ts
export type ChannelId = 'airbnb' | 'booking' | 'vrbo' | 'trivago' | 'decolar' | 'expedia';
export const CHANNEL_IDS: ChannelId[] = ['airbnb', 'booking', 'vrbo', 'trivago', 'decolar', 'expedia'];
export const CHANNEL_NAMES: Record<ChannelId, string> = { airbnb: 'Airbnb', booking: 'Booking.com', vrbo: 'Vrbo', trivago: 'Trivago', decolar: 'Decolar', expedia: 'Expedia' };

export type ListingStatus = 'published' | 'pending' | 'error' | 'off';
export type SyncHealth = 'ok' | 'warning' | 'error';

export interface Channel {
  id: ChannelId; name: string;
  feePct: number;              // 0.03 = 3%
  feeLabel: string;            // "3% do anfitrião", "15% de comissão", "Sem taxa própria"
  titleMaxLength: number | null;
  connected: boolean; accountLabel?: string;
  lastSyncAt: string;          // ISO
  health: SyncHealth; healthNote?: string;
  blurb: string;               // texto curto usado no explorador da landing
}

export interface ChannelListing { status: ListingStatus; price: number /* diária no canal, BRL */; title: string; issue?: string }

export interface Property {
  id: string; name: string; type: 'casa' | 'apartamento' | 'loft' | 'chale' | 'studio';
  city: string; state: string; neighborhood: string;
  guests: number; bedrooms: number; bathrooms: number;
  amenities: string[]; photos: string[]; coverIndex: number;
  description: string;
  nightlyNet: number;          // quanto o anfitrião quer receber por noite
  cleaningFee: number; minNights: number; checkIn: string /* "15:00" */; checkOut: string /* "11:00" */;
  rating: number; reviewsCount: number;
  channels: Record<ChannelId, ChannelListing>;
  createdAt: string;
}

export type ReservationStatus = 'confirmed' | 'pending_payment' | 'cancelled' | 'blocked';
export interface Reservation {
  id: string; propertyId: string; channelId: ChannelId | null;   // null = bloqueio manual
  guestName: string; guests: number;
  checkIn: string; checkOut: string;    // 'YYYY-MM-DD'
  total: number; status: ReservationStatus; createdAt: string; note?: string;
}

export interface Message { id: string; from: 'guest' | 'host'; text: string; sentAt: string }
export interface Conversation { id: string; propertyId: string; channelId: ChannelId; guestName: string; reservationId?: string; unread: number; messages: Message[] }

export interface MonthlyMetric { month: string /* 'YYYY-MM' */; revenueByChannel: Record<ChannelId, number>; occupancy: number /* 0–1 */; adr: number }
export interface DashboardSummary { revenueMonth: number; revenueDeltaPct: number; occupancy: number; occupancyDeltaPp: number; adr: number; adrDeltaPct: number; rating: number; ratingDelta: number }
export interface Plan { id: 'essencial' | 'pro' | 'anfitriao'; name: string; description: string; monthly: number | null; yearly: number | null; featured: boolean; cta: string; features: string[] }
export interface FaqItem { q: string; a: string }
export interface TeamMember { id: string; name: string; role: 'proprietario' | 'limpeza' | 'checkin' | 'financeiro' }
```

API mock (`src/mocks/api.ts`, T02). Toda função retorna `Promise` com atraso aleatório de 300–600ms (exceto se `import.meta.env.MODE === 'test'`: 0ms):

```ts
getChannels(): Promise<Channel[]>
getProperties(): Promise<Property[]>
getProperty(id: string): Promise<Property | undefined>
getReservations(f?: { from?: string; to?: string; propertyId?: string; channelId?: ChannelId; status?: ReservationStatus }): Promise<Reservation[]>
getConversations(): Promise<Conversation[]>
getConversation(id: string): Promise<Conversation | undefined>
getMetrics(): Promise<MonthlyMetric[]>             // últimos 12 meses até 2026-10
getDashboardSummary(): Promise<DashboardSummary>
getPlans(): Promise<Plan[]>
getFaq(): Promise<FaqItem[]>
getTeam(): Promise<TeamMember[]>
// mutações em memória (estado do módulo; perde ao recarregar):
setListingStatus(propertyId: string, channelId: ChannelId, status: ListingStatus): Promise<Property>
sendMessage(conversationId: string, text: string): Promise<Message>
createProperty(draft: Omit<Property, 'id' | 'createdAt' | 'rating' | 'reviewsCount'>): Promise<Property>
blockDates(propertyId: string, checkIn: string, checkOut: string, note?: string): Promise<Reservation>
```

Hook (`src/hooks/useMock.ts`, T02):
```ts
function useMock<T>(fn: () => Promise<T>, deps?: React.DependencyList): { data: T | undefined; loading: boolean; error: Error | undefined; reload: () => void };
```

Data "hoje" fixa: `TODAY = '2026-10-24'` em `src/lib/date.ts` (sábado; hora de referência 15:00, fuso America/Sao_Paulo). Nunca use `new Date()` para "hoje" na UI.

Formatação (`src/lib/format.ts`, T00): `formatBRL(1250) → "R$ 1.250"` (sem centavos quando inteiro), `formatBRLFull(1250.5) → "R$ 1.250,50"`, `formatPct(0.87) → "87%"`, `formatDateShort('2026-10-26') → "26 out"`, `formatRange('2026-10-26','2026-10-30') → "26 a 30 out"`, `formatWeekday('2026-10-24') → "sáb"`, `formatRelative(iso) → "há 2 min"` (relativo a TODAY 15:00).

## 9. Regras de texto (voz da marca)

- Português do Brasil. Fale com o anfitrião por "você". Frases curtas, afirmativas, sem exclamação, sem emoji, sem superlativos vazios.
- Títulos de 2 a 6 palavras terminando em ponto: "Um anúncio. Todos os lugares."
- Sentence case em tudo, inclusive botões. Botões começam com verbo: "Começar grátis", "Publicar agora".
- Links de continuação terminam com " ›".
- Nomes de canais exatamente: Airbnb, Booking.com, Vrbo, Trivago, Decolar, Expedia.
- Não invente estatísticas de mercado nem depoimentos. Números do produto (receita, ocupação) vêm dos mocks.
- Rodapé da landing deve dizer: "Preços e taxas mostrados são exemplos. Morada é independente e não tem vínculo com Airbnb, Booking.com, Vrbo, Trivago, Decolar ou Expedia."

## 10. Regras de UI

- Separação de seções por troca de fundo (bg / bg-alt), não por bordas. Cards **sem sombra**; `shadow-float` só em elementos flutuantes.
- Verde só em ação, link, ativo, foco. Um botão primary por área visível. `surface-dark` em no máximo 2 seções por página.
- Dourado: só estrelas de avaliação e selo "Mais escolhido"/Premium.
- Status sempre com palavra ou ícone além da cor.
- Imagens de imóveis: `https://picsum.photos/seed/<seed>/1200/800` (seed fixo por foto), sempre com `alt`, `loading="lazy"` (exceto hero), `object-cover`, com fundo `bg-verde-soft` enquanto carrega.
- Ícones: lucide-react, `strokeWidth={1.5}`, 20px no app e 24px na landing.
- Logos de canais: **não** desenhar nem baixar. Usar o nome em texto.

## 11. Movimento

- Reveal ao rolar: fade + translateY 24px, `springs.gentle`, uma vez por elemento. Não aplique em toda seção: use em mídia grande e grupos de cards.
- Troca de conteúdo em explorador/pílulas: crossfade 400ms com `AnimatePresence`. Pílula ativa expande com `layout`.
- Carrossel: autoplay 5s, botão play/pause visível, pausa no hover/foco e quando o usuário escolhe um ponto.
- Interruptores e segmentados: spring `snappy`.
- `prefers-reduced-motion`: sem reveal, sem autoplay, sem parallax; trocas instantâneas.

## 12. Acessibilidade (obrigatório)

- Elementos reais: `<button>`, `<a href>`, `<input>` + `<label>`. Nunca `onClick` em `div`.
- Foco visível: `outline: 2px solid var(--verde); outline-offset: 2px` (já global via `:focus-visible` na T00).
- Contraste AA. Botões só com ícone têm `aria-label`. SVG decorativo `aria-hidden="true"`; informativo `role="img"` + `aria-label`.
- Áreas de toque ≥ 44px no mobile.
- Tabelas largas em caixa com `overflow-x-auto`.
- Cada página com um `<h1>` (na landing, o do hero).

## 13. Definição de pronto (toda task)

1. Só arquivos da sua posse foram alterados.
2. `npm run typecheck`, `npm run lint`, `npm run build` passam.
3. Funciona em 375px, 768px, 1280px e 1440px sem rolagem horizontal da página.
4. Teclado: tudo alcançável e operável com Tab/Enter/Espaço/setas quando aplicável.
5. `prefers-reduced-motion` respeitado.
6. Relatório final com: arquivos alterados, desvios do contrato, pendências.
