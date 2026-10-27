# T22 — App: Cadastro de imóvel em 7 passos (wizard) com publicação

- **Onda:** 2
- **Depende de:** T01, T02, T03; T04 opcional
- **Leitura obrigatória:** `00-CONTEXTO.md` inteiro
- **Skills sugeridas:** `apple-design` (transições entre passos), `shadcn` (form controls)

## Objetivo

O núcleo do produto: cadastrar o imóvel uma vez e publicar em vários canais. Tela cheia (sem AppLayout), mas dentro de `.app-scope` (aplique a classe na raiz da página).

## Posse

`src/pages/app/PropertyNew.tsx`, `src/components/app/wizard/{WizardShell.tsx,Stepper.tsx,useWizardDraft.ts,steps/StepLocation.tsx,steps/StepDetails.tsx,steps/StepPhotos.tsx,steps/StepDescription.tsx,steps/StepPricing.tsx,steps/StepChannels.tsx,steps/StepReview.tsx,PublishProgress.tsx,ListingPreviewCard.tsx}`.

## Estrutura geral (WizardShell)
- Cabeçalho `bg-surface border-b border-line`: "Morada" (display 21px 500), status do rascunho "Rascunho salvo há 1 min" (atualiza ao salvar), link "Sair do cadastro" (`/app/imoveis`; se houver alterações não salvas há menos de 2s, salva antes).
- `Stepper`: `<ol aria-label="Etapas do cadastro">` com 7 pílulas: Local, Detalhes, Fotos, Descrição, Preço e regras, Canais, Revisão. Concluída: círculo `bg-verde-soft text-verde` com ✓; atual: pílula `bg-verde text-on-verde font-medium` e `aria-current="step"`; futura: `bg-surface text-ink-2`. Passos concluídos são clicáveis (voltar); futuros não.
- Conteúdo `max-w-[1180px] mx-auto px-4 py-10`: título `<h1>` display 40px peso 500 (texto por passo abaixo) e subtítulo `t-lead text-ink-2 max-w-[60ch]`.
- Rodapé: `Button variant="secondary"` "Voltar" (desabilitado no passo 1) e à direita resumo + `Button` "Continuar" (no passo 6: "Revisar e publicar"; no 7: "Publicar em N canais").
- Transição entre passos: slide horizontal curto (x ±24 + fade) com `springs.gentle`; direção conforme avançar/voltar. Foco vai para o `<h1>` do novo passo. Reduced motion: troca direta.
- `useWizardDraft`: estado do rascunho (tipo `Omit<Property,'id'|'createdAt'|'rating'|'reviewsCount'>` parcial) salvo em `localStorage` (`morada:draft`, try/catch) com debounce 800ms; restaura ao abrir e mostra banner "Continuamos de onde você parou." com botão "Começar do zero".
- Validação por passo; "Continuar" valida e mostra erros inline (`aria-invalid`, mensagem abaixo, foco no primeiro erro).

## Passos (título — subtítulo — campos)

1. **Local** — "Onde fica o imóvel?" — "O endereço exato só é mostrado ao hóspede depois da reserva."
   CEP (máscara 00000-000; ao completar, preenche cidade/UF/bairro de um mapa fixo de 3 CEPs mock, ex. 88062-000 → Florianópolis/SC/Lagoa da Conceição), Rua, Número, Complemento, Bairro, Cidade, UF (`Select`). Tipo do imóvel em cartões selecionáveis (radio group visual): Casa, Apartamento, Loft, Chalé, Studio, com ícones lucide. À direita, cartão de "mapa" estilizado (fundo verde-soft com grade de ruas em SVG e pino) — decorativo.
