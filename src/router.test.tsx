import { render, screen } from '@testing-library/react';
import { createMemoryRouter, RouterProvider } from 'react-router';
import { describe, expect, it } from 'vitest';
import { routes } from './router';

describe('router', () => {
  it('rota desconhecida mostra 404', async () => {
    const router = createMemoryRouter(routes, { initialEntries: ['/nao-existe'] });
    render(<RouterProvider router={router} />);
    expect(await screen.findByText('Página não encontrada.')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Voltar ao início ›' })).toHaveAttribute('href', '/');
  });
});
