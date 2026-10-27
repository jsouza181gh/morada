import { cn } from '@/lib/cn';

export type PhoneStatusBarProps = { className?: string; time?: string };

/** Barra de status decorativa de celular (hora à esquerda; sinal, wi-fi e bateria à direita). Cor herdada. */
export function PhoneStatusBar({ className, time = '9:41' }: PhoneStatusBarProps) {
  return (
    <div
      aria-hidden="true"
      className={cn('flex h-11 items-center justify-between px-[8%] text-[15px] font-semibold', className)}
    >
      <span className="tabular-nums">{time}</span>
      <span className="flex items-center gap-1.5">
        {/* Sinal */}
        <svg width="17" height="11" viewBox="0 0 17 11" fill="currentColor" aria-hidden="true">
          <rect x="0" y="7" width="3" height="4" rx="1" />
          <rect x="4.5" y="5" width="3" height="6" rx="1" />
          <rect x="9" y="2.5" width="3" height="8.5" rx="1" />
          <rect x="13.5" y="0" width="3" height="11" rx="1" />
        </svg>
        {/* Wi-fi */}
        <svg width="15" height="11" viewBox="0 0 15 11" fill="currentColor" aria-hidden="true">
          <path d="M7.5 2.2c2.1 0 4 .8 5.5 2.1l1.1-1.1A9.4 9.4 0 0 0 7.5.6 9.4 9.4 0 0 0 .9 3.2L2 4.3a7.8 7.8 0 0 1 5.5-2.1Z" />
          <path d="M7.5 5.3c1.3 0 2.4.5 3.3 1.2l1.1-1.1a6.3 6.3 0 0 0-8.8 0l1.1 1.1c.9-.7 2-1.2 3.3-1.2Z" />
          <path d="M7.5 8.3c.5 0 1 .2 1.3.5L7.5 10.1 6.2 8.8c.3-.3.8-.5 1.3-.5Z" />
        </svg>
        {/* Bateria */}
        <svg width="25" height="12" viewBox="0 0 25 12" fill="none" aria-hidden="true">
          <rect x="0.5" y="0.5" width="21" height="11" rx="3" stroke="currentColor" opacity=".4" />
          <rect x="2" y="2" width="18" height="8" rx="1.8" fill="currentColor" />
          <path d="M23 4v4c.8-.3 1.3-1.1 1.3-2S23.8 4.3 23 4Z" fill="currentColor" opacity=".4" />
        </svg>
      </span>
    </div>
  );
}