2. **Detalhes** — "Conte como é o espaço." — Steppers numéricos (− valor +, botões 44px) para Hóspedes (1–16), Quartos, Camas, Banheiros. Comodidades: grade de toggles (cartões com ícone) com as 12 comodidades da T02.
3. **Fotos** — "Mostre o imóvel." — "Envie pelo menos 5 fotos. A primeira vira a capa." Área de soltar arquivos (`input type=file multiple accept="image/*"` + drag-and-drop) que gera `URL.createObjectURL` para pré-visualizar; botão "Usar fotos de exemplo" preenche com 6 URLs picsum. Grade reordenável por arrastar (pointer events) **e** por teclado (botões "Mover para a esquerda/direita" em cada foto); a primeira com selo "Capa"; remover foto. Validação: mínimo 5.
4. **Descrição** — "Como você descreveria o imóvel?" — Título (contador ao vivo e aviso por canal: "Airbnb aceita até 50 caracteres" fica `text-warning` se passar), Descrição (`Textarea`, 50–2000 caracteres, contador), e um quadro "Como fica em cada canal" mostrando o título truncado por canal (Airbnb 50, Vrbo 80, outros sem corte).
5. **Preço e regras** — "Quanto você quer receber?" — "Informe o valor líquido. A Morada ajusta o preço de cada canal pela taxa dele." Campo grande "Quero receber por noite" (BRL), tabela ao vivo por canal (taxa e preço final), Taxa de limpeza, Mínimo de noites, Check-in e Check-out (`Select` de horários), toggles Aceita pets / Permite festas / Proibido fumar.
6. **Canais** — "Onde o imóvel vai aparecer?" — "Ligue os canais em que quer publicar. Toque num canal para ver como o anúncio fica lá." Layout 3fr/2fr:
   - Lista em card `bg-surface rounded-lg px-6 py-2`: cada linha com botão do nome do canal (seleciona a prévia; nome do canal em verde e sublinhado quando selecionado; `aria-pressed`), nota (`accountLabel` "Conta conectada: ana.anfitria" ou aviso), `Badge` de prontidão ("Pronto" verde, "Passa por análise" warning para Vrbo, "Falta foto" danger para Expedia se < 8 fotos), e `Switch` "Publicar no {canal}".
   - Canal não conectado (simule Decolar desconectado se quiser mostrar o estado): botão "Conectar" abre `Dialog` explicando "Você vai entrar no site da Decolar e autorizar a Morada." com botões "Cancelar" e "Continuar" (que marca como conectado após 800ms).
   - Prévia (`ListingPreviewCard`): foto de capa, "Prévia no {canal}", título adaptado, subtítulo, preço do canal, e cartão "Taxa do canal".
   - Rodapé: "5 canais selecionados" atualiza ao vivo; com 0, o botão de avançar fica desabilitado e o texto vira "Ligue ao menos um canal".
7. **Revisão** — "Tudo certo para publicar?" — Resumo em seções editáveis (cada uma com link "Editar ›" que volta ao passo): local, detalhes, fotos (6 miniaturas), descrição, preços por canal, canais escolhidos. Botão final "Publicar em N canais".

## PublishProgress (após clicar em publicar)
- Sobreposição `Dialog` não dispensável durante o processo: título "Publicando Casa da Lagoa", lista dos canais escolhidos, cada um passa por "Enviando…" (spinner) → "✓ Publicado" (ou "Em análise" para Vrbo), em sequência com 600–900ms cada (stagger), barra de progresso geral. `aria-live="polite"` anunciando cada canal.
- Ao final: título "Seu imóvel está no ar." + botões "Ver imóvel" (navega para `/app/imoveis/<id>` do imóvel criado via `createProperty`) e "Cadastrar outro". Limpa o rascunho.
- Reduced motion: sem spinners girando; passos trocam de texto apenas.

## Critérios de aceite
- [ ] Fluxo completo do passo 1 ao imóvel criado aparecendo em `/app/imoveis`.
- [ ] Rascunho sobrevive a recarregar a página.
- [ ] Reordenar fotos funciona com mouse, toque e teclado.
- [ ] Todos os campos com label, erros anunciados, foco gerenciado entre passos.
- [ ] Typecheck, lint e build passam.
