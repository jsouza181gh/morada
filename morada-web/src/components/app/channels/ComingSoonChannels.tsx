import { Badge } from '@/components/ui';

const SOON = ['Google Vacation Rentals', 'Hoteis.com', 'Tripadvisor'];

export function ComingSoonChannels() {
  return (
    <section aria-labelledby="canais-em-breve" className="mt-14">
      <h2 id="canais-em-breve" className="font-display text-[24px] leading-8 font-medium tracking-[-0.01em] text-ink">
        Canais em breve
      </h2>
      <ul className="mt-5 grid grid-cols-[repeat(auto-fill,minmax(min(100%,320px),1fr))] gap-5">
        {SOON.map((name) => (
          <li
            key={name}
            aria-disabled="true"
            className="flex items-center justify-between gap-3 rounded-lg border border-dashed border-line bg-surface/60 p-6"
          >
            <span className="text-[21px] leading-7 font-medium text-ink-2">{name}</span>
            <Badge tone="neutral">Em breve</Badge>
          </li>
        ))}
      </ul>
    </section>
  );
}
