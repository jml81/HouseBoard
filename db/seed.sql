-- Delete child tables first (FK constraints)
DELETE FROM apartment_payments;
DELETE FROM meeting_documents;

-- Delete parent and independent tables
DELETE FROM announcements;

INSERT INTO announcements (id, title, summary, content, category, author, published_at, is_new) VALUES
('a1', 'Kevätsiivous 15.3.2026', 'Taloyhtiön kevätsiivous järjestetään lauantaina 15.3. Kaikki asukkaat ovat tervetulleita!', 'Hyvät asukkaat,

Taloyhtiön perinteinen kevätsiivous järjestetään lauantaina 15.3.2026 klo 10-15. Siivoamme yhdessä piha-alueet, grillikatoksen ja yhteiset tilat.

Tarvikkeet (haravat, jätesäkit yms.) löytyvät varastosta. Hallitus tarjoaa kahvia ja pullaa.

Tervetuloa mukaan!

Ystävällisin terveisin,
Hallitus', 'yleinen', 'Hallitus', '2026-02-28', 1),

('a2', 'Hissihuolto viikolla 11', 'Hissin vuosihuolto suoritetaan viikolla 11. Hissi on poissa käytöstä tiistaina 10.3.', 'Hyvät asukkaat,

Hissin vuosihuolto suoritetaan viikolla 11. Hissi on poissa käytöstä tiistaina 10.3.2026 klo 8-16.

Huollon suorittaa KONE Oy. Pyydämme huomioimaan tämän erityisesti liikuntarajoitteisten asukkaiden osalta.

Pahoittelemme aiheutuvaa haittaa.

Ystävällisin terveisin,
Isännöitsijä', 'huolto', 'Isännöitsijä', '2026-02-25', 1),

('a3', 'Putkiremontin aloitus syksyllä 2026', 'Taloyhtiön putkiremontti alkaa syyskuussa 2026. Lisätietoa yhtiökokouksessa.', 'Hyvät osakkaat ja asukkaat,

Kuten yhtiökokouksessa 2025 päätettiin, taloyhtiön putkiremontti aloitetaan syyskuussa 2026.

Remontin arvioitu kesto on 12 kuukautta. Remontti toteutetaan porraskohtaisesti:
- A-rappu: syyskuu - joulukuu 2026
- B-rappu: tammikuu - huhtikuu 2027
- C-rappu: toukokuu - elokuu 2027

Tarkempi aikataulu ja asukasinfo toimitetaan kesäkuussa 2026.

Urakoitsija: Putkiremontti Oy
Valvoja: Insinööritoimisto Laakso Oy

Ystävällisin terveisin,
Hallitus', 'remontti', 'Hallitus', '2026-02-20', 0),

('a4', 'Vesikatko 5.3.2026', 'Lämmin vesi katkaistaan tilapäisesti torstaina 5.3. klo 9-11 putkistotyön vuoksi.', 'Hyvät asukkaat,

Lämpimän veden jakelu katkaistaan tilapäisesti torstaina 5.3.2026 klo 9-11.

Syynä on lämmönvaihtokoneen venttiilien uusiminen. Kylmä vesi toimii normaalisti.

Pahoittelemme aiheutuvaa haittaa.

Ystävällisin terveisin,
Huoltoyhtiö', 'vesi-sahko', 'Huoltoyhtiö', '2026-02-18', 0),

('a5', 'Yhtiökokouskutsu 25.3.2026', 'Varsinainen yhtiökokous pidetään 25.3.2026 klo 18:00 kerhohuoneessa.', 'Hyvät osakkaat,

As Oy Mäntyrinteen varsinainen yhtiökokous pidetään keskiviikkona 25.3.2026 klo 18:00 taloyhtiön kerhohuoneessa.

Kokouksen esityslista:
1. Kokouksen avaus
2. Toimintakertomus 2025
3. Tilinpäätös 2025
4. Vastuuvapauden myöntäminen
5. Talousarvio 2026
6. Putkiremontin rahoitus
7. Hallituksen valinta
8. Muut asiat

Kokouskutsu ja liitteet on toimitettu postilaatikoihin.

Tervetuloa!

Ystävällisin terveisin,
Hallituksen puheenjohtaja', 'yleinen', 'Hallitus', '2026-02-15', 0),

('a6', 'Piha-alueen valaistuksen uusiminen', 'Piha-alueen valaisimet uusitaan LED-valaisimiksi maaliskuussa.', 'Hyvät asukkaat,

Piha-alueen valaisimet uusitaan energiatehokkaammiksi LED-valaisimiksi viikolla 12 (16.-20.3.2026).

Työn aikana piha-alueen valaistus voi olla osittain pois käytöstä iltaisin.

Uudet valaisimet parantavat turvallisuutta ja vähentävät energiankulutusta noin 60 %.

Ystävällisin terveisin,
Hallitus', 'huolto', 'Hallitus', '2026-02-10', 0),

('a7', 'Sähkökatko A-rappussa 12.3.', 'Sähkötyöt aiheuttavat lyhyen sähkökatkon A-rappuun torstaina 12.3. klo 10-12.', 'Hyvät A-rapun asukkaat,

A-rapun sähkökeskuksen tarkastuksen ja huollon vuoksi sähköt katkaistaan torstaina 12.3.2026 klo 10-12.

Katko koskee vain A-rappua. Muut raput eivät ole vaikutuspiirissä.

Pahoittelemme aiheutuvaa haittaa.

Ystävällisin terveisin,
Huoltoyhtiö', 'vesi-sahko', 'Huoltoyhtiö', '2026-02-05', 0);

-- Building
DELETE FROM building;

INSERT INTO building (id, name, address, postal_code, city, apartments, build_year, management_company) VALUES
(1, 'As Oy Mäntyrinne', 'Mäntypolku 5', '00320', 'Helsinki', 24, 1985, 'Realia Isännöinti Oy');

-- Bookings
DELETE FROM bookings;

INSERT INTO bookings (id, title, date, start_time, end_time, category, location, booker_name, apartment) VALUES
('b1', 'Saunavuoro', '2026-03-02', '18:00', '20:00', 'sauna', 'Taloyhtiön sauna', 'Virtanen Matti', 'A 12'),
('b2', 'Pyykinpesu', '2026-03-03', '08:00', '12:00', 'pesutupa', 'Pesutupa', 'Korhonen Anna', 'B 3'),
('b3', 'Saunavuoro', '2026-03-04', '18:00', '20:00', 'sauna', 'Taloyhtiön sauna', 'Nieminen Juha', 'A 8'),
('b4', 'Kerhohuone varaus', '2026-03-05', '14:00', '18:00', 'kerhohuone', 'Kerhohuone', 'Mäkinen Liisa', 'C 1'),
('b5', 'Saunavuoro', '2026-03-06', '18:00', '20:00', 'sauna', 'Taloyhtiön sauna', 'Laine Petri', 'B 7'),
('b6', 'Pyykinpesu', '2026-03-07', '10:00', '14:00', 'pesutupa', 'Pesutupa', 'Hämäläinen Sari', 'A 4'),
('b7', 'Saunavuoro', '2026-03-09', '18:00', '20:00', 'sauna', 'Taloyhtiön sauna', 'Virtanen Matti', 'A 12'),
('b8', 'Kevättalkoot', '2026-03-15', '10:00', '15:00', 'talkoot', 'Piha-alue', 'Hallitus', '-'),
('b9', 'Kerhohuone varaus', '2026-03-15', '16:00', '20:00', 'kerhohuone', 'Kerhohuone', 'Järvinen Mikko', 'C 5'),
('b10', 'Saunavuoro', '2026-03-11', '18:00', '20:00', 'sauna', 'Taloyhtiön sauna', 'Korhonen Anna', 'B 3'),
('b11', 'Pyykinpesu', '2026-03-17', '08:00', '12:00', 'pesutupa', 'Pesutupa', 'Laine Petri', 'B 7'),
('b12', 'Saunavuoro', '2026-03-18', '18:00', '20:00', 'sauna', 'Taloyhtiön sauna', 'Nieminen Juha', 'A 8'),
('b13', 'Kerhohuone varaus', '2026-03-22', '10:00', '14:00', 'kerhohuone', 'Kerhohuone', 'Mäkinen Liisa', 'C 1'),
('b14', 'Pyykinpesu', '2026-03-24', '10:00', '14:00', 'pesutupa', 'Pesutupa', 'Hämäläinen Sari', 'A 4');

-- Events
DELETE FROM events;

INSERT INTO events (id, title, description, date, start_time, end_time, location, organizer, interested_count, status) VALUES
('e1', 'Kevättalkoot', 'Perinteinen kevätsiivous piha-alueella. Haravoidaan, siivotaan ja laitetaan piha kesäkuntoon yhdessä!', '2026-03-15', '10:00', '15:00', 'Piha-alue', 'Hallitus', 18, 'upcoming'),
('e2', 'Yhtiökokous', 'As Oy Mäntyrinteen varsinainen yhtiökokous. Esityslistalla mm. tilinpäätös, putkiremontin rahoitus ja hallituksen valinta.', '2026-03-25', '18:00', '20:00', 'Kerhohuone', 'Hallitus', 22, 'upcoming'),
('e3', 'Pihajuhlat', 'Kesäkauden avajaisjuhlat pihalla! Grillaus, musiikkia ja ohjelmaa lapsille.', '2026-05-30', '14:00', '20:00', 'Piha-alue & grillikatos', 'Pihatoimikunta', 35, 'upcoming'),
('e4', 'Hallituksen kokous', 'Hallituksen kuukausikokous. Aiheina mm. putkiremontin valmistelu ja talousarvion seuranta.', '2026-03-10', '18:00', '19:30', 'Kerhohuone', 'Hallituksen puheenjohtaja', 5, 'upcoming'),
('e5', 'Jouluglögihetki', 'Perinteinen jouluglögihetki kerhohuoneessa. Tarjolla glögiä, pipareita ja hyvää seuraa.', '2025-12-14', '16:00', '19:00', 'Kerhohuone', 'Pihatoimikunta', 28, 'past'),
('e6', 'Syystalkoot', 'Syksyn siivouspäivä. Haravoidaan lehdet ja valmistellaan piha talvea varten.', '2025-10-11', '10:00', '14:00', 'Piha-alue', 'Hallitus', 15, 'past');

-- Materials
DELETE FROM materials;

INSERT INTO materials (id, name, category, file_type, file_size, updated_at, description) VALUES
('m1', 'Järjestyssäännöt', 'saannot', 'pdf', '245 KB', '2025-09-15', 'As Oy Mäntyrinteen järjestyssäännöt, päivitetty 2025.'),
('m2', 'Yhtiöjärjestys', 'saannot', 'pdf', '380 KB', '2024-03-20', 'Voimassa oleva yhtiöjärjestys.'),
('m3', 'Toimintakertomus 2025', 'kokoukset', 'pdf', '1.2 MB', '2026-02-10', 'Hallituksen toimintakertomus tilikaudelta 2025.'),
('m4', 'Tilinpäätös 2025', 'talous', 'pdf', '890 KB', '2026-02-10', 'Taloyhtiön tilinpäätös tilikaudelta 1.1.-31.12.2025.'),
('m5', 'Talousarvio 2026', 'talous', 'xlsx', '156 KB', '2026-01-15', 'Hyväksytty talousarvio vuodelle 2026.'),
('m6', 'Kunnossapitosuunnitelma 2026-2031', 'kunnossapito', 'pdf', '2.1 MB', '2025-11-20', 'Pitkän tähtäimen kunnossapitosuunnitelma (PTS) vuosille 2026-2031.'),
('m7', 'Yhtiökokouksen pöytäkirja 2025', 'kokoukset', 'pdf', '420 KB', '2025-04-15', 'Varsinaisen yhtiökokouksen 2025 pöytäkirja.'),
('m8', 'Energiatodistus', 'kunnossapito', 'pdf', '310 KB', '2025-06-01', 'Taloyhtiön energiatodistus, energialuokka D.'),
('m9', 'Pelastussuunnitelma', 'saannot', 'pdf', '1.8 MB', '2025-08-10', 'Taloyhtiön pelastussuunnitelma ja turvallisuusohjeet.'),
('m10', 'Vastikeseuranta 2026', 'talous', 'xlsx', '98 KB', '2026-02-01', 'Vastikkeiden maksutilanteen seuranta.');

-- Meetings
DELETE FROM meetings;

INSERT INTO meetings (id, title, type, status, date, start_time, end_time, location, description) VALUES
('m1', 'Varsinainen yhtiökokous 2026', 'yhtiokokous', 'upcoming', '2026-03-25', '18:00', '20:00', 'Kerhohuone', 'Varsinainen yhtiökokous. Esityslistalla tilinpäätös 2025, talousarvio 2026, hallituksen valinta ja putkiremontin rahoituspäätös.'),
('m2', 'Hallituksen kokous 3/2026', 'hallituksen-kokous', 'upcoming', '2026-03-10', '18:00', '19:30', 'Kerhohuone', 'Hallituksen kuukausikokous. Aiheina putkiremontin valmistelu, talousarvion seuranta ja piha-alueen kunnostus.'),
('m3', 'Hallituksen kokous 2/2026', 'hallituksen-kokous', 'completed', '2026-02-10', '18:00', '19:30', 'Kerhohuone', 'Hallituksen kuukausikokous. Käsiteltiin putkiremontin tarjoukset ja valittiin urakoitsija.'),
('m4', 'Hallituksen kokous 1/2026', 'hallituksen-kokous', 'completed', '2026-01-13', '18:00', '19:30', 'Kerhohuone', 'Vuoden ensimmäinen hallituksen kokous. Käsiteltiin talousarvion toteutuma ja piha-alueen suunnitelmat.'),
('m5', 'Ylimääräinen yhtiökokous', 'ylimaarainen-yhtiokokous', 'completed', '2025-11-15', '18:00', '19:30', 'Kerhohuone', 'Ylimääräinen yhtiökokous putkiremontin käynnistämiseksi. Päätettiin remontin laajuudesta ja aikataulusta.'),
('m6', 'Varsinainen yhtiökokous 2025', 'yhtiokokous', 'completed', '2025-03-27', '18:00', '20:30', 'Kerhohuone', 'Varsinainen yhtiökokous 2025. Vahvistettiin tilinpäätös, valittiin hallitus ja päätettiin yhtiövastikkeista.');

INSERT INTO meeting_documents (id, meeting_id, name, file_type, file_size) VALUES
('d1', 'm1', 'Kokouskutsu', 'pdf', '245 KB'),
('d2', 'm1', 'Tilinpäätös 2025', 'pdf', '1.8 MB'),
('d3', 'm1', 'Talousarvio 2026', 'xlsx', '340 KB'),
('d4', 'm2', 'Esityslista', 'pdf', '120 KB'),
('d5', 'm3', 'Esityslista', 'pdf', '115 KB'),
('d6', 'm3', 'Pöytäkirja', 'pdf', '280 KB'),
('d7', 'm4', 'Esityslista', 'pdf', '110 KB'),
('d8', 'm4', 'Pöytäkirja', 'pdf', '260 KB'),
('d9', 'm5', 'Kokouskutsu', 'pdf', '200 KB'),
('d10', 'm5', 'Pöytäkirja', 'pdf', '350 KB'),
('d11', 'm5', 'Putkiremontin tarjoukset', 'xlsx', '890 KB'),
('d12', 'm6', 'Kokouskutsu', 'pdf', '230 KB'),
('d13', 'm6', 'Pöytäkirja', 'pdf', '420 KB'),
('d14', 'm6', 'Tilinpäätös 2024', 'pdf', '1.6 MB');

-- Board members
DELETE FROM board_members;

INSERT INTO board_members (id, name, role, apartment, email, phone, term_start, term_end) VALUES
('bm1', 'Mikko Lahtinen', 'puheenjohtaja', 'A 4', 'mikko.lahtinen@email.fi', '040 123 4567', '2025-03-27', '2026-03-25'),
('bm2', 'Sari Korhonen', 'varapuheenjohtaja', 'B 12', 'sari.korhonen@email.fi', '050 234 5678', '2025-03-27', '2026-03-25'),
('bm3', 'Jukka Nieminen', 'jasen', 'A 7', 'jukka.nieminen@email.fi', '040 345 6789', '2025-03-27', '2026-03-25'),
('bm4', 'Anna Mäkelä', 'jasen', 'C 18', 'anna.makela@email.fi', '050 456 7890', '2025-03-27', '2026-03-25'),
('bm5', 'Pekka Virtanen', 'varajasen', 'B 9', 'pekka.virtanen@email.fi', '040 567 8901', '2025-03-27', '2026-03-25');

-- Apartments
DELETE FROM apartments;

INSERT INTO apartments (id, number, staircase, floor, type, area, shares, resident) VALUES
('apt-a1', 'A 1', 'A', 1, '2h+k', 45.5, '1-455', 'Kari Mäkinen'),
('apt-a2', 'A 2', 'A', 1, '1h+k', 32.0, '456-775', 'Liisa Hakala'),
('apt-a3', 'A 3', 'A', 2, '3h+k', 68.0, '776-1455', 'Mikko Lahtinen'),
('apt-a4', 'A 4', 'A', 2, '2h+k', 48.0, '1456-1935', 'Tuula Rantanen'),
('apt-a5', 'A 5', 'A', 3, '3h+k', 68.0, '1936-2615', 'Jukka Nieminen'),
('apt-a6', 'A 6', 'A', 3, '1h+k', 32.0, '2616-2935', 'Mari Salminen'),
('apt-a7', 'A 7', 'A', 4, '4h+k', 82.0, '2936-3755', 'Heikki Koivisto'),
('apt-a8', 'A 8', 'A', 4, '2h+k', 46.0, '3756-4215', 'Aino Virtanen'),
('apt-b1', 'B 9', 'B', 1, '2h+k', 47.0, '4216-4685', 'Pekka Virtanen'),
('apt-b2', 'B 10', 'B', 1, '1h+k', 33.0, '4686-5015', 'Hanna Laine'),
('apt-b3', 'B 11', 'B', 2, '3h+k', 70.0, '5016-5715', 'Timo Heikkinen'),
('apt-b4', 'B 12', 'B', 2, '2h+k', 45.5, '5716-6170', 'Sari Korhonen'),
('apt-b5', 'B 13', 'B', 3, '3h+k', 70.0, '6171-6870', 'Antti Koskinen'),
('apt-b6', 'B 14', 'B', 3, '1h+k', 33.0, '6871-7200', 'Elina Nurmi'),
('apt-b7', 'B 15', 'B', 4, '4h+k', 84.0, '7201-8040', 'Ville Tuominen'),
('apt-b8', 'B 16', 'B', 4, '2h+k', 46.0, '8041-8500', 'Päivi Järvinen'),
('apt-c1', 'C 17', 'C', 1, '2h+k', 46.5, '8501-8965', 'Jussi Lehtonen'),
('apt-c2', 'C 18', 'C', 1, '1h+k', 31.0, '8966-9275', 'Anna Mäkelä'),
('apt-c3', 'C 19', 'C', 2, '3h+k', 69.0, '9276-9965', 'Matti Hämäläinen'),
('apt-c4', 'C 20', 'C', 2, '2h+k', 47.5, '9966-10440', 'Kaisa Aalto'),
('apt-c5', 'C 21', 'C', 3, '3h+k', 69.0, '10441-11130', 'Risto Karjalainen'),
('apt-c6', 'C 22', 'C', 3, '1h+k', 31.0, '11131-11440', 'Minna Ojala'),
('apt-c7', 'C 23', 'C', 4, '4h+k', 83.0, '11441-12270', 'Harri Leppänen'),
('apt-c8', 'C 24', 'C', 4, '2h+k', 47.0, '12271-12740', 'Sirpa Mattila');

-- Contacts
DELETE FROM contacts;

INSERT INTO contacts (id, name, role, company, phone, email, description) VALUES
('c1', 'Markku Toivonen', 'isannoitsija', 'Kiinteistöpalvelu Toivonen Oy', '09 123 4567', 'markku.toivonen@kptoivonen.fi', 'Vastaa taloyhtiön hallinnosta ja taloushallinnosta.'),
('c2', 'Terhi Aaltonen', 'isannoitsija', 'Kiinteistöpalvelu Toivonen Oy', '09 123 4568', 'terhi.aaltonen@kptoivonen.fi', 'Isännöitsijän sijainen ja kirjanpitäjä.'),
('c3', 'Huoltopäivystys', 'huolto', 'Talotekniikka Virtanen Oy', '0800 123 456', 'paivystys@ttv.fi', 'Kiireelliset huoltoasiat 24/7.'),
('c4', 'Raimo Virtanen', 'huolto', 'Talotekniikka Virtanen Oy', '040 789 0123', 'raimo.virtanen@ttv.fi', 'Kiinteistöhuolto arkisin klo 7-16.'),
('c5', 'Mikko Lahtinen', 'hallitus', NULL, '040 123 4567', 'mikko.lahtinen@email.fi', 'Hallituksen puheenjohtaja, huoneisto A 4.'),
('c6', 'Sari Korhonen', 'hallitus', NULL, '050 234 5678', 'sari.korhonen@email.fi', 'Hallituksen varapuheenjohtaja, huoneisto B 12.'),
('c7', 'Siivouspalvelu Puhtaus Oy', 'siivous', 'Siivouspalvelu Puhtaus Oy', '010 234 5678', 'info@puhtausoy.fi', 'Porraskäytävien ja yhteistilojen siivous.'),
('c8', 'Jätehuolto Remeo', 'muu', 'Remeo Oy', '020 123 4567', 'asiakaspalvelu@remeo.fi', 'Jätehuolto ja kierrätysastioiden tyhjennys.'),
('c9', 'Hissitarkastus Kone', 'muu', 'KONE Oyj', '0800 274 274', 'huolto@kone.com', 'Hissin huolto ja vika-asiat.');

-- Marketplace items
DELETE FROM marketplace_items;

INSERT INTO marketplace_items (id, title, description, price, category, condition, status, seller_name, seller_apartment, published_at) VALUES
('mp1', 'Ikea Kallax -hylly, valkoinen', 'Hyväkuntoinen Ikea Kallax 4x2 -hylly. Pari pientä naarmua sivussa. Mitat 147x77 cm. Noudettava 2. kerroksesta, B-rappu.', 40, 'huonekalu', 'hyva', 'available', 'Minna Korhonen', 'B 12', '2026-02-14'),
('mp2', 'Samsung Galaxy Tab A9', 'Vuoden vanha tabletti, alkuperäinen laturi ja suojakuori mukana. Akku kestää hyvin. Naarmuton näyttö.', 120, 'elektroniikka', 'hyva', 'available', 'Jari Virtanen', 'A 3', '2026-02-12'),
('mp3', 'Naisten talvitakki, koko M', 'Lämmin untuvakki, harmaa. Käytetty yhden talven. Ei rikkoutumia tai tahroja. Merkki: Luhta.', 35, 'vaatteet', 'hyva', 'available', 'Liisa Mäkelä', 'C 22', '2026-02-10'),
('mp4', 'Polkupyörä 26"', 'Toimiva kaupunkipyörä, 3 vaihdetta. Renkaat hyvässä kunnossa, vaihdevaijeri vaihdettu viime kesänä. Lukko mukana.', 60, 'urheilu', 'kohtalainen', 'available', 'Timo Nieminen', 'A 7', '2026-02-08'),
('mp5', 'Lastenkirjapaketti, 15 kpl', 'Sekalainen kokoelma lastenkirjoja 3-7-vuotiaille. Mm. Mauri Kunnas, Tatu ja Patu, Peppi Pitkätossu.', 0, 'kirjat', 'kohtalainen', 'available', 'Anna Lahtinen', 'B 16', '2026-02-06'),
('mp6', 'Kahvinkeitin Moccamaster', 'Klassinen Moccamaster-kahvinkeitin, punainen. Toimii moitteettomasti. Muutto pakottaa myymään.', 45, 'elektroniikka', 'hyva', 'reserved', 'Pekka Salminen', 'C 19', '2026-02-04'),
('mp7', 'Sohvapöytä, tammea', 'Massiivitamminen sohvapöytä, 90x60 cm. Muutama käyttöjälki pinnassa mutta tukeva rakenne.', 75, 'huonekalu', 'kohtalainen', 'sold', 'Heikki Järvinen', 'A 5', '2026-01-28'),
('mp8', 'Joogatarvikkeet', 'Joogamatto (Casall), 2 blokkia ja joogavyö. Käytetty muutaman kerran, lähes uudenveroiset.', 0, 'urheilu', 'uusi', 'available', 'Sari Rantala', 'B 9', '2026-02-01'),
('mp9', 'Dekkarikokoelma, 8 kirjaa', 'Ilkka Remes -kokoelma: 8 dekkaria hyvässä kunnossa. Luettu kerran, ei taittuneita sivuja.', 15, 'kirjat', 'hyva', 'available', 'Markku Laine', 'C 24', '2026-01-25'),
('mp10', 'Patja 80x200 cm', 'Jämäkkä vaahtomuovipatja, käytetty vierashuoneessa satunnaisesti. Suojattu päällisellä, puhdas ja hyväkuntoinen.', 25, 'muu', 'tyydyttava', 'available', 'Tiina Koskinen', 'A 2', '2026-01-20');

INSERT INTO apartment_payments (apartment_id, monthly_charge, payment_status, last_payment_date, arrears, hoitovastike, rahoitusvastike, vesimaksu) VALUES
('apt-a1', 240, 'paid', '2026-02-01', 0, 156, 60, 24),
('apt-a2', 180, 'paid', '2026-02-03', 0, 117, 45, 18),
('apt-a3', 310, 'paid', '2026-02-01', 0, 202, 77, 31),
('apt-a4', 240, 'overdue', '2025-12-02', 480, 156, 60, 24),
('apt-a5', 310, 'paid', '2026-02-01', 0, 202, 77, 31),
('apt-a6', 180, 'paid', '2026-02-05', 0, 117, 45, 18),
('apt-a7', 380, 'pending', '2026-01-03', 0, 247, 95, 38),
('apt-a8', 240, 'paid', '2026-02-02', 0, 156, 60, 24),
('apt-b1', 240, 'paid', '2026-02-01', 0, 156, 60, 24),
('apt-b2', 180, 'paid', '2026-02-04', 0, 117, 45, 18),
('apt-b3', 310, 'overdue', '2025-11-05', 930, 202, 77, 31),
('apt-b4', 240, 'paid', '2026-02-01', 0, 156, 60, 24),
('apt-b5', 310, 'paid', '2026-02-02', 0, 202, 77, 31),
('apt-b6', 180, 'pending', '2026-01-02', 0, 117, 45, 18),
('apt-b7', 380, 'paid', '2026-02-01', 0, 247, 95, 38),
('apt-b8', 240, 'paid', '2026-02-03', 0, 156, 60, 24),
('apt-c1', 240, 'paid', '2026-02-02', 0, 156, 60, 24),
('apt-c2', 180, 'paid', '2026-02-01', 0, 117, 45, 18),
('apt-c3', 310, 'paid', '2026-02-04', 0, 202, 77, 31),
('apt-c4', 240, 'pending', '2026-01-01', 0, 156, 60, 24),
('apt-c5', 310, 'paid', '2026-02-03', 0, 202, 77, 31),
('apt-c6', 180, 'overdue', '2025-12-10', 360, 117, 45, 18),
('apt-c7', 380, 'paid', '2026-02-01', 0, 247, 95, 38),
('apt-c8', 240, 'paid', '2026-02-05', 0, 156, 60, 24);
