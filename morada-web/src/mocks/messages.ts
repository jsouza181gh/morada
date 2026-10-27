import type { Conversation, Message } from './types';

/** Horário em UTC; America/Sao_Paulo = UTC-3 (15:00 local = 18:00Z). */
const at = (day: string, hhmm: string) => `2026-10-${day}T${hhmm}:00.000Z`;

let seq = 0;
const g = (text: string, sentAt: string): Message => ({ id: `m-${++seq}`, from: 'guest', text, sentAt });
const h = (text: string, sentAt: string): Message => ({ id: `m-${++seq}`, from: 'host', text, sentAt });

export const conversations: Conversation[] = [
  {
    id: 'c-thomas',
    propertyId: 'pinheiros',
    channelId: 'booking',
    guestName: 'Thomas Weber',
    reservationId: 'r-pinheiros-thomas',
    unread: 1,
    messages: [
      g('Hello, we just booked the loft for next week.', at('22', '13:05')),
      h('Hi Thomas, welcome. Check-in starts at 3 pm and the building has a 24-hour doorman.', at('22', '13:40')),
      g('We arrive at 10 pm, is that ok?', at('24', '17:48')),
    ],
  },
  {
    id: 'c-marina',
    propertyId: 'lagoa',
    channelId: 'airbnb',
    guestName: 'Marina Costa',
    reservationId: 'r-lagoa-marina',
    unread: 0,
    messages: [
      g('Oi! Tem vaga na garagem para um carro?', at('24', '16:12')),
      h('Tem sim, Marina. A vaga é a 12, coberta.', at('24', '16:20')),
    ],
  },
  {
    id: 'c-rafael',
    propertyId: 'leblon',
    channelId: 'airbnb',
    guestName: 'Rafael Dias',
    reservationId: 'r-leblon-rafael',
    unread: 1,
    messages: [
      g('Oi, tudo bem? Acabei de reservar para o dia 27.', at('23', '21:30')),
      h('Oi, Rafael. Tudo certo. A reserva é confirmada assim que o pagamento for aprovado.', at('23', '22:02')),
      g('Consigo fazer o check-in antes das 15h? Meu voo chega às 9h.', at('24', '15:26')),
    ],
  },
  {
    id: 'c-juliana',
    propertyId: 'leblon',
    channelId: 'decolar',
    guestName: 'Juliana Reis',
    reservationId: 'r-leblon-juliana',
    unread: 1,
    messages: [g('Boa tarde. O apartamento tem roupa de cama e toalhas de banho, ou preciso levar?', at('24', '14:55'))],
  },
  {
    id: 'c-moreira',
    propertyId: 'trancoso',
    channelId: 'airbnb',
    guestName: 'Família Moreira',
    reservationId: 'r-trancoso-moreira',
    unread: 1,
    messages: [
      g('Bom dia. Estamos saindo de Porto Seguro agora, chegamos por volta das 14h.', at('24', '13:10')),
      h('Bom dia. A casa já está pronta. O caseiro, seu Raimundo, espera vocês no portão.', at('24', '13:25')),
      g('Perfeito. A piscina é aquecida?', at('24', '13:31')),
      h('Não é aquecida, mas fica no sol a tarde toda.', at('24', '13:40')),
      g('Chegamos. A casa é linda, obrigado. Onde fica a chave do portão dos fundos?', at('24', '17:35')),
    ],
  },
  {
    id: 'c-camila',
    propertyId: 'pinheiros',
    channelId: 'expedia',
    guestName: 'Camila Torres',
    reservationId: 'r-pinheiros-camila',
    unread: 0,
    messages: [
      g('Olá. Vou trabalhar remoto durante a estadia. Qual a velocidade da internet?', at('21', '19:14')),
      h('Olá, Camila. A internet é de 500 megas por fibra, e o loft tem mesa de trabalho e cadeira ergonômica.', at('21', '19:50')),
      g('Ótimo, obrigada.', at('21', '20:03')),
    ],
  },
  {
    id: 'c-lucas',
    propertyId: 'gramado',
    channelId: 'vrbo',
    guestName: 'Lucas Andrade',
    reservationId: 'r-gramado-lucas',
    unread: 0,
    messages: [
      g('Oi. A lenha para a lareira está inclusa?', at('20', '22:41')),
      h('Oi, Lucas. Está sim, deixamos um cesto cheio e tem mais no depósito ao lado do deck.', at('20', '23:05')),
      g('E posso levar meu cachorro? É de porte pequeno.', at('20', '23:09')),
      h('Pode. O chalé aceita pets, só pedimos que ele não suba nas camas.', at('21', '11:30')),
    ],
  },
  {
    id: 'c-anapaula',
    propertyId: 'lagoa',
    channelId: 'booking',
    guestName: 'Ana Paula Ramos',
    reservationId: 'r-lagoa-anapaula',
    unread: 0,
    messages: [
      g('Boa noite. O pagamento da reserva ainda aparece como pendente. Preciso fazer algo?', at('23', '00:15')),
      h('Boa noite, Ana Paula. O Booking.com processa o pagamento até 48 horas antes. Avisamos quando for aprovado.', at('23', '11:20')),
      g('Combinado, obrigada.', at('23', '11:42')),
    ],
  },
  {
    id: 'c-pedro',
    propertyId: 'lagoa',
    channelId: 'airbnb',
    guestName: 'Pedro Lima',
    reservationId: 'r-lagoa-pedro',
    unread: 0,
    messages: [
      g('Posso deixar as malas antes do check-in? Chego às 10h.', at('19', '18:22')),
      h('Pode, Pedro. A diarista estará na casa a partir das 9h e guarda as malas para você.', at('19', '19:00')),
    ],
  },
  {
    id: 'c-bruno',
    propertyId: 'savassi',
    channelId: 'booking',
    guestName: 'Bruno Alves',
    reservationId: 'r-savassi-bruno',
    unread: 0,
    messages: [
      g('Oi. O studio tem garagem?', at('22', '16:40')),
      h('Oi, Bruno. O prédio não tem vaga, mas há um estacionamento 24 horas na mesma quadra.', at('22', '17:02')),
      g('Sabe quanto custa a diária lá?', at('22', '17:05')),
      h('Fica em torno de R$ 45 por dia. A entrada é pela Rua Pernambuco.', at('22', '17:18')),
    ],
  },
];
