import type { CSSProperties, ReactNode } from 'react';
import { cn } from '@/lib/cn';

export type BrowserFrameProps = {
  url: string;
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  /** Quando presente, a moldura vira uma imagem acessível (role="img") e o conteúdo é ocultado de leitores de tela. */
  label?: string;
};

export function BrowserFrame({ url, children, className, style, label }: BrowserFrameProps) {
  const a11y = label ? { role: 'img' as const, 'aria-label': label } : {};
  return (
    <div
      style={style}
      className={cn('overflow-hidden rounded-[14px] border border-line bg-surface', className)}
      {...a11y}
    >
      <div className="flex h-8 items-center gap-1.5 border-b border-line px-3" aria-hidden={label ? true : undefined}>
        <span className="size-2 shrink-0 rounded-full bg-line" />
        <span className="size-2 shrink-0 rounded-full bg-line" />
        <span className="size-2 shrink-0 rounded-full bg-line" />
        <span className="t-caption ml-2 min-w-0 truncate text-ink-2">{url}</span>
      </div>
      <div aria-hidden={label ? true : undefined}>{children}</div>
    </div>
  );
}
