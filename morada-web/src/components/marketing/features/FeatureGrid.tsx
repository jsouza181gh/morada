import { AlignLeft, BellRing, ClipboardCheck, MessageSquareText, Sparkles, Wallet, type LucideIcon } from 'lucide-react';
import { Section } from '@/components/ui';
import { RevealGroup, RevealItem } from '@/components/motion';

const FEATURES: { icon: LucideIcon; title: string; text: string }[] = [
  {
    icon: AlignLeft,
    title: 'Descrição adaptada',
    text: 'Uma descrição vira várias, no tamanho e no idioma de cada canal.',
  },
  {
    icon: ClipboardCheck,
    title: 'Regras da casa',
    text: 'Horários, pets e festas configurados uma vez e aplicados em todos.',
  },
  {
    icon: Sparkles,
    title: 'Limpeza agendada',
    text: 'A equipe recebe o aviso assim que a saída do hóspede é confirmada.',
  },
  {
    icon: Wallet,
    title: 'Repasses em um lugar',
    text: 'Veja o que cada canal já pagou e o que ainda vai cair na conta.',
  },
  {
    icon: MessageSquareText,
    title: 'Respostas prontas',
    text: 'Modelos para check-in, Wi-Fi e regras, enviados no canal certo.',
  },
  {
    icon: BellRing,
    title: 'Alertas que importam',
    text: 'Só avisamos o que precisa de você: foto recusada, preço fora do mercado, reserva nova.',
  },
];

export function FeatureGrid() {
  return (
    <Section tone="white" aria-labelledby="features-title">
      <h2 id="features-title" className="t-section">
        Os detalhes que dão trabalho.
        <br />
        <span className="text-ink-2">Resolvidos.</span>
      </h2>
      <RevealGroup
        as="ul"
        className="mt-16 grid grid-cols-[repeat(auto-fit,minmax(260px,1fr))] gap-x-10 gap-y-14"
      >
        {FEATURES.map(({ icon: Icon, title, text }) => (
          <RevealItem as="li" key={title} className="flex flex-col gap-3 border-t border-line pt-6">
            <Icon size={32} strokeWidth={1.5} className="text-verde" aria-hidden="true" />
            <h3 className="text-[19px] leading-[25px] font-semibold tracking-[-0.01em]">{title}</h3>
            <p className="max-w-[60ch] text-[15px] leading-[22px] text-ink-2">{text}</p>
          </RevealItem>
        ))}
      </RevealGroup>
    </Section>
  );
}
