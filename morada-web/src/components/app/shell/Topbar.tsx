import { Link } from 'react-router';
import { Bell, Search } from 'lucide-react';
import { Avatar, IconButton, Switch } from '@/components/ui';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/cn';

export type TopbarProps = {
  dark: boolean;
  onDarkChange: (dark: boolean) => void;
  hasAlert?: boolean;
  className?: string;
};

const USER = { name: 'Ana Souza', email: 'ana@exemplo.com.br' };

export function Topbar({ dark, onDarkChange, hasAlert = false, className }: TopbarProps) {
  return (
    <header
      className={cn(
        'sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-line bg-bg-alt/80 px-4 backdrop-blur sm:px-8 lg:px-14',
        className,
      )}
    >
      <Link to="/app" className="shrink-0 font-display text-[19px] font-medium tracking-[-0.02em] text-ink md:hidden">
        Morada
      </Link>

      <form role="search" className="relative min-w-0 flex-1" onSubmit={(e) => e.preventDefault()}>
        <label htmlFor="app-busca" className="sr-only">
          Buscar imóvel, hóspede ou reserva
        </label>
        <div className="relative w-full max-w-[420px]">
          <Search
            size={18}
            strokeWidth={1.5}
            aria-hidden="true"
            className="pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2 text-ink-2"
          />
          <input
            id="app-busca"
            type="search"
            placeholder="Buscar imóvel, hóspede ou reserva"
            className="t-body-sm h-10 w-full rounded-pill border border-line bg-surface pr-4 pl-10 text-ink placeholder:text-ink-2 sm:pr-14"
          />
          <kbd
            aria-hidden="true"
            className="t-caption pointer-events-none absolute top-1/2 right-3 hidden -translate-y-1/2 rounded-sm border border-line px-1.5 font-sans text-ink-2 sm:inline"
          >
            ⌘K
          </kbd>
        </div>
      </form>

      <div className="ml-auto flex shrink-0 items-center gap-2">
        <IconButton
          label={hasAlert ? 'Notificações, há alertas' : 'Notificações'}
          variant="ghost"
          className="relative"
        >
          <Bell size={20} strokeWidth={1.5} aria-hidden="true" />
          {hasAlert && (
            <span
              aria-hidden="true"
              className="absolute top-2.5 right-2.5 size-2 rounded-pill bg-verde ring-2 ring-bg-alt"
            />
          )}
        </IconButton>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              aria-label={`Conta de ${USER.name}`}
              className="inline-flex size-11 items-center justify-center rounded-pill"
            >
              <Avatar name={USER.name} tone="dark" size={36} />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="app-scope w-64 bg-surface text-ink">
            <DropdownMenuItem disabled className="flex-col items-start gap-0">
              <span className="t-body-sm font-medium text-ink">{USER.name}</span>
              <span className="t-caption text-ink-2">{USER.email}</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              role="menuitemcheckbox"
              aria-checked={dark}
              onSelect={(e) => {
                e.preventDefault();
                onDarkChange(!dark);
              }}
              className="t-body-sm justify-between"
            >
              Tema escuro
              {/* Visual apenas: o item de menu é quem recebe foco e anuncia o estado. */}
              <span inert className="pointer-events-none">
                <Switch checked={dark} onCheckedChange={onDarkChange} label="Tema escuro" />
              </span>
            </DropdownMenuItem>
            <DropdownMenuItem asChild className="t-body-sm">
              <Link to="/app/configuracoes">Configurações</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild className="t-body-sm">
              <Link to="/">Ver site</Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild className="t-body-sm">
              <Link to="/entrar">Sair</Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
