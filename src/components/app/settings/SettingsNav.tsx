import { Link } from 'react-router';
import { cn } from '@/lib/cn';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { SECTIONS, SELECT_CONTENT_CLASS, SELECT_TRIGGER_CLASS, type SectionId } from './styles';

/** Navegação lateral (≥1068px) e Select (mobile) entre as seções de configurações. */
export function SettingsNav({ active, onChange }: { active: SectionId; onChange: (id: SectionId) => void }) {
  return (
    <>
      <div className="md:hidden">
        <span id="config-secao-label" className="sr-only">
          Seção de configurações
        </span>
        <Select value={active} onValueChange={(v) => onChange(v as SectionId)}>
          <SelectTrigger aria-labelledby="config-secao-label" className={SELECT_TRIGGER_CLASS}>
            <SelectValue />
          </SelectTrigger>
          <SelectContent className={SELECT_CONTENT_CLASS} position="popper">
            {SECTIONS.map((s) => (
              <SelectItem key={s.id} value={s.id}>
                {s.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <nav aria-label="Seções de configurações" className="hidden md:block">
        <ul className="space-y-1">
          {SECTIONS.map((s) => {
            const current = s.id === active;
            return (
              <li key={s.id}>
                <Link
                  to={`?secao=${s.id}`}
                  aria-current={current ? 'page' : undefined}
                  className={cn(
                    't-body-sm flex h-11 items-center rounded-md px-4 transition-colors',
                    current ? 'bg-verde-soft font-medium text-verde' : 'text-ink hover:bg-surface',
                  )}
                >
                  {s.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </>
  );
}
