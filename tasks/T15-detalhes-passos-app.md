# T15 — Landing: detalhes (grade de recursos), passos e App

- **Onda:** 2
- **Depende de:** T01, T03, T04
- **Leitura obrigatória:** `00-CONTEXTO.md` inteiro
- **Skill sugerida:** `frontend-design`

## Posse

`src/components/marketing/features/{FeatureGrid.tsx,Steps.tsx,AppShowcase.tsx}`. Exports nomeados `FeatureGrid`, `Steps`, `AppShowcase`.

## 1. FeatureGrid
- `Section tone="white"`; `<h2 className="t-section">Os detalhes que dão trabalho.<br/><span className="text-ink-2">Resolvidos.</span></h2>`.
- Grade `grid-cols-[repeat(auto-fit,minmax(260px,1fr))] gap-x-10 gap-y-14 mt-16`. Cada item: `border-t border-line pt-6 flex flex-col gap-3`; ícone lucide 32px `text-verde` stroke 1.5; `<h3>` 19/25 semibold; texto 15/22 ink-2.
- Itens (ícone — título — texto):
  1. `AlignLeft` — Descrição adaptada — Uma descrição vira várias, no tamanho e no idioma de cada canal.
  2. `ClipboardCheck` — Regras da casa — Horários, pets e festas configurados uma vez e aplicados em todos.
  3. `Sparkles` — Limpeza agendada — A equipe recebe o aviso assim que a saída do hóspede é confirmada.
  4. `Wallet` — Repasses em um lugar — Veja o que cada canal já pagou e o que ainda vai cair na conta.
  5. `MessageSquareText` — Respostas prontas — Modelos para check-in, Wi-Fi e regras, enviados no canal certo.
  6. `BellRing` — Alertas que importam — Só avisamos o que precisa de você: foto recusada, preço fora do mercado, reserva nova.
- `RevealGroup` nos itens.

## 2. Steps (linha do tempo — é uma sequência real, numerar faz sentido)
- `Section tone="alt"`; `<h2 className="t-section text-center">No ar em uma tarde.</h2>`.
- `<ol>` horizontal (`flex flex-wrap gap-x-6 gap-y-10 mt-16 relative`) com linha conectora `absolute left-7 right-7 top-[27px] h-0.5 bg-line` (só ≥ 734px; no mobile a linha é vertical à esquerda).
- Cada passo (`flex: 1 1 260px`): círculo 56px com número (display 24px semibold) — passos 1 e 2: `bg-surface text-verde ring-2 ring-verde`; passo 3: `bg-verde text-on-verde`; `<h3>` 21/28 semibold; texto `t-body text-ink-2`; tempo `t-caption text-ink-2`.
  1. Cadastre o imóvel. — Fotos, comodidades, regras e preço. Uma vez só. — Cerca de 20 minutos
  2. Conecte seus canais. — Autorize a Morada na conta que você já tem em cada plataforma. — Cerca de 2 minutos por canal
  3. Publique. — O anúncio entra no ar em todos. Reservas e mensagens chegam aqui. — Na hora
- Ao entrar na viewport: a linha conectora se preenche de verde da esquerda para a direita (scaleX 0→1, 1,2s) e os círculos acendem em sequência.

## 3. AppShowcase
- `<section id="app" className="bg-bg pt-36 px-4 overflow-hidden">`, centralizado.
- Eyebrow `t-eyebrow text-verde` "App Morada"; `<h2 className="t-section-xl">A recepção<br/>cabe no bolso.</h2>`; lead "Aceite reservas, responda hóspedes e ajuste preços de onde estiver." (ink-2, máx. 560px).
- Dois `PhoneFrame width={270}` lado a lado (gap 28px), cortados pela base da seção (container `h-[520px]`, telefones com `mb-[-80px]` e `mb-[-140px]`), com `Parallax` de offsets diferentes (20 e 50) para dar profundidade.
  - Celular 1 (tone light, fundo `bg-bg-alt`): título "Hoje" (display 24px 500, `#3a3a3c`); 4 cartões `bg-surface rounded-2xl px-3.5 py-3` (rótulo 12px ink-2 + valor 12px 500): Chegada, 15h / Marina Costa, Casa da Lagoa; Saída, 11h / Pedro Lima, Loft Pinheiros; Limpeza, 12h / Loft Pinheiros, equipe da Rita; Nova reserva / Thomas, 26 a 30 out, Booking.com.
  - Celular 2 (tone dark): "Casa da Lagoa" (12px on-dark-2), "R$ 480" (display 40px 500), "por noite, você recebe", e lista de 5 canais com preço (separadores `border-white/12`).
- Entre o lead e os celulares, botões de loja **sem logos de terceiros**: dois `Button variant="secondary"` "Baixar para iPhone" e "Baixar para Android" (href `#`), centralizados, `mt-8 mb-14`.
- < 734px: só o celular 1.

## Critérios de aceite
- [ ] Textos exatos; ícones lucide com `aria-hidden`.
- [ ] Linha do tempo correta em horizontal (desktop) e vertical (mobile).
- [ ] Parallax e animações desligam com reduced motion.
- [ ] Typecheck, lint e build passam.
