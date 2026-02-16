import { cn } from '@/lib/utils';

interface LoadingSpinnerProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

const sizeClasses = {
  sm: 'size-4 border-2',
  md: 'size-8 border-3',
  lg: 'size-12 border-4',
} as const;

export function LoadingSpinner({ className, size = 'md' }: LoadingSpinnerProps): React.JSX.Element {
  return (
    <div className={cn('flex items-center justify-center', className)}>
      <div
        className={cn(
          'animate-spin rounded-full border-muted border-t-hb-accent',
          sizeClasses[size],
        )}
        role="status"
        aria-label="Loading"
      />
    </div>
  );
}
