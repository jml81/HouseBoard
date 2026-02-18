import { describe, it, expect, vi, afterEach, beforeEach } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders, setTestAuth } from '@/test-utils';
import type { Announcement } from '@/types';
import { AnnouncementFormDialog } from './announcement-form-dialog';

const mockAnnouncement: Announcement = {
  id: 'a1',
  title: 'Testivedote',
  summary: 'Yhteenveto testille',
  content: 'Tämä on testisisältö.',
  category: 'huolto',
  author: 'Hallitus',
  publishedAt: '2026-03-01',
  isNew: false,
};

function mockFetch(data: unknown = { success: true }, status = 200): void {
  vi.stubGlobal(
    'fetch',
    vi.fn().mockResolvedValue(
      new Response(JSON.stringify(data), {
        status,
        headers: { 'Content-Type': 'application/json' },
      }),
    ),
  );
}

function mockFetchError(status: number): void {
  vi.stubGlobal(
    'fetch',
    vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ error: 'Error' }), {
        status,
        headers: { 'Content-Type': 'application/json' },
      }),
    ),
  );
}

describe('AnnouncementFormDialog', () => {
  beforeEach(() => {
    setTestAuth({ isManager: true });
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it('renders create dialog with correct title', () => {
    mockFetch();
    renderWithProviders(<AnnouncementFormDialog open={true} onOpenChange={vi.fn()} />);
    expect(screen.getByText('Uusi tiedote')).toBeInTheDocument();
    expect(screen.getByText('Luo uusi tiedote taloyhtiölle')).toBeInTheDocument();
  });

  it('renders edit dialog with correct title', () => {
    mockFetch();
    renderWithProviders(
      <AnnouncementFormDialog open={true} onOpenChange={vi.fn()} announcement={mockAnnouncement} />,
    );
    expect(screen.getByText('Muokkaa tiedotetta')).toBeInTheDocument();
    expect(screen.getByText('Muokkaa tiedotteen tietoja')).toBeInTheDocument();
  });

  it('renders all form fields', () => {
    mockFetch();
    renderWithProviders(<AnnouncementFormDialog open={true} onOpenChange={vi.fn()} />);
    expect(screen.getByLabelText('Otsikko')).toBeInTheDocument();
    expect(screen.getByText('Kategoria')).toBeInTheDocument();
    expect(screen.getByLabelText('Yhteenveto')).toBeInTheDocument();
    expect(screen.getByLabelText('Sisältö')).toBeInTheDocument();
  });

  it('shows create submit button text', () => {
    mockFetch();
    renderWithProviders(<AnnouncementFormDialog open={true} onOpenChange={vi.fn()} />);
    expect(screen.getByRole('button', { name: 'Julkaise' })).toBeInTheDocument();
  });

  it('shows edit submit button text', () => {
    mockFetch();
    renderWithProviders(
      <AnnouncementFormDialog open={true} onOpenChange={vi.fn()} announcement={mockAnnouncement} />,
    );
    expect(screen.getByRole('button', { name: 'Tallenna' })).toBeInTheDocument();
  });

  it('prefills form with announcement data in edit mode', () => {
    mockFetch();
    renderWithProviders(
      <AnnouncementFormDialog open={true} onOpenChange={vi.fn()} announcement={mockAnnouncement} />,
    );
    expect(screen.getByLabelText('Otsikko')).toHaveValue('Testivedote');
    expect(screen.getByLabelText('Yhteenveto')).toHaveValue('Yhteenveto testille');
    expect(screen.getByLabelText('Sisältö')).toHaveValue('Tämä on testisisältö.');
  });

  it('shows validation error for missing title', async () => {
    mockFetch();
    const user = userEvent.setup();
    renderWithProviders(<AnnouncementFormDialog open={true} onOpenChange={vi.fn()} />);

    await user.click(screen.getByRole('button', { name: 'Julkaise' }));

    expect(screen.getByText('Otsikko on pakollinen')).toBeInTheDocument();
  });

  it('shows validation error for missing summary and content', async () => {
    mockFetch();
    const user = userEvent.setup();
    renderWithProviders(<AnnouncementFormDialog open={true} onOpenChange={vi.fn()} />);

    await user.paste('Testivedote');

    await user.click(screen.getByRole('button', { name: 'Julkaise' }));

    expect(screen.getByText('Yhteenveto on pakollinen')).toBeInTheDocument();
    expect(screen.getByText('Sisältö on pakollinen')).toBeInTheDocument();
  });

  it('submits create form and calls API', async () => {
    const created = {
      ...mockAnnouncement,
      id: 'new-1',
    };
    mockFetch(created, 201);
    const onOpenChange = vi.fn();
    const user = userEvent.setup();

    renderWithProviders(<AnnouncementFormDialog open={true} onOpenChange={onOpenChange} />);

    const titleInput = screen.getByLabelText('Otsikko');
    const summaryInput = screen.getByLabelText('Yhteenveto');
    const contentInput = screen.getByLabelText('Sisältö');

    await user.click(titleInput);
    await user.paste('Uusi tiedote');

    await user.click(summaryInput);
    await user.paste('Yhteenveto');

    await user.click(contentInput);
    await user.paste('Sisältö tässä');

    await user.click(screen.getByRole('button', { name: 'Julkaise' }));

    await waitFor(() => {
      const calls = (fetch as ReturnType<typeof vi.fn>).mock.calls;
      const postCall = calls.find(
        (call: unknown[]) => (call[1] as RequestInit | undefined)?.method === 'POST',
      );
      expect(postCall).toBeDefined();
    });
  });

  it('shows error on API failure', async () => {
    mockFetchError(500);
    const user = userEvent.setup();

    renderWithProviders(<AnnouncementFormDialog open={true} onOpenChange={vi.fn()} />);

    const titleInput = screen.getByLabelText('Otsikko');
    const summaryInput = screen.getByLabelText('Yhteenveto');
    const contentInput = screen.getByLabelText('Sisältö');

    await user.click(titleInput);
    await user.paste('Uusi tiedote');

    await user.click(summaryInput);
    await user.paste('Yhteenveto');

    await user.click(contentInput);
    await user.paste('Sisältö tässä');

    await user.click(screen.getByRole('button', { name: 'Julkaise' }));

    await waitFor(() => {
      expect(fetch).toHaveBeenCalled();
    });
  });

  it('does not render when closed', () => {
    mockFetch();
    renderWithProviders(<AnnouncementFormDialog open={false} onOpenChange={vi.fn()} />);
    expect(screen.queryByText('Uusi tiedote')).not.toBeInTheDocument();
  });
});
