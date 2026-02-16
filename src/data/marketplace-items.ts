import type { MarketplaceItem } from '@/types';

export const marketplaceItems: MarketplaceItem[] = [
  {
    id: 'mp1',
    title: 'Ikea Kallax -hylly, valkoinen',
    description:
      'Hyväkuntoinen Ikea Kallax 4x2 -hylly. Pari pientä naarmua sivussa. Mitat 147x77 cm. Noudettava 2. kerroksesta, B-rappu.',
    price: 40,
    category: 'huonekalu',
    condition: 'hyva',
    status: 'available',
    seller: { name: 'Minna Korhonen', apartment: 'B 12' },
    publishedAt: '2026-02-14',
  },
  {
    id: 'mp2',
    title: 'Samsung Galaxy Tab A9',
    description:
      'Vuoden vanha tabletti, alkuperäinen laturi ja suojakuori mukana. Akku kestää hyvin. Naarmuton näyttö.',
    price: 120,
    category: 'elektroniikka',
    condition: 'hyva',
    status: 'available',
    seller: { name: 'Jari Virtanen', apartment: 'A 3' },
    publishedAt: '2026-02-12',
  },
  {
    id: 'mp3',
    title: 'Naisten talvitakki, koko M',
    description:
      'Lämmin untuvakki, harmaa. Käytetty yhden talven. Ei rikkoutumia tai tahroja. Merkki: Luhta.',
    price: 35,
    category: 'vaatteet',
    condition: 'hyva',
    status: 'available',
    seller: { name: 'Liisa Mäkelä', apartment: 'C 22' },
    publishedAt: '2026-02-10',
  },
  {
    id: 'mp4',
    title: 'Polkupyörä 26"',
    description:
      'Toimiva kaupunkipyörä, 3 vaihdetta. Renkaat hyvässä kunnossa, vaihdevaijeri vaihdettu viime kesänä. Lukko mukana.',
    price: 60,
    category: 'urheilu',
    condition: 'kohtalainen',
    status: 'available',
    seller: { name: 'Timo Nieminen', apartment: 'A 7' },
    publishedAt: '2026-02-08',
  },
  {
    id: 'mp5',
    title: 'Lastenkirjapaketti, 15 kpl',
    description:
      'Sekalainen kokoelma lastenkirjoja 3-7-vuotiaille. Mm. Mauri Kunnas, Tatu ja Patu, Peppi Pitkätossu.',
    price: 0,
    category: 'kirjat',
    condition: 'kohtalainen',
    status: 'available',
    seller: { name: 'Anna Lahtinen', apartment: 'B 16' },
    publishedAt: '2026-02-06',
  },
  {
    id: 'mp6',
    title: 'Kahvinkeitin Moccamaster',
    description:
      'Klassinen Moccamaster-kahvinkeitin, punainen. Toimii moitteettomasti. Muutto pakottaa myymään.',
    price: 45,
    category: 'elektroniikka',
    condition: 'hyva',
    status: 'reserved',
    seller: { name: 'Pekka Salminen', apartment: 'C 19' },
    publishedAt: '2026-02-04',
  },
  {
    id: 'mp7',
    title: 'Sohvapöytä, tammea',
    description:
      'Massiivitamminen sohvapöytä, 90x60 cm. Muutama käyttöjälki pinnassa mutta tukeva rakenne.',
    price: 75,
    category: 'huonekalu',
    condition: 'kohtalainen',
    status: 'sold',
    seller: { name: 'Heikki Järvinen', apartment: 'A 5' },
    publishedAt: '2026-01-28',
  },
  {
    id: 'mp8',
    title: 'Joogatarvikkeet',
    description:
      'Joogamatto (Casall), 2 blokkia ja joogavyö. Käytetty muutaman kerran, lähes uudenveroiset.',
    price: 0,
    category: 'urheilu',
    condition: 'uusi',
    status: 'available',
    seller: { name: 'Sari Rantala', apartment: 'B 9' },
    publishedAt: '2026-02-01',
  },
  {
    id: 'mp9',
    title: 'Dekkarikokoelma, 8 kirjaa',
    description:
      'Ilkka Remes -kokoelma: 8 dekkaria hyvässä kunnossa. Luettu kerran, ei taittuneita sivuja.',
    price: 15,
    category: 'kirjat',
    condition: 'hyva',
    status: 'available',
    seller: { name: 'Markku Laine', apartment: 'C 24' },
    publishedAt: '2026-01-25',
  },
  {
    id: 'mp10',
    title: 'Patja 80x200 cm',
    description:
      'Jämäkkä vaahtomuovipatja, käytetty vierashuoneessa satunnaisesti. Suojattu päällisellä, puhdas ja hyväkuntoinen.',
    price: 25,
    category: 'muu',
    condition: 'tyydyttava',
    status: 'available',
    seller: { name: 'Tiina Koskinen', apartment: 'A 2' },
    publishedAt: '2026-01-20',
  },
];
