import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';

export type PhoneFrameProps = {
  children: ReactNode;
  /** Largura do aparelho em px (default 300). Altura = width × 2.03. */
  width?: number;
  className?: string;
  tone?: 'light' | 'dark';
  /** Quando presente, a moldura vira uma imagem acessível (role="img") e o conteúdo é ocultado de leitores de tela. */
  label?: string;
};

export function PhoneFrame({ children, width = 300, className, tone = 'light', label }: PhoneFrameProps) {
  const w = width;
  const a11y = label ? { role: 'img' as const, 'aria-label': label } : {};
  const sideButton = 'absolute w-[3px] bg-[#1d1d1f]';

  return (
    <div
      className={cn('relative shrink-0', className)}
      style={{ width: w, height: w * 2.03 }}
      {...a11y}
    >
      {/* Botões laterais (fora do bezel) */}
      <span
        aria-hidden="true"
        className={cn(sideButton, 'rounded-l-[2px]')}
        style={{ left: -3, top: w * 0.36, height: w * 0.11 }}
      />
      <span
        aria-hidden="true"
        className={cn(sideButton, 'rounded-l-[2px]')}
        style={{ left: -3, top: w * 0.52, height: w * 0.11 }}
      />
      <span
        aria-hidden="true"
        className={cn(sideButton, 'rounded-r-[2px]')}
        style={{ right: -3, top: w * 0.44, height: w * 0.17 }}
      />

      {/* Bezel */}
      <div
        className="h-full w-full bg-[#1d1d1f] shadow-[0_30px_70px_rgba(0,0,0,.2)]"
        style={{ borderRadius: w * 0.18, padding: w * 0.04 }}
      >
        {/* Tela */}
        <div
          className={cn(
            'relative h-full w-full overflow-hidden',
            tone === 'dark' ? 'bg-surface-dark text-on-dark' : 'bg-surface text-ink',
          )}
          style={{ borderRadius: w * 0.145 }}
        >
          {/* Ilha dinâmica */}
          <span
            aria-hidden="true"
            className="absolute left-1/2 z-10 -translate-x-1/2 rounded-pill bg-black"
            style={{ top: w * 0.04, width: w * 0.3, height: w * 0.087 }}
          />
          <div className="h-full w-full" aria-hidden={label ? true : undefined}>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
