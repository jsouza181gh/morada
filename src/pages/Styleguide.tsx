import { useEffect, useMemo, useState, type ReactNode } from 'react';
import { ArrowRight, Calendar, Home, Moon, Pause, Plus, Sun, Wifi, X } from 'lucide-react';
import {
  Avatar,
  Badge,
  Button,
  Card,
  ChannelBadge,
  EmptyState,
  Headline,
  IconButton,
  KpiCard,
  Pill,
  SegmentedControl,
  Skeleton,
  Switch,
} from '@/components/ui';
import { CHANNEL_IDS, type ListingStatus } from '@/mocks/types';

type Theme = 'light' | 'dark';

const COLOR_TOKENS = [
  'bg',
  'bg-alt',
  'surface',
  'surface-dark',
  'line',
  'line-strong',
  'ink',
  'ink-2',
  'on-dark',
  'on-dark-2',
  'verde',
  'verde-strong',
  'verde-soft',
  'on-verde',
  'ouro',
  'ouro-ink',
  'ouro-soft',
  'warning',
  'warning-soft',
  'danger',
  'danger-soft',
] as const;

const TYPE_SAMPLES: { cls: string; text: string }[] = [
  { cls: 't-hero', text: 'Um anúncio.' },
  { cls: 't-section-xl', text: 'Todos os lugares.' },
  { cls: 't-section', text: 'Publique uma vez.' },
  { cls: 't-title', text: 'Calendário unificado.' },
  { cls: 't-stat', text: 'R$ 18.450' },
  { cls: 't-headline', text: 'Preços sincronizados em todos os canais.' },
  { cls: 't-eyebrow', text: 'Novo na Morada' },
  { cls: 't-lead', text: 'Cadastre o imóvel uma vez e publique no Airbnb, Booking.com e Vrbo sem repetir nada.' },
  { cls: 't-body', text: 'Mensagens, reservas e bloqueios ficam no mesmo lugar. Você responde de uma tela só.' },
  { cls: 't-body-sm', text: 'Última sincronização há 2 min. Nenhum conflito de datas.' },
  { cls: 't-caption', text: 'Atualizado às 15:00' },
];

const STATUSES: ListingStatus[] = ['published', 'pending', 'error', 'off'];
const VARIANTS = ['primary', 'secondary', 'link', 'ghost', 'on-dark'] as const;
const SIZES = ['sm', 'md', 'lg'] as const;

function readTheme(): Theme {
  return document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
}

function Block({ title, children, id }: { title: string; children: ReactNode; id: string }) {
  return (
    <section aria-labelledby={id} className="border-t border-line py-12 first:border-t-0">
      <h2 id={id} className="t-title mb-8">
        {title}
      </h2>
      {children}
    </section>
  );
}

function ColorSwatches({ theme }: { theme: Theme }) {
  // O atributo data-theme é trocado no clique (antes do render), então dá para ler aqui.
  const values = useMemo(() => {
    const styles = getComputedStyle(document.documentElement);
    const next: Record<string, string> = { theme };
    for (const t of [...COLOR_TOKENS, 'shadow-float']) next[t] = styles.getPropertyValue(`--${t}`).trim();
    return next;
  }, [theme]);

  return (
    <>
      <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
        {COLOR_TOKENS.map((t) => (
          <li key={t} className="overflow-hidden rounded-md border border-line bg-surface">
            <div className="h-16 border-b border-line" style={{ background: `var(--${t})` }} />
            <div className="p-3">
              <p className="t-body-sm font-medium text-ink">--{t}</p>
              <p className="t-caption font-mono text-ink-2">{values[t] || '…'}</p>
            </div>
          </li>
        ))}
      </ul>
      <div className="mt-6 rounded-md bg-surface p-4 shadow-float">
        <p className="t-body-sm font-medium text-ink">--shadow-float</p>
        <p className="t-caption font-mono break-all text-ink-2">{values['shadow-float'] || '…'}</p>
      </div>
    </>
  );
}

