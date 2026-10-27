import { Button } from '@/components/ui';
import { cn } from '@/lib/cn';

/**
 * Pílula de preço do hero. Em telas grandes fica `sticky bottom-6` dentro do hero e some
 * (opacity + visibility, sai do Tab) quando o palco deixa a viewport.
 */
export function PriceBar({ visible = true }: { visible?: boolean }) {
  return (
    <div
      className={cn(
        't-body-sm z-30 mt-6 flex max-w-full flex-wrap items-center justify-center gap-x-7 gap-y-2 rounded-[28px] bg-bg-alt/85 py-2.5 pr-2.5 pl-7 text-ink-2 backdrop-blur',
        'max-sm:px-5 max-sm:py-4 sm:flex-nowrap sm:rounded-pill',
        'md:sticky md:bottom-6 md:transition-[opacity,visibility] md:duration-300',
        !visible && 'md:invisible md:opacity-0',
      )}
    >
      <p>
        A partir de <strong className="font-semibold text-ink">R$ 49 por mês</strong> ou R$ 490 por ano. 14 dias
        grátis.
      </p>
      <Button size="sm" href="/cadastro" className="shrink-0 max-sm:min-h-11">
        Começar
      </Button>
    </div>
  );
}
