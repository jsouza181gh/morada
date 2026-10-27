# 01 — Orquestração: ondas, dependências e como despachar agentes

## Ondas

| Onda | Tasks | Paralelismo | Pré-requisito |
|---|---|---|---|
| 0 | T00 | 1 agente | nenhum |
| 1 | T01, T02, T03, T04, T05, T06 | 6 agentes em paralelo | T00 concluída |
| 2 | T10, T11, T12, T13, T14, T15, T16, T17, T20, T21, T22, T23, T24, T25, T26 | até 15 agentes em paralelo | Onda 1 concluída |
| 3 | T30 | 1 agente | Onda 2 concluída |

A onda 2 pode começar parcialmente antes do fim da onda 1:
- Seções da landing (T10–T17) precisam de T01, T03, T04, T05 prontas (T02 só para T12, T14 e T16).
- Páginas do app (T20–T26) precisam de T01, T02, T06 prontas (T04 só para T22).

## Grafo

```
T00 ─┬─ T01 (primitivos UI) ───────┬─ T10 Hero
     ├─ T02 (mocks + api) ─────────┤─ T11 Destaques (carrossel)
     ├─ T03 (motion) ──────────────┤─ T12 Explorador de canais
     ├─ T04 (molduras de device) ──┤─ T13 Overbooking + Antes/Depois
     ├─ T05 (layout marketing) ────┤─ T14 Bento de recursos
     └─ T06 (layout app) ──────────┤─ T15 Detalhes + Passos + App
                                   ├─ T16 Preços + FAQ + CTA final + /precos
                                   ├─ T17 /como-funciona, /entrar, /cadastro
                                   ├─ T20 Dashboard
                                   ├─ T21 Imóveis (lista + detalhe)
                                   ├─ T22 Wizard de cadastro
                                   ├─ T23 Calendário multicanal
                                   ├─ T24 Reservas
                                   ├─ T25 Mensagens
                                   └─ T26 Canais + Relatórios + Configurações
                                                  └─ T30 QA final
```

## Posse de arquivos (resumo; detalhe em cada task)

| Task | Pasta/arquivos |
|---|---|
| T00 | raiz do projeto, `router.tsx`, `main.tsx`, `styles/*`, `lib/*`, `mocks/types.ts`, `components/ui/<shadcn>`, `pages/marketing/Landing.tsx`, todos os stubs iniciais |
| T01 | `components/ui/{Button,Pill,Badge,ChannelBadge,Card,Headline,KpiCard,Section,Switch,SegmentedControl,IconButton,Skeleton,EmptyState,Avatar,index}.tsx`, `pages/Styleguide.tsx` |
| T02 | `mocks/*` (menos `types.ts`), `hooks/useMock.ts` |
| T03 | `components/motion/*`, `hooks/useReducedMotion.ts`, `hooks/useAutoplay.ts` |
| T04 | `components/mockups/*` |
| T05 | `layouts/MarketingLayout.tsx`, `components/marketing/{GlobalNav,LocalNav,Footer}.tsx` |
| T06 | `layouts/AppLayout.tsx`, `components/app/shell/*` |
| T10 | `components/marketing/hero/*` |
| T11 | `components/marketing/highlights/*` |
| T12 | `components/marketing/explorer/*` |
| T13 | `components/marketing/story/*` |
| T14 | `components/marketing/bento/*` |
| T15 | `components/marketing/features/*` |
| T16 | `components/marketing/pricing/*`, `pages/marketing/Pricing.tsx` |
| T17 | `pages/marketing/{HowItWorks,Login,Signup}.tsx`, `components/marketing/auth/*` |
| T20 | `pages/app/Dashboard.tsx`, `components/app/dashboard/*` |
| T21 | `pages/app/{Properties,PropertyDetail}.tsx`, `components/app/properties/*` |
| T22 | `pages/app/PropertyNew.tsx`, `components/app/wizard/*` |
| T23 | `pages/app/Calendar.tsx`, `components/app/calendar/*` |
| T24 | `pages/app/Reservations.tsx`, `components/app/reservations/*` |
| T25 | `pages/app/Messages.tsx`, `components/app/messages/*` |
| T26 | `pages/app/{Channels,Reports,Settings}.tsx`, `components/app/{channels,reports,settings}/*` |
| T30 | qualquer arquivo, só para correções apontadas no relatório de QA |

A composição da landing (`pages/marketing/Landing.tsx`) é escrita pela T00 já importando os componentes de cada seção pelos caminhos fixos abaixo. Cada task da onda 2 substitui o stub do seu componente.

```tsx
// pages/marketing/Landing.tsx (T00)
import { Hero } from '@/components/marketing/hero/Hero';                         // T10
import { Highlights } from '@/components/marketing/highlights/Highlights';       // T11
import { ChannelExplorer } from '@/components/marketing/explorer/ChannelExplorer'; // T12
import { OverbookingStory } from '@/components/marketing/story/OverbookingStory'; // T13
import { Bento } from '@/components/marketing/bento/Bento';                       // T14
import { BeforeAfter } from '@/components/marketing/story/BeforeAfter';           // T13
import { FeatureGrid } from '@/components/marketing/features/FeatureGrid';        // T15
import { Steps } from '@/components/marketing/features/Steps';                    // T15
import { AppShowcase } from '@/components/marketing/features/AppShowcase';        // T15
import { PricingSection } from '@/components/marketing/pricing/PricingSection';   // T16
import { Faq } from '@/components/marketing/pricing/Faq';                         // T16
import { FinalCta } from '@/components/marketing/pricing/FinalCta';               // T16
export default function Landing() {
  return (<>
    <Hero /><Highlights /><ChannelExplorer /><OverbookingStory /><Bento /><BeforeAfter />
    <FeatureGrid /><Steps /><AppShowcase /><PricingSection /><Faq /><FinalCta />
  </>);
}
```

## Prompt padrão para despachar um agente

```
Você vai implementar a task {ID} do projeto Morada.
1. Leia tasks/00-CONTEXTO.md por inteiro (contratos, tokens, regras).
2. Leia tasks/{arquivo-da-task}.md e implemente exatamente o que está lá.
3. Trabalhe em morada-web/. Altere só os arquivos listados em "Posse" da sua task.
4. Se precisar de algo de outra task que ainda é stub, programe contra o contrato do 00-CONTEXTO.md; não implemente a outra task.
5. Ao terminar, rode npm run typecheck, npm run lint e npm run build.
6. Responda com: arquivos alterados, como verificou, desvios do contrato e pendências.
```

Skills úteis por task (instaladas em `.claude/skills/`): `frontend-design` (T10–T17), `apple-design` (T03, T10, T11, T12, T22), `shadcn` (T00, T21–T26), `web-design-guidelines` (T30).

## Conflitos e merge

Como cada task tem arquivos exclusivos, agentes podem trabalhar no mesmo checkout em pastas diferentes, ou cada um em seu worktree (`isolation: worktree`) e o orquestrador junta no fim. Se dois agentes precisarem de um utilitário comum não previsto, cada um cria uma versão local no próprio diretório; a T30 consolida.
