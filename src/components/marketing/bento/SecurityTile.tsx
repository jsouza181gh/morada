import { Lock } from 'lucide-react';

export function SecurityTile() {
  return (
    <div className="flex h-full flex-col justify-between gap-8">
      <Lock size={36} strokeWidth={1.5} className="text-verde" aria-hidden="true" />
      <div className="flex flex-col gap-2">
        <h3 className="text-[21px] leading-[28px] font-semibold tracking-[-0.01em]">
          Suas senhas não passam por aqui.
        </h3>
        <p className="t-body-sm text-ink-2">
          Você autoriza a conexão direto no site de cada canal e pode revogar quando quiser.
        </p>
      </div>
    </div>
  );
}
