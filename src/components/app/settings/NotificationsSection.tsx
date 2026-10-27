import { useState } from 'react';
import { Switch } from '@/components/ui';
import { SECTION_TITLE_CLASS } from './styles';

const EVENTS = [
  { id: 'reserva', label: 'Nova reserva' },
  { id: 'mensagem', label: 'Mensagem de hóspede' },
  { id: 'sync', label: 'Erro de sincronização' },
  { id: 'resumo', label: 'Resumo semanal' },
] as const;

const CHANNELS = [
  { id: 'email', label: 'E-mail', phrase: 'por e-mail' },
  { id: 'app', label: 'App', phrase: 'no app' },
  { id: 'whatsapp', label: 'WhatsApp', phrase: 'por WhatsApp' },
] as const;

type Key = `${(typeof EVENTS)[number]['id']}:${(typeof CHANNELS)[number]['id']}`;

const DEFAULTS: Record<Key, boolean> = {
  'reserva:email': true,
  'reserva:app': true,
  'reserva:whatsapp': true,
  'mensagem:email': false,
  'mensagem:app': true,
  'mensagem:whatsapp': true,
  'sync:email': true,
  'sync:app': true,
  'sync:whatsapp': false,
  'resumo:email': true,
  'resumo:app': false,
  'resumo:whatsapp': false,
};

export function NotificationsSection() {
  const [prefs, setPrefs] = useState(DEFAULTS);

  return (
    <section aria-labelledby="secao-notificacoes" className="rounded-lg bg-surface p-6">
      <h2 id="secao-notificacoes" className={SECTION_TITLE_CLASS}>
        Notificações
      </h2>
      <p className="t-body-sm mt-1 text-ink-2">Escolha como você quer ser avisado de cada evento.</p>
      <div className="mt-6 overflow-x-auto">
        <table className="t-body-sm w-full min-w-[480px] text-ink">
          <thead>
            <tr className="border-b border-line">
              <th scope="col" className="py-2 text-left font-medium text-ink-2">
                Evento
              </th>
              {CHANNELS.map((c) => (
                <th key={c.id} scope="col" className="w-24 py-2 text-center font-medium text-ink-2">
                  {c.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {EVENTS.map((ev) => (
              <tr key={ev.id} className="border-b border-line last:border-0">
                <th scope="row" className="py-4 pr-4 text-left font-normal">
                  {ev.label}
                </th>
                {CHANNELS.map((c) => {
                  const key: Key = `${ev.id}:${c.id}`;
                  return (
                    <td key={c.id} className="py-3 text-center">
                      <Switch
                        checked={prefs[key]}
                        onCheckedChange={(v) => setPrefs((p) => ({ ...p, [key]: v }))}
                        label={`${ev.label} ${c.phrase}`}
                      />
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
