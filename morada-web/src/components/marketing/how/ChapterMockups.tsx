import { CalendarCheck, MessageCircle, BedDouble } from 'lucide-react';
import { BrowserFrame, PhoneFrame, PhoneStatusBar } from '@/components/mockups';
import { ChannelBadge, Switch } from '@/components/ui';
import { CHANNEL_IDS, CHANNEL_NAMES, type ChannelId, type ListingStatus } from '@/mocks/types';
import { cn } from '@/lib/cn';

const STEPS = ['Básico', 'Endereço', 'Fotos', 'Comodidades', 'Regras', 'Preço', 'Revisão'];
const PHOTO_SEEDS = ['morada-how-1', 'morada-how-2', 'morada-how-3', 'morada-how-4', 'morada-how-5', 'morada-how-6'];

/** Capítulo 1: formulário de cadastro com stepper de 7 passos (passo 3 ativo) e grade de fotos. */
export function RegisterMockup() {
  return (
    <BrowserFrame
      url="morada.app/imoveis/novo"
      label="Formulário de cadastro do imóvel no passo 3 de 7, Fotos, com seis fotos enviadas."
      className="w-full max-w-[560px]"
    >
      <div className="p-4 sm:p-6">
        <ol className="flex flex-wrap gap-1.5">
          {STEPS.map((step, i) => {
            const active = i === 2;
            const done = i < 2;
            return (
              <li
                key={step}
                className={cn(
                  't-caption rounded-pill border px-2.5 py-1',
                  active
                    ? 'border-verde bg-verde text-on-verde'
                    : done
                      ? 'border-verde-soft bg-verde-soft text-verde'
                      : 'border-line text-ink-2',
                )}
              >
                {i + 1}. {step}
              </li>
            );
          })}
        </ol>
        <p className="t-headline mt-5">Fotos do imóvel</p>
        <p className="t-body-sm mt-1 text-ink-2">Arraste para reordenar. A primeira vira capa.</p>
        <div className="mt-4 grid grid-cols-3 gap-2">
          {PHOTO_SEEDS.map((seed, i) => (
            <img
              width={1200}
              height={800}
              key={seed}
              src={`https://picsum.photos/seed/${seed}/1200/800`}
              alt={`Foto ${i + 1} do imóvel`}
              loading="lazy"
              className="aspect-[3/2] w-full rounded-sm bg-verde-soft object-cover"
            />
          ))}
        </div>
        <p className="t-caption mt-4 text-ink-2">Rascunho salvo</p>
      </div>
    </BrowserFrame>
  );
}

const noop = () => {};

/** Capítulo 2: lista de canais com interruptores (decorativos). */
export function ConnectMockup() {
  return (
    <div
      role="img"
      aria-label="Canais conectados: Airbnb, Booking.com, Vrbo, Decolar e Expedia ligados; Trivago desligado."
      className="w-full max-w-[460px] rounded-card bg-bg-alt p-6 sm:p-8"
    >
      <div aria-hidden="true" inert>
        <p className="t-headline">Canais</p>
        <ul className="mt-4 divide-y divide-line">
          {CHANNEL_IDS.map((id) => {
            const on = id !== 'trivago';
            return (
              <li key={id} className="flex items-center justify-between gap-4 py-3">
                <span className="min-w-0">
                  <span className="t-body block">{CHANNEL_NAMES[id]}</span>
                  <span className="t-caption block text-ink-2">{on ? 'Conectado' : 'Desligado'}</span>
                </span>
                <Switch checked={on} onCheckedChange={noop} label={CHANNEL_NAMES[id]} />
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}

const PUBLISH_STATUS: Record<ChannelId, ListingStatus> = {
  airbnb: 'published',
  booking: 'published',
  vrbo: 'published',
  trivago: 'off',
  decolar: 'pending',
  expedia: 'published',
};

/** Capítulo 3: status do anúncio em cada canal. */
export function PublishMockup() {
  return (
    <div className="w-full max-w-[460px] rounded-card bg-surface p-6 sm:p-8">
      <p className="t-headline">Casa da Serra</p>
      <p className="t-body-sm mt-1 text-ink-2">Status do anúncio por canal</p>
      <ul className="mt-5 flex flex-col items-start gap-2.5">
        {CHANNEL_IDS.map((id) => (
          <li key={id}>
            <ChannelBadge channel={id} status={PUBLISH_STATUS[id]} />
          </li>
        ))}
      </ul>
    </div>
  );
}

const NOTIFICATIONS = [
  {
    icon: BedDouble,
    app: 'Nova reserva',
    when: 'agora',
    text: 'Airbnb · Casa da Serra, 26 a 30 out. Datas fechadas nos outros canais.',
  },
  { icon: MessageCircle, app: 'Mensagem', when: '2 min', text: 'Booking.com · Ana: Posso fazer check-in às 14h?' },
  { icon: CalendarCheck, app: 'Calendário', when: '5 min', text: 'Calendário sincronizado em 6 canais.' },
];

/** Capítulo 4: celular com três notificações. */
export function NotifyMockup() {
  return (
    <PhoneFrame
      width={280}
      tone="dark"
      label="Celular com três notificações da Morada: nova reserva do Airbnb, mensagem do Booking.com e calendário sincronizado."
    >
      <PhoneStatusBar time="15:00" className="pt-1" />
      <p className="mt-6 text-center font-display text-[56px] leading-none font-medium tabular-nums">15:00</p>
      <p className="t-body-sm mt-1 text-center text-on-dark-2">sábado, 24 de outubro</p>
      <ul className="mt-8 flex flex-col gap-2 px-3">
        {NOTIFICATIONS.map(({ icon: Icon, app, when, text }) => (
          <li key={app} className="rounded-[18px] bg-white/12 p-3 backdrop-blur">
            <div className="flex items-center gap-2">
              <span className="grid size-5 place-items-center rounded-[6px] bg-verde text-on-verde">
                <Icon size={12} strokeWidth={1.5} aria-hidden="true" />
              </span>
              <span className="t-caption flex-1">Morada · {app}</span>
              <span className="t-caption text-on-dark-2">{when}</span>
            </div>
            <p className="mt-1.5 text-[13px] leading-[18px]">{text}</p>
          </li>
        ))}
      </ul>
    </PhoneFrame>
  );
}
