import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';

export type LaptopFrameProps = {
  children: ReactNode;
  className?: string;
  /** Quando presente, a moldura vira uma imagem acessível (role="img") e o conteúdo é ocultado de leitores de tela. */
  label?: string;
};

export function LaptopFrame({ children, className, label }: LaptopFrameProps) {
  const a11y = label ? { role: 'img' as const, 'aria-label': label } : {};
  return (
    <div className={cn('relative w-full', className)} {...a11y}>
      {/* Tampa */}
      <div className="relative rounded-t-[22px] bg-[#1d1d1f] p-[14px] pb-[18px] shadow-[0_40px_80px_rgba(0,0,0,.18)]">
        <span
          aria-hidden="true"
          className="absolute top-[4px] left-1/2 size-[6px] -translate-x-1/2 rounded-full bg-[#2c2c2e]"
        />
        <div
          className="relative aspect-[16/10] w-full overflow-hidden rounded-[6px] bg-bg-alt"
          aria-hidden={label ? true : undefined}
        >
          <div className="absolute inset-0">{children}</div>
        </div>
      </div>
      {/* Base */}
      <div
        aria-hidden="true"
        className="relative -mx-[7%] h-4 rounded-b-[24px] bg-[linear-gradient(#d2d2d7,#b8b8bd)]"
      >
        <span className="absolute top-0 left-1/2 h-1.5 w-[18%] -translate-x-1/2 rounded-b-md bg-[#a1a1a6]" />
      </div>
    </div>
  );
}
