import { describe, it, expect, beforeEach } from 'vitest';
import { useUiStore } from '@/stores/ui-store';

describe('useUiStore', () => {
  beforeEach(() => {
    useUiStore.setState({ sidebarOpen: true, locale: 'fi' });
  });

  it('has correct default state', () => {
    const state = useUiStore.getState();

    expect(state.sidebarOpen).toBe(true);
    expect(state.locale).toBe('fi');
  });

  it('toggles sidebar', () => {
    useUiStore.getState().toggleSidebar();

    expect(useUiStore.getState().sidebarOpen).toBe(false);
  });

  it('sets sidebar open state', () => {
    useUiStore.getState().setSidebarOpen(false);

    expect(useUiStore.getState().sidebarOpen).toBe(false);
  });

  it('sets locale', () => {
    useUiStore.getState().setLocale('en');

    expect(useUiStore.getState().locale).toBe('en');
  });
});
