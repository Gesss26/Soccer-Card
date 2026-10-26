/* ============================================================
   DIVISE.JS - Database squadre, generatore SVG e rose 2026/27
   Aggiornato a ottobre 2026 — formazioni tipo di ogni squadra
   + viso "Classico" + carnagione per giocatore
   + braccia sopra i pantaloncini, corpo arrotondato
   + gambe snodabili: coscia + polpaccio/piede (ginocchio)
   + wrapper <g class="pg-corpo"> per animazione tuffo portiere
   ============================================================ */

var SQUADRE = {
  atalanta:    { nome: 'Atalanta',    casa: { maglia: '#1e3a8a', pantaloncini: '#000000', calzettoni: '#1e3a8a', righe: true, colore2: '#000000' }, portiere: { maglia: '#eab308', pantaloncini: '#000000', calzettoni: '#eab308' } },
  bologna:     { nome: 'Bologna',     casa: { maglia: '#991b1b', pantaloncini: '#1e3a8a', calzettoni: '#991b1b' }, portiere: { maglia: '#16a34a', pantaloncini: '#000000', calzettoni: '#16a34a' } },
  cagliari:    { nome: 'Cagliari',    casa: { maglia: '#dc2626', pantaloncini: '#1e3a8a', calzettoni: '#dc2626' }, portiere: { maglia: '#f97316', pantaloncini: '#000000', calzettoni: '#f97316' } },
  como:        { nome: 'Como',        casa: { maglia: '#1e40af', pantaloncini: '#ffffff', calzettoni: '#1e40af' }, portiere: { maglia: '#eab308', pantaloncini: '#000000', calzettoni: '#eab308' } },
  fiorentina:  { nome: 'Fiorentina',  casa: { maglia: '#7e22ce', pantaloncini: '#ffffff', calzettoni: '#7e22ce' }, portiere: { maglia: '#16a34a', pantaloncini: '#000000', calzettoni: '#16a34a' } },
  frosinone:   { nome: 'Frosinone',   casa: { maglia: '#eab308', pantaloncini: '#1e3a8a', calzettoni: '#eab308' }, portiere: { maglia: '#dc2626', pantaloncini: '#000000', calzettoni: '#dc2626' } },
  genoa:       { nome: 'Genoa',       casa: { maglia: '#991b1b', pantaloncini: '#1e3a8a', calzettoni: '#991b1b' }, portiere: { maglia: '#f97316', pantaloncini: '#000000', calzettoni: '#f97316' } },
  inter:       { nome: 'Inter',       casa: { maglia: '#1e3a8a', pantaloncini: '#000000', calzettoni: '#1e3a8a', righe: true, colore2: '#000000' }, portiere: { maglia: '#eab308', pantaloncini: '#000000', calzettoni: '#eab308' } },
  juventus:    { nome: 'Juventus',    casa: { maglia: '#000000', pantaloncini: '#ffffff', calzettoni: '#000000', righe: true, colore2: '#ffffff' }, portiere: { maglia: '#16a34a', pantaloncini: '#000000', calzettoni: '#16a34a' } },
  lazio:       { nome: 'Lazio',       casa: { maglia: '#87ceeb', pantaloncini: '#ffffff', calzettoni: '#87ceeb' }, portiere: { maglia: '#eab308', pantaloncini: '#000000', calzettoni: '#eab308' } },
  lecce:       { nome: 'Lecce',       casa: { maglia: '#eab308', pantaloncini: '#dc2626', calzettoni: '#eab308', righe: true, colore2: '#dc2626' }, portiere: { maglia: '#16a34a', pantaloncini: '#000000', calzettoni: '#16a34a' } },
  milan:       { nome: 'AC Milan',    casa: { maglia: '#dc2626', pantaloncini: '#000000', calzettoni: '#dc2626', righe: true, colore2: '#000000' }, portiere: { maglia: '#eab308', pantaloncini: '#000000', calzettoni: '#eab308' } },
  monza:       { nome: 'Monza',       casa: { maglia: '#dc2626', pantaloncini: '#ffffff', calzettoni: '#dc2626' }, portiere: { maglia: '#16a34a', pantaloncini: '#000000', calzettoni: '#16a34a' } },
  napoli:      { nome: 'Napoli',      casa: { maglia: '#1e40af', pantaloncini: '#ffffff', calzettoni: '#1e40af' }, portiere: { maglia: '#f97316', pantaloncini: '#000000', calzettoni: '#f97316' } },
  parma:       { nome: 'Parma',       casa: { maglia: '#eab308', pantaloncini: '#1e3a8a', calzettoni: '#eab308', righe: true, colore2: '#1e3a8a' }, portiere: { maglia: '#16a34a', pantaloncini: '#000000', calzettoni: '#16a34a' } },
  roma:        { nome: 'AS Roma',     casa: { maglia: '#991b1b', pantaloncini: '#ffffff', calzettoni: '#991b1b' }, portiere: { maglia: '#eab308', pantaloncini: '#000000', calzettoni: '#eab308' } },
  sassuolo:    { nome: 'Sassuolo',    casa: { maglia: '#16a34a', pantaloncini: '#000000', calzettoni: '#16a34a' }, portiere: { maglia: '#f97316', pantaloncini: '#000000', calzettoni: '#f97316' } },
  torino:      { nome: 'Torino',      casa: { maglia: '#991b1b', pantaloncini: '#1e3a8a', calzettoni: '#991b1b' }, portiere: { maglia: '#16a34a', pantaloncini: '#000000', calzettoni: '#16a34a' } },
  udinese:     { nome: 'Udinese',     casa: { maglia: '#000000', pantaloncini: '#ffffff', calzettoni: '#000000', righe: true, colore2: '#ffffff' }, portiere: { maglia: '#eab308', pantaloncini: '#000000', calzettoni: '#eab308' } },
  venezia:     { nome: 'Venezia',     casa: { maglia: '#16a34a', pantaloncini: '#000000', calzettoni: '#16a34a' }, portiere: { maglia: '#f97316', pantaloncini: '#000000', calzettoni: '#f97316' } }
};

