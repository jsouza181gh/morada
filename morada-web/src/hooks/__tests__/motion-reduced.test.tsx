import { renderHook, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { CountUp, Reveal, RevealGroup, RevealItem } from '@/components/motion';
import { useAutoplay } from '../useAutoplay';

vi.mock('@/hooks/useReducedMotion', () => ({ useReducedMotion: () => true }));

describe('com reduced motion', () => {
  it('Reveal renderiza os filhos visíveis, sem estilo inicial', () => {
    render(
      <Reveal as="section" className="x">
        <p>Conteúdo</p>
      </Reveal>,
    );
    const p = screen.getByText('Conteúdo');
    expect(p).toBeVisible();
    const section = p.parentElement!;
    expect(section.tagName).toBe('SECTION');
    expect(section).toHaveClass('x');
    expect(section.getAttribute('style')).toBeNull();
  });

  it('RevealGroup/RevealItem renderizam estáticos', () => {
    render(
      <RevealGroup>
        <RevealItem>Um</RevealItem>
        <RevealItem>Dois</RevealItem>
      </RevealGroup>,
    );
    expect(screen.getByText('Um').getAttribute('style')).toBeNull();
    expect(screen.getByText('Dois')).toBeVisible();
  });

  it('CountUp mostra o valor final', () => {
    render(<CountUp to={48920} format={(v) => `R$ ${v}`} />);
    expect(screen.getAllByText('R$ 48920')).toHaveLength(2);
  });

  it('useAutoplay começa pausado', () => {
    const { result } = renderHook(() => useAutoplay({ count: 3 }));
    expect(result.current.playing).toBe(false);
  });
});
