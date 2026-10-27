import { useState } from 'react';
import { Link } from 'react-router';
import { Search, X } from 'lucide-react';
import { Sheet, SheetClose, SheetContent, SheetTitle, SheetTrigger } from '@/components/ui/sheet';

const LINKS = [
  { label: 'Produto', to: '/#produto' },
  { label: 'Canais', to: '/#canais' },
  { label: 'Recursos', to: '/#recursos' },
  { label: 'Preços', to: '/precos' },
  { label: 'App', to: '/#app' },
  { label: 'Para administradoras', to: '/precos#anfitriao' },
  { label: 'Ajuda', to: '/#duvidas' },
];

const iconButton =
  'inline-flex size-11 items-center justify-center rounded-pill text-ink/80 transition-colors hover:text-ink';

function HomeIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M3 11L12 4l9 7" />
      <path d="M6 9.5V20h12V9.5" />
    </svg>
  );
}

function MenuIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      aria-hidden="true"
    >
      <path d="M4 9h16" />
      <path d="M4 15h16" />
    </svg>
  );
}

export function GlobalNav() {
  const [open, setOpen] = useState(false);

  return (
    <header className="t-caption h-11 bg-[color-mix(in_srgb,var(--bg-alt)_85%,transparent)]">
      <nav aria-label="Global" className="mx-auto flex h-full max-w-[1024px] items-center justify-between px-4">
        <Link to="/" aria-label="Morada, início" className={iconButton}>
          <HomeIcon />
        </Link>

        <ul className="hidden flex-1 items-center justify-evenly px-4 sm:flex">
          {LINKS.map((link) => (
            <li key={link.to}>
              <Link to={link.to} className="text-ink/80 transition-colors hover:text-ink">
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="flex items-center">
          <button type="button" aria-label="Buscar" className={iconButton}>
            <Search size={16} strokeWidth={1.5} aria-hidden="true" />
          </button>
          <Link
            to="/entrar"
            className="inline-flex h-11 items-center px-2 text-ink/80 transition-colors hover:text-ink"
          >
            Entrar
          </Link>
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <button type="button" aria-label="Abrir menu" className={`${iconButton} sm:hidden`}>
                <MenuIcon />
              </button>
            </SheetTrigger>
            <SheetContent
              side="top"
              showCloseButton={false}
              aria-describedby={undefined}
              className="gap-0 border-line bg-bg px-4 pt-2 pb-10 text-ink"
            >
              <div className="flex h-11 items-center justify-between">
                <SheetTitle className="sr-only">Menu</SheetTitle>
                <span aria-hidden="true" />
                <SheetClose asChild>
                  <button type="button" aria-label="Fechar menu" className={iconButton}>
                    <X size={18} strokeWidth={1.5} aria-hidden="true" />
                  </button>
                </SheetClose>
              </div>
              <ul className="flex flex-col">
                {LINKS.map((link) => (
                  <li key={link.to}>
                    <Link
                      to={link.to}
                      onClick={() => setOpen(false)}
                      className="t-headline flex min-h-11 items-center py-2 text-ink"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </SheetContent>
          </Sheet>
        </div>
      </nav>
    </header>
  );
}
