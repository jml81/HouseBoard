import { useTranslation } from 'react-i18next';
import { Bell, Globe, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Logo } from '@/components/brand/logo';
import { Separator } from '@/components/ui/separator';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useUiStore } from '@/stores/ui-store';
import { i18n } from '@/i18n/config';

export function Header(): React.JSX.Element {
  const { t } = useTranslation();
  const toggleSidebar = useUiStore((s) => s.toggleSidebar);

  const handleLanguageChange = (lng: 'fi' | 'en'): void => {
    void i18n.changeLanguage(lng);
    useUiStore.getState().setLocale(lng);
  };

  return (
    <header className="flex h-16 shrink-0 items-center border-b border-border bg-background">
      {/* Mobile: hamburger + logo */}
      <div className="flex items-center gap-2 px-4 md:hidden">
        <Button variant="ghost" size="icon" onClick={toggleSidebar} aria-label="Menu">
          <Menu className="size-5" />
        </Button>
        <Logo size="sm" />
      </div>

      {/* Desktop: spacer */}
      <div className="hidden flex-1 md:block" />

      {/* Right side actions */}
      <div className="ml-auto flex items-center gap-1 px-4">
        {/* Language switcher */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" aria-label={t('language.switch')}>
              <Globe className="size-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => handleLanguageChange('fi')}>
              {t('language.fi')}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleLanguageChange('en')}>
              {t('language.en')}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Notifications */}
        <Button variant="ghost" size="icon" aria-label="Notifications">
          <Bell className="size-5" />
        </Button>

        <Separator orientation="vertical" className="mx-1 h-6" />

        {/* User avatar */}
        <Avatar className="size-8">
          <AvatarFallback className="bg-hb-accent-light text-sm font-medium text-hb-primary">
            A
          </AvatarFallback>
        </Avatar>
      </div>
    </header>
  );
}
