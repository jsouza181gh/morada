import { useState } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router';
import { describe, expect, it, vi } from 'vitest';
import { Avatar, Button, ChannelBadge, SegmentedControl, Switch } from '@/components/ui';

describe('Button', () => {
  it('renderiza <a> com href externo', () => {
    render(<Button href="https://example.com">Abrir</Button>);
    const link = screen.getByRole('link', { name: 'Abrir' });
    expect(link.tagName).toBe('A');
    expect(link).toHaveAttribute('href', 'https://example.com');
  });

  it('renderiza Link do router com href interno', () => {
    render(
      <MemoryRouter>
        <Button href="/precos">Ver preços</Button>
      </MemoryRouter>,
    );
    expect(screen.getByRole('link', { name: 'Ver preços' })).toHaveAttribute('href', '/precos');
  });

  it('acrescenta › na variante link', () => {
    render(<Button variant="link">Saiba mais</Button>);
    const btn = screen.getByRole('button');
    expect(btn).toHaveTextContent('Saiba mais ›');
    expect(btn).toHaveAttribute('type', 'button');
  });

  it('respeita type passado', () => {
    render(<Button type="submit">Enviar</Button>);
    expect(screen.getByRole('button', { name: 'Enviar' })).toHaveAttribute('type', 'submit');
  });
});

describe('ChannelBadge', () => {
  it('mostra canal e status pendente', () => {
    render(<ChannelBadge channel="booking" status="pending" />);
    expect(screen.getByText('Booking.com')).toBeInTheDocument();
    expect(screen.getByText('Em análise')).toBeInTheDocument();
    expect(screen.getByTitle('Booking.com: Em análise')).toBeInTheDocument();
  });
});

describe('Switch', () => {
  function Harness({ onChange }: { onChange: (v: boolean) => void }) {
    const [on, setOn] = useState(false);
    return (
      <Switch
        checked={on}
        label="Sincronizar"
        onCheckedChange={(v) => {
          setOn(v);
          onChange(v);
        }}
      />
    );
  }

  it('clique e Espaço alternam aria-checked', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Harness onChange={onChange} />);
    const sw = screen.getByRole('switch', { name: 'Sincronizar' });
    expect(sw).toHaveAttribute('aria-checked', 'false');

    await user.click(sw);
    expect(sw).toHaveAttribute('aria-checked', 'true');
    expect(onChange).toHaveBeenLastCalledWith(true);

    sw.focus();
    await user.keyboard(' ');
    expect(sw).toHaveAttribute('aria-checked', 'false');
    expect(onChange).toHaveBeenLastCalledWith(false);

    await user.keyboard('{Enter}');
    expect(sw).toHaveAttribute('aria-checked', 'true');
    expect(onChange).toHaveBeenCalledTimes(3);
  });
});

describe('SegmentedControl', () => {
  function Harness() {
    const [v, setV] = useState<'mensal' | 'anual'>('mensal');
    return (
      <SegmentedControl
        ariaLabel="Cobrança"
        value={v}
        onChange={setV}
        options={[
          { value: 'mensal', label: 'Mensal' },
          { value: 'anual', label: 'Anual' },
        ]}
      />
    );
  }

  it('seta → muda o valor', async () => {
    const user = userEvent.setup();
    render(<Harness />);
    const mensal = screen.getByRole('radio', { name: 'Mensal' });
    expect(mensal).toHaveAttribute('aria-checked', 'true');
    mensal.focus();
    await user.keyboard('{ArrowRight}');
    expect(screen.getByRole('radio', { name: 'Anual' })).toHaveAttribute('aria-checked', 'true');
    expect(mensal).toHaveAttribute('aria-checked', 'false');
  });
});

describe('Avatar', () => {
  it('usa iniciais do primeiro e último nome', () => {
    render(<Avatar name="Mariana Costa Lima" />);
    const img = screen.getByRole('img', { name: 'Mariana Costa Lima' });
    expect(img).toHaveTextContent('ML');
  });
});
