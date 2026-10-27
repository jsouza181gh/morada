import { useState } from 'react';
import { NavLink, useLocation } from 'react-router';
import {
  BarChart3,
  CalendarDays,
  ClipboardList,
  Home,
  LayoutGrid,
  Link2,
  MessageCircle,
  MoreHorizontal,
  Settings,
  type LucideIcon,
} from 'lucide-react';
import { Sheet, SheetContent, SheetDescription, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { cn } from '@/lib/cn';

type NavItem = { label: string; to: string; icon: LucideIcon; end?: boolean; counter?: boolean };

const PRIMARY: NavItem[] = [
  { label: 'Visão geral', to: '/app', icon: LayoutGrid, end: true },
  { label: 'Calendário', to: '/app/calendario', icon: CalendarDays },
  { label: 'Reservas', to: '/app/reservas', icon: ClipboardList },
  { label: 'Mensagens', to: '/app/mensagens', icon: MessageCircle, counter: true },
];

const MORE: NavItem[] = [
  { label: 'Imóveis', to: '/app/imoveis', icon: Home },
  { label: 'Canais', to: '/app/canais', icon: Link2 },
  { label: 'Relatórios', to: '/app/relatorios', icon: BarChart3 },
  { label: 'Configurações', to: '/app/configuracoes', icon: Settings },
];

const itemClass = (active: boolean) =>
  cn(
    'flex h-full min-h-11 flex-col items-center justify-center gap-1 text-[11px] leading-none transition-colors',
    active ? 'font-medium text-verde' : 'text-ink-2 hover:text-ink',
  );

export type MobileNavProps = { unread?: number; className?: string };

export function MobileNav({ unread = 0, className }: MobileNavProps) {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();
  const moreActive = MORE.some((i) => pathname === i.to || pathname.startsWith(`${i.to}/`));

  return (
    <nav
      aria-label="App"
      className={cn(
        'fixed inset-x-0 bottom-0 z-40 box-content grid h-[68px] grid-cols-5 border-t border-line bg-surface/90 pb-[env(safe-area-inset-bottom)] backdrop-blur md:hidden',
        className,
      )}
    >
      {PRIMARY.map(({ label, to, icon: Icon, end, counter }) => (
        <NavLink key={to} to={to} end={end} className={({ isActive }) => itemClass(isActive)}>
          <span className="relative">
            <Icon size={22} strokeWidth={1.5} aria-hidden="true" />
            {counter && unread > 0 && (
              <span className="absolute -top-1.5 -right-2.5 min-w-[18px] rounded-pill bg-ink px-1 text-center text-[11px] leading-[18px] font-medium text-bg">
                {unread}
                <span className="sr-only"> não lidas</span>
              </span>
            )}
          </span>
          <span>{label}</span>
        </NavLink>
      ))}

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <button type="button" className={itemClass(moreActive)} aria-current={moreActive ? 'page' : undefined}>
            <MoreHorizontal size={22} strokeWidth={1.5} aria-hidden="true" />
            <span>Mais</span>
          </button>
        </SheetTrigger>
        <SheetContent
          side="bottom"
          className="app-scope rounded-t-lg bg-surface px-4 pt-6 pb-[calc(24px+env(safe-area-inset-bottom))] text-ink"
        >
          <SheetTitle className="t-headline px-3 font-medium text-ink">Mais</SheetTitle>
          <SheetDescription className="sr-only">Outras áreas do app</SheetDescription>
          <ul className="flex flex-col gap-1">
            {MORE.map(({ label, to, icon: Icon }) => (
              <li key={to}>
                <NavLink
                  to={to}
                  onClick={() => setOpen(false)}
                  className={({ isActive }) =>
                    cn(
                      't-body flex min-h-11 items-center gap-3 rounded-sm px-3 py-2.5 transition-colors',
                      isActive ? 'bg-verde-soft font-medium text-verde' : 'text-ink hover:bg-bg-alt',
                    )
                  }
                >
                  <Icon size={22} strokeWidth={1.5} aria-hidden="true" />
                  {label}
                </NavLink>
              </li>
            ))}
          </ul>
        </SheetContent>
      </Sheet>
    </nav>
  );
}
