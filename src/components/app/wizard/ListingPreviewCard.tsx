import { AnimatePresence, motion } from 'motion/react';
import { Star } from 'lucide-react';
import { easeApple, useReducedMotion } from '@/components/motion';
import { formatBRL } from '@/lib/format';
import { channelPrice } from '@/mocks/properties';
import type { Channel } from '@/mocks/types';
import { TYPE_LABEL, titleForChannel, type WizardDraft } from './useWizardDraft';

type ListingPreviewCardProps = { channel: Channel; draft: WizardDraft };

/** Prévia de como o anúncio aparece num canal. */
export function ListingPreviewCard({ channel, draft }: ListingPreviewCardProps) {
  const reduced = useReducedMotion();
  const cover = draft.photos[0];
  const title = titleForChannel(draft.name, channel.titleMaxLength) || 'Seu anúncio';
  const place = [draft.neighborhood, draft.city].filter(Boolean).join(', ');
  const subtitle = [TYPE_LABEL[draft.type], place, `${draft.guests} ${draft.guests === 1 ? 'hóspede' : 'hóspedes'}`]
    .filter(Boolean)
    .join(' · ');
  const price = draft.nightlyNet > 0 ? channelPrice(draft.nightlyNet, channel.feePct) : 0;

  return (
    <section aria-labelledby="listing-preview-title" className="flex flex-col gap-4">
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={channel.id}
          initial={reduced ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={reduced ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: reduced ? 0 : 0.25, ease: easeApple }}
          className="flex flex-col gap-4"
        >
          <div className="overflow-hidden rounded-lg bg-surface">
            <div className="relative aspect-[4/3] bg-verde-soft">
              {cover ? (
                <img
                  width={1200}
                  height={800}
                  src={cover}
                  alt="Foto de capa do imóvel"
                  loading="lazy"
                  className="size-full object-cover"
                />
              ) : (
                <div className="t-body-sm flex size-full items-center justify-center text-ink-2">Sem foto de capa</div>
              )}
            </div>
            <div className="flex flex-col gap-1 p-5">
              <p className="t-caption text-ink-2">Prévia no {channel.name}</p>
              <h3 id="listing-preview-title" className="t-headline font-medium break-words text-ink">
                {title}
              </h3>
              <p className="t-body-sm text-ink-2">{subtitle}</p>
              <div className="mt-2 flex items-center justify-between gap-3">
                <p className="t-body text-ink">
                  {price > 0 ? (
                    <>
                      <span className="font-medium">{formatBRL(price)}</span>{' '}
                      <span className="text-ink-2">/ noite</span>
                    </>
                  ) : (
                    <span className="text-ink-2">Preço a definir</span>
                  )}
                </p>
                <span className="t-caption inline-flex items-center gap-1 text-ink-2">
                  <Star size={14} strokeWidth={1.5} aria-hidden="true" className="fill-ouro text-ouro" />
                  Novo
                </span>
              </div>
            </div>
          </div>

          <div className="rounded-lg bg-surface p-5">
            <p className="t-caption text-ink-2">Taxa do canal</p>
            <p className="t-body mt-1 font-medium text-ink">{channel.feeLabel}</p>
            <p className="t-body-sm mt-1 text-ink-2">
              {draft.nightlyNet > 0
                ? `Você recebe ${formatBRL(draft.nightlyNet)} por noite. O hóspede vê ${formatBRL(price)}.`
                : 'Defina o valor por noite para ver o preço no canal.'}
            </p>
          </div>
        </motion.div>
      </AnimatePresence>
    </section>
  );
}