var ROSE = {
  atalanta: { portiere: ['Carnesecchi'], difensori: ['Scalvini', 'Kristensen'], centrocampisti: ['Hien', 'Kolasinac', 'Kessié', 'Gaetano', 'Ederson', 'De Ketelaere'], difensori_alta: ['Scamacca', 'Rowe'], panchina: { por: ['Sportiello'], dif: ['Bernasconi', 'Bellanova'], cen: ['Samardzic', 'Zappacosta'], att: ['Raspadori', 'Krstovic'] } },
  bologna: { portiere: ['Skorupski'], difensori: ['Heggem', 'Theate'], centrocampisti: ['Zortea', 'Miranda', 'Pobega', 'Ferguson', 'Orsolini', 'Cambiaghi'], difensori_alta: ['Dovbyk', 'Holm'], panchina: { por: ['Pessina'], dif: ['Helland', 'Casale'], cen: ['Moro', 'Bernardeschi'], att: ['Piccoli', 'Vitik'] } },
  cagliari: { portiere: ['Caprile'], difensori: ['Mina', 'Rodriguez'], centrocampisti: ['Zè Pedro', 'Obert', 'Adopo', 'Winks', 'Romano', 'Maldini'], difensori_alta: ['Mendy', 'Fazzini'], panchina: { por: ['Radunovic'], dif: ['Sugawara', 'Deiola'], cen: ['Idrissi', 'Zé Pedro'], att: ['Nzola', 'Luvumbo'] } },
  como: { portiere: ['Butez'], difensori: ['Chalobah', 'Ramon'], centrocampisti: ['Yan Couto', 'Valle', 'Da Cunha', 'Perrone', 'Diao', 'Nico Paz'], difensori_alta: ['Douvikas', 'Baturina'], panchina: { por: ['Vigorito'], dif: ['Kaiki', 'Kempf'], cen: ['Milla', 'Rodriguez'], att: ['Kean', 'Caqueret'] } },
  fiorentina: { portiere: ['De Gea'], difensori: ['Dragusin', 'Ranieri'], centrocampisti: ['Jimenez', 'Viery', 'Ndour', 'Fagioli', 'Atta', 'Mastantuono'], difensori_alta: ['Pellegrino', 'Pedro Goncalves'], panchina: { por: ['Christensen'], dif: ['Valdepenas', 'Pongracic'], cen: ['Oulai', 'Njie'], att: ['Beto', 'Kean'] } },
  frosinone: { portiere: ['Palmisani'], difensori: ['Calvani', 'Monterisi'], centrocampisti: ['Oyono', 'Bracaglia', 'Masini', 'Calò', 'Ghedjemis', 'Schmid'], difensori_alta: ['Raimondo', 'Kvernadze'], panchina: { por: ['Lolic'], dif: ['Terzic', 'Fayed'], cen: ['Grilitsch', 'Fini'], att: ['Zerbin', 'Cichella'] } },
  genoa: { portiere: ['Bijlow'], difensori: ['Ostigard', 'Vasquez'], centrocampisti: ['Ehizibue', 'Marcandalli', 'Frendrup', 'Sow', 'Baldanzi', 'Ellertsson'], difensori_alta: ['Osmajic', 'Colombo'], panchina: { por: ['Sommariva'], dif: ['Drameh', 'Matturro'], cen: ['Messias', 'El Shaarawy'], att: ['Vitinha', 'Sabelli'] } },
  inter: { portiere: ['Martinez'], difensori: ['Akanji', 'Bastoni'], centrocampisti: ['Bisseck', 'Dimarco', 'Barella', 'Calhanoglu', 'Zielinski', 'Diouf'], difensori_alta: ['Lautaro', 'Thuram'], panchina: { por: ['Provedel'], dif: ['Stones', 'Pavard'], cen: ['Sucic', 'Frattesi'], att: ['Pio Esposito', 'Spence'] } },
  juventus: { portiere: ['Vicario'], difensori: ['Kalulu', 'Bremer'], centrocampisti: ['Lucumì', 'Celik', 'Douglas Luiz', 'McKennie', 'Conceiçao', 'Yildiz'], difensori_alta: ['Woltemade', 'Kolo Muani'], panchina: { por: ['Grabara'], dif: ['Gatti', 'Cambiaso'], cen: ['Sarr', 'Koopmeiners'], att: ['Nico Gonzalez', 'Alajbegovic'] } },
  lazio: { portiere: ['Mandas'], difensori: ['Doekhi', 'Provstgaard'], centrocampisti: ['Marusic', 'Nuno Tavares', 'Taylor', 'Rovella', 'Frattesi', 'Cancellieri'], difensori_alta: ['Noslin', 'Zaccagni'], panchina: { por: ['Furlanetto'], dif: ['Sutalo', 'Patric'], cen: ['Floriani', 'Cataldi'], att: ['Isaksen', 'Pinamonti'] } },
  lecce: { portiere: ['Falcone'], difensori: ['Gaspar', 'Tiago Gabriel'], centrocampisti: ['D. Veiga', 'Gallo', 'Ilic', 'Ngom', 'Coulibaly', 'Pierotti'], difensori_alta: ['Geubbels', 'Monteiro'], panchina: { por: ['Penev'], dif: ['Siebert', 'Ndaba'], cen: ['Berisha', 'Fofana'], att: ["N'dri", 'Stulic'] } },
  milan: { portiere: ['Maignan'], difensori: ['De Winter', 'Pavlovic'], centrocampisti: ['Gila', 'Moreira', 'Modric', 'Rabiot', 'Chukwueze', 'Pulisic'], difensori_alta: ['Cissé', 'Ramos'], panchina: { por: ['Terracciano'], dif: ['Gabbia', 'Estupinan'], cen: ['Musah', 'Saelemaekers'], att: ['Loftus-Cheek', 'Leão'] } },
  monza: { portiere: ['Tornqvist'], difensori: ['Ziolkowski', 'Carboni'], centrocampisti: ['Kouadio', 'Mangas', 'Pessina', 'Folorunsho', 'Birindelli', 'Zeballos'], difensori_alta: ['Robinson', 'Varela'], panchina: { por: ['Thiam'], dif: ['Antov', 'Lucchesi'], cen: ['Akinsanmiro', 'Colpani'], att: ['Ngonge', 'Cutrone'] } },
  napoli: { portiere: ['Meret'], difensori: ['Rrahmani', 'Beukema'], centrocampisti: ['Di Lorenzo', 'Spinazzola', 'Lobotka', 'McTominay', 'De Bruyne', 'Politano'], difensori_alta: ['Højlund', 'Lang'], panchina: { por: ['Milinković-Savić'], dif: ['Buongiorno', 'Marianucci'], cen: ['Gilmour', 'Anguissa'], att: ['Neres', 'Lucca'] } },
  parma: { portiere: ['Corvi'], difensori: ['Troilo', 'Diego Carlos'], centrocampisti: ['Delprato', 'Lontani', 'Bernabé', 'Keita', 'Britschgi', 'Valeri'], difensori_alta: ['Touré', 'Romero'], panchina: { por: ['Daffara'], dif: ['Balogh', 'Ndiaye'], cen: ['Sierro', 'Fabbian'], att: ['Elphege', 'Benedyczak'] } },
  roma: { portiere: ['Svilar'], difensori: ['Mancini', 'Balerdi'], centrocampisti: ['Hermoso', 'Wesley', 'Cristante', 'Kone', 'Molina', 'Soulé'], difensori_alta: ['Dybala', 'Malen'], panchina: { por: ['Gollini'], dif: ['Ndicka', 'Ghilardi'], cen: ['Lulli', 'Mora'], att: ['El Aynaoui', 'Baldanzi'] } },
  sassuolo: { portiere: ['Muric'], difensori: ['Idzes', 'Leysen'], centrocampisti: ['Cinquegrano', 'Doig', 'Bakola', 'Matic', 'Thorstvedt', 'Berardi'], difensori_alta: ['Esposito', 'Laurienté'], panchina: { por: ['Turati'], dif: ['Obrador', 'Walukiewicz'], cen: ['Adzic', 'Volpato'], att: ['Bowie', 'Lipani'] } },
  torino: { portiere: ['Lucas Perri'], difensori: ['Coco', 'Comert'], centrocampisti: ['Comuzzo', 'Belghali', 'Mandragora', 'Fitz-Jim', 'Braganca', 'Cacciamani'], difensori_alta: ['Vlasic', 'Simeone'], panchina: { por: ['Paleari'], dif: ['Fortini', 'Ismajli'], cen: ['Gineitis', 'Casadei'], att: ['Adams', 'Anjorin'] } },
  udinese: { portiere: ['Okoye'], difensori: ['Kabasele', 'Solet'], centrocampisti: ['Abankwah', 'Vojvoda', 'Ekkelenkamp', 'Karlstrom', 'Piotrowski', 'Kamara'], difensori_alta: ['Zaniolo', 'Davis'], panchina: { por: ['Padelli'], dif: ['Alaba', 'Bertola'], cen: ['Miller', 'Unai Gomez'], att: ['Zarraga', 'Zanoli'] } },
  venezia: { portiere: ['Stankovic'], difensori: ['Schingtienne', 'Juan Jesus'], centrocampisti: ['Bella-Kotchap', 'Adams', 'Basic', 'Busio', 'Kike Perez', 'Hainaut'], difensori_alta: ['Correia', 'Yeboah'], panchina: { por: ['Grandi'], dif: ['Mazzocchi', 'Moreno'], cen: ['Haps', 'Sohm'], att: ['Lella', 'Fanne'] } }
};

