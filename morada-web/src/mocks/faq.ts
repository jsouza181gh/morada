import type { FaqItem } from './types';

export const faq: FaqItem[] = [
  {
    q: 'Preciso ter conta em cada plataforma?',
    a: 'Sim, cada canal exige uma conta de anfitrião. Você conecta essas contas uma vez na Morada e passa a gerenciar tudo daqui.',
  },
  {
    q: 'E se uma reserva entrar em dois canais ao mesmo tempo?',
    a: 'Assim que a primeira reserva é confirmada, a Morada fecha a data nos outros canais em segundos.',
  },
  {
    q: 'Posso ter preços diferentes em cada canal?',
    a: 'Pode. Por padrão, a diária é ajustada pela taxa de cada canal para você receber o mesmo valor, e você muda isso quando quiser.',
  },
  {
    q: 'A Morada cobra comissão sobre as reservas?',
    a: 'Não. Você paga só o plano. As taxas de cada canal continuam sendo cobradas por eles.',
  },
  {
    q: 'Quais canais estão disponíveis?',
    a: 'Airbnb, Booking.com, Vrbo, Trivago, Decolar e Expedia. Novos canais entram sem custo extra.',
  },
  {
    q: 'Posso cancelar quando quiser?',
    a: 'Sim. Seus anúncios continuam nas plataformas, só deixam de ser sincronizados pela Morada.',
  },
];
