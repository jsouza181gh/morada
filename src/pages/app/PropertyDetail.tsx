import { useState } from 'react';
import { useParams, useSearchParams } from 'react-router';
import { toast } from 'sonner';
import { PageHeader } from '@/components/app/shell';
import { PhotoGallery } from '@/components/app/properties/PhotoGallery';
import { PriceByChannel } from '@/components/app/properties/PriceByChannel';
import { MiniCalendar } from '@/components/app/properties/MiniCalendar';
import { OverviewTab } from '@/components/app/properties/tabs/OverviewTab';
import { ChannelsTab } from '@/components/app/properties/tabs/ChannelsTab';
import { PhotosTab } from '@/components/app/properties/tabs/PhotosTab';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button, EmptyState, Skeleton } from '@/components/ui';
import { useMock } from '@/hooks/useMock';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { getChannels, getProperty, getReservations } from '@/mocks/api';
import type { Property } from '@/mocks/types';

const TABS = [
  { value: 'visao-geral', label: 'Visão geral' },
  { value: 'canais', label: 'Canais' },
  { value: 'precos', label: 'Preços' },
  { value: 'calendario', label: 'Calendário' },
  { value: 'fotos', label: 'Fotos' },
] as const;
type TabValue = (typeof TABS)[number]['value'];
const DEFAULT_TAB: TabValue = 'visao-geral';

function readTab(v: string | null): TabValue {
  return TABS.some((t) => t.value === v) ? (v as TabValue) : DEFAULT_TAB;
}

export default function PropertyDetail() {
  const { id = '' } = useParams();
  const [params, setParams] = useSearchParams();
  const tab = readTab(params.get('aba'));

  const { data, loading } = useMock(() => getProperty(id), [id]);
  const { data: channels } = useMock(getChannels);
  const { data: reservations } = useMock(() => getReservations({ propertyId: id }), [id]);

  // Atualizações locais (switches de canal) e capa escolhida, válidas só para este imóvel.
  const [patched, setPatched] = useState<Property>();
  const [cover, setCover] = useState<{ id: string; index: number }>();

  const property = patched?.id === id ? patched : data?.id === id ? data : undefined;
  useDocumentTitle(property?.name ?? 'Imóvel');

  function setTab(value: string) {
    setParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        if (value === DEFAULT_TAB) next.delete('aba');
        else next.set('aba', value);
        return next;
      },
      { replace: true },
    );
  }

  if (!property) {
    if (loading) {
      return (
        <div aria-busy="true" className="flex flex-col gap-6">
          <Skeleton className="h-4 w-24 bg-surface" />
          <Skeleton className="h-10 w-72 bg-surface" />
          <Skeleton className="h-[260px] w-full rounded-card bg-surface sm:h-[440px]" />
        </div>
      );
    }
    return (
      <div className="rounded-lg bg-surface">
        <h1 className="sr-only">Imóvel não encontrado</h1>
        <EmptyState
          title="Imóvel não encontrado."
          description="Ele pode ter sido removido ou o endereço está incorreto."
          action={
            <Button variant="secondary" href="/app/imoveis">
              Ver todos os imóveis
            </Button>
          }
        />
      </div>
    );
  }

  const coverIndex = cover?.id === property.id ? cover.index : property.coverIndex;

  return (
    <>
      <PageHeader
        breadcrumb={{ label: 'Imóveis', href: '/app/imoveis' }}
        title={property.name}
        subtitle={`${property.neighborhood}, ${property.city}/${property.state}`}
        actions={
          <>
            <Button variant="secondary" href={`/app/calendario?imovel=${property.id}`}>
              Ver no calendário
            </Button>
            <Button onClick={() => toast('Edição chega na próxima versão.')}>Editar anúncio</Button>
          </>
        }
      />

      <PhotoGallery name={property.name} photos={property.photos} coverIndex={coverIndex} />

      <Tabs value={tab} onValueChange={setTab} className="gap-6">
        <div className="-mx-4 overflow-x-auto px-4 sm:mx-0 sm:px-0">
          <TabsList
            aria-label="Seções do imóvel"
            className="h-auto rounded-pill bg-line/60 p-1 group-data-horizontal/tabs:h-auto"
          >
            {TABS.map((t) => (
              <TabsTrigger
                key={t.value}
                value={t.value}
                className="t-body-sm h-10 flex-none rounded-pill border-0 px-5 text-ink-2 hover:text-ink data-active:bg-surface data-active:font-medium data-active:text-ink data-active:shadow-[0_1px_4px_rgba(0,0,0,0.12)] dark:data-active:border-transparent dark:data-active:bg-surface dark:data-active:text-ink dark:text-ink-2 focus-visible:ring-0"
              >
                {t.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>

        <TabsContent value="visao-geral">
          <OverviewTab property={property} />
        </TabsContent>
        <TabsContent value="canais">
          <ChannelsTab property={property} channels={channels ?? []} onChange={setPatched} />
        </TabsContent>
        <TabsContent value="precos">
          <PriceByChannel nightlyNet={property.nightlyNet} channels={channels ?? []} />
        </TabsContent>
        <TabsContent value="calendario">
          <MiniCalendar propertyId={property.id} reservations={reservations ?? []} />
        </TabsContent>
        <TabsContent value="fotos">
          <PhotosTab
            name={property.name}
            photos={property.photos}
            coverIndex={coverIndex}
            onCoverChange={(index) => setCover({ id: property.id, index })}
          />
        </TabsContent>
      </Tabs>
    </>
  );
}
