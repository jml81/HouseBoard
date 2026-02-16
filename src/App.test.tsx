import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import App from './App';

describe('App', () => {
  it('renders the HouseBoard heading', () => {
    render(<App />);
    expect(screen.getByText('HouseBoard')).toBeInTheDocument();
  });

  it('renders the tagline', () => {
    render(<App />);
    expect(screen.getByText('Kaikki taloyhtiösi asiat kätesi ulottuvilla!')).toBeInTheDocument();
  });
});
