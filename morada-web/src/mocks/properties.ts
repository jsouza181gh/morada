import { channels } from './channels';
import { CHANNEL_IDS, type ChannelId, type ChannelListing, type ListingStatus, type Property } from './types';

/** Diária no canal para o anfitrião receber `nightlyNet` depois da taxa. */
export function channelPrice(nightlyNet: number, feePct: number): number {
  return Math.ceil(nightlyNet / (1 - feePct) / 5) * 5;
}

type Titles = { short: string; long: string; en: string };

/** Fotos por imóvel (seeds fixos do picsum). */
export const PHOTOS_PER_PROPERTY = 24;

function photos(id: string): string[] {
  return Array.from(
    { length: PHOTOS_PER_PROPERTY },
    (_, i) => `https://picsum.photos/seed/morada-${id}-${i + 1}/1200/800`,
  );
}

function buildListings(
  nightlyNet: number,
  titles: Titles,
  overrides: Partial<Record<ChannelId, { status: ListingStatus; issue?: string }>> = {},
): Record<ChannelId, ChannelListing> {
  const titleFor: Record<ChannelId, string> = {
    airbnb: titles.short,
    booking: titles.long,
    vrbo: titles.long,
    trivago: titles.long,
    decolar: titles.long,
    expedia: titles.en,
  };
  const out = {} as Record<ChannelId, ChannelListing>;
  for (const id of CHANNEL_IDS) {
    const ch = channels.find((c) => c.id === id);
    const feePct = ch ? ch.feePct : 0;
    const o = overrides[id];
    out[id] = {
      status: o?.status ?? 'published',
      price: channelPrice(nightlyNet, feePct),
      title: titleFor[id],
      ...(o?.issue ? { issue: o.issue } : {}),
    };
  }
  return out;
}

type Seed = Omit<Property, 'photos' | 'coverIndex' | 'checkIn' | 'checkOut' | 'channels'> & {
  titles: Titles;
  overrides?: Partial<Record<ChannelId, { status: ListingStatus; issue?: string }>>;
};

function build({ titles, overrides, ...p }: Seed): Property {
  return {
    ...p,
    photos: photos(p.id),
    coverIndex: 0,
    checkIn: '15:00',
    checkOut: '11:00',
    channels: buildListings(p.nightlyNet, titles, overrides),
  };
}

