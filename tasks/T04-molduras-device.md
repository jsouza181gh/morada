# T04 — Molduras de dispositivo (notebook, celular, navegador)

- **Onda:** 1 (paralela)
- **Depende de:** T00
- **Leitura obrigatória:** `00-CONTEXTO.md` itens 6, 7 (bloco mockups), 12

## Objetivo

Componentes puramente visuais que emolduram telas desenhadas em HTML/CSS (não imagens), usados no hero, no explorador de canais, na seção "Antes/Depois" e no AppShowcase.

## Posse

`src/components/mockups/{index.ts,LaptopFrame.tsx,PhoneFrame.tsx,BrowserFrame.tsx,PhoneStatusBar.tsx,MockupsDemo.tsx}`.
Para pré-visualizar sem mexer em rotas de outras tasks, crie `MockupsDemo.tsx` (componente solto, não roteado), importe-o temporariamente numa página stub ainda não implementada e remova o import antes de terminar.

## Especificação

As molduras são decorativas: raiz com `aria-hidden` **não**; quem usa decide. Por padrão, a moldura não tem papel de acessibilidade; os filhos podem ter conteúdo. Exponha prop `label?: string` que, quando presente, aplica `role="img" aria-label={label}` na raiz e `aria-hidden` no conteúdo interno.

### LaptopFrame
- Largura fluida (100% do pai, `max-width` decidido pelo uso).
- Tampa: `bg-[#1d1d1f] rounded-t-[22px] p-[14px] pb-[18px]`, sombra `0 40px 80px rgba(0,0,0,.18)`.
- Tela: `aspect-[16/10] rounded-[6px] overflow-hidden bg-bg-alt` com os `children` ocupando 100%.
- Câmera: ponto de 6px `#2c2c2e` centralizado no topo da tampa.
- Base: barra `h-4` com `linear-gradient(#d2d2d7,#b8b8bd)`, `rounded-b-[24px]`, 14% mais larga que a tampa (margens negativas `-mx-[7%]`), com um entalhe central `w-[18%] h-1.5 rounded-b-md bg-[#a1a1a6]` no topo.

### PhoneFrame
- `width` (default 300) e altura `width × 2.03`.
- Bezel `bg-[#1d1d1f]`, raio `width × 0.18`, padding `width × 0.04`, sombra `0 30px 70px rgba(0,0,0,.2)`.
- Tela interna com raio `width × 0.145`, `overflow-hidden`, fundo `bg-surface` (tone light) ou `bg-surface-dark` (tone dark), `position: relative`.
- Ilha dinâmica: `width × 0.3` × `width × 0.087`, preta, `rounded-pill`, centralizada a `width × 0.04` do topo, `z-10`.
- Botões laterais: 2 traços de 3px à esquerda e 1 à direita, `bg-[#1d1d1f]`, posicionados fora do bezel (absolutos).
- Exporte também `PhoneStatusBar` (opcional para quem quiser): hora "9:41" à esquerda e ícones de sinal/wifi/bateria à direita em SVG, cor herdada, altura 44px.

### BrowserFrame
- `rounded-[14px] border border-line bg-surface overflow-hidden`.
- Barra superior `h-8 px-3 flex items-center gap-1.5 border-b border-line`: três círculos 8px `bg-line`, depois a `url` em `t-caption text-ink-2` com `ml-2 truncate`.
- Conteúdo: `children`.
- Aceita `style` e `className` (a seção Antes/Depois rotaciona e empilha várias).

## Critérios de aceite
- [ ] Proporções corretas em larguras 200, 300 e 400 do PhoneFrame.
- [ ] LaptopFrame fluido de 320px a 900px sem quebrar.
- [ ] Funciona nos dois temas (bezel sempre escuro; tela segue tokens).
- [ ] Typecheck, lint e build passam.
