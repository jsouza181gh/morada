import type { KeyboardEvent } from 'react';
import { motion } from 'motion/react';
import { springs } from '@/components/motion';
import { cn } from '@/lib/cn';

export type SwitchProps = {
  checked: boolean;
  onCheckedChange: (v: boolean) => void;
  label: string;
  disabled?: boolean;
  className?: string;
  id?: string;
};

export function Switch({ checked, onCheckedChange, label, disabled = false, className, id }: SwitchProps) {
  // Espaço e Enter já disparam click nativo em <button>; tratamos Enter aqui
  // explicitamente para não depender do comportamento do navegador/jsdom.
  function onKeyDown(e: KeyboardEvent<HTMLButtonElement>) {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (!disabled) onCheckedChange(!checked);
    }
  }

  return (
    <button
      id={id}
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      disabled={disabled}
      onClick={() => onCheckedChange(!checked)}
      onKeyDown={onKeyDown}
      className={cn(
        'relative inline-flex h-[31px] w-[51px] shrink-0 items-center rounded-pill p-[2px] transition-colors duration-200 disabled:cursor-not-allowed disabled:opacity-40',
        checked ? 'justify-end bg-verde' : 'justify-start bg-line-strong',
        className,
      )}
    >
      <motion.span
        layout
        transition={springs.snappy}
        aria-hidden="true"
        className="block size-[27px] rounded-pill bg-white shadow-[0_3px_8px_rgba(0,0,0,0.15),0_1px_1px_rgba(0,0,0,0.16)]"
      />
    </button>
  );
}
