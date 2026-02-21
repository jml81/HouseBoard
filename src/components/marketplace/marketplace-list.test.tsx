import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithRouterContext, setTestAuth } from '@/test-utils';
import { MarketplaceList } from './marketplace-list';

const mockItems = [
  {
    id: 'mp1',
    title: 'Ikea Kallax -hylly, valkoinen',
    description: 'Hyväkuntoinen hylly.',
    price: 40,
    category: 'huonekalu',
    condition: 'hyva',
    status: 'available',
    seller: { name: 'Minna', apartment: 'B 12' },
    publishedAt: '2026-02-14',
    createdBy: null,
  },
  {
    id: 'mp2',
    title: 'Samsung Galaxy Tab A9',
    description: 'Tabletti.',
    price: 120,
    category: 'elektroniikka',
    condition: 'hyva',
    status: 'available',
    seller: { name: 'Jari', apartment: 'A 3' },
    publishedAt: '2026-02-12',
    createdBy: null,
  },
  {
    id: 'mp3',
    title: 'Naisten talvitakki, koko M',
    description: 'Untuvakki.',
    price: 35,
    category: 'vaatteet',
    condition: 'hyva',
    status: 'available',
    seller: { name: 'Liisa', apartment: 'C 22' },
    publishedAt: '2026-02-10',
    createdBy: null,
  },
  {
    id: 'mp4',
    title: 'Polkupyörä 26"',
    description: 'Kaupunkipyörä.',
    price: 60,
    category: 'urheilu',
    condition: 'kohtalainen',
    status: 'available',
    seller: { name: 'Timo', apartment: 'A 7' },
    publishedAt: '2026-02-08',
    createdBy: null,
  },
  {
    id: 'mp5',
    title: 'Lastenkirjapaketti, 15 kpl',
    description: 'Lastenkirjoja.',
    price: 0,
    category: 'kirjat',
    condition: 'kohtalainen',
    status: 'available',
    seller: { name: 'Anna', apartment: 'B 16' },
    publishedAt: '2026-02-06',
    createdBy: null,
  },
  {
    id: 'mp6',
    title: 'Kahvinkeitin Moccamaster',
    description: 'Kahvinkeitin.',
    price: 45,
    category: 'elektroniikka',
    condition: 'hyva',
    status: 'reserved',
    seller: { name: 'Pekka', apartment: 'C 19' },
    publishedAt: '2026-02-04',
    createdBy: null,
  },
  {
    id: 'mp7',
    title: 'Sohvapöytä, tammea',
    description: 'Pöytä.',
    price: 75,
    category: 'huonekalu',
    condition: 'kohtalainen',
    status: 'sold',
    seller: { name: 'Heikki', apartment: 'A 5' },
    publishedAt: '2026-01-28',
    createdBy: null,
  },
  {
    id: 'mp8',
    title: 'Joogatarvikkeet',
    description: 'Joogamatto.',
    price: 0,
    category: 'urheilu',
    condition: 'uusi',
    status: 'available',
    seller: { name: 'Sari', apartment: 'B 9' },
    publishedAt: '2026-02-01',
    createdBy: null,
  },
  {
    id: 'mp9',
    title: 'Dekkarikokoelma, 8 kirjaa',
    description: 'Dekkarit.',
    price: 15,
    category: 'kirjat',
    condition: 'hyva',
    status: 'available',
    seller: { name: 'Markku', apartment: 'C 24' },
    publishedAt: '2026-01-25',
    createdBy: null,
  },
  {
    id: 'mp10',
    title: 'Patja 80x200 cm',
    description: 'Patja.',
    price: 25,
    category: 'muu',
    condition: 'tyydyttava',
    status: 'available',
    seller: { name: 'Tiina', apartment: 'A 2' },
    publishedAt: '2026-01-20',
    createdBy: null,
  },
];

const createdItem = {
  id: 'new-1',
  title: 'Uusi testituote',
  description: 'Testikuvaus',
  price: 0,
  category: 'muu',
  condition: 'hyva',
  status: 'available',
  seller: { name: 'Aino', apartment: 'A 12' },
  publishedAt: '2026-02-18',
  createdBy: 'u1',
};

function setupFetchMock(): void {
  vi.stubGlobal(
    'fetch',
    vi.fn().mockImplementation((_url: string, init?: RequestInit) => {
      if (init?.method === 'POST') {
        return Promise.resolve(
          new Response(JSON.stringify(createdItem), {
            status: 201,
            headers: { 'Content-Type': 'application/json' },
          }),
        );
      }
      // GET requests return mockItems, then after POST include the new item
      return Promise.resolve(
        new Response(JSON.stringify(mockItems), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        }),
      );
    }),
  );
}