var CARNAGIONI = {
  'default':            { pelle: '#fcd7b6', ombra: '#e0b090' },
  'mancini':            { pelle: '#e8b88a', ombra: '#c99a6e' },
  'cristante':          { pelle: '#e8b88a', ombra: '#c99a6e' },
  'politano':           { pelle: '#e8b88a', ombra: '#c99a6e' },
  'berardi':            { pelle: '#e8b88a', ombra: '#c99a6e' },
  'maldini':            { pelle: '#e8b88a', ombra: '#c99a6e' },
  'pessina':            { pelle: '#e8b88a', ombra: '#c99a6e' },
  'dybala':             { pelle: '#d9a070', ombra: '#b8804f' },
  'lautaro':            { pelle: '#d9a070', ombra: '#b8804f' },
  'kolo muani':         { pelle: '#5a3a24', ombra: '#3e2616' },
  'hernandez':          { pelle: '#d9a070', ombra: '#b8804f' },
  'pulisic':            { pelle: '#f0c8a0', ombra: '#d4a878' },
  'mckennie':           { pelle: '#f0c8a0', ombra: '#d4a878' },
  'weah':               { pelle: '#5a3a24', ombra: '#3e2616' },
  'kessié':             { pelle: '#5a3a24', ombra: '#3e2616' },
  'kessie':             { pelle: '#5a3a24', ombra: '#3e2616' },
  'ederson':            { pelle: '#6b4a30', ombra: '#4a3020' },
  'sow':                { pelle: '#5a3a24', ombra: '#3e2616' },
  'mendy':              { pelle: '#5a3a24', ombra: '#3e2616' },
  'nzola':              { pelle: '#5a3a24', ombra: '#3e2616' },
  'luvumbo':            { pelle: '#4a2e1b', ombra: '#2f1c0f' },
  'adopo':              { pelle: '#5a3a24', ombra: '#3e2616' },
  'keita':              { pelle: '#5a3a24', ombra: '#3e2616' },
  'ndiaye':             { pelle: '#4a2e1b', ombra: '#2f1c0f' },
  'touré':              { pelle: '#5a3a24', ombra: '#3e2616' },
  'toure':              { pelle: '#5a3a24', ombra: '#3e2616' },
  'kone':               { pelle: '#5a3a24', ombra: '#3e2616' },
  'konè':               { pelle: '#5a3a24', ombra: '#3e2616' },
  'ndour':              { pelle: '#5a3a24', ombra: '#3e2616' },
  'ngonge':             { pelle: '#4a2e1b', ombra: '#2f1c0f' },
  'diao':               { pelle: '#5a3a24', ombra: '#3e2616' },
  'fofana':             { pelle: '#4a2e1b', ombra: '#2f1c0f' },
  'bella-kotchap':      { pelle: '#5a3a24', ombra: '#3e2616' },
  'okoye':              { pelle: '#4a2e1b', ombra: '#2f1c0f' },
  'solet':              { pelle: '#5a3a24', ombra: '#3e2616' },
  'ekkelenkamp':        { pelle: '#e8b88a', ombra: '#c99a6e' },
  'kabasele':           { pelle: '#4a2e1b', ombra: '#2f1c0f' },
  'abankwah':           { pelle: '#4a2e1b', ombra: '#2f1c0f' },
  'ehizibue':           { pelle: '#5a3a24', ombra: '#3e2616' },
  'marcandalli':        { pelle: '#e8b88a', ombra: '#c99a6e' },
  'osmajic':            { pelle: '#e8b88a', ombra: '#c99a6e' },
  'vitinha':            { pelle: '#d9a070', ombra: '#b8804f' },
  'muriç':              { pelle: '#5a3a24', ombra: '#3e2616' },
  'muric':              { pelle: '#5a3a24', ombra: '#3e2616' },
  'bakola':             { pelle: '#4a2e1b', ombra: '#2f1c0f' },
  'idzes':              { pelle: '#e8b88a', ombra: '#c99a6e' },
  'leysen':             { pelle: '#e8b88a', ombra: '#c99a6e' },
  'coulibaly':          { pelle: '#4a2e1b', ombra: '#2f1c0f' },
  'ngom':               { pelle: '#4a2e1b', ombra: '#2f1c0f' },
  'ilic':               { pelle: '#e8b88a', ombra: '#c99a6e' },
  'gallo':              { pelle: '#e8b88a', ombra: '#c99a6e' },
  'schmid':             { pelle: '#f0c8a0', ombra: '#d4a878' },
  'calò':               { pelle: '#e8b88a', ombra: '#c99a6e' },
  'oyono':              { pelle: '#4a2e1b', ombra: '#2f1c0f' },
  'bracaglia':          { pelle: '#e8b88a', ombra: '#c99a6e' },
  'masini':             { pelle: '#e8b88a', ombra: '#c99a6e' },
  'ghedjemis':          { pelle: '#d9a070', ombra: '#b8804f' },
  'fini':               { pelle: '#e8b88a', ombra: '#c99a6e' },
  'zerbin':             { pelle: '#e8b88a', ombra: '#c99a6e' },
  'cichella':           { pelle: '#e8b88a', ombra: '#c99a6e' },
  'calvani':            { pelle: '#e8b88a', ombra: '#c99a6e' },
  'monterisi':          { pelle: '#e8b88a', ombra: '#c99a6e' },
  'terzic':             { pelle: '#e8b88a', ombra: '#c99a6e' },
  'fayed':              { pelle: '#d9a070', ombra: '#b8804f' },
  'grilitsch':          { pelle: '#f0c8a0', ombra: '#d4a878' },
  'lolic':              { pelle: '#f0c8a0', ombra: '#d4a878' },
  'palmisani':          { pelle: '#e8b88a', ombra: '#c99a6e' },
  'skorupski':          { pelle: '#f0c8a0', ombra: '#d4a878' },
  'heggem':             { pelle: '#f0c8a0', ombra: '#d4a878' },
  'theate':             { pelle: '#f0c8a0', ombra: '#d4a878' },
  'zortea':             { pelle: '#e8b88a', ombra: '#c99a6e' },
  'miranda':            { pelle: '#e8b88a', ombra: '#c99a6e' },
  'pobega':             { pelle: '#e8b88a', ombra: '#c99a6e' },
  'ferguson':           { pelle: '#f0c8a0', ombra: '#d4a878' },
  'cambiaghi':          { pelle: '#e8b88a', ombra: '#c99a6e' },
  'dovbyk':             { pelle: '#f0c8a0', ombra: '#d4a878' },
  'holm':               { pelle: '#f0c8a0', ombra: '#d4a878' },
  'helland':            { pelle: '#f0c8a0', ombra: '#d4a878' },
  'casale':             { pelle: '#e8b88a', ombra: '#c99a6e' },
  'moro':               { pelle: '#e8b88a', ombra: '#c99a6e' },
  'bernardeschi':       { pelle: '#e8b88a', ombra: '#c99a6e' },
  'piccoli':            { pelle: '#e8b88a', ombra: '#c99a6e' },
  'vitik':              { pelle: '#f0c8a0', ombra: '#d4a878' },
  'caprile':            { pelle: '#e8b88a', ombra: '#c99a6e' },
  'mina':               { pelle: '#5a3a24', ombra: '#3e2616' },
  'rodriguez':          { pelle: '#e8b88a', ombra: '#c99a6e' },
  'zè pedro':           { pelle: '#e8b88a', ombra: '#c99a6e' },
  'obert':              { pelle: '#e8b88a', ombra: '#c99a6e' },
  'winks':              { pelle: '#f0c8a0', ombra: '#d4a878' },
  'romano':             { pelle: '#e8b88a', ombra: '#c99a6e' },
  'fazzini':            { pelle: '#e8b88a', ombra: '#c99a6e' },
  'radunovic':          { pelle: '#f0c8a0', ombra: '#d4a878' },
  'sugawara':           { pelle: '#f0c8a0', ombra: '#d4a878' },
  'deiola':             { pelle: '#e8b88a', ombra: '#c99a6e' },
  'idrissi':            { pelle: '#5a3a24', ombra: '#3e2616' },
  'butez':              { pelle: '#f0c8a0', ombra: '#d4a878' },
  'chalobah':           { pelle: '#5a3a24', ombra: '#3e2616' },
  'ramon':              { pelle: '#e8b88a', ombra: '#c99a6e' },
  'yan couto':          { pelle: '#d9a070', ombra: '#b8804f' },
  'valle':              { pelle: '#e8b88a', ombra: '#c99a6e' },
  'da cunha':           { pelle: '#d9a070', ombra: '#b8804f' },
  'perrone':            { pelle: '#e8b88a', ombra: '#c99a6e' },
  'nico paz':           { pelle: '#e8b88a', ombra: '#c99a6e' },
  'douvikas':           { pelle: '#f0c8a0', ombra: '#d4a878' },
  'baturina':           { pelle: '#e8b88a', ombra: '#c99a6e' },
  'vigorito':           { pelle: '#e8b88a', ombra: '#c99a6e' },
  'kaiki':              { pelle: '#d9a070', ombra: '#b8804f' },
  'kempf':              { pelle: '#f0c8a0', ombra: '#d4a878' },
  'milla':              { pelle: '#5a3a24', ombra: '#3e2616' },
  'kean':               { pelle: '#5a3a24', ombra: '#3e2616' },
  'caqueret':           { pelle: '#f0c8a0', ombra: '#d4a878' },
  'de gea':             { pelle: '#f0c8a0', ombra: '#d4a878' },
  'dragusin':           { pelle: '#f0c8a0', ombra: '#d4a878' },
  'ranieri':            { pelle: '#e8b88a', ombra: '#c99a6e' },
  'jimenez':            { pelle: '#d9a070', ombra: '#b8804f' },
  'viery':              { pelle: '#e8b88a', ombra: '#c99a6e' },
  'fagioli':            { pelle: '#e8b88a', ombra: '#c99a6e' },
  'atta':               { pelle: '#5a3a24', ombra: '#3e2616' },
  'mastantuono':        { pelle: '#d9a070', ombra: '#b8804f' },
  'pellegrino':         { pelle: '#e8b88a', ombra: '#c99a6e' },
  'pedro goncalves':    { pelle: '#e8b88a', ombra: '#c99a6e' },
  'christensen':        { pelle: '#f0c8a0', ombra: '#d4a878' },
  'valdepenas':         { pelle: '#e8b88a', ombra: '#c99a6e' },
  'pongracic':          { pelle: '#f0c8a0', ombra: '#d4a878' },
  'oulai':              { pelle: '#4a2e1b', ombra: '#2f1c0f' },
  'njie':               { pelle: '#4a2e1b', ombra: '#2f1c0f' },
  'beto':               { pelle: '#5a3a24', ombra: '#3e2616' },
  'bijlow':             { pelle: '#f0c8a0', ombra: '#d4a878' },
  'ostigard':           { pelle: '#f0c8a0', ombra: '#d4a878' },
  'vasquez':            { pelle: '#e8b88a', ombra: '#c99a6e' },
  'frendrup':           { pelle: '#f0c8a0', ombra: '#d4a878' },
  'baldanzi':           { pelle: '#e8b88a', ombra: '#c99a6e' },
  'ellertsson':         { pelle: '#f0c8a0', ombra: '#d4a878' },
  'colombo':            { pelle: '#e8b88a', ombra: '#c99a6e' },
  'sommariva':          { pelle: '#e8b88a', ombra: '#c99a6e' },
  'drameh':             { pelle: '#5a3a24', ombra: '#3e2616' },
  'matturro':           { pelle: '#e8b88a', ombra: '#c99a6e' },
  'messias':            { pelle: '#d9a070', ombra: '#b8804f' },
  'el shaarawy':        { pelle: '#e8b88a', ombra: '#c99a6e' },
  'sabelli':            { pelle: '#e8b88a', ombra: '#c99a6e' },
  'martinez':           { pelle: '#f0c8a0', ombra: '#d4a878' },
  'akanji':             { pelle: '#5a3a24', ombra: '#3e2616' },
  'bastoni':            { pelle: '#e8b88a', ombra: '#c99a6e' },
  'bisseck':            { pelle: '#5a3a24', ombra: '#3e2616' },
  'dimarco':            { pelle: '#e8b88a', ombra: '#c99a6e' },
  'barella':            { pelle: '#e8b88a', ombra: '#c99a6e' },
  'calhanoglu':         { pelle: '#e8b88a', ombra: '#c99a6e' },
  'zielinski':          { pelle: '#f0c8a0', ombra: '#d4a878' },
  'diouf':              { pelle: '#4a2e1b', ombra: '#2f1c0f' },
  'thuram':             { pelle: '#5a3a24', ombra: '#3e2616' },
  'provedel':           { pelle: '#e8b88a', ombra: '#c99a6e' },
  'stones':             { pelle: '#f0c8a0', ombra: '#d4a878' },
  'pavard':             { pelle: '#f0c8a0', ombra: '#d4a878' },
  'sucic':              { pelle: '#f0c8a0', ombra: '#d4a878' },
  'frattesi':           { pelle: '#e8b88a', ombra: '#c99a6e' },
  'pio esposito':       { pelle: '#e8b88a', ombra: '#c99a6e' },
  'spence':             { pelle: '#5a3a24', ombra: '#3e2616' },
  'vicario':            { pelle: '#e8b88a', ombra: '#c99a6e' },
  'kalulu':             { pelle: '#5a3a24', ombra: '#3e2616' },
  'bremer':             { pelle: '#5a3a24', ombra: '#3e2616' },
  'lucumì':             { pelle: '#4a2e1b', ombra: '#2f1c0f' },
  'celik':              { pelle: '#e8b88a', ombra: '#c99a6e' },
  'douglas luiz':       { pelle: '#d9a070', ombra: '#b8804f' },
  'conceiçao':          { pelle: '#d9a070', ombra: '#b8804f' },
  'yildiz':             { pelle: '#e8b88a', ombra: '#c99a6e' },
  'woltemade':          { pelle: '#f0c8a0', ombra: '#d4a878' },
  'grabara':            { pelle: '#f0c8a0', ombra: '#d4a878' },
  'gatti':              { pelle: '#e8b88a', ombra: '#c99a6e' },
  'cambiaso':           { pelle: '#e8b88a', ombra: '#c99a6e' },
  'sarr':               { pelle: '#4a2e1b', ombra: '#2f1c0f' },
  'koopmeiners':        { pelle: '#f0c8a0', ombra: '#d4a878' },
  'nico gonzalez':      { pelle: '#d9a070', ombra: '#b8804f' },
  'alajbegovic':        { pelle: '#f0c8a0', ombra: '#d4a878' },
  'mandas':             { pelle: '#e8b88a', ombra: '#c99a6e' },
  'doekhi':             { pelle: '#5a3a24', ombra: '#3e2616' },
  'provstgaard':        { pelle: '#f0c8a0', ombra: '#d4a878' },
  'marusic':            { pelle: '#e8b88a', ombra: '#c99a6e' },
  'nuno tavares':       { pelle: '#d9a070', ombra: '#b8804f' },
  'taylor':             { pelle: '#f0c8a0', ombra: '#d4a878' },
  'rovella':            { pelle: '#e8b88a', ombra: '#c99a6e' },
  'cancellieri':        { pelle: '#e8b88a', ombra: '#c99a6e' },
  'noslin':             { pelle: '#e8b88a', ombra: '#c99a6e' },
  'zaccagni':           { pelle: '#e8b88a', ombra: '#c99a6e' },
  'furlanetto':         { pelle: '#e8b88a', ombra: '#c99a6e' },
  'sutalo':             { pelle: '#f0c8a0', ombra: '#d4a878' },
  'patric':             { pelle: '#e8b88a', ombra: '#c99a6e' },
  'floriani':           { pelle: '#e8b88a', ombra: '#c99a6e' },
  'cataldi':            { pelle: '#e8b88a', ombra: '#c99a6e' },
  'isaksen':            { pelle: '#f0c8a0', ombra: '#d4a878' },
  'pinamonti':          { pelle: '#e8b88a', ombra: '#c99a6e' },
  'falcone':            { pelle: '#e8b88a', ombra: '#c99a6e' },
  'gaspar':             { pelle: '#e8b88a', ombra: '#c99a6e' },
  'tiago gabriel':      { pelle: '#d9a070', ombra: '#b8804f' },
  'd. veiga':           { pelle: '#d9a070', ombra: '#b8804f' },
  'pierotti':           { pelle: '#e8b88a', ombra: '#c99a6e' },
  'geubbels':           { pelle: '#5a3a24', ombra: '#3e2616' },
  'monteiro':           { pelle: '#d9a070', ombra: '#b8804f' },
  'penev':              { pelle: '#f0c8a0', ombra: '#d4a878' },
  'siebert':            { pelle: '#f0c8a0', ombra: '#d4a878' },
  'ndaba':              { pelle: '#4a2e1b', ombra: '#2f1c0f' },
  'berisha':            { pelle: '#e8b88a', ombra: '#c99a6e' },
  "n'dri":              { pelle: '#4a2e1b', ombra: '#2f1c0f' },
  'stulic':             { pelle: '#f0c8a0', ombra: '#d4a878' },
  'maignan':            { pelle: '#5a3a24', ombra: '#3e2616' },
  'de winter':          { pelle: '#f0c8a0', ombra: '#d4a878' },
  'pavlovic':           { pelle: '#f0c8a0', ombra: '#d4a878' },
  'gila':               { pelle: '#e8b88a', ombra: '#c99a6e' },
  'moreira':            { pelle: '#d9a070', ombra: '#b8804f' },
  'modric':             { pelle: '#f0c8a0', ombra: '#d4a878' },
  'rabiot':             { pelle: '#f0c8a0', ombra: '#d4a878' },
  'chukwueze':          { pelle: '#4a2e1b', ombra: '#2f1c0f' },
  'cissé':              { pelle: '#4a2e1b', ombra: '#2f1c0f' },
  'cissè':              { pelle: '#4a2e1b', ombra: '#2f1c0f' },
  'ramos':              { pelle: '#e8b88a', ombra: '#c99a6e' },
  'terracciano':        { pelle: '#e8b88a', ombra: '#c99a6e' },
  'gabbia':             { pelle: '#e8b88a', ombra: '#c99a6e' },
  'estupinan':          { pelle: '#5a3a24', ombra: '#3e2616' },
  'musah':              { pelle: '#5a3a24', ombra: '#3e2616' },
  'saelemaekers':       { pelle: '#f0c8a0', ombra: '#d4a878' },
  'loftus-cheek':       { pelle: '#5a3a24', ombra: '#3e2616' },
  'leão':               { pelle: '#5a3a24', ombra: '#3e2616' },
  'leao':               { pelle: '#5a3a24', ombra: '#3e2616' },
  'tornqvist':          { pelle: '#f0c8a0', ombra: '#d4a878' },
  'ziolkowski':         { pelle: '#f0c8a0', ombra: '#d4a878' },
  'carboni':            { pelle: '#e8b88a', ombra: '#c99a6e' },
  'kouadio':            { pelle: '#4a2e1b', ombra: '#2f1c0f' },
  'mangas':             { pelle: '#5a3a24', ombra: '#3e2616' },
  'folorunsho':         { pelle: '#5a3a24', ombra: '#3e2616' },
  'birindelli':         { pelle: '#e8b88a', ombra: '#c99a6e' },
  'zeballos':           { pelle: '#d9a070', ombra: '#b8804f' },
  'robinson':           { pelle: '#5a3a24', ombra: '#3e2616' },
  'varela':             { pelle: '#e8b88a', ombra: '#c99a6e' },
  'thiam':              { pelle: '#4a2e1b', ombra: '#2f1c0f' },
  'antov':              { pelle: '#f0c8a0', ombra: '#d4a878' },
  'lucchesi':           { pelle: '#e8b88a', ombra: '#c99a6e' },
  'akinsanmiro':        { pelle: '#4a2e1b', ombra: '#2f1c0f' },
  'colpani':            { pelle: '#e8b88a', ombra: '#c99a6e' },
  'cutrone':            { pelle: '#e8b88a', ombra: '#c99a6e' },
  'meret':              { pelle: '#e8b88a', ombra: '#c99a6e' },
  'rrahmani':           { pelle: '#e8b88a', ombra: '#c99a6e' },
  'beukema':            { pelle: '#f0c8a0', ombra: '#d4a878' },
  'di lorenzo':         { pelle: '#e8b88a', ombra: '#c99a6e' },
  'spinazzola':         { pelle: '#e8b88a', ombra: '#c99a6e' },
  'lobotka':            { pelle: '#f0c8a0', ombra: '#d4a878' },
  'mctominay':          { pelle: '#f0c8a0', ombra: '#d4a878' },
  'de bruyne':          { pelle: '#f0c8a0', ombra: '#d4a878' },
  'højlund':            { pelle: '#f0c8a0', ombra: '#d4a878' },
  'hojlund':            { pelle: '#f0c8a0', ombra: '#d4a878' },
  'lang':               { pelle: '#f0c8a0', ombra: '#d4a878' },
  'milinković-savić':   { pelle: '#f0c8a0', ombra: '#d4a878' },
  'milinkovic-savic':   { pelle: '#f0c8a0', ombra: '#d4a878' },
  'buongiorno':         { pelle: '#e8b88a', ombra: '#c99a6e' },
  'marianucci':         { pelle: '#e8b88a', ombra: '#c99a6e' },
  'gilmour':            { pelle: '#f0c8a0', ombra: '#d4a878' },
  'anguissa':           { pelle: '#4a2e1b', ombra: '#2f1c0f' },
  'neres':              { pelle: '#5a3a24', ombra: '#3e2616' },
  'lucca':              { pelle: '#e8b88a', ombra: '#c99a6e' },
  'corvi':              { pelle: '#e8b88a', ombra: '#c99a6e' },
  'troilo':             { pelle: '#e8b88a', ombra: '#c99a6e' },
  'diego carlos':       { pelle: '#5a3a24', ombra: '#3e2616' },
  'delprato':           { pelle: '#e8b88a', ombra: '#c99a6e' },
  'lontani':            { pelle: '#e8b88a', ombra: '#c99a6e' },
  'bernabé':            { pelle: '#e8b88a', ombra: '#c99a6e' },
  'bernabè':            { pelle: '#e8b88a', ombra: '#c99a6e' },
  'britschgi':          { pelle: '#f0c8a0', ombra: '#d4a878' },
  'valeri':             { pelle: '#e8b88a', ombra: '#c99a6e' },
  'romero':             { pelle: '#d9a070', ombra: '#b8804f' },
  'daffara':            { pelle: '#e8b88a', ombra: '#c99a6e' },
  'balogh':             { pelle: '#f0c8a0', ombra: '#d4a878' },
  'sierro':             { pelle: '#f0c8a0', ombra: '#d4a878' },
  'fabbian':            { pelle: '#e8b88a', ombra: '#c99a6e' },
  'elphege':            { pelle: '#5a3a24', ombra: '#3e2616' },
  'benedyczak':         { pelle: '#f0c8a0', ombra: '#d4a878' },
  'svilar':             { pelle: '#f0c8a0', ombra: '#d4a878' },
  'balerdi':            { pelle: '#d9a070', ombra: '#b8804f' },
  'hermoso':            { pelle: '#e8b88a', ombra: '#c99a6e' },
  'wesley':             { pelle: '#5a3a24', ombra: '#3e2616' },
  'molina':             { pelle: '#e8b88a', ombra: '#c99a6e' },
  'soulé':              { pelle: '#e8b88a', ombra: '#c99a6e' },
  'soule':              { pelle: '#e8b88a', ombra: '#c99a6e' },
  'malen':              { pelle: '#5a3a24', ombra: '#3e2616' },
  'gollini':            { pelle: '#e8b88a', ombra: '#c99a6e' },
  'ndicka':             { pelle: '#4a2e1b', ombra: '#2f1c0f' },
  'ghilardi':           { pelle: '#e8b88a', ombra: '#c99a6e' },
  'lulli':              { pelle: '#e8b88a', ombra: '#c99a6e' },
  'mora':               { pelle: '#e8b88a', ombra: '#c99a6e' },
  'el aynaoui':         { pelle: '#d9a070', ombra: '#b8804f' },
  'cinquegrano':        { pelle: '#e8b88a', ombra: '#c99a6e' },
  'doig':               { pelle: '#f0c8a0', ombra: '#d4a878' },
  'matic':              { pelle: '#f0c8a0', ombra: '#d4a878' },
  'thorstvedt':         { pelle: '#f0c8a0', ombra: '#d4a878' },
  'turati':             { pelle: '#e8b88a', ombra: '#c99a6e' },
  'obrador':            { pelle: '#e8b88a', ombra: '#c99a6e' },
  'walukiewicz':        { pelle: '#f0c8a0', ombra: '#d4a878' },
  'adzic':              { pelle: '#f0c8a0', ombra: '#d4a878' },
  'volpato':            { pelle: '#e8b88a', ombra: '#c99a6e' },
  'bowie':              { pelle: '#5a3a24', ombra: '#3e2616' },
  'lipani':             { pelle: '#e8b88a', ombra: '#c99a6e' },
  'lucas perri':        { pelle: '#d9a070', ombra: '#b8804f' },
  'coco':               { pelle: '#e8b88a', ombra: '#c99a6e' },
  'comert':             { pelle: '#f0c8a0', ombra: '#d4a878' },
  'comuzzo':            { pelle: '#e8b88a', ombra: '#c99a6e' },
  'belghali':           { pelle: '#d9a070', ombra: '#b8804f' },
  'mandragora':         { pelle: '#e8b88a', ombra: '#c99a6e' },
  'fitz-jim':           { pelle: '#5a3a24', ombra: '#3e2616' },
  'braganca':           { pelle: '#e8b88a', ombra: '#c99a6e' },
  'cacciamani':         { pelle: '#e8b88a', ombra: '#c99a6e' },
  'vlasic':             { pelle: '#f0c8a0', ombra: '#d4a878' },
  'simeone':            { pelle: '#d9a070', ombra: '#b8804f' },
  'paleari':            { pelle: '#e8b88a', ombra: '#c99a6e' },
  'fortini':            { pelle: '#e8b88a', ombra: '#c99a6e' },
  'ismajli':            { pelle: '#e8b88a', ombra: '#c99a6e' },
  'gineitis':           { pelle: '#f0c8a0', ombra: '#d4a878' },
  'casadei':            { pelle: '#e8b88a', ombra: '#c99a6e' },
  'adams':              { pelle: '#5a3a24', ombra: '#3e2616' },
  'anjorin':            { pelle: '#5a3a24', ombra: '#3e2616' },
  'vojvoda':            { pelle: '#e8b88a', ombra: '#c99a6e' },
  'karlstrom':          { pelle: '#f0c8a0', ombra: '#d4a878' },
  'piotrowski':         { pelle: '#f0c8a0', ombra: '#d4a878' },
  'kamara':             { pelle: '#4a2e1b', ombra: '#2f1c0f' },
  'zaniolo':            { pelle: '#e8b88a', ombra: '#c99a6e' },
  'davis':              { pelle: '#5a3a24', ombra: '#3e2616' },
  'padelli':            { pelle: '#e8b88a', ombra: '#c99a6e' },
  'alaba':              { pelle: '#5a3a24', ombra: '#3e2616' },
  'bertola':            { pelle: '#e8b88a', ombra: '#c99a6e' },
  'miller':             { pelle: '#f0c8a0', ombra: '#d4a878' },
  'unai gomez':         { pelle: '#e8b88a', ombra: '#c99a6e' },
  'zarraga':            { pelle: '#e8b88a', ombra: '#c99a6e' },
  'zanoli':             { pelle: '#e8b88a', ombra: '#c99a6e' },
  'stankovic':          { pelle: '#f0c8a0', ombra: '#d4a878' },
  'schingtienne':       { pelle: '#5a3a24', ombra: '#3e2616' },
  'juan jesus':         { pelle: '#e8b88a', ombra: '#c99a6e' },
  'basic':              { pelle: '#f0c8a0', ombra: '#d4a878' },
  'busio':              { pelle: '#f0c8a0', ombra: '#d4a878' },
  'kike perez':         { pelle: '#e8b88a', ombra: '#c99a6e' },
  'hainaut':            { pelle: '#5a3a24', ombra: '#3e2616' },
  'correia':            { pelle: '#d9a070', ombra: '#b8804f' },
  'yeboah':             { pelle: '#4a2e1b', ombra: '#2f1c0f' },
  'grandi':             { pelle: '#e8b88a', ombra: '#c99a6e' },
  'mazzocchi':          { pelle: '#e8b88a', ombra: '#c99a6e' },
  'moreno':             { pelle: '#e8b88a', ombra: '#c99a6e' },
  'haps':               { pelle: '#5a3a24', ombra: '#3e2616' },
  'sohm':               { pelle: '#f0c8a0', ombra: '#d4a878' },
  'lella':              { pelle: '#e8b88a', ombra: '#c99a6e' },
  'fanne':              { pelle: '#4a2e1b', ombra: '#2f1c0f' }
};

