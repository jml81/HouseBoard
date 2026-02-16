import { screen, waitFor, within } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { renderWithRouter } from '@/test-utils';

describe('MobileNav', () => {
  it('renders mobile navigation items in Finnish', async () => {
    renderWithRouter('/kalenteri');

    await waitFor(() => {
      expect(screen.getAllByRole('navigation').length).toBeGreaterThanOrEqual(1);
    });

    // Get the bottom nav (the one inside the fixed bottom bar)
    const navElements = screen.getAllByRole('navigation');
    // The mobile nav is the last one (bottom of the DOM)
    const mobileNav = navElements[navElements.length - 1]!;

    expect(within(mobileNav).getByText('Koti')).toBeInTheDocument();
    expect(within(mobileNav).getByText('Tiedotteet')).toBeInTheDocument();
    expect(within(mobileNav).getByText('Tapahtumat')).toBeInTheDocument();
    expect(within(mobileNav).getByText('Lisää')).toBeInTheDocument();
  });
});