describe('MarketplaceList', () => {
  beforeEach(() => {
    setTestAuth();
    setupFetchMock();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it('renders page header', async () => {
    await renderWithRouterContext(<MarketplaceList />);
    expect(screen.getByText('Kirpputori')).toBeInTheDocument();
  });

  it('renders sell button', async () => {
    await renderWithRouterContext(<MarketplaceList />);
    expect(screen.getByText('Myy')).toBeInTheDocument();
  });

  it('renders search input', async () => {
    await renderWithRouterContext(<MarketplaceList />);
    expect(screen.getByPlaceholderText('Hae tuotetta...')).toBeInTheDocument();
  });

  it('renders category filter buttons', async () => {
    await renderWithRouterContext(<MarketplaceList />);
    const buttons = screen.getAllByRole('button');
    const labels = buttons.map((b) => b.textContent);
    expect(labels).toContain('Kaikki');
    expect(labels).toContain('Huonekalu');
    expect(labels).toContain('Elektroniikka');
    expect(labels).toContain('Vaatteet');
    expect(labels).toContain('Urheilu');
    expect(labels).toContain('Kirjat');
    expect(labels).toContain('Muu');
  });

  it('renders item count', async () => {
    await renderWithRouterContext(<MarketplaceList />);
    expect(await screen.findByText(/10 tuotetta/)).toBeInTheDocument();
  });

  it('renders item titles', async () => {
    await renderWithRouterContext(<MarketplaceList />);
    expect(await screen.findByText('Ikea Kallax -hylly, valkoinen')).toBeInTheDocument();
    expect(screen.getByText('Samsung Galaxy Tab A9')).toBeInTheDocument();
  });

  it('filters by category', async () => {
    const user = userEvent.setup();
    await renderWithRouterContext(<MarketplaceList />);

    await screen.findByText('Ikea Kallax -hylly, valkoinen');
    await user.click(screen.getByRole('button', { name: 'Kirjat' }));

    expect(screen.getByText('Lastenkirjapaketti, 15 kpl')).toBeInTheDocument();
    expect(screen.getByText('Dekkarikokoelma, 8 kirjaa')).toBeInTheDocument();
    expect(screen.queryByText('Ikea Kallax -hylly, valkoinen')).not.toBeInTheDocument();
    expect(screen.getByText(/2 tuotetta/)).toBeInTheDocument();
  });

  it('filters by search query', async () => {
    const user = userEvent.setup();
    await renderWithRouterContext(<MarketplaceList />);

    await screen.findByText('Ikea Kallax -hylly, valkoinen');
    await user.type(screen.getByPlaceholderText('Hae tuotetta...'), 'Samsung');

    expect(screen.getByText('Samsung Galaxy Tab A9')).toBeInTheDocument();
    expect(screen.queryByText('Ikea Kallax -hylly, valkoinen')).not.toBeInTheDocument();
    expect(screen.getByText(/1 tuotetta/)).toBeInTheDocument();
  });

  it('shows empty state when no results match', async () => {
    const user = userEvent.setup();
    await renderWithRouterContext(<MarketplaceList />);

    await screen.findByText('Ikea Kallax -hylly, valkoinen');
    await user.type(screen.getByPlaceholderText('Hae tuotetta...'), 'xyznonexistent');

    expect(screen.getByText('Ei hakutuloksia')).toBeInTheDocument();
    expect(screen.getByText(/0 tuotetta/)).toBeInTheDocument();
  });

  it('toggles category filter off when clicked again', async () => {
    const user = userEvent.setup();
    await renderWithRouterContext(<MarketplaceList />);

    await screen.findByText('Ikea Kallax -hylly, valkoinen');
    await user.click(screen.getByRole('button', { name: 'Kirjat' }));
    expect(screen.getByText(/2 tuotetta/)).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Kirjat' }));
    expect(screen.getByText(/10 tuotetta/)).toBeInTheDocument();
  });

  it('opens create dialog when sell button is clicked', async () => {
    const user = userEvent.setup();
    await renderWithRouterContext(<MarketplaceList />);

    await user.click(screen.getByText('Myy'));

    expect(screen.getByText('Myy tuote')).toBeInTheDocument();
    expect(screen.getByText('Lisää uusi tuote kirpputorille')).toBeInTheDocument();
  });

  it('renders form fields in create dialog', async () => {
    const user = userEvent.setup();
    await renderWithRouterContext(<MarketplaceList />);

    await user.click(screen.getByText('Myy'));

    expect(screen.getByLabelText('Otsikko')).toBeInTheDocument();
    expect(screen.getByLabelText('Kuvaus')).toBeInTheDocument();
    expect(screen.getByLabelText('Hinta (€)')).toBeInTheDocument();
    expect(screen.getByText('Julkaise')).toBeInTheDocument();
  });

  it('submits form and calls API', async () => {
    const user = userEvent.setup();
    await renderWithRouterContext(<MarketplaceList />);

    await screen.findByText('Ikea Kallax -hylly, valkoinen');
    await user.click(screen.getByText('Myy'));

    const titleInput = screen.getByLabelText('Otsikko');
    const descInput = screen.getByLabelText('Kuvaus');

    await user.clear(titleInput);
    await user.paste('Uusi testituote');
    await user.clear(descInput);
    await user.paste('Testikuvaus');

    await user.click(screen.getByText('Julkaise'));

    await waitFor(() => {
      const calls = (fetch as ReturnType<typeof vi.fn>).mock.calls;
      const postCall = calls.find(
        (call: unknown[]) => (call[1] as RequestInit | undefined)?.method === 'POST',
      );
      expect(postCall).toBeDefined();
    });
  }, 15000);

  it('shows validation errors for empty title', async () => {
    const user = userEvent.setup();
    await renderWithRouterContext(<MarketplaceList />);

    await user.click(screen.getByText('Myy'));

    // Fill only description, leave title empty
    const descInput = screen.getByLabelText('Kuvaus');
    await user.clear(descInput);
    await user.paste('Kuvaus ilman otsikkoa');

    await user.click(screen.getByText('Julkaise'));

    expect(screen.getByText('Otsikko on pakollinen')).toBeInTheDocument();
  });

  it('shows validation errors for empty description', async () => {
    const user = userEvent.setup();
    await renderWithRouterContext(<MarketplaceList />);

    await user.click(screen.getByText('Myy'));

    // Fill only title, leave description empty
    const titleInput = screen.getByLabelText('Otsikko');
    await user.clear(titleInput);
    await user.paste('Otsikko ilman kuvausta');

    await user.click(screen.getByText('Julkaise'));

    expect(screen.getByText('Kuvaus on pakollinen')).toBeInTheDocument();
  });
});
