import type { ReactNode } from 'react';
import { render } from '@testing-library/react';
import type { RenderOptions, RenderResult } from '@testing-library/react';
import { I18nextProvider } from 'react-i18next';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
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
        auth: {
          managerToggle: 'Isännöitsijätila',
          managerModeOn: 'Isännöitsijätila päällä',
          managerModeOff: 'Isännöitsijätila pois',
        },
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
        meetings: {
          title: 'Kokoukset',
          description: 'Taloyhtiön kokoukset ja pöytäkirjat',
          upcoming: 'Tulevat',
          past: 'Menneet',
          documents: 'Asiakirjat',
          noUpcoming: 'Ei tulevia kokouksia',
          noPast: 'Ei menneitä kokouksia',
          showDocuments: 'Näytä asiakirjat',
          hideDocuments: 'Piilota asiakirjat',
        },
        board: {
          title: 'Hallitus',
          description: 'Taloyhtiön hallituksen jäsenet',
          term: 'Toimikausi',
          noMembers: 'Ei hallituksen jäseniä',
        },
        apartments: {
          title: 'Huoneistot',
          description: 'Taloyhtiön huoneistoluettelo',
          search: 'Hae huoneistoa tai asukasta...',
          allStaircases: 'Kaikki',
          staircase: 'Rappukäytävä',
          number: 'Huoneisto',
          type: 'Tyyppi',
          area: 'Pinta-ala',
          shares: 'Osakkeet',
          resident: 'Asukas',
          total: 'yhteensä',
          noResults: 'Ei hakutuloksia',
          listView: 'Luettelo',
          paymentsView: 'Vastikkeet',
          payments: {
            title: 'Vastiketiedot',
            monthlyCharge: 'Kuukausivastike',
            status: 'Tila',
            lastPayment: 'Viimeisin maksu',
            arrears: 'Rästit',
            noArrears: 'Ei rästejä',
            paid: 'Maksettu',
            pending: 'Odottaa',
            overdue: 'Myöhässä',
            breakdown: 'Erittely',
            hoitovastike: 'Hoitovastike',
            rahoitusvastike: 'Rahoitusvastike',
            vesimaksu: 'Vesimaksu',
            totalArrears: 'Rästit yhteensä',
            summary: 'Yhteenveto',
            paidCount: 'Maksettu',
            pendingCount: 'Odottaa',
            overdueCount: 'Myöhässä',
            perMonth: '/kk',
          },
        },
        contacts: {
          title: 'Yhteystiedot',
          description: 'Taloyhtiön tärkeät yhteystiedot',
          noContacts: 'Ei yhteystietoja',
        },
        meetingTypes: {
          yhtiokokous: 'Yhtiökokous',
          'ylimaarainen-yhtiokokous': 'Ylim. yhtiökokous',
          'hallituksen-kokous': 'Hallituksen kokous',
        },
        boardRoles: {
          puheenjohtaja: 'Puheenjohtaja',
          varapuheenjohtaja: 'Varapuheenjohtaja',
          jasen: 'Jäsen',
          varajasen: 'Varajäsen',
        },
        contactRoles: {
          isannoitsija: 'Isännöitsijä',
          huolto: 'Huolto',
          hallitus: 'Hallitus',
          siivous: 'Siivous',
          muu: 'Muut',
        },
        marketplace: {
          title: 'Kirpputori',
          description: 'Taloyhtiön asukkaiden kirpputori',
          sell: 'Myy',
          search: 'Hae tuotetta...',
          total: 'tuotetta',
          noResults: 'Ei hakutuloksia',
          price: 'Hinta',
          free: 'Ilmainen',
          condition: 'Kunto',
          seller: 'Myyjä',
          apartment: 'Huoneisto',
          publishedAt: 'Julkaistu',
          backToList: 'Takaisin kirpputorille',
          contact: 'Ota yhteyttä',
          createTitle: 'Myy tuote',
          createDescription: 'Lisää uusi tuote kirpputorille',
          itemTitle: 'Otsikko',
          itemDescription: 'Kuvaus',
          itemPrice: 'Hinta (€)',
          itemCategory: 'Kategoria',
          itemCondition: 'Kunto',
          submit: 'Julkaise',
          pricePlaceholder: '0',
          createSuccess: 'Tuote lisätty kirpputorille!',
          createError: 'Tuotteen lisääminen epäonnistui',
          deleteSuccess: 'Tuote poistettu',
          deleteError: 'Tuotteen poistaminen epäonnistui',
          deleteConfirm: 'Haluatko varmasti poistaa tämän tuotteen? Toimintoa ei voi perua.',
          deleteItem: 'Poista tuote',
          statusUpdateSuccess: 'Tila päivitetty',
          statusUpdateError: 'Tilan päivittäminen epäonnistui',
          markSold: 'Merkitse myydyksi',
          markReserved: 'Merkitse varatuksi',
          markAvailable: 'Merkitse myyntiin',
          validationTitleRequired: 'Otsikko on pakollinen',
          validationDescriptionRequired: 'Kuvaus on pakollinen',
          validationPriceInvalid: 'Hinnan pitää olla vähintään 0',
        },
        marketplaceCategories: {
          huonekalu: 'Huonekalu',
          elektroniikka: 'Elektroniikka',
          vaatteet: 'Vaatteet',
          urheilu: 'Urheilu',
          kirjat: 'Kirjat',
          muu: 'Muu',
        },
        itemConditions: {
          uusi: 'Uusi',
          hyva: 'Hyvä',
          kohtalainen: 'Kohtalainen',
          tyydyttava: 'Tyydyttävä',
        },
        itemStatuses: {
          available: 'Myynnissä',
          sold: 'Myyty',
          reserved: 'Varattu',
        },
        display: {
          title: 'Näyttötila',
          bookingsTitle: 'Tämän päivän varaukset',
          announcementsTitle: 'Ajankohtaista',
          eventsTitle: 'Tulevat tapahtumat',
          buildingInfoTitle: 'Taloyhtiön tiedot',
          noBookings: 'Ei varauksia tänään',
          noAnnouncements: 'Ei tiedotteita',
          noEvents: 'Ei tulevia tapahtumia',
          address: 'Osoite',
          apartments: 'Huoneistoja',
          buildYear: 'Rakennusvuosi',
          management: 'Isännöinti',
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

function createTestQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        gcTime: 0,
      },
    },
  });
}

function AllProviders({ children }: { children: ReactNode }): React.JSX.Element {
  const queryClient = createTestQueryClient();
  return (
    <QueryClientProvider client={queryClient}>
      <I18nextProvider i18n={testI18n}>
        <TooltipProvider>{children}</TooltipProvider>
      </I18nextProvider>
    </QueryClientProvider>
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

  const queryClient = createTestQueryClient();

  return render(
    <QueryClientProvider client={queryClient}>
      <I18nextProvider i18n={testI18n}>
        <TooltipProvider>
          {/* eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-assignment */}
          <RouterProvider router={testRouter as any} />
        </TooltipProvider>
      </I18nextProvider>
    </QueryClientProvider>,
    options,
  );
}

export function renderWithRouter(initialPath = '/'): RenderResult {
  const memoryHistory = createMemoryHistory({ initialEntries: [initialPath] });
  const router = createRouter({ routeTree, history: memoryHistory });
  const queryClient = createTestQueryClient();

  return render(
    <QueryClientProvider client={queryClient}>
      <I18nextProvider i18n={testI18n}>
        <TooltipProvider>
          <RouterProvider router={router} />
        </TooltipProvider>
      </I18nextProvider>
    </QueryClientProvider>,
  );
}
