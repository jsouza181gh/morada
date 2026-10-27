import { NOW_ISO } from '@/lib/date';
import { channels } from './channels';
import { faq } from './faq';
import { conversations } from './messages';
import { dashboardSummary, metrics } from './metrics';
import { plans } from './plans';
import { properties } from './properties';
import { reservations } from './reservations';
import { team } from './team';
import type {
  Channel,
  ChannelId,
  Conversation,
  DashboardSummary,
  FaqItem,
  ListingStatus,
  Message,
  MonthlyMetric,
  Plan,
  Property,
  Reservation,
  ReservationStatus,
  TeamMember,
} from './types';

// Estado mutável do módulo (perde ao recarregar a página).
const state = {
  properties: structuredClone(properties),
  reservations: structuredClone(reservations),
  conversations: structuredClone(conversations),
};

let counter = 0;
const nextId = (prefix: string) => `${prefix}-new-${++counter}`;

/** Resolve com uma cópia do valor depois de 300–600ms (0ms em teste). */
function delay<T>(value: T): Promise<T> {
  const ms = import.meta.env.MODE === 'test' ? 0 : 300 + Math.random() * 300;
  const copy = structuredClone(value);
  return new Promise((resolve) => setTimeout(() => resolve(copy), ms));
}

function fail(message: string): Promise<never> {
  const ms = import.meta.env.MODE === 'test' ? 0 : 300 + Math.random() * 300;
  return new Promise((_, reject) => setTimeout(() => reject(new Error(message)), ms));
}

function overlaps(aIn: string, aOut: string, bIn: string, bOut: string): boolean {
  return aIn < bOut && bIn < aOut;
}

function slugify(name: string): string {
  return (
    name
      .normalize('NFD')
      .replace(/[̀-ͯ]/g, '')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '') || 'imovel'
  );
}

export function getChannels(): Promise<Channel[]> {
  return delay(channels);
}

export function getProperties(): Promise<Property[]> {
  return delay(state.properties);
}

export function getProperty(id: string): Promise<Property | undefined> {
  return delay(state.properties.find((p) => p.id === id));
}

/** Filtra por interseção com o período [from, to] (datas 'YYYY-MM-DD', inclusivas). */
export function getReservations(f?: {
  from?: string;
  to?: string;
  propertyId?: string;
  channelId?: ChannelId;
  status?: ReservationStatus;
}): Promise<Reservation[]> {
  const list = state.reservations.filter((r) => {
    if (f?.from && r.checkOut <= f.from) return false;
    if (f?.to && r.checkIn > f.to) return false;
    if (f?.propertyId && r.propertyId !== f.propertyId) return false;
    if (f?.channelId && r.channelId !== f.channelId) return false;
    if (f?.status && r.status !== f.status) return false;
    return true;
  });
  return delay(list);
}

export function getConversations(): Promise<Conversation[]> {
  return delay(state.conversations);
}

export function getConversation(id: string): Promise<Conversation | undefined> {
  return delay(state.conversations.find((c) => c.id === id));
}

/** Últimos 12 meses até 2026-10. */
export function getMetrics(): Promise<MonthlyMetric[]> {
  return delay(metrics);
}

export function getDashboardSummary(): Promise<DashboardSummary> {
  return delay(dashboardSummary);
}

export function getPlans(): Promise<Plan[]> {
  return delay(plans);
}

export function getFaq(): Promise<FaqItem[]> {
  return delay(faq);
}

export function getTeam(): Promise<TeamMember[]> {
  return delay(team);
}

// Mutações em memória

export function setListingStatus(propertyId: string, channelId: ChannelId, status: ListingStatus): Promise<Property> {
  const property = state.properties.find((p) => p.id === propertyId);
  if (!property) return fail('Imóvel não encontrado.');
  property.channels[channelId].status = status;
  if (status !== 'error') delete property.channels[channelId].issue;
  return delay(property);
}

/** Evento global disparado quando a contagem de não lidas muda (o AppLayout escuta). */
export const UNREAD_EVENT = 'morada:unread';

function notifyUnread() {
  if (typeof window !== 'undefined') window.dispatchEvent(new Event(UNREAD_EVENT));
}

export function sendMessage(conversationId: string, text: string): Promise<Message> {
  const conversation = state.conversations.find((c) => c.id === conversationId);
  if (!conversation) return fail('Conversa não encontrada.');
  const message: Message = { id: nextId('m'), from: 'host', text, sentAt: NOW_ISO };
  conversation.messages.push(message);
  const hadUnread = conversation.unread > 0;
  conversation.unread = 0;
  if (hadUnread) notifyUnread();
  return delay(message);
}

/** Zera as não lidas da conversa (mutação síncrona; a Promise só segue o padrão da API). */
export function markConversationRead(conversationId: string): Promise<void> {
  const conversation = state.conversations.find((c) => c.id === conversationId);
  if (!conversation) return fail('Conversa não encontrada.');
  if (conversation.unread > 0) {
    conversation.unread = 0;
    notifyUnread();
  }
  return delay(undefined);
}

/** Marca a conversa como não lida (pelo menos 1). */
export function markConversationUnread(conversationId: string): Promise<void> {
  const conversation = state.conversations.find((c) => c.id === conversationId);
  if (!conversation) return fail('Conversa não encontrada.');
  conversation.unread = Math.max(1, conversation.unread);
  notifyUnread();
  return delay(undefined);
}

export function createProperty(
  draft: Omit<Property, 'id' | 'createdAt' | 'rating' | 'reviewsCount'>,
): Promise<Property> {
  const base = slugify(draft.name);
  let id = base;
  for (let i = 2; state.properties.some((p) => p.id === id); i++) id = `${base}-${i}`;
  const property: Property = { ...structuredClone(draft), id, createdAt: NOW_ISO, rating: 0, reviewsCount: 0 };
  state.properties.push(property);
  return delay(property);
}

export function blockDates(propertyId: string, checkIn: string, checkOut: string, note?: string): Promise<Reservation> {
  if (!state.properties.some((p) => p.id === propertyId)) return fail('Imóvel não encontrado.');
  if (checkOut <= checkIn) return fail('A saída precisa ser depois da entrada.');
  const conflict = state.reservations.some(
    (r) =>
      r.propertyId === propertyId && r.status !== 'cancelled' && overlaps(checkIn, checkOut, r.checkIn, r.checkOut),
  );
  if (conflict) return fail('Essas datas já têm reserva.');
  const reservation: Reservation = {
    id: nextId('r'),
    propertyId,
    channelId: null,
    guestName: 'Fechado',
    guests: 0,
    checkIn,
    checkOut,
    total: 0,
    status: 'blocked',
    createdAt: NOW_ISO,
    ...(note ? { note } : {}),
  };
  state.reservations.push(reservation);
  state.reservations.sort((a, b) => a.checkIn.localeCompare(b.checkIn) || a.propertyId.localeCompare(b.propertyId));
  return delay(reservation);
}
