import { describe, it, expect, vi, afterEach } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders, setTestAuth } from '@/test-utils';
import { useAuthStore } from '@/stores/auth-store';
import type { MeetingDocument } from '@/types';
import { MeetingDocumentList } from './meeting-document-list';

const mockDocuments: MeetingDocument[] = [
  {
    id: 'd1',
    name: 'Esityslista',
    fileType: 'pdf',
    fileSize: '120 KB',
    fileUrl: '/api/files/meetings/m1/d1.pdf',
  },
  { id: 'd2', name: 'Pöytäkirja', fileType: 'pdf', fileSize: '280 KB', fileUrl: null },
];

describe('MeetingDocumentList', () => {
  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
    useAuthStore.setState({
      isAuthenticated: false,
      isManager: false,
      user: null,
      token: null,
    });
  });

  it('renders document names and metadata', () => {
    renderWithProviders(<MeetingDocumentList meetingId="m1" documents={mockDocuments} />);
    expect(screen.getByText('Esityslista')).toBeInTheDocument();
    expect(screen.getByText('Pöytäkirja')).toBeInTheDocument();
    expect(screen.getByText(/120 KB/)).toBeInTheDocument();
    expect(screen.getByText(/280 KB/)).toBeInTheDocument();
  });

  it('renders download link when fileUrl present', () => {
    renderWithProviders(<MeetingDocumentList meetingId="m1" documents={mockDocuments} />);
    const links = screen.getAllByTitle('Lataa');
    // First doc has fileUrl → link, second has null → disabled button
    expect(links[0]?.closest('a')).toHaveAttribute('href', '/api/files/meetings/m1/d1.pdf');
  });

  it('renders disabled download button when no fileUrl', () => {
    const docsWithoutUrl: MeetingDocument[] = [
      { id: 'd2', name: 'Pöytäkirja', fileType: 'pdf', fileSize: '280 KB', fileUrl: null },
    ];
    renderWithProviders(<MeetingDocumentList meetingId="m1" documents={docsWithoutUrl} />);
    const downloadBtn = screen.getByTitle('Lataa');
    expect(downloadBtn).toBeDisabled();
  });

  it('shows upload input for manager', () => {
    setTestAuth({ isManager: true });
    renderWithProviders(<MeetingDocumentList meetingId="m1" documents={mockDocuments} />);
    expect(document.querySelector('input[type="file"]')).toBeInTheDocument();
  });

  it('does not show upload input for resident', () => {
    setTestAuth({ isManager: false });
    renderWithProviders(<MeetingDocumentList meetingId="m1" documents={mockDocuments} />);
    expect(document.querySelector('input[type="file"]')).not.toBeInTheDocument();
  });

  it('shows delete button for manager', () => {
    setTestAuth({ isManager: true });
    renderWithProviders(<MeetingDocumentList meetingId="m1" documents={mockDocuments} />);
    const deleteButtons = screen
      .getAllByRole('button')
      .filter((btn) => btn.querySelector('svg.lucide-trash-2'));
    expect(deleteButtons.length).toBeGreaterThanOrEqual(1);
  });

  it('does not show delete button for resident', () => {
    setTestAuth({ isManager: false });
    renderWithProviders(<MeetingDocumentList meetingId="m1" documents={mockDocuments} />);
    const deleteButtons = screen
      .getAllByRole('button')
      .filter((btn) => btn.querySelector('svg.lucide-trash-2'));
    expect(deleteButtons).toHaveLength(0);
  });

  it('opens delete confirmation dialog when delete button clicked', async () => {
    setTestAuth({ isManager: true });
    const user = userEvent.setup();
    renderWithProviders(<MeetingDocumentList meetingId="m1" documents={mockDocuments} />);

    const deleteButtons = screen
      .getAllByRole('button')
      .filter((btn) => btn.querySelector('svg.lucide-trash-2'));
    await user.click(deleteButtons[0]!);

    expect(
      await screen.findByText('Haluatko varmasti poistaa tämän asiakirjan?'),
    ).toBeInTheDocument();
  });

  it('calls delete API when confirming document deletion', async () => {
    setTestAuth({ isManager: true });
    const user = userEvent.setup();

    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(
        new Response(JSON.stringify({ success: true }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        }),
      ),
    );

    renderWithProviders(<MeetingDocumentList meetingId="m1" documents={mockDocuments} />);

    const deleteButtons = screen
      .getAllByRole('button')
      .filter((btn) => btn.querySelector('svg.lucide-trash-2'));
    await user.click(deleteButtons[0]!);

    await screen.findByText('Haluatko varmasti poistaa tämän asiakirjan?');
    await user.click(screen.getByRole('button', { name: 'Poista' }));

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(
        '/api/meetings/m1/documents/d1',
        expect.objectContaining({ method: 'DELETE' }),
      );
    });
  });
});
