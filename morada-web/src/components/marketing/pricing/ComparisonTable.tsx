import { CheckIcon } from './PlanCard';

type Cell = boolean | string;
type Row = { label: string; values: [Cell, Cell, Cell] };
type Group = { title: string; rows: Row[] };

const PLANS = ['Essencial', 'Pro', 'Anfitrião+'] as const;

const ALL: [Cell, Cell, Cell] = [true, true, true];

const GROUPS: Group[] = [
  {
    title: 'Canais',
    rows: [
      { label: 'Os 6 canais', values: ALL },
      { label: 'Novos canais', values: ALL },
    ],
  },
  { title: 'Imóveis', rows: [{ label: 'Imóveis', values: ['2', '10', 'Ilimitados'] }] },
  {
    title: 'Calendário',
    rows: [
      { label: 'Calendário sincronizado', values: ALL },
      { label: 'Bloqueios manuais', values: ALL },
    ],
  },
  {
    title: 'Preço',
    rows: [
      { label: 'Ajuste por taxa do canal', values: ALL },
      { label: 'Preço que acompanha a demanda', values: [false, true, true] },
    ],
  },
  {
    title: 'Mensagens',
    rows: [
      { label: 'Caixa de entrada única', values: ALL },
      { label: 'Respostas prontas', values: [false, true, true] },
    ],
  },
  {
    title: 'Relatórios',
    rows: [
      { label: 'Relatório básico', values: ALL },
      { label: 'Relatórios por canal', values: [false, true, true] },
    ],
  },
  {
    title: 'Equipe',
    rows: [
      { label: 'Usuários', values: ['1', '2', 'Ilimitados'] },
      { label: 'Permissões por função', values: [false, false, true] },
    ],
  },
  {
    title: 'Suporte',
    rows: [
      { label: 'Suporte por e-mail', values: ALL },
      { label: 'Atendimento dedicado', values: [false, false, true] },
    ],
  },
];

function CellContent({ value }: { value: Cell }) {
  if (typeof value === 'string') return <span className="font-medium text-ink">{value}</span>;
  if (value)
    return (
      <>
        <CheckIcon className="mx-auto text-verde" />
        <span className="sr-only">Incluído</span>
      </>
    );
  return (
    <>
      <span aria-hidden="true" className="text-ink-2">
        –
      </span>
      <span className="sr-only">Não incluído</span>
    </>
  );
}

const stickyTh = 'bg-bg sm:sticky sm:top-[68px] sm:z-10';

export function ComparisonTable() {
  return (
    <section aria-labelledby="comparar-titulo" className="bg-bg px-4 pt-36">
      <div className="mx-auto max-w-[980px]">
        <h2 id="comparar-titulo" className="t-section">
          Compare os planos.
        </h2>
        <div className="relative mt-12 overflow-x-auto sm:overflow-visible">
          <table className="w-full min-w-[640px] border-collapse text-left t-body">
            <caption className="sr-only">Recursos incluídos em cada plano</caption>
            <thead>
              <tr>
                <th scope="col" className={`${stickyTh} w-[40%] py-4 pr-4`}>
                  <span className="sr-only">Recurso</span>
                </th>
                {PLANS.map((p) => (
                  <th
                    key={p}
                    scope="col"
                    className={`${stickyTh} border-b border-line px-4 py-4 text-center font-display text-[21px] font-semibold`}
                  >
                    {p}
                  </th>
                ))}
              </tr>
            </thead>
            {GROUPS.map((g) => (
              <tbody key={g.title}>
                <tr>
                  <th scope="colgroup" colSpan={4} className="t-headline border-b border-line pt-10 pb-3 text-ink">
                    {g.title}
                  </th>
                </tr>
                {g.rows.map((r) => (
                  <tr key={r.label} className="border-b border-line">
                    <th scope="row" className="py-4 pr-4 font-normal text-ink">
                      {r.label}
                    </th>
                    {r.values.map((v, i) => (
                      <td key={PLANS[i]} className="px-4 py-4 text-center">
                        <CellContent value={v} />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            ))}
          </table>
        </div>
      </div>
    </section>
  );
}
