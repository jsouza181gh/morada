# T03 — Movimento: springs, Reveal, useReducedMotion, useAutoplay

- **Onda:** 1 (paralela)
- **Depende de:** T00
- **Leitura obrigatória:** `00-CONTEXTO.md` itens 7 (bloco Motion) e 11
- **Skill sugerida:** `apple-design` (springs interrompíveis, reduced motion)

## Objetivo

Fornecer as peças de animação usadas por toda a landing e pelo app, com comportamento físico (springs) e respeito total a `prefers-reduced-motion`.

## Posse

`src/components/motion/{index.ts,springs.ts,Reveal.tsx,Parallax.tsx,CountUp.tsx}`, `src/hooks/useReducedMotion.ts`, `src/hooks/useAutoplay.ts`, `src/hooks/useInView.ts`, testes em `src/hooks/__tests__/*`.

## Especificação

### springs.ts
```ts
export const springs = {
  gentle: { type: 'spring', stiffness: 120, damping: 20, mass: 1 },
  snappy: { type: 'spring', stiffness: 400, damping: 30 },
  layout: { type: 'spring', stiffness: 300, damping: 32 },
} as const;
export const easeApple = [0.3, 1, 0.4, 1] as const;   // para transições por tempo (crossfade 0.4s)
```

### useReducedMotion
Wrapper sobre `useReducedMotion` do `motion/react`, retornando `boolean` (nunca `null`).

### useInView(ref, { once = true, amount = 0.25 })
Wrapper do `useInView` do motion; exportado para quem precisar disparar algo uma vez.

### Reveal
```tsx
<Reveal delay={0.1} y={24} as="div" className="...">{children}</Reveal>
```
- `motion` element (`motion.create(as)` ou `motion.div`) com `initial={{ opacity: 0, y }}`, `whileInView={{ opacity: 1, y: 0 }}`, `viewport={{ once: true, amount: 0.25 }}`, `transition={{ ...springs.gentle, delay }}`.
- Reduced motion: renderiza o elemento estático, sem `initial`.
- Também exporte `RevealGroup` que aplica `staggerChildren: 0.08` aos filhos diretos `RevealItem`.

### Parallax
`<Parallax offset={60}>` usa `useScroll` + `useTransform` para mover o filho em Y entre `-offset` e `offset` enquanto atravessa a viewport. Reduced motion: estático. Usado no hero (T10) e no AppShowcase (T15).

### CountUp
`<CountUp to={48920} format={formatBRL} duration={1.2} />` anima o número quando entra na viewport (uma vez). Reduced motion: mostra o valor final. Use `aria-live="off"` e o valor final em `aria-label`.

### useAutoplay
```ts
useAutoplay({ count, intervalMs = 5000, enabled = true }) => { index, setIndex, playing, toggle, pause, play }
```
- Avança `index` em loop a cada `intervalMs` enquanto `playing && enabled && !document.hidden`.
- `setIndex(i)` muda e **pausa** (usuário assumiu o controle).
- Começa `playing = !reducedMotion`.
- Limpa timers ao desmontar; reinicia contagem ao mudar `index` manualmente.

## Testes
- useAutoplay com `vi.useFakeTimers()`: avança após 5000ms; `pause()` impede; `setIndex(2)` pausa e fixa 2; volta a 0 depois do último.
- Reveal com reduced motion mockado renderiza filhos visíveis.

## Critérios de aceite
- [ ] Exports exatamente como no contrato (`springs`, `Reveal` em `components/motion/index.ts`; hooks em `src/hooks/`).
- [ ] Nada anima com reduced motion ligado (testar no DevTools > Rendering > Emulate prefers-reduced-motion).
- [ ] Testes, typecheck, lint e build passam.
