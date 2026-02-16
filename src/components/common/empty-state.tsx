import type { ReactNode } from 'react';
import { Inbox } from 'lucide-react';
import { cn } from '@/lib/utils';

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}

export function EmptyState({
  icon,
  title,
  description,
  action,
  className,
}: EmptyStateProps): React.JSX.Element {
  return (
    <div className={cn('flex flex-col items-center justify-center gap-4 p-8', className)}>
      <div className="flex size-16 items-center justify-center rounded-full bg-muted">
        {icon ?? <Inbox className="size-8 text-muted-foreground" />}
      </div>
      <h3 className="text-lg font-semibold text-hb-primary">{title}</h3>
      {description && (
        <p className="max-w-sm text-center text-sm text-muted-foreground">{description}</p>
      )}
      {action && <div className="mt-2">{action}</div>}
    </div>
  );
}
