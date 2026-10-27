import { SegmentedControl } from '@/components/ui';
import { useTheme, type ThemePref } from '@/lib/theme';
import { SECTION_TITLE_CLASS } from './styles';

const OPTIONS: { value: ThemePref; label: string }[] = [
  { value: 'light', label: 'Claro' },
  { value: 'dark', label: 'Escuro' },
  { value: 'auto', label: 'Automático' },
];

export function AppearanceSection() {
  // O AppLayout aplica o tema no documento; aqui só lemos e alteramos a preferência compartilhada.
  const { pref, setPref } = useTheme();

  return (
    <section aria-labelledby="secao-aparencia" className="rounded-lg bg-surface p-6">
      <h2 id="secao-aparencia" className={SECTION_TITLE_CLASS}>
        Aparência
      </h2>
      <p className="t-body-sm mt-1 text-ink-2">
        Automático acompanha o tema do seu sistema. A escolha fica salva neste navegador.
      </p>
      <SegmentedControl className="mt-6" value={pref} onChange={setPref} options={OPTIONS} ariaLabel="Tema" />
    </section>
  );
}
