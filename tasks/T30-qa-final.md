# T30 — QA final: acessibilidade, responsividade, desempenho e consistência

- **Onda:** 3 (depois de todas as outras)
- **Depende de:** todas
- **Leitura obrigatória:** `00-CONTEXTO.md` inteiro
- **Skill sugerida:** `web-design-guidelines` (revisão de UI/a11y/UX), `apple-design` (movimento)

## Objetivo

Revisar o app inteiro contra o contrato, corrigir problemas pequenos e listar os grandes.

## Posse

Qualquer arquivo, **somente** para correções desta revisão. Mudanças de comportamento ou layout grandes vão para o relatório como pendência, não são feitas aqui.

## Checklist

### Build e código
- [ ] `npm run typecheck`, `lint`, `test`, `build` passam sem warnings novos.
- [ ] Nenhum stub restante (`grep -r "data-stub" src` vazio).
- [ ] Sem `console.log`, sem `any` explícito, sem imports não usados.
- [ ] Utilitários duplicados entre tasks consolidados em `src/lib/` (atualize imports).

### Visual e marca
- [ ] Comparar cada tela com os mockups (https://claude.ai/artifact/5QAY5xtY7af2VNQVnR6cn9): landing, dashboard, cadastro (passo Canais), calendário.
- [ ] Só tokens (nenhuma cor hex solta fora de `tokens.css`, exceto o bezel `#1d1d1f` das molduras e `#3a3a3c` já previsto).
- [ ] Verde só em ação/link/ativo/foco; dourado só em estrelas e selo; no máximo 2 seções inteiras `surface-dark` por página (na landing: OverbookingStory e FinalCta; cards escuros dentro de seções não contam).
- [ ] Telas do app com títulos peso 500 e texto `#3a3a3c`.
- [ ] Voz da marca: títulos curtos com ponto, sentence case, sem exclamação, sem emoji.

### Responsividade
- [ ] Testar 375, 414, 768, 1024, 1280, 1440 e 1920px em todas as rotas: sem rolagem horizontal da página, nada cortado, toques ≥ 44px.

### Acessibilidade
- [ ] axe (via `@axe-core/react` em dev ou extensão) sem violações sérias em todas as rotas.
- [ ] Navegação só por teclado em todos os fluxos: landing (carrossel, explorador, FAQ, preços), login, cadastro, wizard completo, calendário (bloqueio), reservas (sheet), mensagens (enviar).
- [ ] Leitor de tela (NVDA ou VoiceOver): títulos em ordem, landmarks (`header`, `nav`, `main`, `footer`), carrossel e tabs anunciados corretamente.
- [ ] Contraste AA nos dois temas (checar textos `ink-2` sobre `bg-alt` e textos sobre verde).
- [ ] `prefers-reduced-motion`: nenhuma animação automática.

### Desempenho
- [ ] Rotas com `lazy`; Recharts só carregado nas rotas do app que usam.
- [ ] Imagens com `loading="lazy"` e `width/height` (evitar layout shift); hero sem lazy.
- [ ] Lighthouse (build de produção com `npm run preview`) na landing: Performance ≥ 90, Acessibilidade ≥ 95, Boas práticas ≥ 95, SEO ≥ 95. Registre os números.

### SEO básico
- [ ] `document.title` por página; meta description na landing; JSON-LD do FAQ.

## Entrega
Relatório com: correções feitas (arquivo e motivo), números do Lighthouse, pendências priorizadas (alta/média/baixa) com a task de origem.
