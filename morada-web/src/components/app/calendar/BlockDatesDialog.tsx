import { useId, useState, type FormEvent } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { addDays, TODAY } from '@/lib/date';
import { blockDates } from '@/mocks/api';
import type { Property, Reservation } from '@/mocks/types';

export type BlockDatesInitial = { propertyId?: string; from?: string; to?: string };

export type BlockDatesDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  properties: Property[];
  initial?: BlockDatesInitial;
  onBlocked: (reservation: Reservation) => void;
};

const REASONS = ['Manutenção', 'Uso próprio', 'Outro'] as const;
type Reason = (typeof REASONS)[number];

const fieldClass = 'h-11 rounded-md border-line-strong bg-surface px-3 text-[15px] text-ink md:text-[15px]';
const labelClass = 't-body-sm font-medium text-ink';

export function BlockDatesDialog({ open, onOpenChange, properties, initial, onBlocked }: BlockDatesDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="max-h-[calc(100dvh-2rem)] overflow-y-auto rounded-lg bg-surface p-6 text-ink sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle className="font-display text-[24px] leading-tight font-medium tracking-[-0.01em] text-ink">
            Bloquear datas
          </DialogTitle>
          <DialogDescription className="t-body-sm text-ink-2">
            As datas ficam fechadas em todos os canais conectados.
          </DialogDescription>
        </DialogHeader>
        {open && (
          <BlockDatesForm
            properties={properties}
            initial={initial}
            onCancel={() => onOpenChange(false)}
            onDone={(r) => {
              onOpenChange(false);
              toast.success('Datas bloqueadas em todos os canais.');
              onBlocked(r);
            }}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}

function BlockDatesForm({
  properties,
  initial,
  onCancel,
  onDone,
}: {
  properties: Property[];
  initial?: BlockDatesInitial;
  onCancel: () => void;
  onDone: (r: Reservation) => void;
}) {
  const id = useId();
  const [propertyId, setPropertyId] = useState(initial?.propertyId ?? properties[0]?.id ?? '');
  const initialFrom = initial?.from && initial.from >= TODAY ? initial.from : TODAY;
  const [from, setFrom] = useState(initialFrom);
  const [to, setTo] = useState(initial?.to && initial.to >= initialFrom ? initial.to : initialFrom);
  const [reason, setReason] = useState<Reason>('Manutenção');
  const [obs, setObs] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!propertyId) return setError('Escolha um imóvel.');
    if (!from || !to) return setError('Preencha as datas.');
    if (from < TODAY) return setError('Escolha uma data a partir de hoje.');
    if (to < from) return setError('A data final precisa ser depois da inicial.');
    setError(null);
    setSaving(true);
    try {
      const note = obs.trim() ? `${reason}: ${obs.trim()}` : reason;
      // "Até" é o último dia fechado; a saída é no dia seguinte.
      const r = await blockDates(propertyId, from, addDays(to, 1), note);
      onDone(r);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Não foi possível bloquear as datas.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <form noValidate onSubmit={onSubmit} className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <Label htmlFor={`${id}-imovel`} className={labelClass}>
          Imóvel
        </Label>
        <Select value={propertyId} onValueChange={setPropertyId}>
          <SelectTrigger id={`${id}-imovel`} className={`${fieldClass} h-11! w-full`}>
            <SelectValue placeholder="Escolha um imóvel" />
          </SelectTrigger>
          <SelectContent position="popper">
            {properties.map((p) => (
              <SelectItem key={p.id} value={p.id}>
                {p.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-2">
          <Label htmlFor={`${id}-de`} className={labelClass}>
            De
          </Label>
          <Input
            id={`${id}-de`}
            type="date"
            min={TODAY}
            value={from}
            onChange={(e) => {
              setFrom(e.target.value);
              if (e.target.value && to < e.target.value) setTo(e.target.value);
            }}
            className={fieldClass}
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor={`${id}-ate`} className={labelClass}>
            Até
          </Label>
          <Input
            id={`${id}-ate`}
            type="date"
            min={from || TODAY}
            value={to}
            onChange={(e) => setTo(e.target.value)}
            className={fieldClass}
          />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor={`${id}-motivo`} className={labelClass}>
          Motivo
        </Label>
        <Select value={reason} onValueChange={(v) => setReason(v as Reason)}>
          <SelectTrigger id={`${id}-motivo`} className={`${fieldClass} h-11! w-full`}>
            <SelectValue />
          </SelectTrigger>
          <SelectContent position="popper">
            {REASONS.map((r) => (
              <SelectItem key={r} value={r}>
                {r}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor={`${id}-obs`} className={labelClass}>
          Observação <span className="font-normal text-ink-2">(opcional)</span>
        </Label>
        <Textarea
          id={`${id}-obs`}
          value={obs}
          onChange={(e) => setObs(e.target.value)}
          rows={3}
          maxLength={140}
          className="rounded-md border-line-strong bg-surface px-3 text-[15px] text-ink md:text-[15px]"
        />
      </div>

      {error && (
        <p role="alert" className="t-body-sm rounded-md bg-danger-soft px-3 py-2 text-danger">
          ! {error}
        </p>
      )}

      <div className="mt-2 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
        <Button type="button" variant="ghost" size="sm" onClick={onCancel} className="max-sm:min-h-11">
          Cancelar
        </Button>
        <Button type="submit" size="sm" disabled={saving} className="max-sm:min-h-11">
          {saving ? 'Bloqueando…' : 'Bloquear datas'}
        </Button>
      </div>
    </form>
  );
}
