import type { Meeting } from '@/types';

export const meetings: Meeting[] = [
  {
    id: 'm1',
    title: 'Varsinainen yhtiökokous 2026',
    type: 'yhtiokokous',
    status: 'upcoming',
    date: '2026-03-25',
    startTime: '18:00',
    endTime: '20:00',
    location: 'Kerhohuone',
    description:
      'Varsinainen yhtiökokous. Esityslistalla tilinpäätös 2025, talousarvio 2026, hallituksen valinta ja putkiremontin rahoituspäätös.',
    documents: [
      { id: 'd1', name: 'Kokouskutsu', fileType: 'pdf', fileSize: '245 KB', fileUrl: null },
      { id: 'd2', name: 'Tilinpäätös 2025', fileType: 'pdf', fileSize: '1.8 MB', fileUrl: null },
      { id: 'd3', name: 'Talousarvio 2026', fileType: 'xlsx', fileSize: '340 KB', fileUrl: null },
    ],
  },
  {
    id: 'm2',
    title: 'Hallituksen kokous 3/2026',
    type: 'hallituksen-kokous',
    status: 'upcoming',
    date: '2026-03-10',
    startTime: '18:00',
    endTime: '19:30',
    location: 'Kerhohuone',
    description:
      'Hallituksen kuukausikokous. Aiheina putkiremontin valmistelu, talousarvion seuranta ja piha-alueen kunnostus.',
    documents: [
      { id: 'd4', name: 'Esityslista', fileType: 'pdf', fileSize: '120 KB', fileUrl: null },
    ],
  },
  {
    id: 'm3',
    title: 'Hallituksen kokous 2/2026',
    type: 'hallituksen-kokous',
    status: 'completed',
    date: '2026-02-10',
    startTime: '18:00',
    endTime: '19:30',
    location: 'Kerhohuone',
    description:
      'Hallituksen kuukausikokous. Käsiteltiin putkiremontin tarjoukset ja valittiin urakoitsija.',
    documents: [
      { id: 'd5', name: 'Esityslista', fileType: 'pdf', fileSize: '115 KB', fileUrl: null },
      { id: 'd6', name: 'Pöytäkirja', fileType: 'pdf', fileSize: '280 KB', fileUrl: null },
    ],
  },
  {
    id: 'm4',
    title: 'Hallituksen kokous 1/2026',
    type: 'hallituksen-kokous',
    status: 'completed',
    date: '2026-01-13',
    startTime: '18:00',
    endTime: '19:30',
    location: 'Kerhohuone',
    description:
      'Vuoden ensimmäinen hallituksen kokous. Käsiteltiin talousarvion toteutuma ja piha-alueen suunnitelmat.',
    documents: [
      { id: 'd7', name: 'Esityslista', fileType: 'pdf', fileSize: '110 KB', fileUrl: null },
      { id: 'd8', name: 'Pöytäkirja', fileType: 'pdf', fileSize: '260 KB', fileUrl: null },
    ],
  },
  {
    id: 'm5',
    title: 'Ylimääräinen yhtiökokous',
    type: 'ylimaarainen-yhtiokokous',
    status: 'completed',
    date: '2025-11-15',
    startTime: '18:00',
    endTime: '19:30',
    location: 'Kerhohuone',
    description:
      'Ylimääräinen yhtiökokous putkiremontin käynnistämiseksi. Päätettiin remontin laajuudesta ja aikataulusta.',
    documents: [
      { id: 'd9', name: 'Kokouskutsu', fileType: 'pdf', fileSize: '200 KB', fileUrl: null },
      { id: 'd10', name: 'Pöytäkirja', fileType: 'pdf', fileSize: '350 KB', fileUrl: null },
      {
        id: 'd11',
        name: 'Putkiremontin tarjoukset',
        fileType: 'xlsx',
        fileSize: '890 KB',
        fileUrl: null,
      },
    ],
  },
  {
    id: 'm6',
    title: 'Varsinainen yhtiökokous 2025',
    type: 'yhtiokokous',
    status: 'completed',
    date: '2025-03-27',
    startTime: '18:00',
    endTime: '20:30',
    location: 'Kerhohuone',
    description:
      'Varsinainen yhtiökokous 2025. Vahvistettiin tilinpäätös, valittiin hallitus ja päätettiin yhtiövastikkeista.',
    documents: [
      { id: 'd12', name: 'Kokouskutsu', fileType: 'pdf', fileSize: '230 KB', fileUrl: null },
      { id: 'd13', name: 'Pöytäkirja', fileType: 'pdf', fileSize: '420 KB', fileUrl: null },
      { id: 'd14', name: 'Tilinpäätös 2024', fileType: 'pdf', fileSize: '1.6 MB', fileUrl: null },
    ],
  },
];
