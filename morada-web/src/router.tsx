import { createBrowserRouter, type RouteObject } from 'react-router';
import { Button } from '@/components/ui';

type PageModule = { default: React.ComponentType };
const page = (load: () => Promise<PageModule>): Pick<RouteObject, 'lazy'> => ({
  lazy: () => load().then((m) => ({ Component: m.default })),
});

// oxlint-disable-next-line react/only-export-components -- página 404 inline, por contrato
function NotFound() {
  return (
    <main className="mx-auto flex min-h-svh max-w-[980px] flex-col items-center justify-center gap-6 px-4 text-center">
      <h1 className="t-section">Página não encontrada.</h1>
      <Button variant="link" href="/">
        Voltar ao início ›
      </Button>
    </main>
  );
}

export const routes: RouteObject[] = [
  {
    ...page(() => import('@/layouts/MarketingLayout')),
    children: [
      { index: true, ...page(() => import('@/pages/marketing/Landing')) },
      { path: 'precos', ...page(() => import('@/pages/marketing/Pricing')) },
      { path: 'como-funciona', ...page(() => import('@/pages/marketing/HowItWorks')) },
    ],
  },
  { path: 'entrar', ...page(() => import('@/pages/marketing/Login')) },
  { path: 'cadastro', ...page(() => import('@/pages/marketing/Signup')) },
  { path: 'styleguide', ...page(() => import('@/pages/Styleguide')) },
  { path: 'app/imoveis/novo', ...page(() => import('@/pages/app/PropertyNew')) },
  {
    path: 'app',
    ...page(() => import('@/layouts/AppLayout')),
    children: [
      { index: true, ...page(() => import('@/pages/app/Dashboard')) },
      { path: 'imoveis', ...page(() => import('@/pages/app/Properties')) },
      { path: 'imoveis/:id', ...page(() => import('@/pages/app/PropertyDetail')) },
      { path: 'calendario', ...page(() => import('@/pages/app/Calendar')) },
      { path: 'reservas', ...page(() => import('@/pages/app/Reservations')) },
      { path: 'mensagens', ...page(() => import('@/pages/app/Messages')) },
      { path: 'canais', ...page(() => import('@/pages/app/Channels')) },
      { path: 'relatorios', ...page(() => import('@/pages/app/Reports')) },
      { path: 'configuracoes', ...page(() => import('@/pages/app/Settings')) },
    ],
  },
  { path: '*', Component: NotFound },
];

export const router = createBrowserRouter(routes, { basename: import.meta.env.BASE_URL });
