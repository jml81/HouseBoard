import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { screen } from '@testing-library/react';
import { renderWithProviders } from '@/test-utils';
import { BoardPage } from './board-page';

const mockBoardMembers = [
  {
    id: 'bm1',
    name: 'Mikko Lahtinen',
    role: 'puheenjohtaja',
    apartment: 'A 4',
    email: 'mikko.lahtinen@email.fi',
    phone: '040 123 4567',
    termStart: '2025-03-27',
    termEnd: '2026-03-25',
  },
  {
    id: 'bm2',
    name: 'Sari Korhonen',
    role: 'varapuheenjohtaja',
    apartment: 'B 12',
    email: 'sari.korhonen@email.fi',
    phone: '050 234 5678',
    termStart: '2025-03-27',
    termEnd: '2026-03-25',
  },
  {
    id: 'bm3',
    name: 'Jukka Nieminen',
    role: 'jasen',
    apartment: 'A 7',
    email: 'jukka.nieminen@email.fi',
    phone: '040 345 6789',
    termStart: '2025-03-27',
    termEnd: '2026-03-25',
  },
  {
    id: 'bm4',
    name: 'Anna Mäkelä',
    role: 'jasen',
    apartment: 'C 18',
    email: 'anna.makela@email.fi',
    phone: '050 456 7890',
    termStart: '2025-03-27',
    termEnd: '2026-03-25',
  },
  {
    id: 'bm5',
    name: 'Pekka Virtanen',
    role: 'varajasen',
    apartment: 'B 9',
    email: 'pekka.virtanen@email.fi',
    phone: '040 567 8901',
    termStart: '2025-03-27',
    termEnd: '2026-03-25',
  },
];

describe('BoardPage', () => {
  beforeEach(() => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(
        new Response(JSON.stringify(mockBoardMembers), {
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
    renderWithProviders(<BoardPage />);
    expect(screen.getByText('Hallitus')).toBeInTheDocument();
  });

  it('renders all board members', async () => {
    renderWithProviders(<BoardPage />);
    expect(await screen.findByText('Mikko Lahtinen')).toBeInTheDocument();
    expect(screen.getByText('Sari Korhonen')).toBeInTheDocument();
    expect(screen.getByText('Jukka Nieminen')).toBeInTheDocument();
    expect(screen.getByText('Anna Mäkelä')).toBeInTheDocument();
    expect(screen.getByText('Pekka Virtanen')).toBeInTheDocument();
  });

  it('renders role badges', async () => {
    renderWithProviders(<BoardPage />);
    await screen.findByText('Mikko Lahtinen');
    expect(screen.getByText('Puheenjohtaja')).toBeInTheDocument();
    expect(screen.getByText('Varapuheenjohtaja')).toBeInTheDocument();
    expect(screen.getAllByText('Jäsen')).toHaveLength(2);
    expect(screen.getByText('Varajäsen')).toBeInTheDocument();
  });

  it('renders puheenjohtaja first (sorted by role)', async () => {
    renderWithProviders(<BoardPage />);
    await screen.findByText('Mikko Lahtinen');
    const names = screen.getAllByText(/Lahtinen|Korhonen|Nieminen|Mäkelä|Virtanen/);
    expect(names[0]?.textContent).toBe('Mikko Lahtinen');
  });

  it('renders contact info', async () => {
    renderWithProviders(<BoardPage />);
    await screen.findByText('Mikko Lahtinen');
    expect(screen.getByText('mikko.lahtinen@email.fi')).toBeInTheDocument();
    expect(screen.getByText('040 123 4567')).toBeInTheDocument();
    expect(screen.getByText('A 4')).toBeInTheDocument();
  });
});
