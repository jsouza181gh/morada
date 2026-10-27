import { addDays, diffDays, TODAY } from '@/lib/date';
import { properties } from './properties';
import type { ChannelId, Property, Reservation, ReservationStatus } from './types';

/** PRNG determinístico (mesma saída a cada execução). */
function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Seed fixa escolhida para outubro/2026 fechar perto de 87% de ocupação. */
export const RESERVATION_SEED = 35;

let rand = mulberry32(RESERVATION_SEED);
const randInt = (min: number, max: number) => min + Math.floor(rand() * (max - min + 1));
function pick<T>(list: readonly T[]): T {
  return list[Math.floor(rand() * list.length)] as T;
}

const START = '2025-11-01';
/** Último dia com hóspede; a saída mais tardia é 2026-12-31. */
const END = '2026-12-31';

const CHANNEL_WEIGHTS: [ChannelId, number][] = [
  ['airbnb', 0.41],
  ['booking', 0.29],
  ['vrbo', 0.13],
  ['decolar', 0.09],
  ['expedia', 0.06],
  ['trivago', 0.02],
];

/** Ocupação-alvo por mês: alta temporada (dez–fev, jul) e o resto. */
const OCCUPANCY_TARGET: Record<string, number> = {
  '01': 0.84,
  '02': 0.8,
  '03': 0.64,
  '04': 0.62,
  '05': 0.6,
  '06': 0.66,
  '07': 0.82,
  '08': 0.68,
  '09': 0.76,
  '10': 0.95,
  '11': 0.72,
  '12': 0.84,
};

const GUEST_NAMES = [
  'Beatriz Nogueira', 'Gustavo Pereira', 'Larissa Fonseca', 'Rodrigo Mattos', 'Fernanda Oliveira',
  'Mateus Carvalho', 'Isabela Duarte', 'Felipe Bastos', 'Carolina Pires', 'André Monteiro',
  'Letícia Barros', 'Thiago Rocha', 'Patrícia Lopes', 'Daniel Vieira', 'Aline Cardoso',
  'Vinícius Teixeira', 'Renata Moura', 'Eduardo Farias', 'Gabriela Antunes', 'Henrique Prado',
  'Mariana Siqueira', 'Leonardo Freitas', 'Sofia Martins', 'Caio Ribeiro', 'Natália Campos',
  'Diego Almeida', 'Priscila Gomes', 'Otávio Mendes', 'Tatiane Rezende', 'João Victor Santos',
  'Luana Batista', 'Ricardo Peixoto', 'Bianca Queiroz', 'Marcelo Azevedo', 'Helena Castro',
  'Thomas Weber', 'Emma Johnson', 'Lucía Fernández', 'Martín González', 'Sophie Laurent',
];

type Fixed = Omit<Reservation, 'createdAt' | 'total' | 'guests'> & { guests?: number };

/** Reservas obrigatórias (usadas nos mockups). */
const FIXED: Fixed[] = [
  { id: 'r-lagoa-marina', propertyId: 'lagoa', channelId: 'airbnb', guestName: 'Marina Costa', guests: 2, checkIn: '2026-10-25', checkOut: '2026-10-28', status: 'confirmed' },
  { id: 'r-lagoa-pedro', propertyId: 'lagoa', channelId: 'airbnb', guestName: 'Pedro Lima', guests: 2, checkIn: '2026-11-02', checkOut: '2026-11-04', status: 'confirmed' },
  { id: 'r-lagoa-anapaula', propertyId: 'lagoa', channelId: 'booking', guestName: 'Ana Paula Ramos', guests: 3, checkIn: '2026-11-04', checkOut: '2026-11-07', status: 'pending_payment' },
  { id: 'r-pinheiros-thomas', propertyId: 'pinheiros', channelId: 'booking', guestName: 'Thomas Weber', guests: 1, checkIn: '2026-10-26', checkOut: '2026-10-30', status: 'confirmed' },
  { id: 'r-pinheiros-camila', propertyId: 'pinheiros', channelId: 'expedia', guestName: 'Camila Torres', guests: 2, checkIn: '2026-11-01', checkOut: '2026-11-05', status: 'confirmed' },
  { id: 'r-gramado-bloqueio', propertyId: 'gramado', channelId: null, guestName: 'Fechado', guests: 0, checkIn: '2026-10-24', checkOut: '2026-10-26', status: 'blocked', note: 'Manutenção' },
  { id: 'r-gramado-lucas', propertyId: 'gramado', channelId: 'vrbo', guestName: 'Lucas Andrade', guests: 3, checkIn: '2026-10-31', checkOut: '2026-11-03', status: 'confirmed' },
  { id: 'r-leblon-rafael', propertyId: 'leblon', channelId: 'airbnb', guestName: 'Rafael Dias', guests: 4, checkIn: '2026-10-27', checkOut: '2026-10-29', status: 'pending_payment' },
  { id: 'r-leblon-juliana', propertyId: 'leblon', channelId: 'decolar', guestName: 'Juliana Reis', guests: 2, checkIn: '2026-11-01', checkOut: '2026-11-06', status: 'confirmed' },
  { id: 'r-trancoso-moreira', propertyId: 'trancoso', channelId: 'airbnb', guestName: 'Família Moreira', guests: 6, checkIn: '2026-10-24', checkOut: '2026-10-31', status: 'confirmed' },
  { id: 'r-trancoso-bloqueio', propertyId: 'trancoso', channelId: null, guestName: 'Fechado', guests: 0, checkIn: '2026-11-03', checkOut: '2026-11-07', status: 'blocked', note: 'Uso próprio' },
  { id: 'r-savassi-bruno', propertyId: 'savassi', channelId: 'booking', guestName: 'Bruno Alves', guests: 1, checkIn: '2026-10-29', checkOut: '2026-10-31', status: 'confirmed' },
];

