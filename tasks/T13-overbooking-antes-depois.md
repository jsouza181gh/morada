# T13 — Landing: "Chega de overbooking." e "Seis abas a menos."

- **Onda:** 2
- **Depende de:** T01, T03, T04
- **Leitura obrigatória:** `00-CONTEXTO.md` inteiro
- **Skill sugerida:** `frontend-design`

## Posse

`src/components/marketing/story/{OverbookingStory.tsx,CalendarMerge.tsx,BeforeAfter.tsx}`. Exports nomeados `OverbookingStory` e `BeforeAfter`.

## 1. OverbookingStory (seção escura)

- `<section className="bg-surface-dark text-on-dark py-36 px-4">`, conteúdo `max-w-[980px] mx-auto flex flex-col items-center gap-18`.
- `<h2 className="t-section-xl text-center">Chega de<br/>overbooking.</h2>`.
- **CalendarMerge** (`aria-hidden`, largura máx. 820px): 3 linhas de canal + 1 linha "Morada".
  - Cada linha: rótulo `w-[110px] t-body-sm text-on-dark-2` e grade de 14 células (`grid-cols-14 gap-1`), altura 20px, raio 6px; ocupadas `bg-on-dark`, livres `bg-white/10`.
  - Airbnb: dias 2–4; Booking.com: 7–8; Vrbo: 11–13.
  - Linha "Morada" separada por `mt-5 pt-5 border-t border-white/18`, rótulo `font-semibold text-on-dark`, células de 30px, ocupadas = união (2–4, 7–8, 11–13).
  - Animação ao entrar na viewport (uma vez): as células ocupadas das 3 linhas "descem" (translateY até a linha Morada, com fade) e acendem na linha Morada em sequência; duração total ≤ 1,6s, `springs.gentle`. Reduced motion: estado final direto.
- Parágrafo `t-lead text-on-dark-2 text-center max-w-[640px]`: "Cada canal guarda o próprio calendário. A Morada junta todos num só e, **assim que uma reserva entra**, fecha a data em todos os outros. Sem planilha. Sem conferir de madrugada. **Sem cancelar hóspede**." (negritos `text-on-dark font-medium`).

## 2. BeforeAfter

- `<section className="bg-bg-alt py-36 px-4">`, `max-w-[1100px] mx-auto flex flex-col gap-14`.
- Cabeçalho centralizado: `<h2 className="t-section-xl">Seis abas a menos.</h2>` e `t-lead text-ink-2` "Antes, um login por canal. Agora, um painel só."
- Duas `<figure>` lado a lado (`flex flex-wrap gap-6`, cada `flex: 1 1 420px`), `bg-surface rounded-card p-10 flex flex-col gap-6`:
  - **Sem a Morada** (`figcaption` 17px semibold `text-ink-2`): área `relative h-[300px]` com 6 `BrowserFrame` absolutos, largura 58%, empilhados em cascata (left `k*8%`, top `k*34px`, rotação alternada `±(1 + k*0.4)deg`, sombra `0 6px 18px rgba(0,0,0,.08)`), URLs: airbnb.com.br/hosting, admin.booking.com, vrbo.com/host, trivago.com.br, decolar.com/anunciantes, expediapartnercentral.com. Corpo de cada: barra cinza 8px 60% + 2 "inputs" (22px, borda line) sugerindo login.
    - Hover/foco na figura: as janelas se espalham um pouco mais (aumenta rotação/offset em 30%) — micro-interação.
  - **Com a Morada** (`figcaption` `text-verde`): um `BrowserFrame url="morada.app"` de 300px com lista dos 6 canais e status (mesmo visual do PublishSlide: nome + "✓ Publicado" / Vrbo "Em análise").
  - Ao entrar na viewport, as 6 janelas da esquerda caem em cascata (stagger 0.07) e a janela da direita surge com fade + escala 0.96→1 depois.
- Mobile: figuras empilhadas; cascata com 4 janelas visíveis (esconda 2).

## Critérios de aceite
- [ ] Animações rodam uma vez e respeitam reduced motion.
- [ ] Figuras com `figcaption` e conteúdo visual `aria-hidden`; texto dos títulos acessível.
- [ ] Sem rolagem horizontal em 375px.
- [ ] Typecheck, lint e build passam.
