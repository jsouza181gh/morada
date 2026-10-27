import { useState, type ComponentProps, type ReactNode } from 'react';
import { Link } from 'react-router';
import { Eye, EyeOff } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/cn';
import { AuthAside } from './AuthAside';

/** Tela cheia dividida: painel da marca (≥1068px) + formulário. */
export function AuthShell({ children }: { children: ReactNode }) {
  return (
    <div className="grid min-h-dvh bg-bg text-ink md:grid-cols-[1fr_minmax(0,560px)]">
      <AuthAside />
      <main className="flex flex-col items-center justify-center bg-bg px-6 py-12">
        <div className="w-full max-w-[400px]">
          <Link
            to="/"
            className="mb-10 inline-block font-display text-[22px] font-semibold tracking-[-0.02em] text-ink md:hidden"
          >
            Morada
          </Link>
          {children}
        </div>
      </main>
    </div>
  );
}

/** Título + subtítulo das telas de autenticação. */
export function AuthHeading({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <header>
      <h1 className="font-display text-[40px] leading-[44px] font-semibold tracking-[-0.025em]">{title}</h1>
      <p className="t-body mt-2 text-ink-2">{subtitle}</p>
    </header>
  );
}

type AuthFieldProps = {
  id: string;
  label: string;
  error?: string;
  children: ReactNode;
  className?: string;
  /** Conteúdo à direita do rótulo (ex.: "Esqueci minha senha"). */
  aside?: ReactNode;
  /** Texto de apoio abaixo do campo (ex.: medidor de força). */
  hint?: ReactNode;
};

/** Rótulo acima, campo e mensagem de erro (id `${id}-erro`, use em aria-describedby). */
export function AuthField({ id, label, error, children, className, aside, hint }: AuthFieldProps) {
  return (
    <div className={cn('flex flex-col gap-2', className)}>
      <div className="flex items-baseline justify-between gap-4">
        <Label htmlFor={id} className="t-body-sm font-medium text-ink">
          {label}
        </Label>
        {aside}
      </div>
      {children}
      {hint}
      {error && (
        <p id={`${id}-erro`} className="t-body-sm text-danger">
          {error}
        </p>
      )}
    </div>
  );
}

/** Input do shadcn com o estilo das telas de autenticação. */
export function AuthInput({ className, ...props }: ComponentProps<typeof Input>) {
  return (
    <Input
      className={cn(
        'h-12 rounded-md border-line-strong bg-surface px-3.5 text-[17px] text-ink md:text-[17px] aria-invalid:border-danger',
        className,
      )}
      {...props}
    />
  );
}

/** Campo de senha com botão para mostrar/ocultar. */
export function PasswordInput({ className, ...props }: Omit<ComponentProps<typeof Input>, 'type'>) {
  const [visible, setVisible] = useState(false);
  return (
    <div className="relative">
      <AuthInput type={visible ? 'text' : 'password'} className={cn('pr-12', className)} {...props} />
      <button
        type="button"
        onClick={() => setVisible((v) => !v)}
        aria-label={visible ? 'Ocultar senha' : 'Mostrar senha'}
        aria-pressed={visible}
        className="absolute top-1/2 right-0.5 grid size-11 -translate-y-1/2 place-items-center rounded-md text-ink-2 hover:text-ink"
      >
        {visible ? (
          <EyeOff size={20} strokeWidth={1.5} aria-hidden="true" />
        ) : (
          <Eye size={20} strokeWidth={1.5} aria-hidden="true" />
        )}
      </button>
    </div>
  );
}

export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
