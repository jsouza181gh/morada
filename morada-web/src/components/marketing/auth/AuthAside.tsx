import { Link } from 'react-router';
import { ChannelBadge } from '@/components/ui';
import { CHANNEL_IDS } from '@/mocks/types';

/** Painel escuro à esquerda das telas de entrar/cadastro (só ≥1068px). */
export function AuthAside() {
  return (
    <aside className="hidden bg-surface-dark p-14 text-on-dark md:flex md:flex-col md:justify-between">
      <Link to="/" className="self-start font-display text-[22px] font-semibold tracking-[-0.02em] text-on-dark">
        Morada
      </Link>
      <div>
        <p className="t-section-xl text-on-dark">
          Um anúncio.
          <br />
          Todos os lugares.
        </p>
        <ul className="mt-10 flex flex-wrap gap-2" aria-label="Canais suportados">
          {CHANNEL_IDS.map((id) => (
            <li key={id}>
              <ChannelBadge channel={id} status="published" />
            </li>
          ))}
        </ul>
      </div>
      <p className="t-caption text-on-dark-2">Morada é independente e não tem vínculo com os canais citados.</p>
    </aside>
  );
}
