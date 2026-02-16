import type { ReactNode } from 'react';
import { render } from '@testing-library/react';
import type { RenderOptions, RenderResult } from '@testing-library/react';
import { I18nextProvider } from 'react-i18next';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { TooltipProvider } from '@/components/ui/tooltip';
import {
  createMemoryHistory,
  createRootRoute,
  createRouter,
  RouterProvider,
} from '@tanstack/react-router';
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
          dashboard: 'Koti',
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
          back: 'Takaisin',
          save: 'Tallenna',
          cancel: 'Peruuta',
          delete: 'Poista',
          edit: 'Muokkaa',
          search: 'Hae',
          noResults: 'Ei tuloksia',
          comingSoon: 'Tulossa pian',
          comingSoonDescription: 'Tämä ominaisuus on vielä kehityksessä.',
          showAll: 'Näytä kaikki',
          new: 'Uusi',
          readMore: 'Lue lisää',
          download: 'Lataa',
          all: 'Kaikki',
        },
        language: { fi: 'Suomi', en: 'English', switch: 'Vaihda kieli' },
        dashboard: {
          welcome: 'Tervetuloa!',
          building: 'Taloyhtiö',
          upcomingBookings: 'Tulevat varaukset',
          latestAnnouncements: 'Viimeisimmät tiedotteet',
          upcomingEvents: 'Tulevat tapahtumat',
          recentMaterials: 'Uusimmat materiaalit',
          noBookings: 'Ei tulevia varauksia',
          noAnnouncements: 'Ei tiedotteita',
          noEvents: 'Ei tulevia tapahtumia',
          noMaterials: 'Ei materiaaleja',
        },
        calendar: {
          title: 'Kalenteri',
          description: 'Varaa sauna, pesutupa tai kerhohuone',
          monthView: 'Kuukausi',
          listView: 'Lista',
          filter: 'Suodata',
          time: 'Aika',
          location: 'Paikka',
          booker: 'Varaaja',
          apartment: 'Huoneisto',
          noBookings: 'Ei varauksia',
        },
        announcements: {
          title: 'Tiedotteet',
          description: 'Taloyhtiön tiedotteet ja ilmoitukset',
          readMore: 'Lue lisää',
          publishedAt: 'Julkaistu',
          author: 'Kirjoittaja',
          backToList: 'Takaisin tiedotteisiin',
        },
        events: {
          title: 'Tapahtumat',
          description: 'Taloyhtiön tapahtumat ja kokoukset',
          upcoming: 'Tulevat',
          past: 'Menneet',
          interested: 'kiinnostunutta',
          organizer: 'Järjestäjä',
          noUpcoming: 'Ei tulevia tapahtumia',
          noPast: 'Ei menneitä tapahtumia',
        },
        materials: {
          title: 'Materiaalit',
          description: 'Taloyhtiön asiakirjat ja dokumentit',
          download: 'Lataa',
          fileSize: 'Koko',
          updated: 'Päivitetty',
          noMaterials: 'Ei materiaaleja',
        },
        categories: {
          sauna: 'Sauna',
          pesutupa: 'Pesutupa',
          kerhohuone: 'Kerhohuone',
          talkoot: 'Talkoot',
          yleinen: 'Yleinen',
          huolto: 'Huolto',
          remontti: 'Remontti',
          'vesi-sahko': 'Vesi & sähkö',
          saannot: 'Säännöt',
          kokoukset: 'Kokoukset',
          talous: 'Talous',
          kunnossapito: 'Kunnossapito',
          muut: 'Muut',
        },
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

export async function renderWithRouterContext(
  ui: React.ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>,
): Promise<RenderResult> {
  const rootRoute = createRootRoute({ component: () => ui });
  const testRouter = createRouter({
    routeTree: rootRoute,
    history: createMemoryHistory({ initialEntries: ['/'] }),
  });

  await testRouter.load();

  return render(
    <I18nextProvider i18n={testI18n}>
      <TooltipProvider>
        {/* eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-assignment */}
        <RouterProvider router={testRouter as any} />
      </TooltipProvider>
    </I18nextProvider>,
    options,
  );
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
