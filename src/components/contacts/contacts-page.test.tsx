import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { screen } from '@testing-library/react';
import { renderWithProviders } from '@/test-utils';
import { ContactsPage } from './contacts-page';

const mockContacts = [
  {
    id: 'c1',
    name: 'Markku Toivonen',
    role: 'isannoitsija',
    company: 'Kiinteistöpalvelu Toivonen Oy',
    phone: '09 123 4567',
    email: 'markku.toivonen@kptoivonen.fi',
    description: 'Hallinto.',
  },
  {
    id: 'c2',
    name: 'Terhi Aaltonen',
    role: 'isannoitsija',
    company: 'Kiinteistöpalvelu Toivonen Oy',
    phone: '09 123 4568',
    email: 'terhi.aaltonen@kptoivonen.fi',
    description: 'Sijainen.',
  },
  {
    id: 'c3',
    name: 'Huoltopäivystys',
    role: 'huolto',
    company: 'Talotekniikka Virtanen Oy',
    phone: '0800 123 456',
    email: 'paivystys@ttv.fi',
    description: '24/7.',
  },
  {
    id: 'c4',
    name: 'Raimo Virtanen',
    role: 'huolto',
    company: 'Talotekniikka Virtanen Oy',
    phone: '040 789 0123',
    email: 'raimo.virtanen@ttv.fi',
    description: 'Huolto.',
  },
  {
    id: 'c5',
    name: 'Mikko Lahtinen',
    role: 'hallitus',
    phone: '040 123 4567',
    email: 'mikko.lahtinen@email.fi',
    description: 'Pj.',
  },
  {
    id: 'c6',
    name: 'Sari Korhonen',
    role: 'hallitus',
    phone: '050 234 5678',
    email: 'sari.korhonen@email.fi',
    description: 'Vpj.',
  },
  {
    id: 'c7',
    name: 'Siivouspalvelu Puhtaus Oy',
    role: 'siivous',
    company: 'Siivouspalvelu Puhtaus Oy',
    phone: '010 234 5678',
    email: 'info@puhtausoy.fi',
    description: 'Siivous.',
  },
  {
    id: 'c8',
    name: 'Jätehuolto Remeo',
    role: 'muu',
    company: 'Remeo Oy',
    phone: '020 123 4567',
    email: 'asiakaspalvelu@remeo.fi',
    description: 'Jätehuolto.',
  },
  {
    id: 'c9',
    name: 'Hissitarkastus Kone',
    role: 'muu',
    company: 'KONE Oyj',
    phone: '0800 274 274',
    email: 'huolto@kone.com',
    description: 'Hissi.',
  },
];

describe('ContactsPage', () => {
  beforeEach(() => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(
        new Response(JSON.stringify(mockContacts), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        }),
      ),
    );
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it('renders page header', () => {
    renderWithProviders(<ContactsPage />);
    expect(screen.getByText('Yhteystiedot')).toBeInTheDocument();
  });

  it('renders role group headings', async () => {
    renderWithProviders(<ContactsPage />);
    await screen.findByText('Markku Toivonen');
    expect(screen.getByText('Isännöitsijä')).toBeInTheDocument();
    expect(screen.getByText('Huolto')).toBeInTheDocument();
    expect(screen.getByText('Hallitus')).toBeInTheDocument();
    expect(screen.getByText('Siivous')).toBeInTheDocument();
    expect(screen.getByText('Muut')).toBeInTheDocument();
  });

  it('renders all contacts', async () => {
    renderWithProviders(<ContactsPage />);
    expect(await screen.findByText('Markku Toivonen')).toBeInTheDocument();
    expect(screen.getByText('Huoltopäivystys')).toBeInTheDocument();
    expect(screen.getByText('Mikko Lahtinen')).toBeInTheDocument();
  });

  it('renders contact info with clickable links', async () => {
    renderWithProviders(<ContactsPage />);
    await screen.findByText('Markku Toivonen');
    const emailLink = screen.getByText('markku.toivonen@kptoivonen.fi');
    expect(emailLink.closest('a')).toHaveAttribute('href', 'mailto:markku.toivonen@kptoivonen.fi');

    const phoneLink = screen.getByText('09 123 4567');
    expect(phoneLink.closest('a')).toHaveAttribute('href', 'tel:091234567');
  });

  it('renders company names', async () => {
    renderWithProviders(<ContactsPage />);
    await screen.findByText('Markku Toivonen');
    expect(screen.getAllByText('Kiinteistöpalvelu Toivonen Oy')).toHaveLength(2);
    expect(screen.getAllByText('Talotekniikka Virtanen Oy')).toHaveLength(2);
  });
});
