import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

const COLUMNS: { title: string; links: string[] }[] = [
  { title: 'Produto', links: ['Visão geral', 'Calendário', 'Preços por canal', 'Mensagens', 'Relatórios'] },
  { title: 'Canais', links: ['Airbnb', 'Booking.com', 'Vrbo', 'Trivago', 'Decolar', 'Expedia'] },
  { title: 'Para você', links: ['Anfitriões', 'Administradoras', 'Equipes de limpeza', 'App Morada'] },
  { title: 'Ajuda', links: ['Central de ajuda', 'Status dos canais', 'Fale conosco', 'Comunidade'] },
  { title: 'Morada', links: ['Sobre', 'Carreiras', 'Imprensa', 'Segurança'] },
];

const LEGAL = ['Privacidade', 'Termos de uso', 'Cookies', 'Mapa do site'];

function LinkList({ links, className }: { links: string[]; className?: string }) {
  return (
    <ul className={className}>
      {links.map((label) => (
        <li key={label}>
          <a href="#" className="inline-flex min-h-11 items-center hover:underline sm:min-h-0">
            {label}
          </a>
        </li>
      ))}
    </ul>
  );
}

export function Footer() {
  return (
    <footer className="t-caption bg-bg-alt px-4 pt-8 pb-12 text-ink-2">
      <div className="mx-auto max-w-[980px]">
        <p className="border-b border-line pb-4">
          Preços e taxas mostrados são exemplos. Morada é independente e não tem vínculo com Airbnb, Booking.com, Vrbo,
          Trivago, Decolar ou Expedia.
        </p>

        <nav aria-label="Rodapé">
          {/* desktop / tablet: grade de colunas */}
          <div className="hidden grid-cols-[repeat(auto-fit,minmax(150px,1fr))] gap-6 py-6 sm:grid">
            {COLUMNS.map((col) => (
              <div key={col.title}>
                <h3 className="mb-2 font-semibold text-ink">{col.title}</h3>
                <LinkList links={col.links} className="flex flex-col gap-2" />
              </div>
            ))}
          </div>

          {/* mobile: acordeões fechados */}
          <Accordion type="multiple" className="py-2 sm:hidden">
            {COLUMNS.map((col) => (
              <AccordionItem key={col.title} value={col.title} className="border-line">
                <AccordionTrigger className="min-h-11 items-center rounded-none py-3 text-[12px] font-semibold text-ink hover:no-underline">
                  {col.title}
                </AccordionTrigger>
                <AccordionContent className="pb-3 [&_a]:no-underline">
                  <LinkList links={col.links} className="flex flex-col pl-3" />
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </nav>

        <div className="flex flex-col gap-3 border-t border-line pt-4 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
          <p>Copyright 2026 Morada. Todos os direitos reservados.</p>
          <ul className="flex flex-wrap gap-x-4 gap-y-1">
            {LEGAL.map((label) => (
              <li key={label}>
                <a href="#" className="inline-flex min-h-11 items-center hover:underline sm:min-h-0">
                  {label}
                </a>
              </li>
            ))}
          </ul>
          <p>Brasil</p>
        </div>
      </div>
    </footer>
  );
}
