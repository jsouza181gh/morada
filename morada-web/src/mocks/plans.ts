import type { Plan } from './types';

export const plans: Plan[] = [
  {
    id: 'essencial',
    name: 'Essencial',
    description: 'Para quem tem 1 ou 2 imóveis.',
    monthly: 49,
    yearly: 490,
    featured: false,
    cta: 'Começar com Essencial',
    features: ['Até 2 imóveis', 'Os 6 canais', 'Calendário sincronizado', 'Caixa de entrada única'],
  },
  {
    id: 'pro',
    name: 'Pro',
    description: 'Para quem vive de aluguel por temporada.',
    monthly: 129,
    yearly: 1290,
    featured: true,
    cta: 'Começar com Pro',
    features: ['Até 10 imóveis', 'Tudo do Essencial', 'Preço que acompanha a demanda', 'Relatórios por canal', 'App com alertas'],
  },
  {
    id: 'anfitriao',
    name: 'Anfitrião+',
    description: 'Para administradoras e equipes.',
    monthly: null,
    yearly: null,
    featured: false,
    cta: 'Falar com vendas',
    features: ['Imóveis ilimitados', 'Tudo do Pro', 'Equipe com permissões', 'Atendimento dedicado'],
  },
];
