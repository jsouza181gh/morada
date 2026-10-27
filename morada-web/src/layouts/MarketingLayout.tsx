import { useEffect } from 'react';
import { Outlet, ScrollRestoration } from 'react-router';
import { Footer } from '@/components/marketing/Footer';
import { GlobalNav } from '@/components/marketing/GlobalNav';
import { LocalNav } from '@/components/marketing/LocalNav';

/**
 * Cliques em links internos com âncora para a página atual (ex.: "/#canais" estando em "/")
 * rolam suavemente até o id em vez de navegar (instantâneo com reduced motion).
 * Escuta em captura no document: roda antes do <Link> do React Router e, ao chamar
 * preventDefault, impede a navegação dele. Vale para nav, rodapé, Button com href e seções.
 * A compensação de 80px da LocalNav vem do `scroll-mt-20` nos elementos com id do <main>.
 */
function useSmoothAnchorClicks() {
  useEffect(() => {
    function onClick(event: MouseEvent) {
      if (event.defaultPrevented || event.button !== 0) return;
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const anchor = (event.target as Element | null)?.closest?.('a[href]');
      if (!(anchor instanceof HTMLAnchorElement) || (anchor.target && anchor.target !== '_self')) return;

      const url = new URL(anchor.href, window.location.href);
      if (url.origin !== window.location.origin || url.pathname !== window.location.pathname) return;
      const id = decodeURIComponent(url.hash.slice(1));
      if (!id) return;
      const target = document.getElementById(id);
      if (!target) return;

      event.preventDefault();
      const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      target.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
      // alvo focável (ex.: <main tabIndex={-1}> do "Pular para o conteúdo") recebe o foco
      if (target.hasAttribute('tabindex')) target.focus({ preventScroll: true });
      window.history.replaceState(window.history.state, '', `${url.pathname}${url.search}${url.hash}`);
    }
    document.addEventListener('click', onClick, true);
    return () => document.removeEventListener('click', onClick, true);
  }, []);
}

export default function MarketingLayout() {
  useSmoothAnchorClicks();

  return (
    <>
      <a
        href="#conteudo"
        className="sr-only rounded-pill bg-surface px-5 py-3 text-[14px] text-ink shadow-float focus:not-sr-only focus:fixed focus:top-2 focus:left-4 focus:z-[60]"
      >
        Pular para o conteúdo
      </a>
      <GlobalNav />
      <LocalNav />
      <main id="conteudo" tabIndex={-1} className="outline-none [&_[id]]:scroll-mt-20">
        <Outlet />
      </main>
      <Footer />
      <ScrollRestoration />
    </>
  );
}
