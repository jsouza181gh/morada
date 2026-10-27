import { act, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { useAutoplay } from '../useAutoplay';

vi.mock('../useReducedMotion', () => ({ useReducedMotion: () => false }));

describe('useAutoplay', () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it('avança depois de 5000ms', () => {
    const { result } = renderHook(() => useAutoplay({ count: 3 }));
    expect(result.current.index).toBe(0);
    expect(result.current.playing).toBe(true);
    act(() => vi.advanceTimersByTime(4999));
    expect(result.current.index).toBe(0);
    act(() => vi.advanceTimersByTime(1));
    expect(result.current.index).toBe(1);
  });

  it('pause() impede o avanço', () => {
    const { result } = renderHook(() => useAutoplay({ count: 3 }));
    act(() => result.current.pause());
    act(() => vi.advanceTimersByTime(15000));
    expect(result.current.index).toBe(0);
    expect(result.current.playing).toBe(false);
  });

  it('setIndex(2) pausa e fixa 2', () => {
    const { result } = renderHook(() => useAutoplay({ count: 3 }));
    act(() => result.current.setIndex(2));
    act(() => vi.advanceTimersByTime(15000));
    expect(result.current.index).toBe(2);
    expect(result.current.playing).toBe(false);
  });

  it('volta a 0 depois do último', () => {
    const { result } = renderHook(() => useAutoplay({ count: 3 }));
    act(() => vi.advanceTimersByTime(5000));
    act(() => vi.advanceTimersByTime(5000));
    expect(result.current.index).toBe(2);
    act(() => vi.advanceTimersByTime(5000));
    expect(result.current.index).toBe(0);
  });

  it('não avança com a aba oculta', () => {
    const spy = vi.spyOn(document, 'hidden', 'get').mockReturnValue(true);
    const { result } = renderHook(() => useAutoplay({ count: 3 }));
    act(() => vi.advanceTimersByTime(15000));
    expect(result.current.index).toBe(0);
    spy.mockReturnValue(false);
    act(() => document.dispatchEvent(new Event('visibilitychange')));
    act(() => vi.advanceTimersByTime(5000));
    expect(result.current.index).toBe(1);
    spy.mockRestore();
  });

  it('enabled=false não avança', () => {
    const { result } = renderHook(() => useAutoplay({ count: 3, enabled: false }));
    act(() => vi.advanceTimersByTime(15000));
    expect(result.current.index).toBe(0);
  });
});
