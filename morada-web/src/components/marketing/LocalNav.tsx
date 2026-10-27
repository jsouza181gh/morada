import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import { Button } from '@/components/ui';
import { cn } from '@/lib/cn';

const LINKS = [
  { label: 'Visão geral', to: '/#produto' },
  { label: 'Recursos', to: '/#recursos' },
  { label: 'Preços', to: '/precos' },
];

export function LocalNav() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const update = () => setScrolled(window.scrollY > 8);
    update();
    window.addEventListener('scroll', update, { passive: true });
    return () => window.removeEventListener('scroll', update);
  }, []);

  return (
    <div className="sticky top-0 z-40 px-4 py-2">
      <nav
        aria-label="Morada"
        className={cn(
          'mx-auto flex min-h-[52px] max-w-[980px] flex-wrap items-center gap-x-6 gap-y-2 rounded-pill py-1.5 pr-2 pl-6',
          'transition-[background-color,box-shadow,backdrop-filter] duration-200 ease-out',
          scrolled
            ? 'bg-[color-mix(in_srgb,var(--surface)_78%,transparent)] shadow-float backdrop-blur-[20px] backdrop-saturate-[1.8]'
            : 'bg-transparent shadow-none',
        )}
      >
        <Link to="/" className="flex-1 font-display text-[21px] font-semibold tracking-[-0.02em] text-ink">
          Morada
        </Link>
        <ul className="hidden items-center gap-6 text-[12px] sm:flex">
          {LINKS.map((link) => (
            <li key={link.to}>
              <Link to={link.to} className="text-ink/80 transition-colors hover:text-ink">
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
        <div className="flex items-center gap-2">
          <Button variant="secondary" size="sm" href="/#produto">
            Explorar
          </Button>
          <Button variant="primary" size="sm" href="/cadastro">
            Começar
          </Button>
        </div>
      </nav>
    </div>
  );
}
