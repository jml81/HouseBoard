import { useState } from 'react';
import { Link, useLocation } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';
import {
  Home,
  Calendar,
  Megaphone,
  PartyPopper,
  MoreHorizontal,
  FolderOpen,
  ShoppingBag,
  FileText,
  Users,
  Building2,
  Contact,
  UserCog,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/stores/auth-store';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet';
import { Separator } from '@/components/ui/separator';

interface MobileNavItem {
  to: string;
  labelKey: string;
  icon: React.ElementType;
}

const mainNavItems: MobileNavItem[] = [
  { to: '/', labelKey: 'nav.dashboard', icon: Home },
  { to: '/kalenteri', labelKey: 'nav.calendar', icon: Calendar },
  { to: '/tiedotteet', labelKey: 'nav.announcements', icon: Megaphone },
  { to: '/tapahtumat', labelKey: 'nav.events', icon: PartyPopper },
];

const moreNavItems: MobileNavItem[] = [
  { to: '/materiaalit', labelKey: 'nav.materials', icon: FolderOpen },
  { to: '/kirpputori', labelKey: 'nav.marketplace', icon: ShoppingBag },
];

const plusNavItems: MobileNavItem[] = [
  { to: '/plus/kokoukset', labelKey: 'nav_plus.meetings', icon: FileText },
  { to: '/plus/hallitus', labelKey: 'nav_plus.board', icon: Users },
  { to: '/plus/huoneistot', labelKey: 'nav_plus.apartments', icon: Building2 },
  { to: '/plus/yhteystiedot', labelKey: 'nav_plus.contacts', icon: Contact },
  { to: '/plus/kayttajat', labelKey: 'nav_plus.users', icon: UserCog },
];

export function MobileNav(): React.JSX.Element {
  const { t } = useTranslation();
  const location = useLocation();
  const isManager = useAuthStore((s) => s.isManager);
  const [sheetOpen, setSheetOpen] = useState(false);

  return (
    <>
      <nav className="fixed inset-x-0 bottom-0 z-50 border-t border-border bg-background md:hidden">
        <div className="flex h-16 items-center justify-around">
          {mainNavItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              item.to === '/' ? location.pathname === '/' : location.pathname.startsWith(item.to);

            return (
              <Link
                key={item.to}
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

          <button
            type="button"
            onClick={() => setSheetOpen(true)}
            className="flex flex-col items-center gap-1 px-3 py-2 text-xs font-medium text-muted-foreground transition-colors"
          >
            <MoreHorizontal className="size-5" />
            <span>{t('nav.more')}</span>
          </button>
        </div>
      </nav>

      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent side="bottom" className="max-h-[70vh]">
          <SheetHeader>
            <SheetTitle>{t('nav.more')}</SheetTitle>
            <SheetDescription className="sr-only">{t('nav.more')}</SheetDescription>
          </SheetHeader>
          <nav className="flex flex-col gap-1 px-4 pb-4">
            {moreNavItems.map((item) => (
              <SheetNavLink
                key={item.to}
                item={item}
                isActive={location.pathname.startsWith(item.to)}
                t={t}
                onNavigate={() => setSheetOpen(false)}
              />
            ))}

            {isManager && (
              <>
                <Separator className="my-2" />
                <p className="px-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  HouseBoard+
                </p>
                {plusNavItems.map((item) => (
                  <SheetNavLink
                    key={item.to}
                    item={item}
                    isActive={location.pathname === item.to}
                    isPlus
                    t={t}
                    onNavigate={() => setSheetOpen(false)}
                  />
                ))}
              </>
            )}
          </nav>
        </SheetContent>
      </Sheet>
    </>
  );
}

interface SheetNavLinkProps {
  item: MobileNavItem;
  isActive: boolean;
  isPlus?: boolean;
  t: (key: string) => string;
  onNavigate: () => void;
}

function SheetNavLink({
  item,
  isActive,
  isPlus,
  t,
  onNavigate,
}: SheetNavLinkProps): React.JSX.Element {
  const Icon = item.icon;

  return (
    <Link
      to={item.to}
      onClick={onNavigate}
      className={cn(
        'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
        isActive && isPlus
          ? 'bg-hbplus-accent-light text-hb-primary'
          : isActive
            ? 'bg-hb-accent-light text-hb-primary'
            : 'text-foreground hover:bg-muted',
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
