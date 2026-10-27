import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router';
import { MobileNav, Sidebar, Topbar } from '@/components/app/shell';
import { useMock } from '@/hooks/useMock';
import { useTheme } from '@/lib/theme';
import { getChannels, getConversations, UNREAD_EVENT } from '@/mocks/api';

export default function AppLayout() {
  const { dark, setDark } = useTheme({ applyToDocument: true });
  const { pathname } = useLocation();
  // Recarrega a contagem ao trocar de rota e quando a API avisa que as não lidas mudaram.
  const { data: conversations, reload: reloadConversations } = useMock(getConversations, [pathname]);
  const { data: channels } = useMock(getChannels);

  useEffect(() => {
    window.addEventListener(UNREAD_EVENT, reloadConversations);
    return () => window.removeEventListener(UNREAD_EVENT, reloadConversations);
  }, [reloadConversations]);

  const unread = conversations?.reduce((sum, c) => sum + c.unread, 0) ?? 0;
  const hasAlert = channels?.some((c) => c.health !== 'ok') ?? false;

  return (
    <div className="app-scope min-h-dvh bg-bg-alt text-ink md:flex">
      <a
        href="#conteudo"
        className="t-body-sm sr-only rounded-pill bg-surface px-4 py-2 text-verde shadow-float focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50"
      >
        Pular para o conteúdo
      </a>
      <Sidebar unread={unread} />
      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar dark={dark} onDarkChange={setDark} hasAlert={hasAlert} />
        <main id="conteudo" tabIndex={-1} className="flex-1 px-4 pt-8 pb-24 outline-none sm:px-8 md:pb-14 lg:px-14">
          <Outlet />
        </main>
      </div>
      <MobileNav unread={unread} />
    </div>
  );
}
