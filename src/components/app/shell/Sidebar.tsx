import { NavLink } from 'react-router';
import {
  BarChart3,
  CalendarDays,
  ClipboardList,
  Home,
  LayoutGrid,
  Link2,
  MessageCircle,
  Settings,
  type LucideIcon,
} from 'lucide-react';
import { cn } from '@/lib/cn';

type SidebarItem = { label: string; to: string; icon: LucideIcon; end?: boolean; counter?: boolean };

const ITEMS: SidebarItem[] = [
  { label: 'Visão geral', to: '/app', icon: LayoutGrid, end: true },
  { label: 'Imóveis', to: '/app/imoveis', icon: Home },
  { label: 'Calendário', to: '/app/calendario', icon: CalendarDays },
  { label: 'Reservas', to: '/app/reservas', icon: ClipboardList },
  { label: 'Mensagens', to: '/app/mensagens', icon: MessageCircle, counter: true },
  { label: 'Canais', to: '/app/canais', icon: Link2 },
  { label: 'Relatórios', to: '/app/relatorios', icon: BarChart3 },
];

const linkClass = ({ isActive }: { isActive: boolean }) =>
  cn(
    'flex items-center gap-3 rounded-sm px-3 py-2.5 text-[14px] transition-colors',
    isActive ? 'bg-white/10 font-medium text-on-dark' : 'text-on-dark-2 hover:text-on-dark',
  );

export type SidebarProps = { unread?: number; className?: string };

export function Sidebar({ unread = 0, className }: SidebarProps) {
  return (
    <aside
      className={cn(
        'sticky top-0 hidden h-dvh w-60 shrink-0 flex-col gap-8 overflow-y-auto bg-surface-dark px-4 py-7 text-on-dark md:flex',
        className,
      )}
    >
      <NavLink to="/app" className="px-3 font-display text-[22px] font-medium tracking-[-0.02em] text-on-dark">
        Morada
      </NavLink>

      <nav aria-label="App">
        <ul className="flex flex-col gap-1">
          {ITEMS.map(({ label, to, icon: Icon, end, counter }) => (
            <li key={to}>
              <NavLink to={to} end={end} className={linkClass}>
                <Icon size={18} strokeWidth={1.5} aria-hidden="true" />
                <span>{label}</span>
                {counter && unread > 0 && (
                  <span className="ml-auto rounded-pill bg-on-dark px-2 text-[12px] font-medium text-surface-dark">
                    {unread}
                    <span className="sr-only"> não lidas</span>
                  </span>
                )}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      <div className="mt-auto flex flex-col gap-6">
        <NavLink to="/app/configuracoes" className={linkClass}>
          <Settings size={18} strokeWidth={1.5} aria-hidden="true" />
          <span>Configurações</span>
        </NavLink>
        <div className="t-caption flex flex-col gap-1 px-3 text-on-dark-2">
          <span>Plano Pro</span>
          <span>7 de 10 imóveis</span>
          <div className="mt-1 h-1 overflow-hidden rounded-pill bg-white/15" aria-hidden="true">
            <div className="h-full w-[70%] rounded-pill bg-on-dark" />
          </div>
        </div>
      </div>
    </aside>
  );
}
