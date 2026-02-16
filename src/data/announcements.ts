import type { Announcement } from '@/types';

export const announcements: Announcement[] = [
  {
    id: 'a1',
    title: 'Kevätsiivous 15.3.2026',
    summary:
      'Taloyhtiön kevätsiivous järjestetään lauantaina 15.3. Kaikki asukkaat ovat tervetulleita!',
    content:
      'Hyvät asukkaat,\n\nTaloyhtiön perinteinen kevätsiivous järjestetään lauantaina 15.3.2026 klo 10-15. Siivoamme yhdessä piha-alueet, grillikatoksen ja yhteiset tilat.\n\nTarvikkeet (haravat, jätesäkit yms.) löytyvät varastosta. Hallitus tarjoaa kahvia ja pullaa.\n\nTervetuloa mukaan!\n\nYstävällisin terveisin,\nHallitus',
    category: 'yleinen',
    author: 'Hallitus',
    publishedAt: '2026-02-28',
    isNew: true,
  },
  {
    id: 'a2',
    title: 'Hissihuolto viikolla 11',
    summary: 'Hissin vuosihuolto suoritetaan viikolla 11. Hissi on poissa käytöstä tiistaina 10.3.',
    content:
      'Hyvät asukkaat,\n\nHissin vuosihuolto suoritetaan viikolla 11. Hissi on poissa käytöstä tiistaina 10.3.2026 klo 8-16.\n\nHuollon suorittaa KONE Oy. Pyydämme huomioimaan tämän erityisesti liikuntarajoitteisten asukkaiden osalta.\n\nPahoittelemme aiheutuvaa haittaa.\n\nYstävällisin terveisin,\nIsännöitsijä',
    category: 'huolto',
    author: 'Isännöitsijä',
    publishedAt: '2026-02-25',
    isNew: true,
  },
  {
    id: 'a3',
    title: 'Putkiremontin aloitus syksyllä 2026',
    summary: 'Taloyhtiön putkiremontti alkaa syyskuussa 2026. Lisätietoa yhtiökokouksessa.',
    content:
      'Hyvät osakkaat ja asukkaat,\n\nKuten yhtiökokouksessa 2025 päätettiin, taloyhtiön putkiremontti aloitetaan syyskuussa 2026.\n\nRemontin arvioitu kesto on 12 kuukautta. Remontti toteutetaan porraskohtaisesti:\n- A-rappu: syyskuu - joulukuu 2026\n- B-rappu: tammikuu - huhtikuu 2027\n- C-rappu: toukokuu - elokuu 2027\n\nTarkempi aikataulu ja asukasinfo toimitetaan kesäkuussa 2026.\n\nUrakoitsija: Putkiremontti Oy\nValvoja: Insinööritoimisto Laakso Oy\n\nYstävällisin terveisin,\nHallitus',
    category: 'remontti',
    author: 'Hallitus',
    publishedAt: '2026-02-20',
    isNew: false,
  },
  {
    id: 'a4',
    title: 'Vesikatko 5.3.2026',
    summary: 'Lämmin vesi katkaistaan tilapäisesti torstaina 5.3. klo 9-11 putkistotyön vuoksi.',
    content:
      'Hyvät asukkaat,\n\nLämpimän veden jakelu katkaistaan tilapäisesti torstaina 5.3.2026 klo 9-11.\n\nSyynä on lämmönvaihtokoneen venttiilien uusiminen. Kylmä vesi toimii normaalisti.\n\nPahoittelemme aiheutuvaa haittaa.\n\nYstävällisin terveisin,\nHuoltoyhtiö',
    category: 'vesi-sahko',
    author: 'Huoltoyhtiö',
    publishedAt: '2026-02-18',
    isNew: false,
  },
  {
    id: 'a5',
    title: 'Yhtiökokouskutsu 25.3.2026',
    summary: 'Varsinainen yhtiökokous pidetään 25.3.2026 klo 18:00 kerhohuoneessa.',
    content:
      'Hyvät osakkaat,\n\nAs Oy Mäntyrinteen varsinainen yhtiökokous pidetään keskiviikkona 25.3.2026 klo 18:00 taloyhtiön kerhohuoneessa.\n\nKokouksen esityslista:\n1. Kokouksen avaus\n2. Toimintakertomus 2025\n3. Tilinpäätös 2025\n4. Vastuuvapauden myöntäminen\n5. Talousarvio 2026\n6. Putkiremontin rahoitus\n7. Hallituksen valinta\n8. Muut asiat\n\nKokouskutsu ja liitteet on toimitettu postilaatikoihin.\n\nTervetuloa!\n\nYstävällisin terveisin,\nHallituksen puheenjohtaja',
    category: 'yleinen',
    author: 'Hallitus',
    publishedAt: '2026-02-15',
    isNew: false,
  },
  {
    id: 'a6',
    title: 'Piha-alueen valaistuksen uusiminen',
    summary: 'Piha-alueen valaisimet uusitaan LED-valaisimiksi maaliskuussa.',
    content:
      'Hyvät asukkaat,\n\nPiha-alueen valaisimet uusitaan energiatehokkaammiksi LED-valaisimiksi viikolla 12 (16.-20.3.2026).\n\nTyön aikana piha-alueen valaistus voi olla osittain pois käytöstä iltaisin.\n\nUudet valaisimet parantavat turvallisuutta ja vähentävät energiankulutusta noin 60 %.\n\nYstävällisin terveisin,\nHallitus',
    category: 'huolto',
    author: 'Hallitus',
    publishedAt: '2026-02-10',
    isNew: false,
  },
  {
    id: 'a7',
    title: 'Sähkökatko A-rappussa 12.3.',
    summary: 'Sähkötyöt aiheuttavat lyhyen sähkökatkon A-rappuun torstaina 12.3. klo 10-12.',
    content:
      'Hyvät A-rapun asukkaat,\n\nA-rapun sähkökeskuksen tarkastuksen ja huollon vuoksi sähköt katkaistaan torstaina 12.3.2026 klo 10-12.\n\nKatko koskee vain A-rappua. Muut raput eivät ole vaikutuspiirissä.\n\nPahoittelemme aiheutuvaa haittaa.\n\nYstävällisin terveisin,\nHuoltoyhtiö',
    category: 'vesi-sahko',
    author: 'Huoltoyhtiö',
    publishedAt: '2026-02-05',
    isNew: false,
  },
];
