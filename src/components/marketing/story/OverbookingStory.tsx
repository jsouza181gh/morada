import { CalendarMerge } from './CalendarMerge';

export function OverbookingStory() {
  return (
    <section className="bg-surface-dark px-4 py-36 text-on-dark">
      <div className="mx-auto flex max-w-[980px] flex-col items-center gap-18">
        <h2 className="t-section-xl text-center">
          Chega de
          <br />
          overbooking.
        </h2>

        <CalendarMerge />

        <p className="t-lead max-w-[640px] text-center text-on-dark-2">
          Cada canal guarda o próprio calendário. A Morada junta todos num só e,{' '}
          <strong className="font-medium text-on-dark">assim que uma reserva entra</strong>, fecha a data em todos os
          outros. Sem planilha. Sem conferir de madrugada.{' '}
          <strong className="font-medium text-on-dark">Sem cancelar hóspede</strong>.
        </p>
      </div>
    </section>
  );
}
