import { Button } from '@/components/ui';
import { Parallax } from '@/components/motion';
import { PhoneFrame, PhoneStatusBar } from '@/components/mockups';
import { formatBRL } from '@/lib/format';

const TODAY_CARDS = [
  { label: 'Chegada, 15h', value: 'Marina Costa, Casa da Lagoa' },
  { label: 'Saída, 11h', value: 'Pedro Lima, Loft Pinheiros' },
  { label: 'Limpeza, 12h', value: 'Loft Pinheiros, equipe da Rita' },
  { label: 'Nova reserva', value: 'Thomas, 26 a 30 out, Booking.com' },
] as const;

// Valores fixos da T15 (diária no canal para o anfitrião receber R$ 480).
const CHANNEL_PRICES = [
  { name: 'Airbnb', price: 495 },
  { name: 'Booking.com', price: 565 },
  { name: 'Vrbo', price: 505 },
  { name: 'Decolar', price: 545 },
  { name: 'Expedia', price: 565 },
] as const;

const PHONE_WIDTH = 270;

export function AppShowcase() {
  return (
    <section id="app" aria-labelledby="app-title" className="overflow-hidden bg-bg px-4 pt-36 text-center text-ink">
      <p className="t-eyebrow text-verde">App Morada</p>
      <h2 id="app-title" className="t-section-xl mt-3">
        A recepção
        <br />
        cabe no bolso.
      </h2>
      <p className="t-lead mx-auto mt-6 max-w-[560px] text-ink-2">
        Aceite reservas, responda hóspedes e ajuste preços de onde estiver.
      </p>

      <div className="mt-8 mb-14 flex flex-wrap justify-center gap-3">
        <Button variant="secondary" href="#">
          Baixar para iPhone
        </Button>
        <Button variant="secondary" href="#">
          Baixar para Android
        </Button>
      </div>

      <div className="mx-auto flex h-[520px] items-end justify-center gap-7">
        <Parallax offset={20} className="mb-[-80px]">
          <PhoneFrame
            width={PHONE_WIDTH}
            tone="light"
            label="App Morada, tela Hoje: chegada de Marina Costa às 15h, saída de Pedro Lima às 11h, limpeza às 12h e nova reserva de Thomas pelo Booking.com."
          >
            <div className="flex h-full flex-col bg-bg-alt text-left">
              <PhoneStatusBar time="15:00" className="text-[#3a3a3c]" />
              <div className="px-4 pt-3">
                <p className="font-display text-2xl font-medium tracking-[-0.02em] text-[#3a3a3c]">Hoje</p>
                <ul className="mt-4 flex flex-col gap-2">
                  {TODAY_CARDS.map((card) => (
                    <li key={card.label} className="rounded-2xl bg-surface px-3.5 py-3">
                      <p className="text-xs text-ink-2">{card.label}</p>
                      <p className="mt-0.5 text-xs font-medium text-ink">{card.value}</p>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </PhoneFrame>
        </Parallax>

        <Parallax offset={50} className="mb-[-140px] hidden sm:block">
          <PhoneFrame
            width={PHONE_WIDTH}
            tone="dark"
            label="App Morada, Casa da Lagoa: R$ 480 por noite para você, com preço ajustado em cada canal."
          >
            <div className="flex h-full flex-col text-left">
              <PhoneStatusBar time="15:00" />
              <div className="px-5 pt-4">
                <p className="text-xs text-on-dark-2">Casa da Lagoa</p>
                <p className="mt-1 font-display text-[40px] leading-none font-medium tracking-[-0.03em]">
                  {formatBRL(480)}
                </p>
                <p className="mt-2 text-xs text-on-dark-2">por noite, você recebe</p>
                <ul className="mt-6 divide-y divide-white/12 border-y border-white/12">
                  {CHANNEL_PRICES.map((c) => (
                    <li key={c.name} className="flex items-center justify-between py-3 text-[13px]">
                      <span>{c.name}</span>
                      <span className="font-medium tabular-nums">{formatBRL(c.price)}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </PhoneFrame>
        </Parallax>
      </div>
    </section>
  );
}
