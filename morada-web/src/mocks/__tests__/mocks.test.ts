import {
  blockDates,
  getConversation,
  getConversations,
  getReservations,
  markConversationRead,
  markConversationUnread,
  sendMessage,
  UNREAD_EVENT,
} from '../api';
import { channels } from '../channels';
import { conversations } from '../messages';
import { dashboardSummary, metrics, monthRevenue } from '../metrics';
import { PHOTOS_PER_PROPERTY, properties } from '../properties';
import { generateReservations, reservations } from '../reservations';
import { CHANNEL_IDS } from '../types';

describe('reservas', () => {
  it('não se sobrepõem por imóvel (exceto canceladas)', () => {
    for (const p of properties) {
      const list = reservations
        .filter((r) => r.propertyId === p.id && r.status !== 'cancelled')
        .sort((a, b) => a.checkIn.localeCompare(b.checkIn));
      for (let i = 1; i < list.length; i++) {
        expect(list[i]!.checkIn >= list[i - 1]!.checkOut, `${list[i - 1]!.id} x ${list[i]!.id}`).toBe(true);
      }
    }
  });

  it('são determinísticas', () => {
    expect(generateReservations()).toEqual(reservations);
  });

  it('têm total = noites × diária do canal e hóspedes dentro da capacidade', () => {
    for (const r of reservations) {
      const p = properties.find((x) => x.id === r.propertyId)!;
      expect(r.guests).toBeLessThanOrEqual(p.guests);
      expect(r.checkOut > r.checkIn).toBe(true);
      if (r.channelId) {
        const nights = (Date.parse(r.checkOut) - Date.parse(r.checkIn)) / 86_400_000;
        expect(r.total).toBe(nights * p.channels[r.channelId].price);
      }
    }
  });

  it('incluem as 12 reservas obrigatórias com as datas exatas', () => {
    const expected = [
      ['lagoa', 'Marina Costa', 'airbnb', '2026-10-25', '2026-10-28', 'confirmed'],
      ['lagoa', 'Pedro Lima', 'airbnb', '2026-11-02', '2026-11-04', 'confirmed'],
      ['lagoa', 'Ana Paula Ramos', 'booking', '2026-11-04', '2026-11-07', 'pending_payment'],
      ['pinheiros', 'Thomas Weber', 'booking', '2026-10-26', '2026-10-30', 'confirmed'],
      ['pinheiros', 'Camila Torres', 'expedia', '2026-11-01', '2026-11-05', 'confirmed'],
      ['gramado', 'Fechado', null, '2026-10-24', '2026-10-26', 'blocked'],
      ['gramado', 'Lucas Andrade', 'vrbo', '2026-10-31', '2026-11-03', 'confirmed'],
      ['leblon', 'Rafael Dias', 'airbnb', '2026-10-27', '2026-10-29', 'pending_payment'],
      ['leblon', 'Juliana Reis', 'decolar', '2026-11-01', '2026-11-06', 'confirmed'],
      ['trancoso', 'Família Moreira', 'airbnb', '2026-10-24', '2026-10-31', 'confirmed'],
      ['trancoso', 'Fechado', null, '2026-11-03', '2026-11-07', 'blocked'],
      ['savassi', 'Bruno Alves', 'booking', '2026-10-29', '2026-10-31', 'confirmed'],
    ] as const;
    for (const [propertyId, guestName, channelId, checkIn, checkOut, status] of expected) {
      const found = reservations.find(
        (r) =>
          r.propertyId === propertyId && r.guestName === guestName && r.checkIn === checkIn && r.checkOut === checkOut,
      );
      expect(found, `${propertyId} ${guestName} ${checkIn}`).toBeDefined();
      expect(found!.channelId).toBe(channelId);
      expect(found!.status).toBe(status);
    }
  });

  it('não usam canais desligados no imóvel', () => {
    for (const r of reservations) {
      if (!r.channelId) continue;
      const p = properties.find((x) => x.id === r.propertyId)!;
      expect(p.channels[r.channelId].status).not.toBe('off');
    }
  });
});

