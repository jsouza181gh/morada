import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { CountUp, Parallax, Reveal, RevealGroup, RevealItem } from '@/components/motion';

vi.mock('@/hooks/useReducedMotion', () => ({ useReducedMotion: () => false }));

describe('motion sem reduced motion (jsdom)', () => {
  it('Reveal, RevealGroup e Parallax montam sem erro', () => {
    render(
      <Parallax offset={40}>
        <Reveal delay={0.1}>
          <p>Mídia</p>
        </Reveal>
        <RevealGroup as="ul">
          <RevealItem as="li">Card</RevealItem>
        </RevealGroup>
      </Parallax>,
    );
    expect(screen.getByText('Mídia')).toBeInTheDocument();
    expect(screen.getByText('Card').tagName).toBe('LI');
  });

  it('CountUp expõe o valor final para leitores de tela', () => {
    render(<CountUp to={1200} format={(v) => `${v} un`} />);
    expect(screen.getByLabelText('1200 un')).toBeInTheDocument();
  });
});
