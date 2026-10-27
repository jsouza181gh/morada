import { useId, useState } from 'react';
import { toast } from 'sonner';
import { CHANNEL_IDS, CHANNEL_NAMES, type Channel } from '@/mocks/types';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui';
import { formatBRL } from '@/lib/format';

export type PriceByChannelProps = {
  nightlyNet: number;
  channels: Channel[];
};

/** Diária no canal para você receber `net` depois da taxa, arredondada para cima em múltiplos de 5. */
function priceForChannel(net: number, feePct: number): number {
  return Math.ceil(net / (1 - feePct) / 5) * 5;
}

const MAX = 99_999;

export function PriceByChannel({ nightlyNet, channels }: PriceByChannelProps) {
  const [net, setNet] = useState(nightlyNet);
  const inputId = useId();
  const noteId = useId();

  function onChange(raw: string) {
    const digits = raw.replace(/\D/g, '').slice(0, 5);
    setNet(Math.min(MAX, Number(digits || '0')));
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="rounded-lg bg-surface p-6">
        <label htmlFor={inputId} className="t-body-sm font-medium text-ink">
          Quero receber por noite
        </label>
        <input
          id={inputId}
          type="text"
          inputMode="numeric"
          autoComplete="off"
          aria-describedby={noteId}
          value={formatBRL(net)}
          onChange={(e) => onChange(e.target.value)}
          className="mt-2 block h-14 w-full max-w-[280px] rounded-md border border-line-strong bg-surface px-4 font-display text-[28px] font-medium tracking-[-0.02em] text-ink tabular-nums"
        />
        <p id={noteId} className="t-body-sm mt-2 text-ink-2">
          A Morada calcula a diária de cada canal para você receber esse valor depois da taxa.
        </p>
      </div>

      <div className="overflow-hidden rounded-lg bg-surface">
        <Table className="t-body-sm">
          <caption className="sr-only">Preço por canal para receber {formatBRL(net)} por noite</caption>
          <TableHeader>
            <TableRow className="border-line hover:bg-transparent">
              <TableHead className="pl-5 text-ink-2">Canal</TableHead>
              <TableHead className="px-4 text-ink-2">Taxa</TableHead>
              <TableHead className="px-4 text-right text-ink-2">Você recebe</TableHead>
              <TableHead className="pr-5 text-right text-ink-2">Diária no canal</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {CHANNEL_IDS.map((id) => {
              const ch = channels.find((c) => c.id === id);
              const fee = ch?.feePct ?? 0;
              return (
                <TableRow key={id} className="border-line hover:bg-transparent">
                  <TableCell className="py-3 pl-5 font-medium text-ink">{CHANNEL_NAMES[id]}</TableCell>
                  <TableCell className="px-4 text-ink-2">{ch?.feeLabel ?? 'Sem taxa própria'}</TableCell>
                  <TableCell className="px-4 text-right text-ink-2 tabular-nums">{formatBRL(net)}</TableCell>
                  <TableCell className="pr-5 text-right font-medium text-ink tabular-nums">
                    {formatBRL(priceForChannel(net, fee))}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4">
        <p className="t-body-sm text-ink-2">Os preços são enviados aos canais quando você salvar.</p>
        <Button onClick={() => toast('Preços salvos. Os canais recebem em instantes.')} disabled={net <= 0}>
          Salvar preços
        </Button>
      </div>
    </div>
  );
}
