import { screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { ComingSoon } from '@/components/common/coming-soon';
import { renderWithProviders } from '@/test-utils';

describe('ComingSoon', () => {
  it('renders coming soon message in Finnish', () => {
    renderWithProviders(<ComingSoon titleKey="nav.calendar" />);

    expect(screen.getByText('Tulossa pian')).toBeInTheDocument();
    expect(screen.getByText('Tämä ominaisuus on vielä kehityksessä.')).toBeInTheDocument();
  });

  it('renders the page title from i18n key', () => {
    renderWithProviders(<ComingSoon titleKey="nav.calendar" />);

    expect(screen.getByText('Kalenteri')).toBeInTheDocument();
  });
});