export const properties: Property[] = [
  build({
    id: 'lagoa',
    name: 'Casa da Lagoa',
    type: 'casa',
    city: 'Florianópolis',
    state: 'SC',
    neighborhood: 'Lagoa da Conceição',
    guests: 4,
    bedrooms: 2,
    bathrooms: 2,
    amenities: [
      'Wi-Fi',
      'Cozinha completa',
      'Estacionamento',
      'Deck',
      'Churrasqueira',
      'Máquina de lavar',
      'Espaço de trabalho',
    ],
    description:
      'Casa de madeira a duas quadras da Lagoa da Conceição, com deck coberto e rede. A cozinha é completa e a garagem cabe um carro. Dá para ir a pé às lojas de aluguel de prancha e aos restaurantes da Avenida das Rendeiras.',
    nightlyNet: 480,
    cleaningFee: 180,
    minNights: 2,
    rating: 4.92,
    reviewsCount: 128,
    createdAt: '2025-03-12T14:20:00.000Z',
    titles: {
      short: 'Casa com deck a 2 quadras da Lagoa',
      long: 'Casa da Lagoa · Deck coberto e garagem na Lagoa da Conceição',
      en: 'Lagoa House · Deck and parking near Lagoa da Conceição',
    },
    overrides: {
      vrbo: { status: 'pending' },
      expedia: { status: 'error', issue: 'Faltam 2 fotos em alta resolução' },
    },
  }),
  build({
    id: 'pinheiros',
    name: 'Loft Pinheiros',
    type: 'loft',
    city: 'São Paulo',
    state: 'SP',
    neighborhood: 'Pinheiros',
    guests: 2,
    bedrooms: 1,
    bathrooms: 1,
    amenities: [
      'Wi-Fi',
      'Ar-condicionado',
      'Cozinha completa',
      'Máquina de lavar',
      'Espaço de trabalho',
      'Aceita pets',
    ],
    description:
      'Loft com pé-direito duplo a cinco minutos do metrô Fradique Coutinho. Tem mesa de trabalho, internet rápida e ar-condicionado no mezanino.',
    nightlyNet: 520,
    cleaningFee: 150,
    minNights: 2,
    rating: 4.88,
    reviewsCount: 94,
    createdAt: '2025-05-03T13:00:00.000Z',
    titles: {
      short: 'Loft pé-direito duplo perto do metrô',
      long: 'Loft Pinheiros · Pé-direito duplo a 5 minutos do metrô Fradique Coutinho',
      en: 'Pinheiros Loft · Double-height ceiling near the subway',
    },
    overrides: { vrbo: { status: 'pending' } },
  }),
  build({
    id: 'gramado',
    name: 'Chalé Gramado',
    type: 'chale',
    city: 'Gramado',
    state: 'RS',
    neighborhood: 'Planalto',
    guests: 4,
    bedrooms: 2,
    bathrooms: 1,
    amenities: ['Wi-Fi', 'Lareira', 'Cozinha completa', 'Estacionamento', 'Deck', 'Aceita pets'],
    description:
      'Chalé de pedra e madeira no Planalto, com lareira na sala e deck de frente para o vale. Fica a dez minutos de carro da Rua Coberta.',
    nightlyNet: 640,
    cleaningFee: 220,
    minNights: 2,
    rating: 4.95,
    reviewsCount: 61,
    createdAt: '2025-06-18T16:45:00.000Z',
    titles: {
      short: 'Chalé com lareira e vista para o vale',
      long: 'Chalé Gramado · Lareira e deck com vista para o vale no Planalto',
      en: 'Gramado Chalet · Fireplace and valley-view deck',
    },
  }),
  build({
    id: 'leblon',
    name: 'Apto Leblon',
    type: 'apartamento',
    city: 'Rio de Janeiro',
    state: 'RJ',
    neighborhood: 'Leblon',
    guests: 5,
    bedrooms: 2,
    bathrooms: 2,
    amenities: [
      'Wi-Fi',
      'Ar-condicionado',
      'Cozinha completa',
      'Vista para o mar',
      'Máquina de lavar',
      'Espaço de trabalho',
      'Estacionamento',
    ],
    description:
      'Apartamento reformado a uma quadra da praia do Leblon, com varanda e vista lateral para o mar. Os dois quartos têm ar-condicionado e o prédio tem portaria 24 horas.',
    nightlyNet: 910,
    cleaningFee: 280,
    minNights: 3,
    rating: 4.81,
    reviewsCount: 143,
    createdAt: '2025-04-07T12:10:00.000Z',
    titles: {
      short: 'Apto com varanda a 1 quadra da praia',
      long: 'Apto Leblon · Varanda com vista para o mar a uma quadra da praia',
      en: 'Leblon Apartment · Ocean-view balcony one block from the beach',
    },
  }),
  build({
    id: 'trancoso',
    name: 'Casa Trancoso',
    type: 'casa',
    city: 'Porto Seguro',
    state: 'BA',
    neighborhood: 'Trancoso',
    guests: 8,
    bedrooms: 4,
    bathrooms: 3,
    amenities: [
      'Wi-Fi',
      'Piscina',
      'Ar-condicionado',
      'Cozinha completa',
      'Churrasqueira',
      'Deck',
      'Estacionamento',
      'Máquina de lavar',
    ],
    description:
      'Casa de quatro suítes em condomínio a 800 metros do Quadrado, com piscina e jardim de coqueiros. A praia dos Nativos fica a dez minutos de caminhada.',
    nightlyNet: 1450,
    cleaningFee: 350,
    minNights: 4,
    rating: 4.97,
    reviewsCount: 52,
    createdAt: '2025-09-22T15:30:00.000Z',
    titles: {
      short: 'Casa com piscina perto do Quadrado',
      long: 'Casa Trancoso · Quatro suítes e piscina a 800 m do Quadrado',
      en: 'Trancoso House · Four suites and pool near the Quadrado',
    },
  }),
  build({
    id: 'savassi',
    name: 'Studio Savassi',
    type: 'studio',
    city: 'Belo Horizonte',
    state: 'MG',
    neighborhood: 'Savassi',
    guests: 2,
    bedrooms: 1,
    bathrooms: 1,
    amenities: ['Wi-Fi', 'Ar-condicionado', 'Cozinha completa', 'Espaço de trabalho', 'Máquina de lavar'],
    description:
      'Studio compacto na Savassi, perto dos bares da Rua Pernambuco. Bom para quem vem a trabalho: mesa ampla, internet rápida e check-in sem chave.',
    nightlyNet: 260,
    cleaningFee: 120,
    minNights: 2,
    rating: 4.76,
    reviewsCount: 38,
    createdAt: '2025-08-14T11:00:00.000Z',
    titles: {
      short: 'Studio na Savassi com mesa de trabalho',
      long: 'Studio Savassi · Mesa de trabalho e check-in sem chave',
      en: 'Savassi Studio · Workspace and keyless check-in',
    },
    overrides: { decolar: { status: 'off' }, expedia: { status: 'off' } },
  }),
  build({
    id: 'paraty',
    name: 'Casa Paraty',
    type: 'casa',
    city: 'Paraty',
    state: 'RJ',
    neighborhood: 'Centro Histórico',
    guests: 6,
    bedrooms: 3,
    bathrooms: 2,
    amenities: ['Wi-Fi', 'Ar-condicionado', 'Cozinha completa', 'Máquina de lavar', 'Aceita pets'],
    description:
      'Casarão colonial restaurado no Centro Histórico, com pátio interno e três quartos. O cais dos passeios de barco fica a quatro quadras.',
    nightlyNet: 780,
    cleaningFee: 250,
    minNights: 2,
    rating: 4.9,
    reviewsCount: 77,
    createdAt: '2025-10-05T10:15:00.000Z',
    titles: {
      short: 'Casarão com pátio no Centro Histórico',
      long: 'Casa Paraty · Casarão colonial com pátio no Centro Histórico',
      en: 'Paraty House · Colonial home with courtyard in the Historic Center',
    },
    overrides: { trivago: { status: 'off' } },
  }),
];
