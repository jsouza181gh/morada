# T17 — Páginas /como-funciona, /entrar e /cadastro

- **Onda:** 2
- **Depende de:** T01, T03, T04 (pode importar `Steps` e `OverbookingStory` pelos caminhos fixos; se ainda forem stubs, tudo bem)
- **Leitura obrigatória:** `00-CONTEXTO.md` inteiro

## Posse

`src/pages/marketing/{HowItWorks.tsx,Login.tsx,Signup.tsx}`, `src/components/marketing/auth/{AuthShell.tsx,AuthAside.tsx}`, `src/components/marketing/how/*`.

## 1. /como-funciona (dentro do MarketingLayout)
Página longa, estilo storytelling da Apple:
1. Hero: `Headline size="hero" eyebrow="Como funciona" title="Do cadastro à primeira reserva."` + lead "Veja o caminho completo, com as telas que você vai usar."
2. Quatro capítulos alternando `bg-bg` / `bg-bg-alt`, cada um com texto à esquerda (≥1068px) e mockup à direita, alternando lados:
   - **1. Cadastre uma vez.** "Fotos, comodidades, regras, preço e políticas num único formulário em 7 passos. Salvamos o rascunho sozinhos." Mockup: `BrowserFrame url="morada.app/imoveis/novo"` com stepper de 7 pílulas (passo 3 "Fotos" ativo) e grade de 6 fotos.
   - **2. Conecte seus canais.** "Entre na conta de cada plataforma e autorize a Morada. Você pode revogar quando quiser." Mockup: 6 linhas com nome do canal e `Switch` (5 ligados, Trivago desligado; decorativos `aria-hidden`).
   - **3. Publique e acompanhe.** "Cada canal recebe o anúncio no formato dele. Você vê o status de todos num só lugar." Mockup: lista de `ChannelBadge`.
   - **4. Receba e responda.** "Reservas fecham o calendário de todos os canais. Mensagens chegam na mesma caixa." Mockup: `PhoneFrame` com 3 notificações.
   - Cada capítulo: número grande (display 96px `text-verde`), `<h2>` `t-section`, texto `t-lead text-ink-2`. Mockups com `Reveal`.
3. Reutilize `<OverbookingStory />` e `<Steps />`.
4. CTA: `Headline size="section" title="Pronto para começar?"` + `Button size="lg" href="/cadastro"` "Cadastrar meu imóvel".
- `document.title = 'Como funciona — Morada'`.

## 2. AuthShell (para /entrar e /cadastro, sem layout de marketing)
- Tela cheia `min-h-dvh grid md:grid-cols-[1fr_minmax(0,560px)]`.
- Lado esquerdo (`AuthAside`, só ≥1068px): `bg-surface-dark text-on-dark p-14 flex flex-col justify-between`: "Morada" (display 22px) linkando `/`; no meio, `t-section-xl` "Um anúncio.<br/>Todos os lugares." e 6 `ChannelBadge` publicados em `flex-wrap gap-2`; embaixo `t-caption text-on-dark-2` "Morada é independente e não tem vínculo com os canais citados."
- Lado direito: `bg-bg flex items-center justify-center px-6 py-12`, formulário `w-full max-w-[400px]`. No mobile, "Morada" no topo.

## 3. /entrar
- `<h1>` display 40px semibold "Entrar na Morada."; subtítulo ink-2 "Bom te ver de novo."
- Formulário (`<form noValidate>`): E-mail (`type="email"`, `autoComplete="email"`), Senha (`type="password"`, `autoComplete="current-password"`, botão olho para mostrar/ocultar com `aria-label`), link "Esqueci minha senha ›" (href `#`), `Button fullWidth size="lg" type="submit"` "Entrar".
- Inputs: `Input` do shadcn estilizado `h-12 rounded-md border-line-strong`, `Label` acima (`t-body-sm font-medium`).
- Validação no submit: e-mail vazio/inválido → "Informe um e-mail válido."; senha vazia → "Informe sua senha." Mensagens abaixo do campo com `text-danger t-body-sm`, `aria-invalid`, `aria-describedby`; foco vai ao primeiro campo com erro.
- Sucesso (qualquer valor válido): botão mostra "Entrando…" por 600ms e navega para `/app`. **Não** guarde nada.
- Separador "ou" e `Button variant="secondary" fullWidth` "Entrar com link por e-mail" (mostra toast "Enviamos um link para {email}." via sonner, se e-mail válido).
- Rodapé: "Ainda não tem conta? Criar conta ›" (`/cadastro`).

## 4. /cadastro
- `<h1>` "Crie sua conta." e subtítulo "14 dias grátis. Sem cartão de crédito."
- Campos: Nome completo, E-mail, Senha (mínimo 8 caracteres; medidor de força em 3 barras: fraca/média/forte com rótulo), Quantos imóveis você tem? (`Select`: 1, 2 a 5, 6 a 10, Mais de 10), checkbox "Li e aceito os Termos de uso e a Política de privacidade" (links `#`).
- Lê `?plano=essencial|pro|anfitriao` da URL e mostra acima do formulário um `Badge tone="verde"` "Plano Pro selecionado" com link "Trocar ›" (`/precos`).
- Validação como no /entrar; erros: "Informe seu nome.", "Informe um e-mail válido.", "Use pelo menos 8 caracteres.", "Escolha uma opção.", "Aceite os termos para continuar."
- Sucesso: navega para `/app/imoveis/novo`.
- Rodapé: "Já tem conta? Entrar ›".

## Critérios de aceite
- [ ] Formulários 100% operáveis por teclado; labels associados; erros anunciados.
- [ ] Layout dividido no desktop, coluna única no mobile.
- [ ] Typecheck, lint e build passam.
