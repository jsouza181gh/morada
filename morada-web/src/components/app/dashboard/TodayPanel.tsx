import { Skeleton } from '@/components/ui';
import { TODAY } from '@/lib/date';
import type { Property, Reservation } from '@/mocks/types';

type TodayPanelProps = { reservations: Reservation[] | undefined; properties: Property[] | undefined };

type Entry = { key: string; minutes: number; time: string; text: string };

function toMinutes(hhmm: string): number {
  const [h, m] = hhmm.split(':').map(Number) as [number, number];
  return h * 60 + (m || 0);
}

/** 900 → "15h"; 930 → "15h30". */
function hourLabel(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m ? `${h}h${String(m).padStart(2, '0')}` : `${h}h`;
}

function buildEntries(reservations: Reservation[], properties: Property[]): Entry[] {
  const byId = new Map(properties.map((p) => [p.id, p]));
  const out: Entry[] = [];
  for (const r of reservations) {
    if (r.status !== 'confirmed' && r.status !== 'pending_payment') continue;
    const p = byId.get(r.propertyId);
    if (!p) continue;
    if (r.checkIn === TODAY) {
      const t = toMinutes(p.checkIn);
      out.push({ key: `in-${r.id}`, minutes: t, time: hourLabel(t), text: `Chegada — ${r.guestName}, ${p.name}` });
    }
    if (r.checkOut === TODAY) {
      const t = toMinutes(p.checkOut);
      out.push({ key: `out-${r.id}`, minutes: t, time: hourLabel(t), text: `Saída — ${r.guestName}, ${p.name}` });
      const c = t + 60;
      out.push({ key: `clean-${r.id}`, minutes: c, time: hourLabel(c), text: `Limpeza — ${p.name}` });
    }
  }
  return out.sort((a, b) => a.minutes - b.minutes || a.text.localeCompare(b.text, 'pt-BR'));
}

export function TodayPanel({ reservations, properties }: TodayPanelProps) {
  const loading = !reservations || !properties;
  const entries = loading ? [] : buildEntries(reservations, properties);

  return (
    <section aria-labelledby="dash-today" className="rounded-lg bg-surface p-6 text-ink">
      <h2 id="dash-today" className="mb-4 text-[21px] leading-7 font-medium">
        Hoje
      </h2>
      {loading ? (
        <ul className="flex flex-col gap-4" aria-hidden="true">
          {[0, 1, 2].map((i) => (
            <li key={i} className="grid grid-cols-[48px_1fr] items-center gap-3">
              <Skeleton className="h-4 w-9" />
              <Skeleton className="h-5 w-full" />
            </li>
          ))}
        </ul>
      ) : entries.length === 0 ? (
        <p className="t-body-sm text-ink-2">Nenhuma chegada ou saída hoje.</p>
      ) : (
        <ol className="flex flex-col gap-4">
          {entries.map((e) => (
            <li key={e.key} className="grid grid-cols-[48px_1fr] items-baseline gap-3">
              <span className="t-caption text-ink-2 tabular-nums">{e.time}</span>
              <span className="t-body-sm">{e.text}</span>
            </li>
          ))}
        </ol>
      )}
    </section>
  );
}
