import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { ErrorBoundary } from '@/components/common/error-boundary';

let shouldThrow = true;

function ConditionalThrow(): React.JSX.Element {
  if (shouldThrow) {
    throw new Error('Test error');
  }
  return <div>Working content</div>;
}

function WorkingComponent(): React.JSX.Element {
  return <div>Working content</div>;
}

describe('ErrorBoundary', () => {
  it('renders children when no error occurs', () => {
    render(
      <ErrorBoundary>
        <WorkingComponent />
      </ErrorBoundary>,
    );

    expect(screen.getByText('Working content')).toBeInTheDocument();
  });

  it('renders error UI when child throws', () => {
    vi.spyOn(console, 'error').mockImplementation(() => undefined);
    shouldThrow = true;

    render(
      <ErrorBoundary>
        <ConditionalThrow />
      </ErrorBoundary>,
    );

    expect(screen.getByText('Tapahtui virhe')).toBeInTheDocument();
    expect(screen.getByText('Yritä uudelleen')).toBeInTheDocument();

    vi.restoreAllMocks();
  });

  it('renders custom fallback when provided', () => {
    vi.spyOn(console, 'error').mockImplementation(() => undefined);
    shouldThrow = true;

    render(
      <ErrorBoundary fallback={<div>Custom error</div>}>
        <ConditionalThrow />
      </ErrorBoundary>,
    );

    expect(screen.getByText('Custom error')).toBeInTheDocument();

    vi.restoreAllMocks();
  });

  it('recovers after retry when error is resolved', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => undefined);
    const user = userEvent.setup();
    shouldThrow = true;

    render(
      <ErrorBoundary>
        <ConditionalThrow />
      </ErrorBoundary>,
    );

    expect(screen.getByText('Tapahtui virhe')).toBeInTheDocument();

    // Fix the condition before retrying
    shouldThrow = false;
    await user.click(screen.getByText('Yritä uudelleen'));

    expect(screen.getByText('Working content')).toBeInTheDocument();

    vi.restoreAllMocks();
  });
});
