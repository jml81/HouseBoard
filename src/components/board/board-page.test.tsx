import { describe, it, expect } from 'vitest';
import { screen } from '@testing-library/react';
import { renderWithProviders } from '@/test-utils';
import { BoardPage } from './board-page';

describe('BoardPage', () => {
  it('renders page header', () => {
    renderWithProviders(<BoardPage />);
    expect(screen.getByText('Hallitus')).toBeInTheDocument();
  });

  it('renders all board members', () => {
    renderWithProviders(<BoardPage />);
    expect(screen.getByText('Mikko Lahtinen')).toBeInTheDocument();
    expect(screen.getByText('Sari Korhonen')).toBeInTheDocument();
    expect(screen.getByText('Jukka Nieminen')).toBeInTheDocument();
    expect(screen.getByText('Anna Mäkelä')).toBeInTheDocument();
    expect(screen.getByText('Pekka Virtanen')).toBeInTheDocument();
  });

  it('renders role badges', () => {
    renderWithProviders(<BoardPage />);
    expect(screen.getByText('Puheenjohtaja')).toBeInTheDocument();
    expect(screen.getByText('Varapuheenjohtaja')).toBeInTheDocument();
    expect(screen.getAllByText('Jäsen')).toHaveLength(2);
    expect(screen.getByText('Varajäsen')).toBeInTheDocument();
  });

  it('renders puheenjohtaja first (sorted by role)', () => {
    renderWithProviders(<BoardPage />);
    const names = screen.getAllByText(/Lahtinen|Korhonen|Nieminen|Mäkelä|Virtanen/);
    expect(names[0]?.textContent).toBe('Mikko Lahtinen');
  });

  it('renders contact info', () => {
    renderWithProviders(<BoardPage />);
    expect(screen.getByText('mikko.lahtinen@email.fi')).toBeInTheDocument();
    expect(screen.getByText('040 123 4567')).toBeInTheDocument();
    expect(screen.getByText('A 4')).toBeInTheDocument();
  });
});