describe('imóveis e canais', () => {
  it('preço por canal segue a fórmula da taxa', () => {
    for (const p of properties) {
      for (const c of channels) {
        expect(p.channels[c.id].price).toBe(Math.ceil(p.nightlyNet / (1 - c.feePct) / 5) * 5);
        if (c.titleMaxLength) expect(p.channels[c.id].title.length).toBeLessThanOrEqual(c.titleMaxLength);
      }
    }
  });

  it(`cada imóvel tem ${PHOTOS_PER_PROPERTY} fotos com seed fixo`, () => {
    for (const p of properties) {
      expect(p.photos).toHaveLength(PHOTOS_PER_PROPERTY);
      expect(new Set(p.photos).size).toBe(PHOTOS_PER_PROPERTY);
    }
  });

  it('conversas apontam para reservas existentes', () => {
    expect(conversations).toHaveLength(10);
    for (const c of conversations) {
      if (c.reservationId) expect(reservations.some((r) => r.id === c.reservationId)).toBe(true);
    }
  });
});

describe('métricas', () => {
  it('2026-10 bate com a soma das reservas confirmadas com check-in no mês', () => {
    const oct = metrics.find((m) => m.month === '2026-10')!;
    for (const id of CHANNEL_IDS) {
      const sum = reservations
        .filter((r) => r.status === 'confirmed' && r.channelId === id && r.checkIn.startsWith('2026-10'))
        .reduce((s, r) => s + r.total, 0);
      expect(oct.revenueByChannel[id]).toBe(sum);
    }
    expect(dashboardSummary.revenueMonth).toBe(monthRevenue(oct));
    expect(dashboardSummary.occupancy).toBe(oct.occupancy);
  });

  it('cobre 12 meses de 2025-11 a 2026-10', () => {
    expect(metrics.map((m) => m.month)).toHaveLength(12);
    expect(metrics[0]!.month).toBe('2025-11');
    expect(metrics[11]!.month).toBe('2026-10');
  });

  it('ocupação de outubro fica entre 80% e 92%', () => {
    expect(dashboardSummary.occupancy).toBeGreaterThanOrEqual(0.8);
    expect(dashboardSummary.occupancy).toBeLessThanOrEqual(0.92);
  });
});

describe('api', () => {
  it('blockDates rejeita sobreposição', async () => {
    await expect(blockDates('lagoa', '2026-10-26', '2026-10-27')).rejects.toThrow('Essas datas já têm reserva.');
  });

  it('blockDates aceita período livre e passa a aparecer nas reservas', async () => {
    const taken = await getReservations({ propertyId: 'lagoa', from: '2026-12-01', to: '2026-12-31' });
    const busy = (d: string) => taken.some((r) => r.status !== 'cancelled' && r.checkIn <= d && d < r.checkOut);
    let day = 1;
    while (busy(`2026-12-${String(day).padStart(2, '0')}`) || busy(`2026-12-${String(day + 1).padStart(2, '0')}`))
      day++;
    const checkIn = `2026-12-${String(day).padStart(2, '0')}`;
    const checkOut = `2026-12-${String(day + 1).padStart(2, '0')}`;
    const r = await blockDates('lagoa', checkIn, checkOut, 'Pintura');
    expect(r.status).toBe('blocked');
    const after = await getReservations({ propertyId: 'lagoa', from: checkIn, to: checkIn });
    expect(after.some((x) => x.id === r.id)).toBe(true);
  });

  it('sendMessage adiciona mensagem do anfitrião e zera não lidas', async () => {
    await sendMessage('c-thomas', 'Yes, no problem.');
    const c = await getConversation('c-thomas');
    expect(c!.unread).toBe(0);
    expect(c!.messages.at(-1)).toMatchObject({ from: 'host', text: 'Yes, no problem.' });
  });

  it('markConversationRead zera as não lidas e avisa o layout', async () => {
    const before = (await getConversations()).find((c) => c.unread > 0)!;
    const onUnread = vi.fn();
    window.addEventListener(UNREAD_EVENT, onUnread);
    await markConversationRead(before.id);
    expect((await getConversation(before.id))!.unread).toBe(0);
    await markConversationUnread(before.id);
    expect((await getConversation(before.id))!.unread).toBe(1);
    window.removeEventListener(UNREAD_EVENT, onUnread);
    expect(onUnread).toHaveBeenCalledTimes(2);
  });

  it('retorna cópias', async () => {
    const c = await getConversation('c-marina');
    c!.messages.length = 0;
    expect((await getConversation('c-marina'))!.messages.length).toBeGreaterThan(0);
  });
});
