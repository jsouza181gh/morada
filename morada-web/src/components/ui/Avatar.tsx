import type { HTMLAttributes } from 'react';
import { cn } from '@/lib/cn';

export type AvatarProps = {
  name: string;
  size?: number;
  tone?: 'verde' | 'dark' | 'neutral';
} & Omit<HTMLAttributes<HTMLSpanElement>, 'children'>;

const tones: Record<NonNullable<AvatarProps['tone']>, string> = {
  verde: 'bg-verde-soft text-verde',
  dark: 'bg-surface-dark text-on-dark',
  neutral: 'bg-bg-alt text-ink-2',
};

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return '';
  const first = parts[0]?.[0] ?? '';
  const last = parts.length > 1 ? (parts[parts.length - 1]?.[0] ?? '') : '';
  return (first + last).toLocaleUpperCase('pt-BR');
}

export function Avatar({ name, size = 40, tone = 'verde', className, style, ...rest }: AvatarProps) {
  return (
    <span
      role="img"
      aria-label={name}
      style={{ width: size, height: size, fontSize: Math.round(size * 0.38), ...style }}
      className={cn(
        'inline-flex shrink-0 items-center justify-center rounded-pill leading-none font-medium select-none',
        tones[tone],
        className,
      )}
      {...rest}
    >
      <span aria-hidden="true">{getInitials(name)}</span>
    </span>
  );
}
