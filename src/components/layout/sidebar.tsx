import { Link, useLocation } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';
import {
  LayoutDashboard,
  Calendar,
  Megaphone,
  PartyPopper,
  FolderOpen,
  ShoppingBag,
  Users,
  Building2,
  Contact,
  FileText,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Logo } from '@/components/brand/logo';
import { Separator } from '@/components/ui/separator';
import { useAuthStore } from '@/stores/auth-store';

interface NavItem {
  to: string;
  labelKey: string;
  icon: React.ElementType;
}

const mainNavItems: NavItem[] = [
  { to: '/', labelKey: 'nav.dashboard', icon: LayoutDashboard },
  { to: '/kalenteri', labelKey: 'nav.calendar', icon: Calendar },
  { to: '/tiedotteet', labelKey: 'nav.announcements', icon: Megaphone },
  { to: '/tapahtumat', labelKey: 'nav.events', icon: PartyPopper },
  { to: '/materiaalit', labelKey: 'nav.materials', icon: FolderOpen },
  { to: '/kirpputori', labelKey: 'nav.marketplace', icon: ShoppingBag },
];

const plusNavItems: NavItem[] = [
  { to: '/plus/kokoukset', labelKey: 'nav_plus.meetings', icon: FileText },
  { to: '/plus/hallitus', labelKey: 'nav_plus.board', icon: Users },
  { to: '/plus/huoneistot', labelKey: 'nav_plus.apartments', icon: Building2 },
  { to: '/plus/yhteystiedot', labelKey: 'nav_plus.contacts', icon: Contact },
];

export function Sidebar(): React.JSX.Element {
  const { t } = useTranslation();
  const location = useLocation();
  const isManager = useAuthStore((s) => s.isManager);
  const isPlus = location.pathname.startsWith('/plus');

  return (
    <aside className="hidden w-64 shrink-0 border-r border-sidebar-border bg-sidebar md:flex md:flex-col">
      <div className="flex h-16 items-center px-6">
        <Link to="/">
          <Logo size="md" variant={isPlus ? 'plus' : 'default'} />
        </Link>
      </div>

      <Separator />

      <nav className="flex flex-1 flex-col gap-1 overflow-y-auto p-3">
        <div className="mb-1 px-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">
          HouseBoard
        </div>
        {mainNavItems.map((item) => (
          <NavLink
            key={item.to}
            item={item}
            isActive={
              item.to === '/' ? location.pathname === '/' : location.pathname.startsWith(item.to)
            }
            t={t}
          />
        ))}

        {isManager && (
          <>
            <Separator className="my-3" />

            <div className="mb-1 px-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">
              HouseBoard+
            </div>
            {plusNavItems.map((item) => (
              <NavLink
                key={item.to}
                item={item}
                isActive={location.pathname === item.to}
                isPlus
                t={t}
              />
            ))}
          </>
        )}
      </nav>
    </aside>
  );
}

interface NavLinkProps {
  item: NavItem;
  isActive: boolean;
  isPlus?: boolean;
  t: (key: string) => string;
}

function NavLink({ item, isActive, isPlus, t }: NavLinkProps): React.JSX.Element {
  const Icon = item.icon;

  return (
    <Link
      to={item.to}
      className={cn(
        'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
        isActive && isPlus
          ? 'bg-hbplus-accent-light text-hb-primary'
          : isActive
            ? 'bg-hb-accent-light text-hb-primary'
            : 'text-sidebar-foreground hover:bg-sidebar-accent',
      )}
    >
      <Icon
        className={cn(
          'size-5',
          isActive && isPlus
            ? 'text-hbplus-accent'
            : isActive
              ? 'text-hb-accent'
              : 'text-muted-foreground',
        )}
      />
      {t(item.labelKey)}
    </Link>
  );
}
