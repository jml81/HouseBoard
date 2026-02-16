import { describe, it, expect } from 'vitest';
import { screen } from '@testing-library/react';
import { renderWithProviders } from '@/test-utils';
import { ContactsPage } from './contacts-page';

describe('ContactsPage', () => {
  it('renders page header', () => {
    renderWithProviders(<ContactsPage />);
    expect(screen.getByText('Yhteystiedot')).toBeInTheDocument();
  });

  it('renders role group headings', () => {
    renderWithProviders(<ContactsPage />);
    expect(screen.getByText('Isännöitsijä')).toBeInTheDocument();
    expect(screen.getByText('Huolto')).toBeInTheDocument();
    expect(screen.getByText('Hallitus')).toBeInTheDocument();
    expect(screen.getByText('Siivous')).toBeInTheDocument();
    expect(screen.getByText('Muut')).toBeInTheDocument();
  });

  it('renders all contacts', () => {
    renderWithProviders(<ContactsPage />);
    expect(screen.getByText('Markku Toivonen')).toBeInTheDocument();
    expect(screen.getByText('Huoltopäivystys')).toBeInTheDocument();
    expect(screen.getByText('Mikko Lahtinen')).toBeInTheDocument();
  });

  it('renders contact info with clickable links', () => {
    renderWithProviders(<ContactsPage />);
    const emailLink = screen.getByText('markku.toivonen@kptoivonen.fi');
    expect(emailLink.closest('a')).toHaveAttribute('href', 'mailto:markku.toivonen@kptoivonen.fi');

    const phoneLink = screen.getByText('09 123 4567');
    expect(phoneLink.closest('a')).toHaveAttribute('href', 'tel:091234567');
  });

  it('renders company names', () => {
    renderWithProviders(<ContactsPage />);
    expect(screen.getAllByText('Kiinteistöpalvelu Toivonen Oy')).toHaveLength(2);
    expect(screen.getAllByText('Talotekniikka Virtanen Oy')).toHaveLength(2);
  });
});