function carnagionePer(nome) {
  if (!nome) return CARNAGIONI['default'];
  var n = nome.toLowerCase().trim();
  if (CARNAGIONI[n]) return CARNAGIONI[n];
  for (var k in CARNAGIONI) {
    if (k === 'default') continue;
    if (n.indexOf(k) !== -1) return CARNAGIONI[k];
  }
  return CARNAGIONI['default'];
}

/* ============================================================
   GENERA SVG GIOCATORE - VISO "CLASSICO"
   Struttura:
   - <g class="pg-corpo"> wrappa TUTTO (testa, busto, braccia, gambe)
     → usato per la rotazione del tuffo portiere
   - pg-testa / pg-busto / pg-braccio-sx/dx / pg-gamba-* → animazioni locali
   viewBox: 0 0 40 60
   ============================================================ */
function creaGiocatoreSVG(divisa, animazione, nomeGiocatore) {
  if (!divisa) divisa = { maglia: '#888888', pantaloncini: '#333333', calzettoni: '#888888' };

  var animClass = animazione === 'fermo' ? 'anim-fermo' : '';
  var idPattern = 'righe_' + Math.random().toString(36).substr(2, 9);

  var carn = carnagionePer(nomeGiocatore);
  var pelle = carn.pelle;
  var ombra = carn.ombra;

  var svg = '<svg viewBox="0 0 40 60" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" class="' + animClass + '">';

  if (divisa.righe && divisa.colore2) {
    svg += '<defs>';
    svg += '<pattern id="' + idPattern + '" x="0" y="0" width="8" height="8" patternUnits="userSpaceOnUse">';
    svg += '<rect x="0" y="0" width="4" height="8" fill="' + divisa.maglia + '"/>';
    svg += '<rect x="4" y="0" width="4" height="8" fill="' + divisa.colore2 + '"/>';
    svg += '</pattern>';
    svg += '</defs>';
  }

  var fillMaglia = (divisa.righe && divisa.colore2) ? 'url(#' + idPattern + ')' : divisa.maglia;

  /* === WRAPPER CORPO (per rotazione tuffo) === */
  svg += '<g class="pg-corpo" style="transform-origin: 20px 40px; transform-box: view-box;">';

  // ===== TESTA =====
  svg += '<g class="pg-testa" style="transform-origin: 20px 17px; transform-box: view-box;">';
  svg += '<path d="M 17.5 15 L 17.5 19 L 22.5 19 L 22.5 15 Z" fill="' + pelle + '" stroke="#333" stroke-width="0.5"/>';
  svg += '<ellipse cx="20" cy="10" rx="7.5" ry="7.8" fill="' + pelle + '" stroke="#333" stroke-width="1"/>';
  svg += '<path d="M 12.5 9 Q 12 2.8 20 2.8 Q 28 2.8 27.5 9 Q 26 6 23 5.5 Q 20 5 17 5.5 Q 14 6 12.5 9 Z" fill="#6b4a2b" stroke="#4a3020" stroke-width="0.5"/>';
  svg += '<path d="M 25 5.5 Q 27 6.5 27.3 9 Q 26.5 7.5 25 5.5 Z" fill="#6b4a2b" stroke="#4a3020" stroke-width="0.3"/>';
  svg += '<ellipse cx="12.5" cy="10.5" rx="1.3" ry="1.8" fill="' + pelle + '" stroke="#333" stroke-width="0.7"/>';
  svg += '<ellipse cx="27.5" cy="10.5" rx="1.3" ry="1.8" fill="' + pelle + '" stroke="#333" stroke-width="0.7"/>';
  svg += '<circle cx="17" cy="10" r="1.1" fill="#1a1a1a"/>';
  svg += '<circle cx="23" cy="10" r="1.1" fill="#1a1a1a"/>';
  svg += '<circle cx="16.7" cy="9.7" r="0.3" fill="#fff"/>';
  svg += '<circle cx="22.7" cy="9.7" r="0.3" fill="#fff"/>';
  svg += '<path d="M 15 7.8 Q 17 7.3 18.5 7.8" fill="none" stroke="#4a3020" stroke-width="0.7" stroke-linecap="round"/>';
  svg += '<path d="M 21.5 7.8 Q 23 7.3 25 7.8" fill="none" stroke="#4a3020" stroke-width="0.7" stroke-linecap="round"/>';
  svg += '<path d="M 20 10.8 L 19.6 12.5 Q 20 12.8 20.4 12.5 Z" fill="' + ombra + '" opacity="0.7"/>';
  svg += '<path d="M 17.5 13.8 Q 20 15.3 22.5 13.8" fill="none" stroke="#8a3b3b" stroke-width="0.8" stroke-linecap="round"/>';
  svg += '<ellipse cx="14.5" cy="12.5" rx="1" ry="0.5" fill="#f4a0a0" opacity="0.3"/>';
  svg += '<ellipse cx="25.5" cy="12.5" rx="1" ry="0.5" fill="#f4a0a0" opacity="0.3"/>';
  svg += '</g>';

  // ===== BUSTO =====
  svg += '<g class="pg-busto" style="transform-origin: 20px 36px; transform-box: view-box;">';
  svg += '<path d="M 12 20 Q 12 18 14 17.5 Q 20 16.5 26 17.5 Q 28 18 28 20 L 29 34 Q 29 37.5 26 37.8 Q 20 38.3 14 37.8 Q 11 37.5 11 34 Z" fill="' + fillMaglia + '" stroke="#222" stroke-width="1" stroke-linejoin="round"/>';
  svg += '<path d="M 16 17.5 Q 20 22.5 24 17.5" fill="none" stroke="#fff" stroke-width="1.1" stroke-linecap="round"/>';
  svg += '</g>';

  // ===== PANTALONCINI =====
  svg += '<path d="M 11.2 36.5 Q 20 39 28.8 36.5 L 28.4 43.5 Q 28.3 46 25.5 46 L 22.8 46 Q 21 46 20.5 44 Q 20 42.8 19.5 44 Q 19 46 17.2 46 L 14.5 46 Q 11.7 46 11.6 43.5 Z" fill="' + divisa.pantaloncini + '" stroke="#222" stroke-width="1" stroke-linejoin="round"/>';

  // ===== BRACCIO SINISTRO =====
  svg += '<g class="pg-braccio-sx" style="transform-origin: 12px 20px; transform-box: view-box;">';
  svg += '<path d="M 12 19.5 Q 9 19.5 8.5 22 L 7.8 31 Q 7.6 34.5 10.5 35 Q 13.5 35.5 14 32 L 14.8 22.5 Q 15 20 12 19.5 Z" fill="' + fillMaglia + '" stroke="#222" stroke-width="1" stroke-linejoin="round"/>';
  svg += '<circle cx="11" cy="35.5" r="3.2" fill="' + pelle + '" stroke="#333" stroke-width="1"/>';
  svg += '</g>';

  // ===== BRACCIO DESTRO =====
  svg += '<g class="pg-braccio-dx" style="transform-origin: 28px 20px; transform-box: view-box;">';
  svg += '<path d="M 28 19.5 Q 31 19.5 31.5 22 L 32.2 31 Q 32.4 34.5 29.5 35 Q 26.5 35.5 26 32 L 25.2 22.5 Q 25 20 28 19.5 Z" fill="' + fillMaglia + '" stroke="#222" stroke-width="1" stroke-linejoin="round"/>';
  svg += '<circle cx="29" cy="35.5" r="3.2" fill="' + pelle + '" stroke="#333" stroke-width="1"/>';
  svg += '</g>';

  // ===== GAMBA SINISTRA =====
  svg += '<g class="pg-gamba-sx" style="transform-origin: 16px 48px; transform-box: view-box;">';
  svg += '<path d="M 14.2 45 Q 13.8 48 14 51 L 14.2 52.5 Q 14.5 52.8 16 52.8 Q 17.5 52.8 17.8 52.5 L 18 51 Q 18.2 48 17.8 45 Z" fill="' + pelle + '" stroke="#333" stroke-width="1" stroke-linejoin="round"/>';
  svg += '<g class="pg-gamba-sx-bassa" style="transform-origin: 16px 52px; transform-box: view-box;">';
  svg += '<path d="M 14.2 52.5 Q 13.8 54 14 57.5 Q 16 58.3 18 57.5 Q 18.4 54 18.2 52.5 Q 17.5 52.8 16 52.8 Q 14.5 52.8 14.2 52.5 Z" fill="' + divisa.calzettoni + '" stroke="#222" stroke-width="1" stroke-linejoin="round"/>';
  svg += '<path d="M 12.5 58.5 Q 12 60 14 60 L 18.5 60 Q 20 60 19.5 58.7 Q 18 58.2 16 58.3 Q 14 58.2 12.5 58.5 Z" fill="#111" stroke="#222" stroke-width="0.6" stroke-linejoin="round"/>';
  svg += '</g></g>';

  // ===== GAMBA DESTRA =====
  svg += '<g class="pg-gamba-dx" style="transform-origin: 24px 48px; transform-box: view-box;">';
  svg += '<path d="M 22.2 45 Q 21.8 48 22 51 L 22.2 52.5 Q 22.5 52.8 24 52.8 Q 25.5 52.8 25.8 52.5 L 26 51 Q 26.2 48 25.8 45 Z" fill="' + pelle + '" stroke="#333" stroke-width="1" stroke-linejoin="round"/>';
  svg += '<g class="pg-gamba-dx-bassa" style="transform-origin: 24px 52px; transform-box: view-box;">';
  svg += '<path d="M 22.2 52.5 Q 21.8 54 22 57.5 Q 24 58.3 26 57.5 Q 26.4 54 25.8 52.5 Q 25.5 52.8 24 52.8 Q 22.5 52.8 22.2 52.5 Z" fill="' + divisa.calzettoni + '" stroke="#222" stroke-width="1" stroke-linejoin="round"/>';
  svg += '<path d="M 20.5 58.5 Q 20 60 22 60 L 26.5 60 Q 28 60 27.5 58.7 Q 26 58.2 24 58.3 Q 22 58.2 20.5 58.5 Z" fill="#111" stroke="#222" stroke-width="0.6" stroke-linejoin="round"/>';
  svg += '</g></g>';

  svg += '</g>'; /* chiude pg-corpo */

  svg += '</svg>';
  return svg;
}

function scegliDivise(sqTU, sqCPU) {
  var divTu = SQUADRE[sqTU] ? SQUADRE[sqTU].casa : { maglia: '#4dabf7', pantaloncini: '#0f3460', calzettoni: '#4dabf7' };
  var divCpu = SQUADRE[sqCPU] ? SQUADRE[sqCPU].casa : { maglia: '#ff6b6b', pantaloncini: '#7f1d1d', calzettoni: '#ff6b6b' };
  if (divTu.maglia === divCpu.maglia) {
    divCpu = SQUADRE[sqCPU] ? SQUADRE[sqCPU].portiere : { maglia: '#ffffff', pantaloncini: '#000000', calzettoni: '#ffffff' };
  }
  return { tu: divTu, cpu: divCpu };
}