export const FIXED_RESERVATION_IDS = FIXED.map((f) => f.id);

function totalFor(p: Property, channelId: ChannelId | null, nights: number): number {
  return channelId ? nights * p.channels[channelId].price : 0;
}

function createdAtFor(checkIn: string): string {
  let day = addDays(checkIn, -randInt(4, 60));
  if (day >= TODAY) day = addDays(TODAY, -randInt(1, 20));
  const hh = String(randInt(12, 23)).padStart(2, '0');
  const mm = String(randInt(0, 59)).padStart(2, '0');
  return `${day}T${hh}:${mm}:00.000Z`;
}

function pickChannel(p: Property): ChannelId {
  const allowed = CHANNEL_WEIGHTS.filter(([id]) => p.channels[id].status !== 'off');
  const sum = allowed.reduce((s, [, w]) => s + w, 0);
  let r = rand() * sum;
  for (const [id, w] of allowed) {
    r -= w;
    if (r < 0) return id;
  }
  return allowed[0]![0];
}

function fromFixed(p: Property, f: Fixed): Reservation {
  return {
    ...f,
    guests: f.guests ?? 2,
    total: totalFor(p, f.channelId, diffDays(f.checkIn, f.checkOut)),
    createdAt: createdAtFor(f.checkIn),
  };
}

function generateFor(p: Property): Reservation[] {
  const fixed = FIXED.filter((f) => f.propertyId === p.id).sort((a, b) => a.checkIn.localeCompare(b.checkIn));
  const out: Reservation[] = [];
  const maxNights = p.minNights + 5;
  const meanStay = (p.minNights + maxNights) / 2;
  let fi = 0;
  let cursor = addDays(START, randInt(0, 2));
  let n = 0;

  while (cursor < END) {
    const next = fixed[fi];
    if (next && cursor >= next.checkIn) {
      out.push(fromFixed(p, next));
      cursor = next.checkOut > cursor ? next.checkOut : cursor;
      fi++;
      continue;
    }
    const target = OCCUPANCY_TARGET[cursor.slice(5, 7)] ?? 0.7;
    const meanGap = (meanStay * (1 - target)) / target;
    cursor = addDays(cursor, Math.round(rand() * 2 * meanGap));
    let nights = randInt(p.minNights, maxNights);
    const limit = next ? next.checkIn : addDays(END, 1);
    if (cursor >= limit) {
      cursor = next ? next.checkIn : limit;
      continue;
    }
    const room = diffDays(cursor, limit);
    if (room < p.minNights) {
      cursor = limit;
      continue;
    }
    nights = Math.min(nights, room);
    const checkOut = addDays(cursor, nights);
    const channelId = pickChannel(p);
    let status: ReservationStatus = 'confirmed';
    const r = rand();
    if (checkOut <= TODAY && r < 0.04) status = 'cancelled';
    else if (cursor > TODAY && r > 0.94) status = 'pending_payment';
    n++;
    out.push({
      id: `r-${p.id}-${String(n).padStart(3, '0')}`,
      propertyId: p.id,
      channelId,
      guestName: pick(GUEST_NAMES),
      guests: randInt(1, p.guests),
      checkIn: cursor,
      checkOut,
      total: totalFor(p, channelId, nights),
      status,
      createdAt: createdAtFor(cursor),
    });
    cursor = checkOut;
  }
  while (fi < fixed.length) out.push(fromFixed(p, fixed[fi++]!));
  return out;
}

/** Gera o conjunto completo de reservas a partir de uma seed (determinístico). */
export function generateReservations(seed: number = RESERVATION_SEED): Reservation[] {
  rand = mulberry32(seed);
  return properties
    .flatMap(generateFor)
    .sort((a, b) => a.checkIn.localeCompare(b.checkIn) || a.propertyId.localeCompare(b.propertyId));
}

export const reservations: Reservation[] = generateReservations();
