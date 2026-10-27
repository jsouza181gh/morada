const ITEMS = [
  { label: 'Reserva confirmada', className: 'bg-verde' },
  { label: 'Aguardando pagamento', className: 'bg-verde-soft ring-1 ring-verde ring-inset' },
  {
    label: 'Bloqueado por você',
    className: '',
    style: { backgroundImage: 'repeating-linear-gradient(135deg, var(--bg-alt) 0 6px, var(--line) 6px 8px)' },
  },
] as const;

export function Legend() {
  return (
    <ul aria-label="Legenda" className="mt-4 flex flex-wrap gap-x-6 gap-y-2">
      {ITEMS.map((item) => (
        <li key={item.label} className="t-body-sm flex items-center gap-2 text-ink-2">
          <span
            aria-hidden="true"
            className={`inline-block h-4 w-7 rounded-[5px] ${item.className}`}
            style={'style' in item ? item.style : undefined}
          />
          {item.label}
        </li>
      ))}
    </ul>
  );
}
