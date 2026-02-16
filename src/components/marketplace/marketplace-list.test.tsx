import { describe, it, expect } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithRouterContext } from '@/test-utils';
import { MarketplaceList } from './marketplace-list';

describe('MarketplaceList', () => {
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
    expect(screen.getByText(/10 tuotetta/)).toBeInTheDocument();
  });

  it('renders item titles', async () => {
    await renderWithRouterContext(<MarketplaceList />);
    expect(screen.getByText('Ikea Kallax -hylly, valkoinen')).toBeInTheDocument();
    expect(screen.getByText('Samsung Galaxy Tab A9')).toBeInTheDocument();
  });

  it('filters by category', async () => {
    const user = userEvent.setup();
    await renderWithRouterContext(<MarketplaceList />);

    await user.click(screen.getByRole('button', { name: 'Kirjat' }));

    expect(screen.getByText('Lastenkirjapaketti, 15 kpl')).toBeInTheDocument();
    expect(screen.getByText('Dekkarikokoelma, 8 kirjaa')).toBeInTheDocument();
    expect(screen.queryByText('Ikea Kallax -hylly, valkoinen')).not.toBeInTheDocument();
    expect(screen.getByText(/2 tuotetta/)).toBeInTheDocument();
  });

  it('filters by search query', async () => {
    const user = userEvent.setup();
    await renderWithRouterContext(<MarketplaceList />);

    await user.type(screen.getByPlaceholderText('Hae tuotetta...'), 'Samsung');

    expect(screen.getByText('Samsung Galaxy Tab A9')).toBeInTheDocument();
    expect(screen.queryByText('Ikea Kallax -hylly, valkoinen')).not.toBeInTheDocument();
    expect(screen.getByText(/1 tuotetta/)).toBeInTheDocument();
  });

  it('shows empty state when no results match', async () => {
    const user = userEvent.setup();
    await renderWithRouterContext(<MarketplaceList />);

    await user.type(screen.getByPlaceholderText('Hae tuotetta...'), 'xyznonexistent');

    expect(screen.getByText('Ei hakutuloksia')).toBeInTheDocument();
    expect(screen.getByText(/0 tuotetta/)).toBeInTheDocument();
  });

  it('toggles category filter off when clicked again', async () => {
    const user = userEvent.setup();
    await renderWithRouterContext(<MarketplaceList />);

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

  it('submits form and adds new item to list', async () => {
    const user = userEvent.setup();
    await renderWithRouterContext(<MarketplaceList />);

    await user.click(screen.getByText('Myy'));

    const titleInput = screen.getByLabelText('Otsikko');
    const descInput = screen.getByLabelText('Kuvaus');

    await user.clear(titleInput);
    await user.paste('Uusi testituote');
    await user.clear(descInput);
    await user.paste('Testikuvaus');

    await user.click(screen.getByText('Julkaise'));

    expect(screen.getByText('Uusi testituote')).toBeInTheDocument();
    expect(screen.getByText(/11 tuotetta/)).toBeInTheDocument();
  }, 15000);
});
