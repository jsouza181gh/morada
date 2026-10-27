export type ChannelId = 'airbnb' | 'booking' | 'vrbo' | 'trivago' | 'decolar' | 'expedia';
export const CHANNEL_IDS: ChannelId[] = ['airbnb', 'booking', 'vrbo', 'trivago', 'decolar', 'expedia'];
export const CHANNEL_NAMES: Record<ChannelId, string> = {
  airbnb: 'Airbnb',
  booking: 'Booking.com',
  vrbo: 'Vrbo',
  trivago: 'Trivago',
  decolar: 'Decolar',
  expedia: 'Expedia',
};

export type ListingStatus = 'published' | 'pending' | 'error' | 'off';
export type SyncHealth = 'ok' | 'warning' | 'error';

export interface Channel {
  id: ChannelId;
  name: string;
  feePct: number; // 0.03 = 3%
  feeLabel: string; // "3% do anfitrião", "15% de comissão", "Sem taxa própria"
  titleMaxLength: number | null;
  connected: boolean;
  accountLabel?: string;
  lastSyncAt: string; // ISO
  health: SyncHealth;
  healthNote?: string;
  blurb: string; // texto curto usado no explorador da landing
}

export interface ChannelListing {
  status: ListingStatus;
  price: number /* diária no canal, BRL */;
  title: string;
  issue?: string;
}

export interface Property {
  id: string;
  name: string;
  type: 'casa' | 'apartamento' | 'loft' | 'chale' | 'studio';
  city: string;
  state: string;
  neighborhood: string;
  guests: number;
  bedrooms: number;
  bathrooms: number;
  amenities: string[];
  photos: string[];
  coverIndex: number;
  description: string;
  nightlyNet: number; // quanto o anfitrião quer receber por noite
  cleaningFee: number;
  minNights: number;
  checkIn: string /* "15:00" */;
  checkOut: string /* "11:00" */;
  rating: number;
  reviewsCount: number;
  channels: Record<ChannelId, ChannelListing>;
  createdAt: string;
}

export type ReservationStatus = 'confirmed' | 'pending_payment' | 'cancelled' | 'blocked';
export interface Reservation {
  id: string;
  propertyId: string;
  channelId: ChannelId | null; // null = bloqueio manual
  guestName: string;
  guests: number;
  checkIn: string;
  checkOut: string; // 'YYYY-MM-DD'
  total: number;
  status: ReservationStatus;
  createdAt: string;
  note?: string;
}

export interface Message {
  id: string;
  from: 'guest' | 'host';
  text: string;
  sentAt: string;
}
export interface Conversation {
  id: string;
  propertyId: string;
  channelId: ChannelId;
  guestName: string;
  reservationId?: string;
  unread: number;
  messages: Message[];
}

export interface MonthlyMetric {
  month: string /* 'YYYY-MM' */;
  revenueByChannel: Record<ChannelId, number>;
  occupancy: number /* 0–1 */;
  adr: number;
}
export interface DashboardSummary {
  revenueMonth: number;
  revenueDeltaPct: number;
  occupancy: number;
  occupancyDeltaPp: number;
  adr: number;
  adrDeltaPct: number;
  rating: number;
  ratingDelta: number;
}
export interface Plan {
  id: 'essencial' | 'pro' | 'anfitriao';
  name: string;
  description: string;
  monthly: number | null;
  yearly: number | null;
  featured: boolean;
  cta: string;
  features: string[];
}
export interface FaqItem {
  q: string;
  a: string;
}
export interface TeamMember {
  id: string;
  name: string;
  role: 'proprietario' | 'limpeza' | 'checkin' | 'financeiro';
}