export default function Styleguide() {
  const [theme, setTheme] = useState<Theme>(() => (typeof document === 'undefined' ? 'light' : readTheme()));
  const [pill, setPill] = useState('casa');
  const [sw1, setSw1] = useState(true);
  const [sw2, setSw2] = useState(false);
  const [billing, setBilling] = useState<'mensal' | 'anual'>('mensal');
  const [period, setPeriod] = useState<'7d' | '30d' | '12m'>('30d');

  function toggleTheme() {
    const next: Theme = theme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    setTheme(next);
  }

  useEffect(() => {
    document.title = 'Styleguide · Morada';
  }, []);

  return (
    <div className="min-h-dvh bg-bg text-ink">
      <header className="sticky top-0 z-10 border-b border-line bg-bg/85 backdrop-blur-xl">
        <div className="mx-auto flex max-w-[1260px] items-center justify-between gap-4 px-4 py-3">
          <p className="t-headline">Morada · Styleguide</p>
          <Button
            variant="secondary"
            size="sm"
            iconLeft={
              theme === 'dark' ? (
                <Sun size={16} strokeWidth={1.5} aria-hidden="true" />
              ) : (
                <Moon size={16} strokeWidth={1.5} aria-hidden="true" />
              )
            }
            onClick={toggleTheme}
          >
            {theme === 'dark' ? 'Usar tema claro' : 'Usar tema escuro'}
          </Button>
        </div>
      </header>

      <main className="mx-auto max-w-[1260px] px-4 pb-24">
        <div className="pt-12 pb-4">
          <h1 className="t-section">Componentes base.</h1>
          <p className="t-lead mt-4 max-w-[60ch] text-ink-2">
            Tokens, tipografia e primitivos da Morada em todos os estados.
          </p>
        </div>

        <Block title="Cores" id="sg-cores">
          <ColorSwatches theme={theme} />
        </Block>

        <Block title="Tipografia" id="sg-tipo">
          <ul className="space-y-6">
            {TYPE_SAMPLES.map((s) => (
              <li key={s.cls} className="grid gap-2 md:grid-cols-[140px_1fr] md:items-baseline">
                <code className="t-caption text-ink-2">.{s.cls}</code>
                <p className={`${s.cls} max-w-full break-words`}>{s.text}</p>
              </li>
            ))}
          </ul>
        </Block>

        <Block title="Botões" id="sg-botoes">
          <div className="space-y-6">
            {VARIANTS.map((v) => {
              const dark = v === 'on-dark';
              return (
                <div key={v} className={dark ? 'rounded-lg bg-surface-dark p-6' : ''}>
                  <p className={`t-caption mb-3 ${dark ? 'text-on-dark-2' : 'text-ink-2'}`}>{v}</p>
                  <div className="flex flex-wrap items-center gap-3">
                    {SIZES.map((s) => (
                      <Button key={s} variant={v} size={s}>
                        {v === 'link' ? 'Saiba mais' : `Começar grátis (${s})`}
                      </Button>
                    ))}
                    <Button variant={v} disabled>
                      Desabilitado
                    </Button>
                  </div>
                </div>
              );
            })}
            <div>
              <p className="t-caption mb-3 text-ink-2">com ícone, href e largura total</p>
              <div className="flex flex-wrap items-center gap-3">
                <Button iconLeft={<Plus size={20} strokeWidth={1.5} aria-hidden="true" />}>Adicionar imóvel</Button>
                <Button variant="secondary" iconRight={<ArrowRight size={20} strokeWidth={1.5} aria-hidden="true" />}>
                  Ver canais
                </Button>
                <Button variant="link" href="/precos">
                  Ver preços
                </Button>
                <Button variant="link" href="https://example.com">
                  Link externo
                </Button>
              </div>
              <div className="mt-3 max-w-[360px]">
                <Button fullWidth>Publicar agora</Button>
              </div>
            </div>
          </div>
        </Block>

        <Block title="Pílulas" id="sg-pilulas">
          <div className="flex flex-wrap gap-2" role="group" aria-label="Tipo de imóvel">
            {[
              { id: 'casa', label: 'Casa', icon: <Home strokeWidth={1.5} /> },
              { id: 'apto', label: 'Apartamento', icon: <Calendar strokeWidth={1.5} /> },
              { id: 'chale', label: 'Chalé', icon: <Wifi strokeWidth={1.5} /> },
              { id: 'loft', label: 'Loft' },
            ].map((p) => (
              <Pill key={p.id} active={pill === p.id} icon={p.icon} onClick={() => setPill(p.id)}>
                {p.label}
              </Pill>
            ))}
          </div>
        </Block>

        <Block title="Badges" id="sg-badges">
          <div className="flex flex-wrap gap-2">
            <Badge>Neutro</Badge>
            <Badge tone="verde">✓ Publicado</Badge>
            <Badge tone="ouro">Mais escolhido</Badge>
            <Badge tone="warning">• Em análise</Badge>
            <Badge tone="danger">! Erro</Badge>
            <Badge tone="dark">Premium</Badge>
          </div>
        </Block>

        <Block title="Selos de canal" id="sg-canais">
          <div className="overflow-x-auto">
            <table className="border-separate border-spacing-2">
              <tbody>
                {CHANNEL_IDS.map((c) => (
                  <tr key={c}>
                    {STATUSES.map((s) => (
                      <td key={s}>
                        <ChannelBadge channel={c} status={s} />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            {STATUSES.map((s) => (
              <ChannelBadge key={s} channel="airbnb" status={s} size="sm" />
            ))}
          </div>
        </Block>

        <Block title="Cards" id="sg-cards">
          <div className="rounded-card bg-bg-alt p-4 sm:p-6">
            <div className="grid gap-4 md:grid-cols-3">
              <Card tone="surface">
                <p className="t-title">Surface.</p>
                <p className="t-body mt-2 text-ink-2">Card branco sobre fundo cinza.</p>
              </Card>
              <Card tone="alt" className="border border-line">
                <p className="t-title">Alt.</p>
                <p className="t-body mt-2 text-ink-2">Card cinza sobre fundo branco.</p>
              </Card>
              <Card tone="dark">
                <p className="t-title">Dark.</p>
                <p className="t-body mt-2 text-on-dark-2">Destaque de impacto.</p>
              </Card>
            </div>
            <div className="mt-4 grid gap-4 md:grid-cols-3">
              <Card size="app">
                <p className="t-headline">Card do app</p>
                <p className="t-body-sm mt-1 text-ink-2">rounded-lg, p-6.</p>
              </Card>
            </div>
          </div>
        </Block>

        <Block title="Headline" id="sg-headline">
          <div className="space-y-16">
            <Headline size="hero" as="h2" eyebrow="Morada" title="Um anúncio. Todos os lugares.">
              Cadastre o imóvel <b>uma vez</b> e publique em seis canais.
            </Headline>
            <Headline size="section" title="Calendário unificado.">
              Reservas de todos os canais em uma única agenda.
            </Headline>
            <Headline size="title" align="start" title="Preços por canal.">
              Ajuste a diária e veja <strong>quanto você recebe</strong>.
            </Headline>
            <div className="rounded-card bg-surface-dark p-8 sm:p-12">
              <Headline size="section" tone="dark" eyebrow="Pro" title="Feito para crescer.">
                Equipe, relatórios e <b>sincronização a cada minuto</b>.
              </Headline>
            </div>
          </div>
        </Block>

        <Block title="KPIs" id="sg-kpis">
          <div className="grid gap-4 rounded-card bg-bg-alt p-4 sm:grid-cols-3 sm:p-6">
            <KpiCard label="Receita do mês" value="R$ 18.450" delta="12%" trend="up" caption="vs. setembro" />
            <KpiCard label="Ocupação" value="72%" delta="4 p.p." trend="down" caption="vs. setembro" />
            <KpiCard label="Diária média" value="R$ 420" loading />
          </div>
        </Block>

        <Block title="Interruptor e segmentado" id="sg-controles">
          <div className="flex flex-wrap items-center gap-8">
            <div className="flex items-center gap-3">
              <Switch checked={sw1} onCheckedChange={setSw1} label="Sincronização automática" />
              <span className="t-body-sm">Sincronização automática: {sw1 ? 'ligada' : 'desligada'}</span>
            </div>
            <div className="flex items-center gap-3">
              <Switch checked={sw2} onCheckedChange={setSw2} label="Aceitar reserva instantânea" />
              <span className="t-body-sm">Reserva instantânea</span>
            </div>
            <div className="flex items-center gap-3">
              <Switch checked onCheckedChange={() => undefined} label="Desabilitado" disabled />
              <span className="t-body-sm text-ink-2">Desabilitado</span>
            </div>
          </div>
          <div className="mt-8 flex flex-wrap items-center gap-6">
            <SegmentedControl
              ariaLabel="Período de cobrança"
              value={billing}
              onChange={setBilling}
              options={[
                { value: 'mensal', label: 'Mensal' },
                { value: 'anual', label: 'Anual' },
              ]}
            />
            <SegmentedControl
              ariaLabel="Período do relatório"
              value={period}
              onChange={setPeriod}
              options={[
                { value: '7d', label: '7 dias' },
                { value: '30d', label: '30 dias' },
                { value: '12m', label: '12 meses' },
              ]}
            />
          </div>
        </Block>

        <Block title="Botões de ícone" id="sg-iconbuttons">
          <div className="flex flex-wrap items-center gap-6">
            {(['glass', 'solid', 'ghost'] as const).map((v) => (
              <div key={v} className="flex items-center gap-3">
                {SIZES.map((s) => (
                  <IconButton key={s} variant={v} size={s} label={`Pausar (${v}, ${s})`}>
                    <Pause size={s === 'sm' ? 16 : 20} strokeWidth={1.5} aria-hidden="true" />
                  </IconButton>
                ))}
              </div>
            ))}
            <IconButton label="Fechar" disabled>
              <X size={20} strokeWidth={1.5} aria-hidden="true" />
            </IconButton>
          </div>
        </Block>

        <Block title="Avatar" id="sg-avatar">
          <div className="flex flex-wrap items-center gap-4">
            <Avatar name="Mariana Costa Lima" />
            <Avatar name="João Souza" tone="dark" />
            <Avatar name="Ana" tone="neutral" />
            <Avatar name="Pedro Henrique Alves" size={56} />
            <Avatar name="Lu Martins" size={28} tone="neutral" />
          </div>
        </Block>

        <Block title="Estado vazio" id="sg-empty">
          <div className="rounded-lg bg-bg-alt">
            <EmptyState
              title="Nenhuma reserva ainda."
              description="Quando um hóspede reservar em qualquer canal, ela aparece aqui."
              action={<Button size="sm">Publicar imóvel</Button>}
            />
          </div>
        </Block>

        <Block title="Skeleton" id="sg-skeleton">
          <div className="max-w-[420px] space-y-3">
            <Skeleton className="h-40 w-full rounded-lg" />
            <Skeleton className="h-5 w-3/4" />
            <Skeleton className="h-5 w-1/2" />
          </div>
        </Block>
      </main>
    </div>
  );
}
