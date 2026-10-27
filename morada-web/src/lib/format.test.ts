import { describe, expect, it } from 'vitest';
import { addDays, diffDays, eachDay, isWeekend, TODAY } from './date';
import {
  formatBRL,
  formatBRLFull,
  formatDateShort,
  formatPct,
  formatRange,
  formatRelative,
  formatWeekday,
} from './format';

describe('format', () => {
  it('formatBRL', () => {
    expect(formatBRL(1250)).toBe('R$ 1.250');
    expect(formatBRL(1250.5)).toBe('R$ 1.250,50');
  });
  it('formatBRLFull', () => {
    expect(formatBRLFull(1250.5)).toBe('R$ 1.250,50');
    expect(formatBRLFull(1250)).toBe('R$ 1.250,00');
  });
  it('formatPct', () => {
    expect(formatPct(0.87)).toBe('87%');
  });
  it('formatDateShort', () => {
    expect(formatDateShort('2026-10-26')).toBe('26 out');
    expect(formatDateShort('2026-03-05')).toBe('5 mar');
  });
  it('formatRange', () => {
    expect(formatRange('2026-10-26', '2026-10-30')).toBe('26 a 30 out');
    expect(formatRange('2026-10-30', '2026-11-02')).toBe('30 out a 2 nov');
  });
  it('formatWeekday', () => {
    expect(formatWeekday(TODAY)).toBe('sáb');
    expect(formatWeekday('2026-10-23')).toBe('sex');
  });
  it('formatRelative', () => {
    expect(formatRelative('2026-10-24T17:58:00Z')).toBe('há 2 min');
    expect(formatRelative('2026-10-24T15:00:00Z')).toBe('há 3 h');
    expect(formatRelative('2026-10-23T12:00:00Z')).toBe('ontem');
    expect(formatRelative('2026-10-20T18:00:00Z')).toBe('há 4 dias');
  });
});

describe('date', () => {
  it('addDays / diffDays / eachDay / isWeekend', () => {
    expect(addDays('2026-10-30', 3)).toBe('2026-11-02');
    expect(diffDays('2026-10-26', '2026-10-30')).toBe(4);
    expect(eachDay('2026-10-24', '2026-10-26')).toEqual(['2026-10-24', '2026-10-25', '2026-10-26']);
    expect(isWeekend(TODAY)).toBe(true);
    expect(isWeekend('2026-10-26')).toBe(false);
  });
});
