import { Link, useLocation } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';
import { Home, Calendar, Megaphone, PartyPopper, MoreHorizontal } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MobileNavItem {
  to: string;
  labelKey: string;
  icon: React.ElementType;
}

const mobileNavItems: MobileNavItem[] = [
  { to: '/kalenteri', labelKey: 'nav.home', icon: Home },
  { to: '/kalenteri', labelKey: 'nav.calendar', icon: Calendar },
  { to: '/tiedotteet', labelKey: 'nav.announcements', icon: Megaphone },
  { to: '/tapahtumat', labelKey: 'nav.events', icon: PartyPopper },
  { to: '/materiaalit', labelKey: 'nav.more', icon: MoreHorizontal },
];

export function MobileNav(): React.JSX.Element {
  const { t } = useTranslation();
  const location = useLocation();

  return (
    <nav className="fixed inset-x-0 bottom-0 z-50 border-t border-border bg-background md:hidden">
      <div className="flex h-16 items-center justify-around">
        {mobileNavItems.map((item, index) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.to;

          return (
            <Link
              key={`${item.to}-${String(index)}`}
              to={item.to}
              className={cn(
                'flex flex-col items-center gap-1 px-3 py-2 text-xs font-medium transition-colors',
                isActive ? 'text-hb-accent' : 'text-muted-foreground',
              )}
            >
              <Icon className="size-5" />
              <span>{t(item.labelKey)}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
