import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useClock } from './use-clock';

describe('useClock', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2026, 1, 16, 14, 35, 0));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('returns a Date object', () => {
    const { result } = renderHook(() => useClock());
    expect(result.current).toBeInstanceOf(Date);
  });

  it('updates on tick', () => {
    const { result } = renderHook(() => useClock());

    const initialTime = result.current.getTime();

    act(() => {
      vi.setSystemTime(new Date(2026, 1, 16, 14, 35, 5));
      vi.advanceTimersByTime(1_000);
    });

    expect(result.current.getTime()).toBeGreaterThan(initialTime);
  });

  it('cleans up interval on unmount', () => {
    const clearIntervalSpy = vi.spyOn(globalThis, 'clearInterval');
    const { unmount } = renderHook(() => useClock());

    unmount();

    expect(clearIntervalSpy).toHaveBeenCalled();
    clearIntervalSpy.mockRestore();
  });
});
