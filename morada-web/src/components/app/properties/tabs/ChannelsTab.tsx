import { toast } from 'sonner';
import { setListingStatus } from '@/mocks/api';
import { CHANNEL_NAMES, type Channel, type ChannelId, type Property } from '@/mocks/types';
import { ChannelStatusList } from '../ChannelStatusList';

export type ChannelsTabProps = {
  property: Property;
  channels: Channel[];
  /** Recebe o imóvel atualizado (otimista e, depois, o retorno da API). */
  onChange: (p: Property) => void;
};

export function ChannelsTab({ property, channels, onChange }: ChannelsTabProps) {
  function toggle(channelId: ChannelId, on: boolean) {
    const previous = property;
    const status = on ? 'published' : 'off';
    // A API limpa a `issue` quando o status deixa de ser 'error'; espelhamos isso no otimista.
    const { issue: _issue, ...rest } = property.channels[channelId];
    const optimistic: Property = {
      ...property,
      channels: { ...property.channels, [channelId]: { ...rest, status } },
    };
    onChange(optimistic);

    const name = CHANNEL_NAMES[channelId];
    setListingStatus(property.id, channelId, status)
      .then((updated) => {
        onChange(updated);
        toast(on ? `Publicado no ${name}.` : `Removido do ${name}.`);
      })
      .catch(() => {
        onChange(previous);
        toast.error(`Não foi possível atualizar o ${name}. Tente de novo.`);
      });
  }

  return (
    <ChannelStatusList
      variant="full"
      property={property}
      channels={channels}
      onToggle={toggle}
      onFix={() => toast('Edição chega na próxima versão.')}
    />
  );
}
