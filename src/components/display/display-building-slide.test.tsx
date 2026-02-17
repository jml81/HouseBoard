import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { screen } from '@testing-library/react';
import { renderWithProviders } from '@/test-utils';
import { DisplayBuildingSlide } from './display-building-slide';

const mockBuilding = {
  name: 'As Oy Mäntyrinne',
  address: 'Mäntypolku 5',
  postalCode: '00320',
  city: 'Helsinki',
  apartments: 24,
  buildYear: 1985,
  managementCompany: 'Realia Isännöinti Oy',
};

function okJson(data: unknown): Response {
  return new Response(JSON.stringify(data), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}

describe('DisplayBuildingSlide', () => {
  beforeEach(() => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockImplementation(() => Promise.resolve(okJson(mockBuilding))),
    );
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it('renders building name', async () => {
    renderWithProviders(<DisplayBuildingSlide />);
    expect(await screen.findByText('As Oy Mäntyrinne')).toBeInTheDocument();
  });

  it('renders address', async () => {
    renderWithProviders(<DisplayBuildingSlide />);
    await screen.findByText('As Oy Mäntyrinne');
    expect(screen.getByText(/Mäntypolku 5/)).toBeInTheDocument();
  });

  it('renders apartment count', async () => {
    renderWithProviders(<DisplayBuildingSlide />);
    await screen.findByText('As Oy Mäntyrinne');
    expect(screen.getByText('24')).toBeInTheDocument();
  });
});
