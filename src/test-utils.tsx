import type { ReactNode } from 'react';
import { render } from '@testing-library/react';
import type { RenderOptions, RenderResult } from '@testing-library/react';
import { I18nextProvider } from 'react-i18next';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { TooltipProvider } from '@/components/ui/tooltip';
import { createMemoryHistory, createRouter, RouterProvider } from '@tanstack/react-router';
import { routeTree } from './route-tree.gen';

// Initialize test i18n instance
const testI18n = i18n.createInstance();
void testI18n.use(initReactI18next).init({
  lng: 'fi',
  fallbackLng: 'fi',
  ns: ['common'],
  defaultNS: 'common',
  resources: {
    fi: {
      common: {
        app: { name: 'HouseBoard', slogan: 'Kaikki taloyhtiösi asiat kätesi ulottuvilla!' },
        nav: {
          home: 'Koti',
          calendar: 'Kalenteri',
          announcements: 'Tiedotteet',
          events: 'Tapahtumat',
          materials: 'Materiaalit',
          marketplace: 'Kirpputori',
          more: 'Lisää',
        },
        nav_plus: {
          title: 'HouseBoard+',
          meetings: 'Kokoukset',
          board: 'Hallitus',
          apartments: 'Huoneistot',
          contacts: 'Yhteystiedot',
        },
        common: {
          loading: 'Ladataan...',
          error: 'Tapahtui virhe',
          retry: 'Yritä uudelleen',
          comingSoon: 'Tulossa pian',
          comingSoonDescription: 'Tämä ominaisuus on vielä kehityksessä.',
        },
        language: { fi: 'Suomi', en: 'English', switch: 'Vaihda kieli' },
      },
    },
  },
  interpolation: { escapeValue: false },
});

export { testI18n };

function AllProviders({ children }: { children: ReactNode }): React.JSX.Element {
  return (
    <I18nextProvider i18n={testI18n}>
      <TooltipProvider>{children}</TooltipProvider>
    </I18nextProvider>
  );
}

export function renderWithProviders(
  ui: React.ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>,
): RenderResult {
  return render(ui, { wrapper: AllProviders, ...options });
}

export function renderWithRouter(initialPath = '/'): RenderResult {
  const memoryHistory = createMemoryHistory({ initialEntries: [initialPath] });
  const router = createRouter({ routeTree, history: memoryHistory });

  return render(
    <I18nextProvider i18n={testI18n}>
      <TooltipProvider>
        <RouterProvider router={router} />
      </TooltipProvider>
    </I18nextProvider>,
  );
}
