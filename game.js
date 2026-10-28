/* ============================================================
   CONFIGURAZIONE
   ============================================================ */
var STAMINA_MAX = 10;
var CARTE_INIZIALI = 5;
var CARTE_MANO_MAX = 5;
var MINUTI_PER_MANO = 2;
var MANI_PER_TEMPO = 23;
var DURATA_ANIM_PALLA = 1400;
var DURATA_SCIVOLATA = 1100;
var DURATA_RITORNO = 400;
var MAX_BONUS = 3;
var STREAK_PER_BONUS = 3;
var BONUS_SCELTA_TIMEOUT = 8000;
var DURATA_SPOSTAMENTO_INIZIO = 600;
var SALITA_CALCIO_INIZIO = 100;
var MAX_CARTE_STESSO_SEME = 5;
var ORDINE_SEMI = ['bandierina', 'coppa', 'guantone', 'palla'];
var PAUSA_PRE_AZIONE = 1000;
var PAUSA_POST_AZIONE = 1000;
var DURATA_BANNER_VINCITORE = 3000;

var ZONE_PORTIERE_4 = { 1: [1,2,4,5], 2: [2,3,5,6], 3: [4,5,7,8], 4: [5,6,8,9] };
var CENTRI_ZONE_4 = { 1:{x:33.3,y:33.3}, 2:{x:66.6,y:33.3}, 3:{x:33.3,y:66.6}, 4:{x:66.6,y:66.6} };
var COPPIE_11 = { 1:[1,2],2:[1,4],3:[2,3],4:[2,5],5:[3,6],6:[4,5],7:[4,7],8:[5,6],9:[5,8],10:[7,8],11:[8,9] };
var PORTA_LEFT = 21.5, PORTA_TOP = 35, PORTA_W = 57, PORTA_H = 46;
var CASELLE_PERC = { 1:{x:16.6,y:16.6},2:{x:50,y:16.6},3:{x:83.3,y:16.6},4:{x:16.6,y:50},5:{x:50,y:50},6:{x:83.3,y:50},7:{x:16.6,y:83.3},8:{x:50,y:83.3},9:{x:83.3,y:83.3} };
var NOMI_BONUS = {
  'contrasto-sicuro':{nome:'Contrasto Sicuro',icona:'⭐'},
  'parata-super':{nome:'Parata Super',icona:'🧤'},
  'gol-super':{nome:'Gol Super',icona:'⚽'},
  'passaggio-lungo':{nome:'Passaggio Lungo',icona:'🎯'},
  'tiro-fuori-area':{nome:'Tiro da Fuori',icona:'🚀'}
};

var urlParams = new URLSearchParams(window.location.search);
var TORNEO_MODE = urlParams.get('torneo');
var PARTITA_TORNEO = urlParams.get('partita');
var URL_SQ_TU = urlParams.get('sqTU');
var URL_SQ_CPU = urlParams.get('sqCPU');
var URL_CASA = urlParams.get('casa');
var URL_TRASFERTA = urlParams.get('trasferta');

var SCENA_W = 1600, SCENA_H = 900, scalaCorrente = 1;
var POSIZIONI_COPPIE = [
  { x: 530,  y: 560, angolo: 180 }, { x: 510,  y: 700, angolo: 180 },
  { x: 680,  y: 480, angolo: 180 }, { x: 640,  y: 780, angolo: 180 },
  { x: 800,  y: 560, angolo: 180 }, { x: 800,  y: 700, angolo: 180 },
  { x: 920,  y: 480, angolo: 180 }, { x: 960,  y: 780, angolo: 180 },
  { x: 1070, y: 560, angolo: 180 }, { x: 1090, y: 700, angolo: 180 }
];
var MAPPA_COPPIE = [
  { zona: 1, meta: 'sup' }, { zona: 1, meta: 'inf' },
  { zona: 2, meta: 'sup' }, { zona: 2, meta: 'inf' },
  { zona: 3, meta: 'sup' }, { zona: 3, meta: 'inf' },
  { zona: 4, meta: 'sup' }, { zona: 4, meta: 'inf' },
  { zona: 5, meta: 'sup' }, { zona: 5, meta: 'inf' }
];
var POSIZIONI_PORTIERI = [ { x: 430, y: 600 }, { x: 1180, y: 600 } ];
var DISTANZA_COPPIA_PX = 60;

/* ============================================================
   FULLSCREEN
   ============================================================ */
function isFullscreen() { return !!(document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement || document.msFullscreenElement); }
function richiediFullscreen() {
  if (isFullscreen()) return;
  var el = document.documentElement; var p = null;
  if (el.requestFullscreen) p = el.requestFullscreen();
  else if (el.webkitRequestFullscreen) p = el.webkitRequestFullscreen();
  else if (el.mozRequestFullScreen) p = el.mozRequestFullScreen();
  else if (el.msRequestFullscreen) p = el.msRequestFullscreen();
  if (p && p.catch) p.catch(function(){});
  if (screen.orientation && screen.orientation.lock) screen.orientation.lock('landscape').catch(function(){});
  aggiornaIconaFullscreen(); setTimeout(adattaScena, 300);
}
function esciFullscreen() {
  var p = null;
  if (document.exitFullscreen) p = document.exitFullscreen();
  else if (document.webkitExitFullscreen) p = document.webkitExitFullscreen();
  else if (document.mozCancelFullScreen) p = document.mozCancelFullScreen();
  else if (document.msExitFullscreen) p = document.msExitFullscreen();
  if (p && p.catch) p.catch(function(){});
  aggiornaIconaFullscreen(); setTimeout(adattaScena, 300);
}
function toggleFullscreen() { initAudio(); if (isFullscreen()) esciFullscreen(); else richiediFullscreen(); }
function aggiornaIconaFullscreen() {
  var b = document.getElementById('btn-fullscreen'); if (!b) return;
  b.textContent = '⛶'; b.title = isFullscreen() ? 'Esci da schermo intero' : 'Schermo intero';
  b.style.borderColor = isFullscreen() ? '#ffd700' : '#4dabf7';
}
document.addEventListener('fullscreenchange', function() { aggiornaIconaFullscreen(); setTimeout(adattaScena, 200); });
document.addEventListener('webkitfullscreenchange', function() { aggiornaIconaFullscreen(); setTimeout(adattaScena, 200); });

/* ============================================================
   ZOOM — palla sempre al centro, scala 2x su tutti i device
   ============================================================ */
var zoomState = {
  modalita: 'palla2x', scalaTarget: 1, scalaCorrente: 1,
  offsetTargetX: 0, offsetTargetY: 0, offsetCorrenteX: 0, offsetCorrenteY: 0,
  smoothing: 0.10, rafId: null,
  seguiIstantaneo: false
};
function getPosizionePallaScena() {
  if (stato.giocatorePalla) {
    var wrapper = document.querySelector('[data-giocatore-id="' + stato.giocatorePalla + '"]');
    if (wrapper) {
      var scena = document.getElementById('scena');
      var r = wrapper.getBoundingClientRect(); var box = scena.getBoundingClientRect();
      return { x: (r.left + r.width / 2 - box.left) / scalaCorrente, y: (r.top + r.height / 2 - box.top) / scalaCorrente };
    }
  }
  if (stato.zonaPalla !== null && stato.zonaPalla !== undefined) {
    var meta = stato.metaContesa || 'inf'; var idx = -1;
    for (var i = 0; i < MAPPA_COPPIE.length; i++) if (MAPPA_COPPIE[i].zona === stato.zonaPalla && MAPPA_COPPIE[i].meta === meta) { idx = i; break; }
    if (idx >= 0) return { x: POSIZIONI_COPPIE[idx].x, y: POSIZIONI_COPPIE[idx].y };
  }
  return { x: SCENA_W / 2, y: SCENA_H / 2 };
}
function impostaZoomFit() { zoomState.modalita = 'palla2x'; }
function impostaZoomPalla2x() { zoomState.modalita = 'palla2x'; }

function aggiornaTargetZoom() {
  var scena = document.getElementById('scena'); var wrapper = document.getElementById('scena-wrapper');
  if (!scena || !wrapper) return;

  var box = wrapper.getBoundingClientRect();
  var w = box.width, h = box.height;
  if (w === 0 || h === 0) return;

  var scalaFit = Math.min(w / SCENA_W, h / SCENA_H);

  // SEMPRE 2x (camera on ball) — uguale su PC e mobile
  var scala = scalaFit * 2;

  var p = getPosizionePallaScena();
  var offsetX = w / 2 - p.x * scala;
  var offsetY = h / 2 - p.y * scala;
  var lS = SCENA_W * scala, aS = SCENA_H * scala;
  if (lS <= w) offsetX = (w - lS) / 2;
  else { if (offsetX > 0) offsetX = 0; if (offsetX < w - lS) offsetX = w - lS; }
  if (aS <= h) offsetY = (h - aS) / 2;
  else { if (offsetY > 0) offsetY = 0; if (offsetY < h - aS) offsetY = h - aS; }
  zoomState.scalaTarget = scala;
  zoomState.offsetTargetX = offsetX;
  zoomState.offsetTargetY = offsetY;
}

function applicaTransformScena() {
  var scena = document.getElementById('scena'); if (!scena) return;
  scena.style.transform = 'translate(' + zoomState.offsetCorrenteX + 'px,' + zoomState.offsetCorrenteY + 'px) scale(' + zoomState.scalaCorrente + ')';
  scalaCorrente = zoomState.scalaCorrente;
}

function loopZoom() {
  aggiornaTargetZoom();
  // Se stiamo seguendo la palla in movimento, snap istantaneo (campo scorre sotto)
  var s = zoomState.seguiIstantaneo ? 1.0 : zoomState.smoothing;
  zoomState.scalaCorrente     += (zoomState.scalaTarget     - zoomState.scalaCorrente)     * s;
  zoomState.offsetCorrenteX   += (zoomState.offsetTargetX   - zoomState.offsetCorrenteX)   * s;
  zoomState.offsetCorrenteY   += (zoomState.offsetTargetY   - zoomState.offsetCorrenteY)   * s;
  applicaTransformScena();
  zoomState.rafId = requestAnimationFrame(loopZoom);
}
function avviaLoopZoom() { if (zoomState.rafId) cancelAnimationFrame(zoomState.rafId); zoomState.rafId = requestAnimationFrame(loopZoom); }
function adattaScena() { avviaLoopZoom(); }
window.addEventListener('resize', adattaScena);
window.addEventListener('orientationchange', function() { setTimeout(adattaScena, 250); });

/* ============================================================
   HELPER UI
   ============================================================ */
function mostraBannerTop() { var p = document.getElementById('banner-top'); if (p) p.classList.remove('nascosto'); }
function nascondiBannerTop() { var p = document.getElementById('banner-top'); if (p) p.classList.add('nascosto'); }
function mostraCarteOverlay() { var o = document.getElementById('carte-overlay'); if (o) o.classList.add('attivo'); }
function nascondiCarteOverlay() { var o = document.getElementById('carte-overlay'); if (o) o.classList.remove('attivo'); }
function nascondiEntrambiBanner() {
  var b1 = document.getElementById('banner-top'); var b2 = document.getElementById('carte-overlay');
  if (b1) b1.classList.add('nascosto'); if (b2) b2.classList.remove('attivo');
}
function mostraEntrambiBanner() {
  var b1 = document.getElementById('banner-top'); if (b1) b1.classList.remove('nascosto');
  if (stato.contrasto && !stato.contrasto.risolto) { var b2 = document.getElementById('carte-overlay'); if (b2) b2.classList.add('attivo'); }
}

function mostraBonusChoice(tipo, callback) {
  var ov = document.getElementById('bonus-choice-overlay');
  var info = NOMI_BONUS[tipo];
  var carta = document.getElementById('bonus-choice-carta');
  document.getElementById('bonus-choice-titolo').textContent = 'USA CARTA BONUS?';
  document.getElementById('bonus-choice-sottotitolo').textContent = 'Hai una carta bonus disponibile!';
  document.getElementById('bonus-choice-icona').textContent = info.icona;
  document.getElementById('bonus-choice-nome').textContent = info.nome;
  carta.className = 'bonus-choice-carta ' + tipo;
  var azioni = document.getElementById('bonus-choice-azioni');
  azioni.innerHTML = '<button class="bonus-btn" id="bc-si">✅ SÌ, USA ' + info.icona + ' ' + info.nome.toUpperCase() + '</button><button id="bc-no" style="background:#8B2020;border-color:#ff6b6b">❌ NO, SALTA</button>';
  document.getElementById('bc-si').onclick = function() { clearTimeout(window._bonusChoiceTimer); chiudiBonusChoice(); callback(true); };
  document.getElementById('bc-no').onclick = function() { clearTimeout(window._bonusChoiceTimer); chiudiBonusChoice(); callback(false); };
  var timerEl = document.getElementById('bonus-choice-timer');
  var rimasti = Math.round(BONUS_SCELTA_TIMEOUT / 1000);
  timerEl.textContent = 'Scelta automatica tra ' + rimasti + 's';
  var intervallo = setInterval(function() { rimasti--; if (rimasti <= 0) { clearInterval(intervallo); timerEl.textContent = ''; return; } timerEl.textContent = 'Scelta automatica tra ' + rimasti + 's'; }, 1000);
  window._bonusChoiceTimer = setTimeout(function() { clearInterval(intervallo); chiudiBonusChoice(); callback(false); }, BONUS_SCELTA_TIMEOUT);
  ov.classList.add('attivo');
}
function chiudiBonusChoice() {
  var ov = document.getElementById('bonus-choice-overlay');
  if (ov) ov.classList.remove('attivo');
  if (window._bonusChoiceTimer) { clearTimeout(window._bonusChoiceTimer); window._bonusChoiceTimer = null; }
}

/* GITHUB */
var GH = { owner: 'Gesss26', repo: 'Soccer-Card', branch: 'main', path: 'calcio_carte_salvataggio.json', token: null, sha: null, abilitato: false };
var _ghDebounce = null;
function ghCaricaConfig() { try { var cfg = JSON.parse(localStorage.getItem('gh_config') || '{}'); if (cfg.token) { GH.token = cfg.token; GH.abilitato = true; } } catch(e) {} }
function ghSalvaConfig(token) { try { if (token) { localStorage.setItem('gh_config', JSON.stringify({ token: token })); GH.token = token; GH.abilitato = true; } else { localStorage.removeItem('gh_config'); GH.token = null; GH.abilitato = false; } } catch(e) {} }
function ghApiHeaders() { return { 'Authorization': 'Bearer ' + GH.token, 'Accept': 'application/vnd.github+json', 'X-GitHub-Api-Version': '2022-11-28' }; }
async function ghLeggiFile() {
  if (!GH.abilitato) return { contenuto: null, sha: null };
  var url = 'https://api.github.com/repos/' + GH.owner + '/' + GH.repo + '/contents/' + encodeURIComponent(GH.path) + '?ref=' + GH.branch;
  var r = await fetch(url, { headers: ghApiHeaders() });
  if (r.status === 404) return { contenuto: null, sha: null };
  if (!r.ok) throw new Error('GitHub GET ' + r.status);
  var j = await r.json();
  var testo = atob(j.content.replace(/\n/g, ''));
  testo = decodeURIComponent(escape(testo));
  return { contenuto: JSON.parse(testo), sha: j.sha };
}
async function ghScriviFile(oggetto) {
  if (!GH.abilitato) return null;
  var attuale = await ghLeggiFile().catch(function(){ return { sha: null }; });
  var contenuto = JSON.stringify(oggetto, null, 2);
  var b64 = btoa(unescape(encodeURIComponent(contenuto)));
  var body = { message: 'Salvataggio ' + new Date().toISOString(), content: b64, branch: GH.branch };
  if (attuale.sha) body.sha = attuale.sha;
  var url = 'https://api.github.com/repos/' + GH.owner + '/' + GH.repo + '/contents/' + encodeURIComponent(GH.path);
  var r = await fetch(url, { method: 'PUT', headers: Object.assign({ 'Content-Type': 'application/json' }, ghApiHeaders()), body: JSON.stringify(body) });
  if (!r.ok) throw new Error('GitHub PUT ' + r.status);
  var j = await r.json(); GH.sha = j.content.sha; return j;
}
var ghSalvataggioInCorso = false;
async function salvaSuGitHub() {
  if (!GH.abilitato || ghSalvataggioInCorso) return;
  ghSalvataggioInCorso = true;
  try {
    var dati = { versione: 1, data: new Date().toISOString(), ammonizioni: (typeof ammonizioni !== 'undefined') ? ammonizioni : null };
    var c = localStorage.getItem('seriea2027_v1'); if (c) dati.campionato = JSON.parse(c);
    var partita = localStorage.getItem('calcio_carte_partita_in_corso_v2'); if (partita) dati.partitaInCorso = JSON.parse(partita);
    await ghScriviFile(dati);
  } catch(e) {} finally { ghSalvataggioInCorso = false; }
}
async function caricaDaGitHub() {
  if (!GH.abilitato) return false;
  try {
    var r = await ghLeggiFile(); if (!r.contenuto) return false;
    var dati = r.contenuto;
    if (dati.ammonizioni && dati.ammonizioni.squadre) { ammonizioni = dati.ammonizioni; salvaAmmonizioniInLocalStorage(); }
    if (dati.campionato) localStorage.setItem('seriea2027_v1', JSON.stringify(dati.campionato));
    if (dati.partitaInCorso) localStorage.setItem('calcio_carte_partita_in_corso_v2', JSON.stringify(dati.partitaInCorso));
    return true;
  } catch(e) { return false; }
}
function programmaSalvataggioGitHub() { if (!GH.abilitato) return; if (_ghDebounce) clearTimeout(_ghDebounce); _ghDebounce = setTimeout(function() { salvaSuGitHub(); }, 4000); }

/* AMMONIZIONI */
var ammonizioni = null;
function caricaAmmonizioniDaLocalStorage() { try { var s = localStorage.getItem('campionato_ammonizioni'); if (s) return JSON.parse(s); } catch(e){} return null; }
function salvaAmmonizioniInLocalStorage() { try { localStorage.setItem('campionato_ammonizioni', JSON.stringify(ammonizioni)); programmaSalvataggioGitHub(); } catch(e){} }
function inizializzaAmmonizioni() { var d = caricaAmmonizioniDaLocalStorage(); ammonizioni = (d && d.squadre) ? d : { versione: 1, squadre: {} }; }
function getGiocatoreAmmonizioni(sqId, nome) { if (!ammonizioni || !ammonizioni.squadre[sqId]) return null; var sq = ammonizioni.squadre[sqId]; var ruoli = ['portiere','difensori','centrocampisti','difensori_alta','panchina']; for (var i=0;i<ruoli.length;i++){ var r=ruoli[i]; if (sq[r] && sq[r][nome]) return sq[r][nome]; } return null; }
function aggiornaAmmonizione(sqId, nome, d) {
  if (!ammonizioni.squadre[sqId]) ammonizioni.squadre[sqId] = {};
  if (!ammonizioni.squadre[sqId]['centrocampisti']) ammonizioni.squadre[sqId]['centrocampisti'] = {};
  if (!ammonizioni.squadre[sqId]['centrocampisti'][nome]) ammonizioni.squadre[sqId]['centrocampisti'][nome] = { gialli: 0, squalificato: false };
  var g = ammonizioni.squadre[sqId]['centrocampisti'][nome];
  g.gialli += d; if (g.gialli >= 6) g.squalificato = true;
}
function èSqualificato(sqId, nome) { var g = getGiocatoreAmmonizioni(sqId, nome); return g ? g.squalificato : false; }

function esportaCampionato() {
  var dati = { versione: 1, data: new Date().toISOString(), campionato: null, ammonizioni: ammonizioni };
  try { var c = localStorage.getItem('seriea2027_v1'); if (c) dati.campionato = JSON.parse(c); } catch(e){}
  var nomeFile = 'calcio_carte_salvataggio_' + new Date().toISOString().slice(0,10) + '.json';
  var blob = new Blob([JSON.stringify(dati, null, 2)], {type:'application/json'});
  var url = URL.createObjectURL(blob);
  var a = document.createElement('a'); a.href = url; a.download = nomeFile;
  document.body.appendChild(a); a.click(); document.body.removeChild(a);
  URL.revokeObjectURL(url);
  alert('✅ Salvataggio creato: ' + nomeFile);
}
function importaCampionato(file) {
  var reader = new FileReader();
  reader.onload = function(e) {
    try {
      var dati = JSON.parse(e.target.result);
      if (!dati || typeof dati !== 'object') { alert('File non valido'); return; }
      if (dati.ammonizioni && dati.ammonizioni.squadre) { ammonizioni = dati.ammonizioni; salvaAmmonizioniInLocalStorage(); }
      if (dati.campionato) localStorage.setItem('seriea2027_v1', JSON.stringify(dati.campionato));
      alert('✅ Importato! Ricaricamento...');
      setTimeout(function() { location.href = 'index.html'; }, 800);
    } catch(err) { alert('Errore: ' + err.message); }
  };
  reader.readAsText(file);
}
function resetCampionatoSalvato() { if (!confirm('Azzerare il campionato salvato?')) return; try { localStorage.removeItem('seriea2027_v1'); } catch(e){} alert('✅ Azzerato'); programmaSalvataggioGitHub(); }

/* AUDIO */
var audioCtx = null;
var volumeMusica = 0.5, volumeTifosi = 0.5, volumeEffetti = 0.5;
function initAudio() { if (!audioCtx) { try { audioCtx = new (window.AudioContext || window.webkitAudioContext)(); } catch(e){ audioCtx = null; } } if (audioCtx && audioCtx.state === 'suspended') audioCtx.resume(); }
function suonaFischietto(tipo) { initAudio(); if (!audioCtx) return; var ora = audioCtx.currentTime, durata, fb, fm; if (tipo === 'fallo') { durata=0.4; fb=2200; fm=30; } else if (tipo === 'fine-tempo') { durata=1.2; fb=2400; fm=25; } else if (tipo === 'fine-partita') { durata=1.8; fb=2500; fm=20; } else { durata=0.3; fb=2200; fm=30; } var o = audioCtx.createOscillator(); o.type='square'; o.frequency.setValueAtTime(fb, ora); var l = audioCtx.createOscillator(); l.frequency.setValueAtTime(fm, ora); var lg = audioCtx.createGain(); lg.gain.setValueAtTime(30, ora); l.connect(lg); lg.connect(o.frequency); var g = audioCtx.createGain(); g.gain.setValueAtTime(0, ora); g.gain.linearRampToValueAtTime(0.25 * volumeEffetti, ora+0.05); g.gain.linearRampToValueAtTime(0.25 * volumeEffetti, ora+durata-0.1); g.gain.linearRampToValueAtTime(0, ora+durata); o.connect(g); g.connect(audioCtx.destination); o.start(ora); l.start(ora); o.stop(ora+durata); l.stop(ora+durata); }
function suonaCalcio() { initAudio(); if (!audioCtx) return; var ora = audioCtx.currentTime; var o = audioCtx.createOscillator(); o.type='sine'; o.frequency.setValueAtTime(180, ora); o.frequency.exponentialRampToValueAtTime(50, ora+0.12); var g = audioCtx.createGain(); g.gain.setValueAtTime(0.35 * volumeEffetti, ora); g.gain.exponentialRampToValueAtTime(0.001, ora+0.18); o.connect(g); g.connect(audioCtx.destination); o.start(ora); o.stop(ora+0.2); }
function suonaScivolata() { initAudio(); if (!audioCtx) return; var ora = audioCtx.currentTime, durata = 0.5; var bs = Math.floor(audioCtx.sampleRate * durata); var buffer = audioCtx.createBuffer(1, bs, audioCtx.sampleRate); var data = buffer.getChannelData(0); for (var i=0;i<bs;i++){ var t=i/bs; data[i]=(Math.random()*2-1)*(1-t); } var noise = audioCtx.createBufferSource(); noise.buffer = buffer; var f = audioCtx.createBiquadFilter(); f.type='bandpass'; f.frequency.setValueAtTime(1200, ora); f.frequency.exponentialRampToValueAtTime(400, ora+durata); f.Q.value = 2; var g = audioCtx.createGain(); g.gain.setValueAtTime(0.0, ora); g.gain.linearRampToValueAtTime(0.22 * volumeEffetti, ora+0.05); g.gain.exponentialRampToValueAtTime(0.001, ora+durata); noise.connect(f); f.connect(g); g.connect(audioCtx.destination); noise.start(ora); noise.stop(ora+durata); }
function suonaPalo() { initAudio(); if (!audioCtx) return; var ora = audioCtx.currentTime; var o1 = audioCtx.createOscillator(); o1.type='triangle'; o1.frequency.setValueAtTime(1400, ora); o1.frequency.exponentialRampToValueAtTime(600, ora+0.08); var g1 = audioCtx.createGain(); g1.gain.setValueAtTime(0.5 * volumeEffetti, ora); g1.gain.exponentialRampToValueAtTime(0.001, ora+0.25); o1.connect(g1); g1.connect(audioCtx.destination); o1.start(ora); o1.stop(ora+0.3); }
function suonaFuori() { initAudio(); if (!audioCtx) return; var ora = audioCtx.currentTime, durata = 0.6; var bs = Math.floor(audioCtx.sampleRate * durata); var buffer = audioCtx.createBuffer(1, bs, audioCtx.sampleRate); var data = buffer.getChannelData(0); for (var i=0;i<bs;i++){ var t=i/bs; data[i]=(Math.random()*2-1)*(1-t*0.8); } var noise = audioCtx.createBufferSource(); noise.buffer = buffer; var f = audioCtx.createBiquadFilter(); f.type='highpass'; f.frequency.setValueAtTime(2500, ora); f.frequency.exponentialRampToValueAtTime(800, ora+durata); var gN = audioCtx.createGain(); gN.gain.setValueAtTime(0.0, ora); gN.gain.linearRampToValueAtTime(0.18 * volumeEffetti, ora+0.05); gN.gain.exponentialRampToValueAtTime(0.001, ora+durata); noise.connect(f); f.connect(gN); gN.connect(audioCtx.destination); noise.start(ora); noise.stop(ora+durata); }
function creaBufferRumoreRosa(durataSecondi) { if (!audioCtx) return null; var sr = audioCtx.sampleRate; var bs = Math.floor(sr * durataSecondi); var buffer = audioCtx.createBuffer(1, bs, sr); var data = buffer.getChannelData(0); var b0=0,b1=0,b2=0,b3=0,b4=0,b5=0,b6=0; for (var i=0;i<bs;i++){ var w = Math.random()*2-1; b0=0.99886*b0+w*0.0555179; b1=0.99332*b1+w*0.0750759; b2=0.96900*b2+w*0.1538520; b3=0.86650*b3+w*0.3104856; b4=0.55000*b4+w*0.5329522; b5=-0.7616*b5-w*0.0168980; data[i]=(b0+b1+b2+b3+b4+b5+b6+w*0.5362)*0.11; b6=w*0.115926; } return buffer; }
function suonaEsultanza() { initAudio(); if (!audioCtx) return; var ora = audioCtx.currentTime, durata = 3.0; var buffer = creaBufferRumoreRosa(durata); if (!buffer) return; var noise = audioCtx.createBufferSource(); noise.buffer = buffer; var f = audioCtx.createBiquadFilter(); f.type='bandpass'; f.frequency.setValueAtTime(500, ora); f.frequency.linearRampToValueAtTime(900, ora+0.4); f.frequency.linearRampToValueAtTime(600, ora+durata); f.Q.value = 0.7; var g = audioCtx.createGain(); g.gain.setValueAtTime(0.0, ora); g.gain.linearRampToValueAtTime(0.55 * volumeTifosi, ora+0.25); g.gain.linearRampToValueAtTime(0.5 * volumeTifosi, ora+1.6); g.gain.linearRampToValueAtTime(0.0, ora+durata); noise.connect(f); f.connect(g); g.connect(audioCtx.destination); noise.start(ora); noise.stop(ora+durata); }
function suonaTensione() { initAudio(); if (!audioCtx) return; var ora = audioCtx.currentTime, durata = 2.5; var buffer = creaBufferRumoreRosa(durata); if (!buffer) return; var noise = audioCtx.createBufferSource(); noise.buffer = buffer; var f = audioCtx.createBiquadFilter(); f.type='bandpass'; f.frequency.setValueAtTime(350, ora); f.frequency.linearRampToValueAtTime(550, ora+1.0); f.frequency.linearRampToValueAtTime(450, ora+durata); f.Q.value = 0.9; var g = audioCtx.createGain(); g.gain.setValueAtTime(0.0, ora); g.gain.linearRampToValueAtTime(0.22 * volumeTifosi, ora+0.4); g.gain.linearRampToValueAtTime(0.20 * volumeTifosi, ora+1.8); g.gain.linearRampToValueAtTime(0.0, ora+durata); noise.connect(f); f.connect(g); g.connect(audioCtx.destination); noise.start(ora); noise.stop(ora+durata); }
function suonaBonus() { initAudio(); if (!audioCtx) return; var ora = audioCtx.currentTime; var note = [523, 659, 784, 1047]; for (var i=0;i<note.length;i++) { var o = audioCtx.createOscillator(); o.type='triangle'; o.frequency.setValueAtTime(note[i], ora + i*0.1); var g = audioCtx.createGain(); g.gain.setValueAtTime(0.0, ora + i*0.1); g.gain.linearRampToValueAtTime(0.2 * volumeEffetti, ora + i*0.1 + 0.03); g.gain.exponentialRampToValueAtTime(0.001, ora + i*0.1 + 0.25); o.connect(g); g.connect(audioCtx.destination); o.start(ora + i*0.1); o.stop(ora + i*0.1 + 0.3); } }
function suonaMoneta() { initAudio(); if (!audioCtx) return; var ora = audioCtx.currentTime; for (var i=0;i<6;i++) { var o = audioCtx.createOscillator(); o.type='triangle'; o.frequency.setValueAtTime(800 + i*100, ora + i*0.25); var g = audioCtx.createGain(); g.gain.setValueAtTime(0.0, ora + i*0.25); g.gain.linearRampToValueAtTime(0.15 * volumeEffetti, ora + i*0.25 + 0.02); g.gain.exponentialRampToValueAtTime(0.001, ora + i*0.25 + 0.2); o.connect(g); g.connect(audioCtx.destination); o.start(ora + i*0.25); o.stop(ora + i*0.25 + 0.25); } }
function suonaDado() { initAudio(); if (!audioCtx) return; var ora = audioCtx.currentTime; for (var i=0;i<3;i++){ var o = audioCtx.createOscillator(); o.type='square'; o.frequency.setValueAtTime(400 + Math.random()*600, ora + i*0.08); var g = audioCtx.createGain(); g.gain.setValueAtTime(0.08 * volumeEffetti, ora + i*0.08); g.gain.exponentialRampToValueAtTime(0.001, ora + i*0.08 + 0.06); o.connect(g); g.connect(audioCtx.destination); o.start(ora + i*0.08); o.stop(ora + i*0.08 + 0.06); } }

var sottofondo = { source:null, gain:null, filtro:null, attivo:false, volumeTarget:0.04 };
function avviaSottofondo() { initAudio(); if (!audioCtx || sottofondo.attivo) return; var buffer = creaBufferRumoreRosa(4.0); if (!buffer) return; var source = audioCtx.createBufferSource(); source.buffer = buffer; source.loop = true; var f = audioCtx.createBiquadFilter(); f.type='bandpass'; f.frequency.value = 500; f.Q.value = 0.5; var g = audioCtx.createGain(); g.gain.value = 0.0; source.connect(f); f.connect(g); g.connect(audioCtx.destination); source.start(0); sottofondo.source=source; sottofondo.gain=g; sottofondo.filtro=f; sottofondo.attivo = true; }
function fermaSottofondo() { if (!sottofondo.attivo || !sottofondo.source) return; try { sottofondo.gain.gain.cancelScheduledValues(audioCtx.currentTime); sottofondo.gain.gain.linearRampToValueAtTime(0, audioCtx.currentTime + 0.3); setTimeout(function() { if (sottofondo.source) { try { sottofondo.source.stop(); } catch(e){} sottofondo.source = null; } sottofondo.attivo = false; }, 400); } catch(e){} }
function aggiornaSottofondoPerZona(zona) { if (!sottofondo.attivo || !sottofondo.gain || !audioCtx) return; var ora = audioCtx.currentTime, target; if (zona === 1 || zona === 5) { target = 0.14 * volumeTifosi; sottofondo.filtro.frequency.linearRampToValueAtTime(700, ora+0.6); } else if (zona === 0 || zona === 6) { target = 0.05 * volumeTifosi; sottofondo.filtro.frequency.linearRampToValueAtTime(400, ora+0.6); } else { target = 0.04 * volumeTifosi; sottofondo.filtro.frequency.linearRampToValueAtTime(500, ora+0.6); } sottofondo.gain.gain.cancelScheduledValues(ora); sottofondo.gain.gain.linearRampToValueAtTime(target, ora+0.6); }
function aggiornaVolumeSottofondo() { aggiornaSottofondoPerZona(stato.zonaPalla); }

/* STATO */
var stato = {
  tipoPartita:'1P', squadraTU:'juventus', squadraCPU:'napoli', divise:{ tu:null, cpu:null },
  tempo:1, mano:1, maxMani:MANI_PER_TEMPO, punteggio:{ tu:0, cpu:0 },
  zonaPalla:3, possessore:null, giocatorePalla:null, metaContesa:'inf',
  pallaInAnimazione:false, azioneTiroDaPalo:null,
  mazzi:{ tu:[], cpu:[] }, scarti:{ tu:[], cpu:[] }, mazzoBonus:[],
  mani:{ tu:[], cpu:[] }, giocatori:{ tu:[], cpu:[] }, panchina:{ tu:[], cpu:[] },
  monetaVinta:null, partitaFinita:false, sostBloccate:false,
  direzioneAttaccoTU:1, invertiCoppie:false, tuECasa:true,
  bonus: { tu: [], cpu: [] }, bonusUsatoQuestoTiro: { tu:null, cpu:null }, streak: { tu:0, cpu:0 },
  statistiche: {
    tu: { gol:0, tiri:0, parate:0, angoli:0, pali:0, contese:0, vinte:0, falli:0, ammonizioni:0, espulsioni:0, sostituzioni:0, bonusGuadagnati:0, marcatori:[] },
    cpu:{ gol:0, tiri:0, parate:0, angoli:0, pali:0, contese:0, vinte:0, falli:0, ammonizioni:0, espulsioni:0, sostituzioni:0, bonusGuadagnati:0, marcatori:[] }
  },
  logCompleto:[]
};
var selezioneCarta = null;
var selezioneSost = { campo:null, panchina:null };
var renderingCampoInCorso = false;

/* SALVATAGGIO */
var CHIAVE_SALVATAGGIO = 'calcio_carte_partita_in_corso_v2';
function serializzaStato() {
  return {
    versione: 2, timestamp: Date.now(),
    tipoPartita: stato.tipoPartita, squadraTU: stato.squadraTU, squadraCPU: stato.squadraCPU, divise: stato.divise,
    tempo: stato.tempo, mano: stato.mano, maxMani: stato.maxMani, punteggio: stato.punteggio,
    zonaPalla: stato.zonaPalla, possessore: stato.possessore, giocatorePalla: stato.giocatorePalla, metaContesa: stato.metaContesa,
    mazzi: stato.mazzi, scarti: stato.scarti, mazzoBonus: stato.mazzoBonus,
    mani: stato.mani, giocatori: stato.giocatori, panchina: stato.panchina,
    monetaVinta: stato.monetaVinta, partitaFinita: stato.partitaFinita,
    direzioneAttaccoTU: stato.direzioneAttaccoTU, invertiCoppie: stato.invertiCoppie, tuECasa: stato.tuECasa,
    bonus: stato.bonus, streak: stato.streak, statistiche: stato.statistiche, logCompleto: stato.logCompleto,
    secondiTrascorsi: secondiTrascorsi
  };
}
function salvaPartita() {
  if (!stato.giocatori || !stato.giocatori.tu || stato.giocatori.tu.length === 0) return;
  if (stato.partitaFinita) { try { localStorage.removeItem(CHIAVE_SALVATAGGIO); } catch(e){} return; }
  try { localStorage.setItem(CHIAVE_SALVATAGGIO, JSON.stringify(serializzaStato())); } catch(e) {}
  programmaSalvataggioGitHub();
}

document.addEventListener('visibilitychange', function() { if (document.hidden) salvaPartita(); });
window.addEventListener('pagehide', function() { salvaPartita(); });
window.addEventListener('blur', function() { salvaPartita(); });

function caricaPartitaSalvata() {
  try {
    var raw = localStorage.getItem(CHIAVE_SALVATAGGIO); if (!raw) return null;
    var dati = JSON.parse(raw);
    if (!dati || dati.versione !== 2) return null;
    if (!dati.giocatori || !dati.giocatori.tu || dati.giocatori.tu.length === 0) return null;
    if (!dati.mazzi || !dati.scarti) return null;
    if (dati.partitaFinita) return null;
    return dati;
  } catch(e) { return null; }
}
function eliminaSalvataggio() { try { localStorage.removeItem(CHIAVE_SALVATAGGIO); } catch(e){} }
function ripristinaPartita(datiSalvati) {
  stato.tipoPartita = datiSalvati.tipoPartita; stato.squadraTU = datiSalvati.squadraTU; stato.squadraCPU = datiSalvati.squadraCPU;
  stato.divise = datiSalvati.divise;
  stato.tempo = datiSalvati.tempo; stato.mano = datiSalvati.mano; stato.maxMani = datiSalvati.maxMani;
  stato.punteggio = datiSalvati.punteggio;
  stato.zonaPalla = datiSalvati.zonaPalla; stato.possessore = datiSalvati.possessore; stato.giocatorePalla = datiSalvati.giocatorePalla; stato.metaContesa = datiSalvati.metaContesa;
  stato.mazzi = datiSalvati.mazzi; stato.scarti = datiSalvati.scarti; stato.mazzoBonus = datiSalvati.mazzoBonus;
  stato.mani = datiSalvati.mani; stato.giocatori = datiSalvati.giocatori; stato.panchina = datiSalvati.panchina;
  stato.monetaVinta = datiSalvati.monetaVinta; stato.partitaFinita = false;
  stato.direzioneAttaccoTU = datiSalvati.direzioneAttaccoTU; stato.invertiCoppie = datiSalvati.invertiCoppie; stato.tuECasa = datiSalvati.tuECasa;
  stato.bonus = datiSalvati.bonus; stato.streak = datiSalvati.streak; stato.statistiche = datiSalvati.statistiche; stato.logCompleto = datiSalvati.logCompleto;
  stato.bonusUsatoQuestoTiro = { tu:null, cpu:null };
  stato.contrasto = null; stato.sostBloccate = false; stato.pallaInAnimazione = false; stato.azioneTiroDaPalo = null;
  secondiTrascorsi = datiSalvati.secondiTrascorsi || 0;
  ZONE_CONFIG[0].proprietario = 'tu'; ZONE_CONFIG[6].proprietario = 'cpu';
  adattaScena(); setTimeout(adattaScena, 100); setTimeout(adattaScena, 400);
  renderCampo(); renderHeader(); chiudiModale();
  avviaSottofondo();
  setTimeout(function() { aggiornaSottofondoPerZona(stato.zonaPalla); }, 500);
  if (timerPartita) clearInterval(timerPartita);
  aggiornaTimerDisplay();
  timerPartita = setInterval(function() { secondiTrascorsi++; aggiornaTimerDisplay(); if (secondiTrascorsi % 15 === 0) salvaPartita(); }, 1000);
  setTimeout(function() { if (!stato.partitaFinita) avviaContrasto(); }, 800);
}
function mostraSchermataRipristino(dati) {
  var nomeTU = SQUADRE[dati.squadraTU] ? SQUADRE[dati.squadraTU].nome : dati.squadraTU;
  var nomeCPU = SQUADRE[dati.squadraCPU] ? SQUADRE[dati.squadraCPU].nome : dati.squadraCPU;
  document.getElementById('modale').classList.remove('nascosto');
  document.getElementById('modale-box').innerHTML =
    '<h2>💾 Partita in corso</h2><p style="color:#ccc;margin:16px 0">Hai una partita non terminata:</p>' +
    '<div style="background:rgba(0,0,0,0.4);border-radius:12px;padding:20px;margin:20px 0"><div style="font-size:32px;font-weight:bold;color:#ffd700">' + nomeTU + ' <span style="color:#4dabf7">' + dati.punteggio.tu + '</span> - <span style="color:#ff6b6b">' + dati.punteggio.cpu + '</span> ' + nomeCPU + '</div><div style="font-size:20px;color:#aaa;margin-top:10px">Tempo ' + dati.tempo + '° · Mano ' + dati.mano + '/' + dati.maxMani + '</div></div>' +
    '<div><button class="primario" onclick="riprendiPartitaSalvata()">▶️ RIPRENDI</button><button style="background:#8B2020;border-color:#ff6b6b" onclick="abbandonaPartitaSalvata()">🗑️ ABBANDONA (0-2)</button></div>';
  window._salvataggioDaRipristinare = dati;
}
function riprendiPartitaSalvata() { var dati = window._salvataggioDaRipristinare; if (!dati) { mostraMenuPrincipale(); return; } ripristinaPartita(dati); }
function abbandonaPartitaSalvata() { if (!confirm('Abbandonando subirai sconfitta a tavolino 0-2.')) return; eliminaSalvataggio(); window._salvataggioDaRipristinare = null; location.reload(); }

var timerPartita = null;
var secondiTrascorsi = 0;
function avviaTimer() {
  if (timerPartita) clearInterval(timerPartita);
  secondiTrascorsi = 0; aggiornaTimerDisplay();
  timerPartita = setInterval(function() { secondiTrascorsi++; aggiornaTimerDisplay(); if (secondiTrascorsi % 15 === 0) salvaPartita(); }, 1000);
}
function aggiornaTimerDisplay() {
  var min = Math.floor(secondiTrascorsi / 60); var sec = secondiTrascorsi % 60;
  var el = document.getElementById('timer-partita');
  if (el) el.textContent = (min < 10 ? '0' : '') + min + ':' + (sec < 10 ? '0' : '') + sec;
}

var ZONE_CONFIG = [
  { id:0, nome:'Z0', ruolo:'POR', portiere:true, proprietario:'tu' },
  { id:1, nome:'Z1', ruolo:'DIF' }, { id:2, nome:'Z2', ruolo:'CEN' },
  { id:3, nome:'Z3', ruolo:'CEN' }, { id:4, nome:'Z4', ruolo:'CEN' },
  { id:5, nome:'Z5', ruolo:'DIF' },
  { id:6, nome:'Z6', ruolo:'POR', portiere:true, proprietario:'cpu' }
];
var SEMI = { palla:{emoji:'⚽',nome:'Palla'}, coppa:{emoji:'🏆',nome:'Coppa'}, guantone:{emoji:'🧤',nome:'Guantone'}, bandierina:{emoji:'🚩',nome:'Bandierina'} };
var SEMI_KEYS = Object.keys(SEMI);
var VALORI = [ {valore:14,label:'A'},{valore:13,label:'K'},{valore:12,label:'Q'},{valore:11,label:'J'},{valore:10,label:'10'},{valore:9,label:'9'},{valore:8,label:'8'},{valore:7,label:'7'},{valore:6,label:'6'},{valore:5,label:'5'},{valore:4,label:'4'},{valore:3,label:'3'},{valore:2,label:'2'} ];

function creaMazzoPoker() { var mazzo=[], id=0; for (var i=0;i<SEMI_KEYS.length;i++){ for (var j=0;j<VALORI.length;j++){ mazzo.push({id:'c'+(id++), seme:SEMI_KEYS[i], valore:VALORI[j].valore, label:VALORI[j].label}); } } return mescola(mazzo); }
function mescola(arr) { var a=arr.slice(); for (var i=a.length-1;i>0;i--){ var j=Math.floor(Math.random()*(i+1)); var t=a[i]; a[i]=a[j]; a[j]=t; } return a; }
function creaMazzoBonus() { var m = []; for (var i=0;i<3;i++) m.push('contrasto-sicuro'); for (var j=0;j<3;j++) m.push('parata-super'); for (var k=0;k<3;k++) m.push('gol-super'); for (var l=0;l<3;l++) m.push('passaggio-lungo'); for (var n=0;n<3;n++) m.push('tiro-fuori-area'); return mescola(m); }
function inizializzaMazzi() { stato.mazzi.tu = creaMazzoPoker(); stato.mazzi.cpu = creaMazzoPoker(); stato.scarti.tu = []; stato.scarti.cpu = []; stato.mazzoBonus = creaMazzoBonus(); stato.mani.tu = []; stato.mani.cpu = []; }
function contaSemeInMano(sq, seme) { var n = 0; for (var i=0;i<stato.mani[sq].length;i++) if (stato.mani[sq][i].seme === seme) n++; return n; }
function pescaUnaCarta(sq) {
  var tentativi = 0;
  while (tentativi < 100) {
    tentativi++;
    if (stato.mazzi[sq].length === 0) {
      if (stato.scarti[sq].length === 0) return;
      stato.mazzi[sq] = mescola(stato.mazzi[sq].concat(stato.scarti[sq]));
      stato.scarti[sq] = [];
    }
    var carta = stato.mazzi[sq].pop();
    if (contaSemeInMano(sq, carta.seme) < MAX_CARTE_STESSO_SEME) { stato.mani[sq].push(carta); return; }
    else { stato.mazzi[sq].push(carta); stato.mazzi[sq] = mescola(stato.mazzi[sq]); }
  }
  if (stato.mazzi[sq].length > 0) stato.mani[sq].push(stato.mazzi[sq].pop());
}
function pescaUnaCartaBonus() { if (stato.mazzoBonus.length === 0) { stato.mazzoBonus = creaMazzoBonus(); } return stato.mazzoBonus.pop(); }
function pescaCarteMano(sq, n) { for (var i=0;i<n;i++) pescaUnaCarta(sq); }
function riempiMano(sq) { var sicurezza = 0; while (stato.mani[sq].length < CARTE_MANO_MAX && sicurezza < 200) { sicurezza++; pescaUnaCarta(sq); if (stato.mazzi[sq].length === 0 && stato.scarti[sq].length === 0) break; } }
function calcolaMinutoParziale() { return Math.min((stato.mano-1)*MINUTI_PER_MANO, 45); }
function calcolaMinutoTotale() { if (stato.tempo === 1) return calcolaMinutoParziale(); return Math.min(45 + (stato.mano-1)*MINUTI_PER_MANO, 90); }
function log(msg, classe) { stato.logCompleto.push({ msg:msg, classe:classe||'' }); }

function creaPalloneSVG() {
  return '<svg viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg"><defs><radialGradient id="pg" cx="35%" cy="30%" r="75%"><stop offset="0%" stop-color="#fff"/><stop offset="60%" stop-color="#f0f0f0"/><stop offset="100%" stop-color="#c8c8c8"/></radialGradient></defs><circle cx="20" cy="20" r="19" fill="url(#pg)" stroke="#1a1a1a" stroke-width="1.5"/><polygon points="20,10 26.5,14.7 24,22.3 16,22.3 13.5,14.7" fill="#1a1a1a"/><polygon points="32,8 37,14 34,20 28,17 29,10" fill="#1a1a1a" opacity="0.9"/><polygon points="8,8 3,14 6,20 12,17 11,10" fill="#1a1a1a" opacity="0.9"/><polygon points="34,26 39,32 34,38 28,35 30,28" fill="#1a1a1a" opacity="0.9"/><polygon points="6,26 1,32 6,38 12,35 10,28" fill="#1a1a1a" opacity="0.9"/><ellipse cx="13" cy="11" rx="5" ry="3.5" fill="#fff" opacity="0.55"/></svg>';
}

function tuASinistra() { if (stato.tuECasa) return !stato.invertiCoppie; else return stato.invertiCoppie; }
function giocatoriInZona(sq, zonaFisica, escludiPortiere) {
  var tuSin = tuASinistra();
  var squadraASinistra = (sq === 'tu') ? tuSin : !tuSin;
  return stato.giocatori[sq].filter(function(g) {
    if (escludiPortiere && g.portiere) return false;
    var zonaFisicaG = squadraASinistra ? g.zona : (6 - g.zona);
    return zonaFisicaG === zonaFisica;
  });
}
function getCoppiaAttiva(zonaId, meta) { var idx = meta === 'sup' ? 0 : 1; var tu = giocatoriInZona('tu', zonaId, true); var cpu = giocatoriInZona('cpu', zonaId, true); return { tu: tu[idx] || tu[0] || null, cpu: cpu[idx] || cpu[0] || null }; }
function direzionePerSquadra(sq) { var dirTU = stato.direzioneAttaccoTU; return sq === 'tu' ? dirTU : -dirTU; }

function assegnaBonus(sq) {
  if (stato.bonus[sq].length >= MAX_BONUS) return false;
  var tipo = pescaUnaCartaBonus(); stato.bonus[sq].push(tipo);
  stato.statistiche[sq].bonusGuadagnati = (stato.statistiche[sq].bonusGuadagnati || 0) + 1;
  suonaBonus();
  if (sq === 'tu') { mostraBonusBanner('🏆 TU guadagni: ' + NOMI_BONUS[tipo].icona + ' ' + NOMI_BONUS[tipo].nome); try { renderBonusSlots(); } catch(e){} }
  else mostraBonusBanner('🤖 CPU ha guadagnato una carta Bonus!');
  renderBonusCpuInfo(); salvaPartita(); return true;
}
function mostraBonusBanner(testo) { var b = document.getElementById('bonus-banner'); b.textContent = testo; b.classList.add('attivo'); setTimeout(function() { b.classList.remove('attivo'); }, 3000); }
function consumaBonus(sq, tipo) { var idx = stato.bonus[sq].indexOf(tipo); if (idx > -1) { stato.bonus[sq].splice(idx, 1); return true; } return false; }
function haBonus(sq, tipo) { return stato.bonus[sq].indexOf(tipo) > -1; }
function renderBonusCpuInfo() { for (var i = 0; i < 3; i++) { var slot = document.getElementById('bonus-cpu-slot-' + i); if (!slot) continue; slot.classList.remove('pieno'); slot.textContent = ''; if (i < stato.bonus.cpu.length) { slot.classList.add('pieno'); slot.textContent = NOMI_BONUS[stato.bonus.cpu[i]].icona; } } }

function creaGiocatori(sq) {
  var g = []; var id = 0;
  var sqId = sq === 'tu' ? stato.squadraTU : stato.squadraCPU;
  var rosa = ROSE[sqId]; if (!rosa) return g;
  function z(zonaLogica) { return zonaLogica; }
  g.push({ id:sq+'_'+(id++), squadra:sq, zona:z(0), ruolo:'POR', portiere:true, stamina:STAMINA_MAX, staminaMax:STAMINA_MAX, falli:0, falliArea:0, ammonito:false, espulso:false, nome: rosa.portiere[0] });
  for (var i=0;i<2;i++) g.push({ id:sq+'_'+(id++), squadra:sq, zona:z(1), ruolo:'DIF', portiere:false, stamina:STAMINA_MAX, staminaMax:STAMINA_MAX, falli:0, falliArea:0, ammonito:false, espulso:false, nome: rosa.difensori[i] || ('DIF'+(i+1)) });
  var cen = rosa.centrocampisti;
  for (var zz=2; zz<=4; zz++) for (var k=0;k<2;k++) { var idx = (zz-2)*2 + k; g.push({ id:sq+'_'+(id++), squadra:sq, zona:z(zz), ruolo:'CEN', portiere:false, stamina:STAMINA_MAX, staminaMax:STAMINA_MAX, falli:0, falliArea:0, ammonito:false, espulso:false, nome: cen[idx] || ('CEN'+(idx+1)) }); }
  for (var j=0;j<2;j++) g.push({ id:sq+'_'+(id++), squadra:sq, zona:z(5), ruolo:'ATT', portiere:false, stamina:STAMINA_MAX, staminaMax:STAMINA_MAX, falli:0, falliArea:0, ammonito:false, espulso:false, nome: rosa.difensori_alta[j] || ('ATT'+(j+1)) });
  return g;
}
function creaPanchina(sq) {
  var p = []; var id = 0;
  var sqId = sq === 'tu' ? stato.squadraTU : stato.squadraCPU;
  var r = ROSE[sqId]; if (!r || !r.panchina) return p;
  for (var i=0;i<r.panchina.por.length;i++) p.push({ id:sq+'_pan_'+(id++), squadra:sq, ruolo:'POR', portiere:true, stamina:STAMINA_MAX, staminaMax:STAMINA_MAX, falli:0, ammonito:false, espulso:false, entrato:false, nome:r.panchina.por[i] });
  for (var j=0;j<r.panchina.dif.length;j++) p.push({ id:sq+'_pan_'+(id++), squadra:sq, ruolo:'DIF', portiere:false, stamina:STAMINA_MAX, staminaMax:STAMINA_MAX, falli:0, ammonito:false, espulso:false, entrato:false, nome:r.panchina.dif[j] });
  for (var k=0;k<r.panchina.cen.length;k++) p.push({ id:sq+'_pan_'+(id++), squadra:sq, ruolo:'CEN', portiere:false, stamina:STAMINA_MAX, staminaMax:STAMINA_MAX, falli:0, ammonito:false, espulso:false, entrato:false, nome:r.panchina.cen[k] });
  for (var m=0;m<r.panchina.att.length;m++) p.push({ id:sq+'_pan_'+(id++), squadra:sq, ruolo:'ATT', portiere:false, stamina:STAMINA_MAX, staminaMax:STAMINA_MAX, falli:0, ammonito:false, espulso:false, entrato:false, nome:r.panchina.att[m] });
  return p;
}
function applicaSqualifiche(sq) {
  var sqId = sq === 'tu' ? stato.squadraTU : stato.squadraCPU;
  if (!ammonizioni || !ammonizioni.squadre[sqId]) return;
  for (var i=0;i<stato.giocatori[sq].length;i++) { var g = stato.giocatori[sq][i]; if (èSqualificato(sqId, g.nome)) log('⚠️ ' + g.nome + ' è squalificato ma gioca comunque.'); }
}

/* MENU / MODALI */
function mostraMenuPrincipale() {
  eliminaSalvataggio(); nascondiEntrambiBanner(); nascondiBannerMano(); chiudiBonusChoice(); fermaSottofondo();
  var ov = document.getElementById('tiro-overlay'); if (ov) ov.remove();
  stato.partitaFinita = true;
  document.getElementById('modale').classList.remove('nascosto');
  document.getElementById('modale-box').innerHTML =
    '<div class="menu-principale">' +
      '<div class="menu-titolo">⚽ CALCIO A CARTE ⚽</div>' +
      '<div class="menu-sottotitolo">Scegli la modalità di gioco</div>' +
      '<div class="menu-btn" onclick="avviaSetup1P()"><div class="icona">🎮</div><div class="testo"><div class="titolo">PARTITA SINGOLA</div><div class="descr">1 giocatore vs CPU</div></div></div>' +
      '<div class="menu-btn" onclick="avviaSetup2P()"><div class="icona">👥</div><div class="testo"><div class="titolo">PARTITA 2 GIOCATORI</div><div class="descr">Locale - stesso dispositivo</div></div></div>' +
      '<div class="menu-btn evidenza" onclick="location.href=\'seriea2027.html\'"><div class="icona">⚽</div><div class="testo"><div class="titolo">SERIE A 2026/2027</div><div class="descr">20 squadre · 38 giornate</div></div></div>' +
      '<div style="margin-top:24px"><button onclick="apriImpostazioni()">⚙️ Impostazioni</button></div>' +
    '</div>';
}

function apriImpostazioni() {
  document.getElementById('modale').classList.remove('nascosto');
  document.getElementById('modale-box').innerHTML =
    '<h2>⚙️ Impostazioni</h2>' +
    '<div class="impostazioni-grid">' +
      '<button class="primario" onclick="esportaCampionato()">💾 Salva campionato su file</button>' +
      '<button onclick="document.getElementById(\'file-input-campionato\').click()">📂 Carica campionato da file</button>' +
      '<button style="background:#8B2020;border-color:#ff6b6b" onclick="resetCampionatoSalvato()">🗑 Azzera campionato</button>' +
      '<button class="primario" style="background:#4dabf7;border-color:#fff" onclick="forzaRicarica()">🔄 Forza ricarica (svuota cache)</button>' +
      '<button onclick="apriSostituzioni()">🔄 Sostituzioni</button>' +
      '<button class="primario" style="background:#4dabf7;border-color:#fff" onclick="apriIstruzioni()">📖 Istruzioni</button>' +
      '<button onclick="mostraMenuPrincipale()">← Chiudi</button>' +
    '</div>' +
    '<h3 style="color:#ffd700;margin:24px 0 12px">☁️ GitHub</h3>' +
    '<input type="text" id="gh-token-input" placeholder="github_pat_..." value="' + (GH.token ? GH.token : '') + '" style="width:100%;padding:14px;border-radius:10px;border:2px solid #4dabf7;background:#0a0a15;color:#fff;font-family:monospace;font-size:16px;margin-bottom:12px">' +
    '<div style="display:flex;flex-wrap:wrap;gap:12px;justify-content:center">' +
      '<button class="primario" onclick="ghSalvaConfig(document.getElementById(\'gh-token-input\').value);alert(\'Token salvato!\');apriImpostazioni();">💾 Salva token</button>' +
      '<button onclick="ghSalvaConfig(null);alert(\'Rimosso.\');apriImpostazioni();">🗑 Rimuovi</button>' +
      '<button onclick="salvaSuGitHub()">☁️ Salva ora</button>' +
      '<button onclick="caricaDaGitHub().then(function(ok){alert(ok?\'Caricato!\':\'Errore\')})">⬇️ Carica ora</button>' +
    '</div>' +
    '<h3 style="color:#ffd700;margin:24px 0 12px">🔊 Volume</h3>' +
    '<div class="volume-control"><label>🎵 Musica</label><input type="range" min="0" max="100" value="' + Math.round(volumeMusica*100) + '" oninput="cambiaVolume(\'musica\',this.value)"><span class="vol-val" id="vol-musica-val">' + Math.round(volumeMusica*100) + '%</span></div>' +
    '<div class="volume-control"><label>👥 Tifosi</label><input type="range" min="0" max="100" value="' + Math.round(volumeTifosi*100) + '" oninput="cambiaVolume(\'tifosi\',this.value)"><span class="vol-val" id="vol-tifosi-val">' + Math.round(volumeTifosi*100) + '%</span></div>' +
    '<div class="volume-control"><label>🔔 Effetti</label><input type="range" min="0" max="100" value="' + Math.round(volumeEffetti*100) + '" oninput="cambiaVolume(\'effetti\',this.value)"><span class="vol-val" id="vol-effetti-val">' + Math.round(volumeEffetti*100) + '%</span></div>' +
    '<input type="file" id="file-input-campionato" accept=".json" style="display:none" onchange="gestisciFileCampionato(event)">';
}

function forzaRicarica() {
  if (!confirm('Forzare la ricarica? Verranno ricaricati tutti i file (HTML, CSS, JS) dalla rete, ignorando la cache del browser.\n\nI salvataggi locali (partita in corso, campionato, ammonizioni) NON verranno toccati.')) return;
  if ('caches' in window) {
    caches.keys().then(function(names) {
      names.forEach(function(name) { caches.delete(name); });
    }).catch(function(){});
  }
  var base = location.href.split('?')[0].split('#')[0];
  var params = location.search ? location.search.substring(1) + '&' : '';
  var nuovoUrl = base + '?' + params + 'v=' + Date.now();
  location.replace(nuovoUrl);
}

function apriIstruzioni() {
  document.getElementById('modale').classList.remove('nascosto');
  document.getElementById('modale-box').innerHTML =
    '<h2>📖 Istruzioni</h2><div class="istruzioni-content">' +
    '<h3>🎯 Obiettivo</h3><p>Segna più gol in 46 mani (2 tempi da 23).</p>' +
    '<h3>🃏 Contrasto</h3><p>Il possessore gioca per primo: la sua carta è il <strong>seme guida</strong>. Il difensore che gioca una carta di seme diverso da quello guida commette <strong>SEMPRE fallo</strong>.</p>' +
    '<h3>⚽ Avanzamento</h3><p>Chi vince avanza di 1 zona. Se rubi palla (vinci in difesa), la squadra rubante avanza. In Z1 o Z5 si tira in porta.</p>' +
    '<h3>🥅 Tiro e Rigore</h3><p>Attaccante 1d9. Portiere 1d4 (4 settori). Se il settore copre la casella → parata. <strong>Se il difensore commette fallo in area, l\'attaccante va direttamente a tirare un rigore</strong> (salta l\'avanzamento).</p>' +
    '<h3>⚡ Stamina e Cartellini</h3><p>Ogni contrasto vinto costa 1 punto stamina. A 0 stamina o se espulso, il giocatore gioca la coppia con una carta in meno. Chi commette fallo subisce una penalità di -1 stamina. Il portiere perde 1 stamina ad ogni tiro.</p>' +
    '<h3>🟨 Falli del difensore in area</h3><p>Nel contrasto in area (Z1/Z5), 1° fallo = 🟨 giallo, 2° fallo = 🟥 rosso.</p>' +
    '<h3>🚀 Tiro da Fuori Area</h3><p>Bonus utilizzabile quando vinci un contrasto in Z4 (attaccando verso destra) o Z2 (attaccando verso sinistra): tira subito in porta saltando l\'avanzamento.</p>' +
    '</div><button class="primario" onclick="mostraMenuPrincipale()" style="margin-top:24px">← Chiudi</button>';
}
function cambiaVolume(tipo, valore) {
  var v = parseInt(valore) / 100;
  if (tipo === 'musica') { volumeMusica = v; var el = document.getElementById('vol-musica-val'); if (el) el.textContent = valore + '%'; }
  else if (tipo === 'tifosi') { volumeTifosi = v; var el2 = document.getElementById('vol-tifosi-val'); if (el2) el2.textContent = valore + '%'; aggiornaVolumeSottofondo(); }
  else if (tipo === 'effetti') { volumeEffetti = v; var el3 = document.getElementById('vol-effetti-val'); if (el3) el3.textContent = valore + '%'; }
}
function gestisciFileCampionato(ev) { var f = ev.target.files[0]; if (!f) return; importaCampionato(f); ev.target.value = ''; }
function chiudiModale() { document.getElementById('modale').classList.add('nascosto'); }
function apriLog() {
  var html = '<h2>📋 Cronaca</h2><div style="background:#0a0a15;border-radius:12px;padding:20px;max-height:70vh;overflow-y:auto;font-size:16px;text-align:left;font-family:monospace">';
  for (var i=0;i<stato.logCompleto.length;i++) { var l = stato.logCompleto[i]; html += '<p class="' + (l.classe||'') + '" style="margin:6px 0">' + l.msg + '</p>'; }
  html += '</div><button class="primario" onclick="chiudiModale()" style="margin-top:20px">CHIUDI</button>';
  document.getElementById('modale-box').innerHTML = html;
  document.getElementById('modale').classList.remove('nascosto');
}

/* RENDER */
function renderHeader() {
  var sqCasa, sqTrasf;
  if (URL_CASA && URL_TRASFERTA) { sqCasa = URL_CASA; sqTrasf = URL_TRASFERTA; } else { sqCasa = stato.squadraTU; sqTrasf = stato.squadraCPU; }
  var nomeCasa = SQUADRE[sqCasa] ? SQUADRE[sqCasa].nome : sqCasa;
  var nomeTrasf = SQUADRE[sqTrasf] ? SQUADRE[sqTrasf].nome : sqTrasf;
  var golCasa, golTrasf;
  if (sqCasa === stato.squadraTU) { golCasa = stato.punteggio.tu; golTrasf = stato.punteggio.cpu; } else { golCasa = stato.punteggio.cpu; golTrasf = stato.punteggio.tu; }
  document.getElementById('nome-casa').textContent = nomeCasa;
  document.getElementById('nome-trasferta').textContent = nomeTrasf;
  document.getElementById('punteggio-casa').textContent = golCasa;
  document.getElementById('punteggio-trasferta').textContent = golTrasf;
  document.getElementById('tempo').textContent = stato.tempo + '°';
  document.getElementById('mano').textContent = stato.mano;
  var p = calcolaMinutoParziale(), t = calcolaMinutoTotale();
  document.getElementById('minuto-parziale').textContent = p + "'";
  document.getElementById('minuto-totale').textContent = t + "'";
  document.getElementById('zona-palla').textContent = 'Z' + stato.zonaPalla;
  var at = document.getElementById('attacco-lato'); if (at) at.textContent = stato.direzioneAttaccoTU > 0 ? '→' : '←';
  var st = document.getElementById('info-streak'); if (st) st.textContent = stato.streak.tu;
  renderBonusCpuInfo();
}

function renderCampo() {
  if (renderingCampoInCorso) return;
  renderingCampoInCorso = true;
  var scena = document.getElementById('scena');
  var vecchie = scena.querySelectorAll('.coppia-render, .portiere-render');
  for (var i = 0; i < vecchie.length; i++) vecchie[i].remove();
  var tuSin = tuASinistra();

  for (var idx = 0; idx < POSIZIONI_COPPIE.length; idx++) {
    var p = POSIZIONI_COPPIE[idx];
    var mappa = MAPPA_COPPIE[idx];
    var zonaFisica = mappa.zona;
    var metaGioco = mappa.meta;
    var zonaLogicaTU = tuSin ? zonaFisica : (6 - zonaFisica);
    var zonaLogicaCPU = tuSin ? (6 - zonaFisica) : zonaFisica;

    var tuG = stato.giocatori.tu.filter(function(g){ return !g.portiere && !g.espulso && g.zona === zonaLogicaTU; });
    var cpuG = stato.giocatori.cpu.filter(function(g){ return !g.portiere && !g.espulso && g.zona === zonaLogicaCPU; });

    var coppia = document.createElement('div');
    coppia.className = 'coppia-render';
    coppia.style.cssText = 'position:absolute;left:' + p.x + 'px;top:' + p.y + 'px;transform:translate(-50%,-50%);z-index:10;';
    var rad = p.angolo * Math.PI / 180;
    var dx = Math.cos(rad) * (DISTANZA_COPPIA_PX / 2); var dy = Math.sin(rad) * (DISTANZA_COPPIA_PX / 2);
    var indice = (metaGioco === 'sup') ? 0 : 1;
    var gTU = tuG[indice] || tuG[0] || null;
    var gCPU = cpuG[indice] || cpuG[0] || null;
    var dxTU = tuSin ? dx : -dx;
    var dxCPU = tuSin ? -dx : dx;

    if (gTU) { var wrapTU = document.createElement('div'); wrapTU.className = 'pedina-wrapper tu'; wrapTU.dataset.giocatoreId = gTU.id; wrapTU.style.cssText = 'position:absolute;left:' + dxTU + 'px;top:' + (dy * (tuSin ? 1 : -1)) + 'px;transform:translate(-50%,-50%);display:flex;flex-direction:column;align-items:center;'; wrapTU.appendChild(creaNomeGiocatore(gTU)); wrapTU.appendChild(creaPedinaEl(gTU)); wrapTU.appendChild(creaInfoSotto(gTU)); coppia.appendChild(wrapTU); }
    if (gCPU) { var wrapCPU = document.createElement('div'); wrapCPU.className = 'pedina-wrapper cpu'; wrapCPU.dataset.giocatoreId = gCPU.id; wrapCPU.style.cssText = 'position:absolute;left:' + dxCPU + 'px;top:' + (dy * (tuSin ? -1 : 1)) + 'px;transform:translate(-50%,-50%);display:flex;flex-direction:column;align-items:center;'; wrapCPU.appendChild(creaNomeGiocatore(gCPU)); wrapCPU.appendChild(creaPedinaEl(gCPU)); wrapCPU.appendChild(creaInfoSotto(gCPU)); coppia.appendChild(wrapCPU); }
    scena.appendChild(coppia);
  }

  var portiereTU_index = tuSin ? 0 : 1, portiereCPU_index = tuSin ? 1 : 0;
  var gPorTU = stato.giocatori.tu.filter(function(g){ return g.portiere && !g.espulso; })[0];
  var gPorCPU = stato.giocatori.cpu.filter(function(g){ return g.portiere && !g.espulso; })[0];

  if (gPorTU) { var pp = POSIZIONI_PORTIERI[portiereTU_index]; var wrapPorTU = document.createElement('div'); wrapPorTU.className = 'pedina-wrapper tu portiere-render'; wrapPorTU.dataset.giocatoreId = gPorTU.id; wrapPorTU.style.cssText = 'position:absolute;left:' + pp.x + 'px;top:' + pp.y + 'px;transform:translate(-50%,-50%);z-index:10;display:flex;flex-direction:column;align-items:center;'; wrapPorTU.appendChild(creaNomeGiocatore(gPorTU)); wrapPorTU.appendChild(creaPedinaEl(gPorTU)); wrapPorTU.appendChild(creaInfoSotto(gPorTU)); scena.appendChild(wrapPorTU); }
  if (gPorCPU) { var pp2 = POSIZIONI_PORTIERI[portiereCPU_index]; var wrapPorCPU = document.createElement('div'); wrapPorCPU.className = 'pedina-wrapper cpu portiere-render'; wrapPorCPU.dataset.giocatoreId = gPorCPU.id; wrapPorCPU.style.cssText = 'position:absolute;left:' + pp2.x + 'px;top:' + pp2.y + 'px;transform:translate(-50%,-50%);z-index:10;display:flex;flex-direction:column;align-items:center;'; wrapPorCPU.appendChild(creaNomeGiocatore(gPorCPU)); wrapPorCPU.appendChild(creaPedinaEl(gPorCPU)); wrapPorCPU.appendChild(creaInfoSotto(gPorCPU)); scena.appendChild(wrapPorCPU); }

  if (!stato.pallaInAnimazione && stato.zonaPalla !== null && stato.possessore) {
    var idG = stato.giocatorePalla;
    if (!idG) { var c = getCoppiaAttiva(stato.zonaPalla, stato.metaContesa); var g = stato.possessore === 'tu' ? c.tu : c.cpu; if (g) { stato.giocatorePalla = g.id; idG = g.id; } }
    if (idG) creaPallaAiPiedi(stato.zonaPalla, idG);
  }
  renderingCampoInCorso = false;
}

function creaPallaAiPiedi(zonaId, idG) {
  var v = document.querySelectorAll('.palla-centro'); for (var i = 0; i < v.length; i++) v[i].remove();
  var e = document.querySelectorAll('.evidenzia-coppia'); for (var j = 0; j < e.length; j++) e[j].remove();
  var wrapperEl = document.querySelector('[data-giocatore-id="' + idG + '"]'); if (!wrapperEl) return;
  var pedinaEl = wrapperEl.querySelector('.pedina') || wrapperEl;
  var scena = document.getElementById('scena');
  var r = pedinaEl.getBoundingClientRect(); var box = scena.getBoundingClientRect();
  var xPx = (r.left + r.width / 2 - box.left) / scalaCorrente;
  var yPx = (r.bottom - box.top) / scalaCorrente;
  var ell = document.createElement('div'); ell.className = 'evidenzia-coppia'; ell.style.cssText = 'left:' + xPx + 'px;top:' + yPx + 'px;position:absolute;transform:translate(-50%,-50%);'; scena.appendChild(ell);
  var p = document.createElement('div'); p.className = 'palla-centro'; p.style.cssText = 'left:' + xPx + 'px;top:' + yPx + 'px;position:absolute;transform:translate(-50%,-50%);'; p.innerHTML = creaPalloneSVG(); scena.appendChild(p);
}

function creaNomeGiocatore(g) { var el = document.createElement('div'); el.className = 'nome-giocatore'; el.textContent = g.nome; el.title = g.nome + ' (' + g.ruolo + ')'; return el; }
function creaInfoSotto(g) {
  var el = document.createElement('div'); el.className = 'info-sotto ' + g.squadra;
  if (g.ammonito) el.classList.add('ammonito-info');
  if (g.espulso) el.classList.add('espulso-info');
  var perc = (g.stamina / g.staminaMax) * 100; var cls = ''; if (perc < 20) cls = 'basso'; else if (perc < 50) cls = 'medio';
  var h = '<span class="stamina-txt ' + cls + '">' + g.stamina + '</span>';
  h += '<span class="falli-txt ' + (g.falli === 0 ? 'zero' : '') + '">' + g.falli + '</span>';
  var c = '·'; if (g.espulso) c = '🟥'; else if (g.ammonito) c = '🟨';
  h += '<span class="cartellini">' + c + '</span>';
  el.innerHTML = h;
  var bar = document.createElement('div'); bar.className = 'stamina-bar';
  var fill = document.createElement('div'); fill.className = 'stamina-fill';
  var pct = (g.stamina / g.staminaMax) * 100; fill.style.width = pct + '%';
  if (pct < 20) fill.classList.add('basso'); else if (pct < 50) fill.classList.add('medio');
  bar.appendChild(fill); el.appendChild(bar);
  return el;
}
function creaPedinaEl(g, anim) {
  anim = anim || 'fermo';
  var el = document.createElement('div');
  el.className = 'pedina ' + g.squadra + (g.portiere ? ' portiere' : '');
  el.dataset.giocatoreId = g.id;
  if (g.stamina <= 2 && g.stamina > 0) el.classList.add('stanco');
  if (g.stamina === 0) el.classList.add('esaurito');
  if (g.ammonito) el.classList.add('ammonito');
  if (g.espulso) el.classList.add('espulso');
  el.title = g.nome + ' - Stamina ' + g.stamina + '/' + g.staminaMax;
  var div;
  if (g.portiere) { var sqId = g.squadra === 'tu' ? stato.squadraTU : stato.squadraCPU; div = SQUADRE[sqId].portiere; }
  else { div = g.squadra === 'tu' ? stato.divise.tu : stato.divise.cpu; }
  el.innerHTML = creaGiocatoreSVG(div, anim, g.nome);
  return el;
}
function nascondiEvidenzia() { var els = document.querySelectorAll('.evidenzia-coppia'); for (var i=0;i<els.length;i++) els[i].remove(); }

/* SETUP PARTITA */
function avviaSetup1P() {
  stato.tipoPartita = '1P';
  var html = '<h2>⚽ Scegli la tua squadra</h2><div class="squadre-griglia">';
  var keys = Object.keys(SQUADRE);
  for (var i=0;i<keys.length;i++) { var id = keys[i]; html += '<div class="squadra-btn ' + (id===stato.squadraTU?'selezionata':'') + '" onclick="selezionaTU1P(\'' + id + '\')"><div class="nome">' + SQUADRE[id].nome + '</div><div class="maglia">' + creaGiocatoreSVG(SQUADRE[id].casa, 'fermo') + '</div></div>'; }
  html += '</div><div style="margin-top:24px"><button class="primario" onclick="avviaPartitaDaSetup()">INIZIA PARTITA</button><button onclick="mostraMenuPrincipale()">← INDIETRO</button></div>';
  document.getElementById('modale-box').innerHTML = html;
  document.getElementById('modale').classList.remove('nascosto');
}
function selezionaTU1P(id) { stato.squadraTU = id; avviaSetup1P(); }
function avviaSetup2P() {
  stato.tipoPartita = '2P';
  var keys = Object.keys(SQUADRE);
  var html = '<h2>👤 Giocatore 1</h2><div class="squadre-griglia">';
  for (var i=0;i<keys.length;i++) { var id = keys[i]; html += '<div class="squadra-btn ' + (id===stato.squadraTU?'selezionata':'') + '" onclick="selezionaTU2P(\'' + id + '\')"><div class="nome">' + SQUADRE[id].nome + '</div><div class="maglia">' + creaGiocatoreSVG(SQUADRE[id].casa, 'fermo') + '</div></div>'; }
  html += '</div><h2 style="margin-top:30px">👤 Giocatore 2</h2><div class="squadre-griglia">';
  for (var j=0;j<keys.length;j++) { var id2 = keys[j]; html += '<div class="squadra-btn ' + (id2===stato.squadraCPU?'selezionata':'') + '" onclick="selezionaCPU2P(\'' + id2 + '\')"><div class="nome">' + SQUADRE[id2].nome + '</div><div class="maglia">' + creaGiocatoreSVG(SQUADRE[id2].casa, 'fermo') + '</div></div>'; }
  html += '</div><div style="margin-top:24px"><button class="primario" onclick="avviaPartitaDaSetup()">INIZIA PARTITA</button><button onclick="mostraMenuPrincipale()">← INDIETRO</button></div>';
  document.getElementById('modale-box').innerHTML = html;
  document.getElementById('modale').classList.remove('nascosto');
}
function selezionaTU2P(id) { stato.squadraTU = id; avviaSetup2P(); }
function selezionaCPU2P(id) { stato.squadraCPU = id; avviaSetup2P(); }
function avviaPartitaDaSetup() { if (stato.tipoPartita === '1P') { var d = Object.keys(SQUADRE).filter(function(id){ return id !== stato.squadraTU; }); stato.squadraCPU = d[Math.floor(Math.random()*d.length)]; } avviaPartita(stato.squadraTU, stato.squadraCPU, stato.tipoPartita); }

function avviaPartita(sqTU, sqCPU, tipo, casaSquadra) {
  tipo = tipo || '1P';
  richiediFullscreen();
  stato.tipoPartita = tipo; stato.squadraTU = sqTU; stato.squadraCPU = sqCPU;
  stato.divise = scegliDivise(sqTU, sqCPU);
  stato.giocatori.tu = creaGiocatori('tu'); stato.giocatori.cpu = creaGiocatori('cpu');
  stato.panchina.tu = creaPanchina('tu'); stato.panchina.cpu = creaPanchina('cpu');
  inizializzaMazzi();
  pescaCarteMano('tu', CARTE_INIZIALI); pescaCarteMano('cpu', CARTE_INIZIALI);
  stato.punteggio = { tu:0, cpu:0 }; stato.tempo = 1; stato.mano = 1;
  stato.partitaFinita = false; stato.sostBloccate = false;
  stato.logCompleto = [];
  stato.zonaPalla = 3; stato.possessore = null; stato.giocatorePalla = null; stato.metaContesa = 'inf'; stato.azioneTiroDaPalo = null;
  stato.bonus = { tu: [], cpu: [] }; stato.bonusUsatoQuestoTiro = { tu:null, cpu:null }; stato.streak = { tu:0, cpu:0 };
  stato.contrasto = null; stato.invertiCoppie = false;
  ZONE_CONFIG[0].proprietario = 'tu'; ZONE_CONFIG[6].proprietario = 'cpu';
  if (casaSquadra) stato.tuECasa = (casaSquadra === sqTU);
  else if (URL_CASA) stato.tuECasa = (URL_CASA === sqTU);
  else stato.tuECasa = true;
  if (stato.tuECasa) stato.direzioneAttaccoTU = 1; else stato.direzioneAttaccoTU = -1;
  applicaSqualifiche('tu'); applicaSqualifiche('cpu');
  adattaScena(); setTimeout(adattaScena, 100); setTimeout(adattaScena, 400);
  renderCampo(); renderHeader(); chiudiModale();
  document.getElementById('modale-box').innerHTML =
    '<h2>🪙 Lancio della moneta</h2><p style="font-size:24px;color:#aaa;margin:20px 0">Scegli testa o croce</p>' +
    '<div style="display:flex;gap:30px;justify-content:center;margin-top:30px"><button class="primario" style="font-size:32px;padding:40px 80px;border-radius:20px" onclick="lanciaMoneta(\'testa\')">TESTA</button><button class="primario" style="font-size:32px;padding:40px 80px;border-radius:20px" onclick="lanciaMoneta(\'croce\')">CROCE</button></div>';
  document.getElementById('modale').classList.remove('nascosto');
}
function lanciaMoneta(scelta, callback) {
  richiediFullscreen(); initAudio(); avviaSottofondo();
  setTimeout(function() { aggiornaSottofondoPerZona(stato.zonaPalla); }, 500);
  var esito = Math.random() < 0.5 ? 'testa' : 'croce';
  var vince = esito === scelta ? 'tu' : 'cpu';
  stato.monetaVinta = vince;
  chiudiModale();
  mostraAnimazioneMoneta(vince, function() { if (callback) callback(vince); else { avviaTimer(); eseguiCalcioIniziale(vince); } });
}
function mostraAnimazioneMoneta(vincente, cb) {
  suonaMoneta();
  var anim = document.getElementById('moneta-animazione');
  var moneta = document.getElementById('moneta-gira'); var testo = document.getElementById('moneta-testo');
  anim.classList.remove('nascosta');
  moneta.textContent = '🪙'; testo.textContent = 'Lancio della moneta...';
  moneta.style.animation = 'none'; void moneta.offsetWidth;
  moneta.style.animation = 'monetaGira 2s cubic-bezier(0.4,0,0.2,1) forwards';
  setTimeout(function() { testo.textContent = vincente === 'tu' ? '🏆 TU VINCI!' : '🏆 CPU VINCE!'; moneta.textContent = vincente === 'tu' ? '🏆' : '🤖'; }, 2000);
  setTimeout(function() { anim.classList.add('nascosta'); if (cb) cb(); }, 3200);
}

function animaPallaInZona(gDa, gA, cb, saltaZone) {
  suonaCalcio();
  // Segui istantaneamente la palla durante l'animazione (campo scorre sotto)
  zoomState.seguiIstantaneo = true;

  var scena = document.getElementById('scena'); var box = scena.getBoundingClientRect();
  var wrapperD = document.querySelector('[data-giocatore-id="' + gDa.id + '"]');
  var wrapperA = document.querySelector('[data-giocatore-id="' + gA.id + '"]');
  if (!wrapperD || !wrapperA) { zoomState.seguiIstantaneo = false; if (cb) cb(); return; }
  var pedD = wrapperD.querySelector('.pedina') || wrapperD;
  var pedA = wrapperA.querySelector('.pedina') || wrapperA;
  var rD = pedD.getBoundingClientRect(), rA = pedA.getBoundingClientRect();
  var pX = (rD.left + rD.width/2 - box.left) / scalaCorrente;
  var pY = (rD.bottom - box.top) / scalaCorrente;
  var aX = (rA.left + rA.width/2 - box.left) / scalaCorrente;
  var aY = (rA.bottom - box.top) / scalaCorrente;
  var p = document.getElementById('palla-volante');
  if (p && p.parentNode !== scena) scena.appendChild(p);
  var v = document.querySelectorAll('.palla-centro'); for (var i=0;i<v.length;i++) v[i].remove();
  var e = document.querySelectorAll('.evidenzia-coppia'); for (var j=0;j<e.length;j++) e[j].remove();
  p.innerHTML = '<div class="palla-inner">' + creaPalloneSVG() + '</div>';
  var pi = p.querySelector('.palla-inner');
  p.style.transition = 'none'; p.style.left = pX + 'px'; p.style.top = pY + 'px'; p.classList.add('attiva');
  pi.style.transform = 'rotate(0deg)'; void p.offsetWidth;
  var dur = DURATA_ANIM_PALLA; if (saltaZone) dur = dur * 1.4;
  var t0 = performance.now();
  var dx = aX - pX, dy = aY - pY; var dist = Math.sqrt(dx*dx + dy*dy);
  var giri = (dist/50) * (dx >= 0 ? 1 : -1); var gradi = giri * 360;
  var arco = saltaZone ? 70 : 25;
  function anima(now) {
    var t = Math.min((now - t0) / dur, 1); var e2 = t*t*(3-2*t);
    var arcoY = -Math.sin(Math.PI*t) * arco;
    p.style.left = (pX + dx*e2) + 'px'; p.style.top = (pY + dy*e2 + arcoY) + 'px';
    pi.style.transform = 'rotate(' + (gradi*e2) + 'deg)';
    if (t < 1) requestAnimationFrame(anima);
    else {
      p.classList.remove('attiva');
      stato.pallaInAnimazione = false;
      zoomState.seguiIstantaneo = false;
      if (cb) cb();
    }
  }
  requestAnimationFrame(anima);
}

function eseguiCalcioIniziale(squadra) {
  nascondiEntrambiBanner();
  var v0 = document.querySelectorAll('.palla-centro'); for (var i=0;i<v0.length;i++) v0[i].remove();
  nascondiEvidenzia();
  stato.pallaInAnimazione = true; stato.giocatorePalla = null;
  var coppiaZ3 = getCoppiaAttiva(3, 'inf');
  var gB = squadra === 'tu' ? coppiaZ3.tu : coppiaZ3.cpu;
  if (!gB) { var lista = giocatoriInZona(squadra, 3, false).filter(function(g){ return !g.portiere && !g.espulso; }); gB = lista[0] || null; }
  if (!gB) { stato.mano++; renderHeader(); setTimeout(function() { avviaContrasto(); }, 800); return; }
  var dirAtt = direzionePerSquadra(squadra);
  var zonaDest = Math.max(1, Math.min(5, 3 + dirAtt));
  var compagni = giocatoriInZona(squadra, zonaDest, false).filter(function(g){ return !g.portiere && !g.espulso; });
  if (compagni.length === 0 && zonaDest !== 3) { zonaDest = 3; compagni = giocatoriInZona(squadra, 3, false).filter(function(g){ return !g.portiere && !g.espulso && g.id !== gB.id; }); }
  var gA = compagni[0];
  stato.zonaPalla = 3; stato.metaContesa = 'inf'; stato.possessore = squadra; stato.giocatorePalla = gB.id;
  zoomState.seguiIstantaneo = true;
  renderCampo(); renderHeader(); aggiornaSottofondoPerZona(3);
  if (!gA) { stato.pallaInAnimazione = false; zoomState.seguiIstantaneo = false; renderCampo(); renderHeader(); setTimeout(function() { avviaContrasto(); }, 800); return; }

  log('🎙️ Calcio d\'inizio! ' + (squadra === 'tu' ? 'TU' : 'CPU') + ' batte dal centro con ' + gB.nome + '.', 'highlight');
  log('🎙️ ' + gB.nome + ' serve ' + gA.nome + ' in Z' + zonaDest + '.', '');

  var wrapperB = document.querySelector('[data-giocatore-id="' + gB.id + '"]');
  function finalizza() {
    var idxG = compagni.indexOf(gA); var metaG = idxG <= 0 ? 'sup' : 'inf';
    stato.zonaPalla = zonaDest; stato.metaContesa = metaG; stato.possessore = squadra; stato.giocatorePalla = gA.id; stato.pallaInAnimazione = false;
    zoomState.seguiIstantaneo = false;
    renderCampo(); renderHeader(); aggiornaSottofondoPerZona(zonaDest);
    stato.mano++; salvaPartita(); setTimeout(avviaContrasto, 800);
  }
  if (!wrapperB) { animaPallaInZona(gB, gA, finalizza); return; }
  wrapperB.style.transition = 'transform ' + (DURATA_SPOSTAMENTO_INIZIO/1000) + 's cubic-bezier(0.34,1.2,0.64,1)';
  wrapperB.style.transform = 'translate(-50%, -' + SALITA_CALCIO_INIZIO + 'px)';
  setTimeout(function() {
    var ped = wrapperB.querySelector('.pedina');
    if (ped) { ped.classList.add('pg-in-calcio'); setTimeout(function() { ped.classList.remove('pg-in-calcio'); }, 800); }
    suonaCalcio();
    setTimeout(function() {
      animaPallaInZona(gB, gA, function() {
        wrapperB.style.transition = 'transform ' + (DURATA_RITORNO/1000) + 's ease-out';
        wrapperB.style.transform = 'translate(-50%, 0)';
        setTimeout(finalizza, DURATA_RITORNO);
      });
    }, 250);
  }, DURATA_SPOSTAMENTO_INIZIO);
}

/* COMBAT */
function avviaContrasto() {
  if (stato.partitaFinita) return;
  if (stato.mano > stato.maxMani) { fineTempoOPartita(); return; }
  salvaPartita();
  mostraBannerTop();
  stato.sostBloccate = false;
  var zona = stato.zonaPalla; var poss = stato.possessore; var dif = poss === 'tu' ? 'cpu' : 'tu'; var meta = stato.metaContesa;
  if (zona === 1 || zona === 5) suonaTensione();
  var c = getCoppiaAttiva(zona, meta);
  var gP = poss === 'tu' ? c.tu : c.cpu;
  var gA = poss === 'tu' ? c.cpu : c.tu;
  if (!gP) { var l1 = giocatoriInZona(poss, zona, false).filter(function(g){ return !g.portiere; }); gP = l1[0]; }
  if (!gA) { var l2 = giocatoriInZona(dif, zona, false).filter(function(g){ return !g.portiere; }); gA = l2[0]; }
  if (gP) stato.giocatorePalla = gP.id;

  if (gP && gA) {
    log('🎙️ Z' + zona + ' ' + (meta === 'sup' ? 'superiore' : 'inferiore') + ': ' + gP.nome + ' (' + (poss === 'tu' ? 'TU' : 'CPU') + ') contro ' + gA.nome + ' (' + (dif === 'tu' ? 'TU' : 'CPU') + ').', '');
  }

  riempiMano('tu'); riempiMano('cpu');
  if (stato.mani.tu.length === 0 && stato.mani.cpu.length === 0) {
    stato.mano++; setTimeout(function() { if (!stato.partitaFinita) avviaContrasto(); }, 600); return;
  }
  stato.contrasto = {
    zona: zona, attaccante: poss, difensore: dif, semeGuida: null,
    giocatorePoss: gP ? gP.id : null, giocatoreAvv: gA ? gA.id : null,
    cartaTu: null, cartaCpu: null, storico: [], turni: 0, risolto: false,
    fase: 'gioca-attaccante', cpuHaGiaGiocato: false,
    falloAttaccante: false, falloDifensore: false
  };
  stato.statistiche[poss].contese++;
  selezioneCarta = null;
  if (poss === 'cpu' && haBonus('cpu', 'contrasto-sicuro') && cpuVuoleUsareContrastoSicuro(zona)) {
    setTimeout(function() {
      consumaBonus('cpu', 'contrasto-sicuro');
      mostraBonusBanner('🤖 CPU usa: ⭐ Contrasto Sicuro!');
      setTimeout(function() { risolviContrastoAutomatico('cpu'); }, 1500);
    }, 800); return;
  }
  renderCampo(); renderHeader(); renderPannelloContrasto();
  if (poss === 'cpu') setTimeout(function() { turnoGiocaCPUAttaccante(); }, 400);
}

function confermaCarta() {
  if (selezioneCarta === null) return;
  var c = stato.contrasto;
  if (!c || c.risolto) return;

  if (c.fase === 'gioca-attaccante' && c.attaccante === 'tu') {
    var cartaTu = stato.mani.tu[selezioneCarta];
    if (!cartaTu) return;
    if (c.turni === 0 && !c.semeGuida) {
      c.semeGuida = cartaTu.seme; c.falloAttaccante = false;
      c.cartaTu = cartaTu; rimuoviCartaDaMano('tu', cartaTu);
      var nomeAtt = (trovaGiocatorePerId('tu', c.giocatorePoss)||{}).nome || 'TU';
      log('🎙️ ' + nomeAtt + ' gioca ' + cartaTu.label + SEMI[cartaTu.seme].emoji + ' e impone il seme guida: ' + SEMI[cartaTu.seme].nome, 'highlight');
      nascondiEntrambiBanner(); setTimeout(function() { rispostaCPUAlSeme(); }, 1000); return;
    }
    if (cartaTu.seme !== c.semeGuida) {
      var cpuHaSeme = haSemeInMano('cpu', c.semeGuida);
      c.falloAttaccante = cpuHaSeme;
    } else { c.falloAttaccante = false; }
    c.cartaTu = cartaTu; rimuoviCartaDaMano('tu', cartaTu);
    var nomeAtt2 = (trovaGiocatorePerId('tu', c.giocatorePoss)||{}).nome || 'TU';
    log('🎙️ ' + nomeAtt2 + ' gioca ' + cartaTu.label + SEMI[cartaTu.seme].emoji + (c.falloAttaccante ? ' — FALLO!' : ''), c.falloAttaccante ? 'parata' : 'highlight');
    nascondiEntrambiBanner(); setTimeout(function() { rispostaCPUAlSeme(); }, 1000); return;
  }

  if (c.fase === 'risposta-difensore' && c.difensore === 'tu') {
    var cartaTuR = stato.mani.tu[selezioneCarta];
    if (!cartaTuR) return;
    c.falloDifensore = (cartaTuR.seme !== c.semeGuida);
    c.cartaTu = cartaTuR; rimuoviCartaDaMano('tu', cartaTuR);
    var nomeDif = (trovaGiocatorePerId('tu', c.giocatoreAvv)||{}).nome || 'TU';
    log('🎙️ ' + nomeDif + ' risponde con ' + cartaTuR.label + SEMI[cartaTuR.seme].emoji + (c.falloDifensore ? ' — FALLO!' : ''), c.falloDifensore ? 'parata' : '');
    nascondiEntrambiBanner(); setTimeout(function() { risolviTurnoContrasto(); }, 1000); return;
  }
}

function rimuoviCartaDaMano(sq, carta) { var idx = stato.mani[sq].indexOf(carta); if (idx > -1) { stato.scarti[sq].push(stato.mani[sq][idx]); stato.mani[sq].splice(idx, 1); } }

function turnoGiocaCPUAttaccante() {
  var c = stato.contrasto;
  if (!c || c.risolto) return;
  if (stato.mani.cpu.length === 0) { pescaUnaCarta('cpu'); if (stato.mani.cpu.length === 0) { fineManoSenzaVincitore(); return; } }
  var cartaCPU;
  if (c.turni === 0 && !c.semeGuida) {
    cartaCPU = scegliCartaPiuAlta(stato.mani.cpu); c.semeGuida = cartaCPU.seme; c.falloAttaccante = false;
  } else {
    var carteSeme = stato.mani.cpu.filter(function(x){ return x.seme === c.semeGuida; });
    if (carteSeme.length > 0) { cartaCPU = scegliCartaPiuAlta(carteSeme); c.falloAttaccante = false; }
    else { cartaCPU = scegliCartaPiuAlta(stato.mani.cpu); c.falloAttaccante = haSemeInMano('tu', c.semeGuida); }
  }
  c.cartaCpu = cartaCPU; c.cpuHaGiaGiocato = true; rimuoviCartaDaMano('cpu', cartaCPU);
  var nomeCPU = (trovaGiocatorePerId('cpu', c.giocatorePoss)||{}).nome || 'CPU';
  log('🎙️ ' + nomeCPU + ' gioca ' + cartaCPU.label + SEMI[cartaCPU.seme].emoji + (c.turni === 0 ? ' → seme guida: ' + SEMI[cartaCPU.seme].nome : '') + (c.falloAttaccante ? ' — FALLO!' : ''), c.falloAttaccante ? 'parata' : 'highlight');
  c.fase = 'risposta-difensore'; renderPannelloContrasto(); setTimeout(function() { mostraCarteOverlay(); }, 100);
}

function rispostaCPUAlSeme() {
  var c = stato.contrasto;
  if (!c || c.risolto) return;
  var mani = stato.mani.cpu;
  if (mani.length === 0) {
    pescaUnaCarta('cpu'); mani = stato.mani.cpu;
    if (mani.length === 0) { c.cartaCpu = null; risolviTurnoContrasto(); return; }
  }
  var carteSeme = mani.filter(function(x){ return x.seme === c.semeGuida; });
  var cartaCPU;
  if (carteSeme.length > 0) {
    cartaCPU = scegliCartaPiuAlta(carteSeme); c.falloDifensore = false;
  } else {
    cartaCPU = scegliCartaPiuAlta(mani); c.falloDifensore = true;
  }
  c.cartaCpu = cartaCPU; rimuoviCartaDaMano('cpu', cartaCPU);
  var nomeCPU = (trovaGiocatorePerId('cpu', c.giocatoreAvv)||{}).nome || 'CPU';
  log('🎙️ ' + nomeCPU + ' risponde con ' + cartaCPU.label + SEMI[cartaCPU.seme].emoji + (c.falloDifensore ? ' — FALLO!' : ''), c.falloDifensore ? 'parata' : '');
  setTimeout(function() { risolviTurnoContrasto(); }, 500);
}

function scegliCartaPiuAlta(carte) { if (!carte || carte.length === 0) return null; var best = carte[0]; for (var i = 1; i < carte.length; i++) if (carte[i].valore > best.valore) best = carte[i]; return best; }

function risolviTurnoContrasto() {
  var c = stato.contrasto;
  if (!c || c.risolto) return;
  var cartaAtt = (c.attaccante === 'tu') ? c.cartaTu : c.cartaCpu;
  var cartaDif = (c.difensore === 'tu') ? c.cartaTu : c.cartaCpu;
  if (!cartaAtt && !cartaDif) { fineManoSenzaVincitore(); return; }
  if (!cartaAtt) { mostraBannerTurno(null, cartaDif, c.semeGuida, 'Attaccante senza carta', 'difensore'); setTimeout(function() { nascondiBannerMano(); concludiContrasto('difensore'); }, DURATA_BANNER_VINCITORE); return; }
  if (!cartaDif) { mostraBannerTurno(cartaAtt, null, c.semeGuida, 'Difensore senza carta', 'attaccante'); setTimeout(function() { nascondiBannerMano(); concludiContrasto('attaccante'); }, DURATA_BANNER_VINCITORE); return; }
  var attHaSeme = cartaAtt.seme === c.semeGuida;
  var difHaSeme = cartaDif.seme === c.semeGuida;
  var esito, motivo;
  if (c.falloAttaccante && c.falloDifensore) { esito = cartaAtt.valore >= cartaDif.valore ? 'attaccante' : 'difensore'; motivo = '⚠️ ENTRAMBI IN FALLO'; }
  else if (c.falloAttaccante) { esito = 'difensore'; motivo = '⚠️ FALLO ATTACCANTE · vince il difensore'; }
  else if (c.falloDifensore) { esito = 'attaccante'; motivo = '⚠️ FALLO DIFENSORE · vince l\'attaccante'; }
  else if (attHaSeme && !difHaSeme) { esito = 'attaccante'; motivo = 'Attaccante col seme guida'; }
  else if (!attHaSeme && difHaSeme) { esito = 'difensore'; motivo = 'Difensore col seme guida'; }
  else { if (cartaAtt.valore > cartaDif.valore) { esito = 'attaccante'; motivo = 'Valore più alto'; } else if (cartaDif.valore > cartaAtt.valore) { esito = 'difensore'; motivo = 'Valore più alto'; } else { esito = 'pareggio'; motivo = 'Carte di pari valore'; } }
  c.storico.push({ att: cartaAtt, dif: cartaDif, esito: esito, fAtt: c.falloAttaccante, fDif: c.falloDifensore });

  var nomeAtt = (trovaGiocatorePerId(c.attaccante, c.giocatorePoss)||{}).nome || c.attaccante;
  var nomeDif = (trovaGiocatorePerId(c.difensore, c.giocatoreAvv)||{}).nome || c.difensore;
  var esitoTxt = (esito === 'pareggio') ? 'PAREGGIO' : (esito === 'attaccante' ? 'vince ' + nomeAtt : 'vince ' + nomeDif);
  log('🎙️ ' + nomeAtt + ' ' + cartaAtt.label + SEMI[cartaAtt.seme].emoji + ' vs ' + nomeDif + ' ' + cartaDif.label + SEMI[cartaDif.seme].emoji + ' → ' + esitoTxt + ' (' + motivo + ')', esito === 'pareggio' ? '' : 'highlight');

  mostraBannerTurno(cartaAtt, cartaDif, c.semeGuida, motivo, esito);
  setTimeout(function() {
    nascondiBannerMano();
    if (esito === 'pareggio') {
      c.cartaTu = null; c.cartaCpu = null; c.cpuHaGiaGiocato = false;
      c.falloAttaccante = false; c.falloDifensore = false; c.turni++;
      if (stato.mani.tu.length === 0 || stato.mani.cpu.length === 0) { ripescaPerPareggio(); return; }
      if (c.attaccante === 'tu') { selezioneCarta = null; c.fase = 'gioca-attaccante'; setTimeout(function() { mostraEntrambiBanner(); renderPannelloContrasto(); }, PAUSA_PRE_AZIONE); }
      else { turnoGiocaCPUAttaccanteRipetizione(); }
      return;
    }
    concludiContrasto(esito);
  }, DURATA_BANNER_VINCITORE);
}

function turnoGiocaCPUAttaccanteRipetizione() {
  var c = stato.contrasto;
  if (!c || c.risolto) return;
  if (stato.mani.cpu.length === 0) { pescaUnaCarta('cpu'); if (stato.mani.cpu.length === 0) { c.cartaCpu = null; risolviTurnoContrasto(); return; } }
  var carteSeme = stato.mani.cpu.filter(function(x){ return x.seme === c.semeGuida; });
  var cartaCPU;
  if (carteSeme.length > 0) { cartaCPU = scegliCartaPiuAlta(carteSeme); c.falloAttaccante = false; }
  else { cartaCPU = scegliCartaPiuAlta(stato.mani.cpu); c.falloAttaccante = haSemeInMano('tu', c.semeGuida); }
  c.cartaCpu = cartaCPU; c.cpuHaGiaGiocato = true; rimuoviCartaDaMano('cpu', cartaCPU);
  var nomeCPU = (trovaGiocatorePerId('cpu', c.giocatorePoss)||{}).nome || 'CPU';
  log('🎙️ ' + nomeCPU + ' rigioca ' + cartaCPU.label + SEMI[cartaCPU.seme].emoji + (c.falloAttaccante ? ' — FALLO!' : ''), c.falloAttaccante ? 'parata' : '');
  c.fase = 'risposta-difensore'; renderPannelloContrasto(); setTimeout(function() { mostraCarteOverlay(); }, 100);
}

function haSemeInMano(sq, seme) { for (var i = 0; i < stato.mani[sq].length; i++) if (stato.mani[sq][i].seme === seme) return true; return false; }

function ripescaPerPareggio() {
  var c = stato.contrasto;
  if (!c || c.risolto) return;
  pescaUnaCarta('tu'); pescaUnaCarta('cpu');
  if (stato.mani.tu.length === 0 || stato.mani.cpu.length === 0) {
    if (stato.mani.tu.length === 0 && stato.mani.cpu.length === 0) concludiContrasto('attaccante');
    else if (stato.mani.tu.length === 0) concludiContrasto(c.difensore === 'tu' ? 'attaccante' : 'difensore');
    else concludiContrasto(c.attaccante === 'tu' ? 'attaccante' : 'difensore');
    return;
  }
  c.cpuHaGiaGiocato = false; c.falloAttaccante = false; c.falloDifensore = false;
  if (c.attaccante === 'tu') { selezioneCarta = null; c.fase = 'gioca-attaccante'; setTimeout(function() { mostraEntrambiBanner(); renderPannelloContrasto(); }, PAUSA_PRE_AZIONE); }
  else { turnoGiocaCPUAttaccanteRipetizione(); }
}

function concludiContrasto(esito) {
  var c = stato.contrasto;
  if (!c || c.risolto) return;
  c.risolto = true;
  c.vincitore = (esito === 'attaccante') ? c.attaccante : c.difensore;
  risolviContrastoLogica(c.vincitore, c);
}

function fineManoSenzaVincitore() {
  var c = stato.contrasto;
  if (!c || c.risolto) return;
  pescaUnaCarta('tu'); pescaUnaCarta('cpu');
  if (stato.mani.tu.length === 0 && stato.mani.cpu.length === 0) { c.risolto = true; c.vincitore = c.attaccante; risolviContrastoLogica(c.vincitore, c); return; }
  ripescaPerPareggio();
}

function mostraBannerTurno(cartaAtt, cartaDif, semeGuida, motivo, esito) {
  var b = document.getElementById('banner-mano');
  b.classList.remove('tu', 'cpu', 'attivo'); void b.offsetWidth;
  if (esito === 'pareggio') b.classList.add('attivo');
  else if (esito === 'attaccante') b.classList.add(stato.contrasto.attaccante === 'tu' ? 'tu' : 'cpu', 'attivo');
  else b.classList.add(stato.contrasto.difensore === 'tu' ? 'tu' : 'cpu', 'attivo');
  var testoVincitore;
  if (esito === 'pareggio') testoVincitore = '🤝 PAREGGIO!';
  else if (esito === 'attaccante') testoVincitore = (stato.contrasto.attaccante === 'tu') ? '🏆 TU VINCI!' : '🏆 CPU VINCE!';
  else testoVincitore = (stato.contrasto.difensore === 'tu') ? '🏆 TU RUBI PALLA!' : '🏆 CPU RUBA PALLA!';
  document.getElementById('banner-vincitore').textContent = testoVincitore;
  var eCasa = document.getElementById('banner-carta-casa'); eCasa.innerHTML = '';
  if (cartaAtt) eCasa.appendChild(creaCartaEl(cartaAtt)); else eCasa.innerHTML = '<div style="color:#666;font-size:40px;padding:60px">—</div>';
  var eSeme = document.getElementById('banner-carta-seme'); eSeme.innerHTML = '';
  var semeDiv = document.createElement('div'); semeDiv.className = 'carta';
  semeDiv.innerHTML = '<div class="seme-centro" style="font-size:152px;display:flex;align-items:center;justify-content:center;width:100%;height:100%">' + SEMI[semeGuida].emoji + '</div>';
  eSeme.appendChild(semeDiv);
  var eTrasf = document.getElementById('banner-carta-trasferta'); eTrasf.innerHTML = '';
  if (cartaDif) eTrasf.appendChild(creaCartaEl(cartaDif)); else eTrasf.innerHTML = '<div style="color:#666;font-size:40px;padding:60px">—</div>';
  document.getElementById('banner-seme').textContent = 'Seme guida: ' + SEMI[semeGuida].nome + ' ' + SEMI[semeGuida].emoji;
  var mot = motivo || '';
  if (stato.contrasto.falloAttaccante) mot += ' · ⚠️ FALLO ATTACCANTE';
  if (stato.contrasto.falloDifensore) mot += ' · ⚠️ FALLO DIFENSORE';
  document.getElementById('banner-motivo').textContent = mot + ' · Turno ' + stato.contrasto.storico.length;
}

function risolviContrastoAutomatico(vincente) {
  var c = stato.contrasto;
  if (!c || c.risolto) return;
  c.risolto = true; c.vincitore = vincente;
  flashVincitore(vincente);
  stato.streak[vincente]++;
  if (stato.streak[vincente] >= STREAK_PER_BONUS) { stato.streak[vincente] = 0; assegnaBonus(vincente); }
  var perdente = vincente === 'tu' ? 'cpu' : 'tu';
  stato.streak[perdente] = 0;
  var cartaFinta = {label:'?',seme:'palla',valore:0};
  mostraBannerMano(vincente, c.cartaTu||cartaFinta, c.cartaCpu||cartaFinta, c.semeGuida || 'palla', 'Contrasto Sicuro');
  setTimeout(function() { nascondiBannerMano(); setTimeout(function() { risolviContrastoLogica(vincente, c); }, 300); }, 3200);
}

function cpuVuoleUsareContrastoSicuro(zona) { var dir = direzionePerSquadra('cpu'); var zonaAv = dir > 0 ? (zona >= 4) : (zona <= 2); var staPerdendo = stato.punteggio.cpu < stato.punteggio.tu; var secondoTempo = stato.tempo === 2; return zonaAv || (staPerdendo && secondoTempo); }

function renderPannelloContrasto() {
  var c = stato.contrasto; if (!c) return;
  document.getElementById('titolo-mano').textContent = 'Contrasto Z' + c.zona + ' ' + stato.metaContesa;
  var faseLabel = ''; var tuPuoGiocare = false; var tuDeveRispondereAlSeme = false; var tuNonHaSeme = false;
  if (c.fase === 'gioca-attaccante' && c.attaccante === 'tu') {
    if (c.turni === 0 && !c.semeGuida) { faseLabel = 'TU SEI IN ATTACCO — scegli la tua carta (definirà il seme guida)'; }
    else {
      var tuHaSeme = haSemeInMano('tu', c.semeGuida);
      if (tuHaSeme) { faseLabel = 'TU SEI IN ATTACCO — gioca il seme ' + SEMI[c.semeGuida].emoji + ' ' + SEMI[c.semeGuida].nome; }
      else { faseLabel = '⚠️ NON HAI IL SEME — scegli quale carta giocare'; tuNonHaSeme = true; }
    }
    tuPuoGiocare = true;
  } else if (c.fase === 'risposta-difensore' && c.difensore === 'tu') {
    if (haSemeInMano('tu', c.semeGuida)) { faseLabel = 'TU SEI IN DIFESA — gioca il seme ' + SEMI[c.semeGuida].emoji + ' ' + SEMI[c.semeGuida].nome + ' (o commetti fallo)'; tuDeveRispondereAlSeme = true; }
    else { faseLabel = '⚠️ NON HAI IL SEME — qualsiasi carta giochi sarà FALLO'; tuNonHaSeme = true; }
    tuPuoGiocare = true;
  } else if (c.attaccante === 'cpu') { faseLabel = '🤖 CPU sta giocando...'; }
  document.getElementById('carte-overlay-titolo').textContent = faseLabel;

  var slotEl = document.getElementById('slot-cpu-carta'); var labelEl = document.getElementById('seme-carta-label'); slotEl.innerHTML = '';
  if (c.cpuHaGiaGiocato && c.cartaCpu) {
    labelEl.textContent = 'CPU HA GIOCATO'; labelEl.classList.add('cpu-label');
    var contSlot = document.createElement('div'); contSlot.className = 'cpu-card-slot'; contSlot.appendChild(creaCartaEl(c.cartaCpu)); slotEl.appendChild(contSlot);
  } else {
    labelEl.textContent = 'SEME GUIDA'; labelEl.classList.remove('cpu-label');
    var semeDiv = document.createElement('div'); semeDiv.className = 'seme-carta';
    semeDiv.innerHTML = '<span class="seme-emoji">' + (c.semeGuida ? SEMI[c.semeGuida].emoji : '❔') + '</span>';
    slotEl.appendChild(semeDiv);
  }
  var subTxt = c.semeGuida ? 'Seme guida: ' + SEMI[c.semeGuida].emoji + ' ' + SEMI[c.semeGuida].nome + ' · Turno ' + (c.storico.length + 1) : 'Il possessore gioca per primo e definisce il seme';
  document.getElementById('carte-overlay-sottotitolo').textContent = subTxt;
  document.getElementById('turno-label').textContent = c.semeGuida ? 'Seme: ' + SEMI[c.semeGuida].nome : 'Attende...';

  var carteOrdinate = stato.mani.tu.map(function(carta, idxOrig) { return { carta: carta, idxOrig: idxOrig }; })
    .sort(function(a, b) { var sA = ORDINE_SEMI.indexOf(a.carta.seme); var sB = ORDINE_SEMI.indexOf(b.carta.seme); if (sA !== sB) return sA - sB; return a.carta.valore - b.carta.valore; });
  var contTu = document.getElementById('carte-overlay-carte'); contTu.innerHTML = '';
  for (var i=0; i<carteOrdinate.length; i++) {
    (function(entry) {
      var carta = entry.carta; var idx = entry.idxOrig;
      var el = creaCartaEl(carta);
      if (c.semeGuida) el.classList.add('seme-guidatore');
      el.onclick = function() { if (tuPuoGiocare) selezionaCartaTu(idx); };
      if (selezioneCarta === idx) el.classList.add('selezionata');
      contTu.appendChild(el);
    })(carteOrdinate[i]);
  }
  var avviso = '';
  if (tuNonHaSeme) { avviso = '<div style="background:#8B2020;color:#fff;padding:14px;border-radius:10px;font-weight:bold;font-size:18px;text-align:center">⚠️ Non hai il seme ' + SEMI[c.semeGuida].emoji + ' ' + SEMI[c.semeGuida].nome + ' — qualsiasi carta giochi sarà FALLO</div>'; }
  else if (tuDeveRispondereAlSeme || (c.attaccante === 'tu' && c.turni > 0)) { avviso = '<div style="background:rgba(255,215,0,0.15);color:#ffd700;padding:10px;border-radius:10px;font-size:15px;text-align:center">Hai il seme guida. Se scegli una carta fuori seme commetterai fallo.</div>'; }
  renderPilaMazzo(); renderPilaScarti(); renderPilaBonus(); renderBonusSlots();
  document.getElementById('info-mazzo').textContent = stato.mazzi.tu.length + '/' + stato.mazzi.cpu.length;
  document.getElementById('info-scarti').textContent = stato.scarti.tu.length + '/' + stato.scarti.cpu.length;
  document.getElementById('info-streak').textContent = stato.streak.tu;
  renderBonusCpuInfo();
  var azioni = '';
  if (tuPuoGiocare && !c.risolto) {
    azioni += '<button class="primario" id="btn-gioca" onclick="confermaCarta()" ' + (selezioneCarta === null ? 'disabled' : '') + '>GIOCA CARTA</button>';
    if (haBonus('tu', 'contrasto-sicuro') && c.fase === 'gioca-attaccante' && c.attaccante === 'tu' && c.turni === 0) { azioni += ' <button class="bonus-btn" onclick="usaContrastoSicuroTU()">⭐ CONTRASTO SICURO</button>'; }
  }
  document.getElementById('azioni-container').innerHTML = avviso + azioni;
  setTimeout(function() { mostraCarteOverlay(); }, 150);
}

function creaCartaEl(carta) { var el = document.createElement('div'); el.className = 'carta'; el.innerHTML = '<div class="valore-alto">' + carta.label + '</div><div class="seme-centro">' + SEMI[carta.seme].emoji + '</div><div class="valore-basso">' + carta.label + '</div>'; return el; }
function renderPilaMazzo() { var mp = document.getElementById('mazzo-pila'); if (!mp) return; mp.innerHTML = ''; var tot = stato.mazzi.tu.length + stato.mazzi.cpu.length; var n = Math.min(tot, 4); for (var i = 0; i < n; i++) { var el = document.createElement('div'); el.className = 'pila-carta dietro'; el.style.left = (i * 2) + 'px'; el.style.top = (i * 2) + 'px'; mp.appendChild(el); } var mc = document.getElementById('mazzo-count'); if (mc) mc.textContent = tot; }
function renderPilaScarti() { var sp = document.getElementById('scarti-pila'); if (!sp) return; sp.innerHTML = ''; var tot = stato.scarti.tu.length + stato.scarti.cpu.length; var n = Math.min(tot, 4); for (var i = 0; i < n; i++) { var el = document.createElement('div'); el.className = 'pila-carta scarto'; el.style.left = (i * 2) + 'px'; el.style.top = (i * 2) + 'px'; sp.appendChild(el); } var sc = document.getElementById('scarti-count'); if (sc) sc.textContent = tot; }
function renderPilaBonus() { var bp = document.getElementById('bonus-pila'); if (!bp) return; bp.innerHTML = ''; var n = Math.min(stato.mazzoBonus.length, 4); for (var i=0;i<n;i++) { var el = document.createElement('div'); el.className = 'pila-carta bonus'; el.style.left = (i*2) + 'px'; el.style.top = (i*2) + 'px'; bp.appendChild(el); } var bc = document.getElementById('bonus-count'); if (bc) bc.textContent = stato.mazzoBonus.length; }
function renderBonusSlots() { var slots = document.querySelectorAll('#bonus-slots-tu .bonus-slot'); for (var i=0;i<slots.length;i++) { var s = slots[i]; s.innerHTML = ''; s.classList.remove('pieno'); if (i < stato.bonus.tu.length) { var tipo = stato.bonus.tu[i]; s.classList.add('pieno'); var info = NOMI_BONUS[tipo]; var c = document.createElement('div'); c.className = 'bonus-carta ' + tipo; c.innerHTML = '<span>' + info.icona + '</span>'; s.appendChild(c); } } }
function selezionaCartaTu(idx) { if (stato.contrasto.risolto) return; if (!stato.sostBloccate) stato.sostBloccate = true; selezioneCarta = idx; renderPannelloContrasto(); }
function usaContrastoSicuroTU() { if (!haBonus('tu', 'contrasto-sicuro')) return; consumaBonus('tu', 'contrasto-sicuro'); mostraBonusBanner('🏆 TU usi: ⭐ Contrasto Sicuro!'); document.getElementById('azioni-container').innerHTML = ''; renderBonusSlots(); nascondiEntrambiBanner(); setTimeout(function() { risolviContrastoAutomatico('tu'); }, 1500); }

function mostraBannerMano(v, cT, cC, seme, motivo) {
  var b = document.getElementById('banner-mano');
  b.classList.remove('tu', 'cpu', 'attivo'); void b.offsetWidth;
  if (v === 'pareggio') b.classList.add('attivo'); else b.classList.add(v, 'attivo');
  document.getElementById('banner-vincitore').textContent = v === 'tu' ? '🏆 TU VINCI!' : v === 'cpu' ? '🏆 CPU VINCE!' : '🤝 PAREGGIO!';
  var sqCasa, sqTrasf;
  if (URL_CASA && URL_TRASFERTA) { sqCasa = URL_CASA; sqTrasf = URL_TRASFERTA; } else { sqCasa = stato.squadraTU; sqTrasf = stato.squadraCPU; }
  var cartaCasa = (sqCasa === stato.squadraTU) ? cT : cC; var cartaTrasf = (sqCasa === stato.squadraTU) ? cC : cT;
  var eCasa = document.getElementById('banner-carta-casa'); eCasa.innerHTML = ''; eCasa.appendChild(creaCartaEl(cartaCasa));
  var eSeme = document.getElementById('banner-carta-seme'); eSeme.innerHTML = '';
  var semeDiv = document.createElement('div'); semeDiv.className = 'carta';
  semeDiv.innerHTML = '<div class="seme-centro" style="font-size:152px;display:flex;align-items:center;justify-content:center;width:100%;height:100%">' + SEMI[seme].emoji + '</div>';
  eSeme.appendChild(semeDiv);
  var eTrasf = document.getElementById('banner-carta-trasferta'); eTrasf.innerHTML = ''; eTrasf.appendChild(creaCartaEl(cartaTrasf));
  document.getElementById('banner-seme').textContent = 'Seme: ' + SEMI[seme].nome + ' ' + SEMI[seme].emoji;
  document.getElementById('banner-motivo').textContent = motivo || '';
}
function nascondiBannerMano() { document.getElementById('banner-mano').classList.remove('attivo'); }

function trovaGiocatorePerId(sq, id) { if (!id) return null; for (var i = 0; i < stato.giocatori[sq].length; i++) if (stato.giocatori[sq][i].id === id) return stato.giocatori[sq][i]; return null; }

function applicaFallo(sq, gF, inArea) {
  if (!gF || gF.espulso) return;
  gF.falli++; stato.statistiche[sq].falli++;
  if (inArea) gF.falliArea = (gF.falliArea || 0) + 1;
  gF.stamina = Math.max(0, gF.stamina - 1);
  suonaFischietto('fallo');

  if (inArea) {
    if (gF.falliArea === 1 && !gF.ammonito) {
      gF.ammonito = true; stato.statistiche[sq].ammonizioni++;
      log('🟨 AMMONIZIONE per ' + gF.nome + ' (fallo in area: 1/2)', 'parata');
      var sqIdF = sq === 'tu' ? stato.squadraTU : stato.squadraCPU; aggiornaAmmonizione(sqIdF, gF.nome, 1);
    } else if (gF.falliArea >= 2 && !gF.espulso) {
      gF.espulso = true; stato.statistiche[sq].espulsioni++;
      log('🟥 ESPULSIONE per ' + gF.nome + ' (2 falli in area)!', 'goal');
      var sqIdF2 = sq === 'tu' ? stato.squadraTU : stato.squadraCPU; aggiornaAmmonizione(sqIdF2, gF.nome, 1);
    }
  } else {
    log('🟨 Fallo di ' + gF.nome + ' (' + gF.falli + ')', 'parata');
    if (gF.falli === 3 && !gF.ammonito) {
      gF.ammonito = true; stato.statistiche[sq].ammonizioni++;
      log('🟨 AMMONIZIONE per ' + gF.nome, 'parata');
      var sqIdF3 = sq === 'tu' ? stato.squadraTU : stato.squadraCPU; aggiornaAmmonizione(sqIdF3, gF.nome, 1);
    }
    if (gF.falli >= 6 && !gF.espulso) {
      gF.espulso = true; stato.statistiche[sq].espulsioni++;
      log('🟥 ' + gF.nome + ' ESPULSO!', 'goal');
      var sqIdF4 = sq === 'tu' ? stato.squadraTU : stato.squadraCPU; aggiornaAmmonizione(sqIdF4, gF.nome, 1);
    }
  }
  salvaAmmonizioniInLocalStorage();
  salvaPartita();
}

function risolviContrastoLogica(vincente, c) {
  var zonaTiroDif = direzionePerSquadra(vincente) > 0 ? 5 : 1;
  var falloInArea = (c.zona === zonaTiroDif);

  if (c.falloAttaccante) { var gAtt = trovaGiocatorePerId(c.attaccante, c.giocatorePoss); if (gAtt) applicaFallo(c.attaccante, gAtt, false); }
  if (c.falloDifensore) { var gDif = trovaGiocatorePerId(c.difensore, c.giocatoreAvv); if (gDif) applicaFallo(c.difensore, gDif, falloInArea); }

  if (vincente === 'tu') { stato.streak.tu++; stato.streak.cpu = 0; if (stato.streak.tu >= STREAK_PER_BONUS) { stato.streak.tu = 0; assegnaBonus('tu'); } }
  else { stato.streak.cpu++; stato.streak.tu = 0; if (stato.streak.cpu >= STREAK_PER_BONUS) { stato.streak.cpu = 0; assegnaBonus('cpu'); } }
  flashVincitore(vincente); stato.statistiche[vincente].vinte++;

  var gP = trovaGiocatorePerId(c.attaccante, c.giocatorePoss);
  var gA = trovaGiocatorePerId(c.difensore, c.giocatoreAvv);
  if (gP && !gP.portiere && !gP.espulso) gP.stamina = Math.max(0, gP.stamina - 1);
  if (gA && !gA.portiere && !gA.espulso) gA.stamina = Math.max(0, gA.stamina - 1);

  var nomeV = (trovaGiocatorePerId(vincente, vincente===c.attaccante?c.giocatorePoss:c.giocatoreAvv)||{}).nome || vincente;
  var haRubato = (vincente === c.difensore);
  log('🎙️ ' + nomeV + ' vince il contrasto in Z' + c.zona + (haRubato ? ' e RUBA PALLA!' : ' e avanza!'), 'highlight');

  if (c.falloDifensore && falloInArea) {
    log('⚽ RIGORE per fallo del difensore in area!', 'goal');
    setTimeout(function() { apriSchermataTiro(vincente, true); }, PAUSA_PRE_AZIONE);
    return;
  } else if (c.falloDifensore && !falloInArea) {
    log('🟨 Fallo del difensore fuori area — punizione (nessun rigore).', 'parata');
  }

  stato.mano++; salvaPartita();
  var dirVincente = direzionePerSquadra(vincente);
  var zonaAttuale = c.zona;
  var zonaTiro = dirVincente > 0 ? 5 : 1;
  if (zonaAttuale === zonaTiro) {
    stato.azioneTiroDaPalo = { zona:c.zona, giocatoreAtt:c.giocatorePoss, giocatoreDif:c.giocatoreAvv, meta:c.meta, attaccante:c.attaccante, difensore:c.difensore, possessore:vincente };
    setTimeout(function() { apriSchermataTiro(vincente); }, PAUSA_PRE_AZIONE); return;
  }
  var nz = zonaAttuale + dirVincente;
  if (nz < 0 || nz > 6) { setTimeout(function() { apriSchermataTiro(vincente); }, PAUSA_PRE_AZIONE); return; }
  var gVincitore = (vincente === c.attaccante) ? gP : gA;
  var gPerdente = (vincente === c.attaccante) ? gA : gP;
  var zLungo = zonaAttuale + dirVincente * 2;
  var passaggioLungoValido = (zLungo >= 1 && zLungo <= 5);
  var procediConAvanzamento = function(zFinale) {
    if (stato.partitaFinita) return;
    var comp = giocatoriInZona(vincente, zFinale, false).filter(function(g){ return !g.portiere && !g.espulso; });
    if (comp.length === 0) { setTimeout(function() { apriSchermataTiro(vincente); }, PAUSA_PRE_AZIONE); return; }
    var sc = comp[Math.floor(Math.random()*comp.length)];
    var nm = (comp.indexOf(sc) === 0) ? 'sup' : 'inf';
    stato.zonaPalla = zFinale; stato.possessore = vincente; stato.metaContesa = nm; stato.giocatorePalla = sc.id;
    aggiornaSottofondoPerZona(zFinale);
    setTimeout(function() {
      if (stato.partitaFinita) return;
      if (haRubato && gVincitore && gPerdente) {
        suonaScivolata(); animaTackle(gVincitore, gPerdente);
        log('🎙️ SCIVOLATA DI ' + gVincitore.nome + ' AI DANNI DI ' + (gPerdente?gPerdente.nome:'AVVERSARIO') + '!', 'parata');
        setTimeout(function() {
          if (stato.partitaFinita) return;
          renderCampo(); renderHeader();
          setTimeout(function() {
            if (!gVincitore) { finalizzaSenzaAnim(); return; }
            log('🎙️ ' + gVincitore.nome + ' serve ' + sc.nome + ' in Z' + zFinale + '.', '');
            animaPallaInZona(gVincitore, sc, function() { finalizzaDopo(); });
          }, 100);
        }, DURATA_SCIVOLATA + DURATA_RITORNO);
      } else if (gVincitore) {
        renderCampo(); renderHeader();
        setTimeout(function() { if (stato.partitaFinita) return; log('🎙️ ' + gVincitore.nome + ' serve ' + sc.nome + ' in Z' + zFinale + '.', ''); animaPallaInZona(gVincitore, sc, function() { finalizzaDopo(); }); }, 100);
      } else { finalizzaSenzaAnim(); }
    }, PAUSA_PRE_AZIONE);
    function finalizzaSenzaAnim() { renderCampo(); renderHeader(); finalizzaDopo(); }
    function finalizzaDopo() {
      if (stato.partitaFinita) return;
      stato.possessore = vincente; stato.giocatorePalla = sc.id; stato.pallaInAnimazione = false;
      renderCampo(); renderHeader();
      setTimeout(function() { salvaPartita(); mostraEntrambiBanner(); setTimeout(avviaContrasto, 400); }, PAUSA_POST_AZIONE);
    }
  };
  var zonaTiroFuori = dirVincente > 0 ? 4 : 2;
  if (vincente === 'tu' && zonaAttuale === zonaTiroFuori && haBonus('tu', 'tiro-fuori-area')) {
    chiediTiroFuoriArea(zonaAttuale, function(usa) {
      if (usa) { consumaBonus('tu', 'tiro-fuori-area'); mostraBonusBanner('🏆 TU usi: 🚀 Tiro da Fuori Area!'); renderBonusSlots(); animaPallaVersoPorta(vincente, function() { apriSchermataTiro(vincente); }); }
      else procediConAvanzamento(nz);
    }); return;
  }
  if (vincente === 'tu' && passaggioLungoValido && haBonus('tu', 'passaggio-lungo')) {
    chiediPassaggioLungo(zonaAttuale, dirVincente, function(usa) {
      if (usa) { consumaBonus('tu', 'passaggio-lungo'); mostraBonusBanner('🏆 TU usi: 🎯 Passaggio Lungo!'); renderBonusSlots(); procediConAvanzamento(zLungo); }
      else procediConAvanzamento(nz);
    });
  } else if (vincente === 'cpu' && passaggioLungoValido && haBonus('cpu', 'passaggio-lungo') && cpuVuoleUsarePassaggioLungo(zonaAttuale, dirVincente)) {
    consumaBonus('cpu', 'passaggio-lungo'); procediConAvanzamento(zLungo);
  } else procediConAvanzamento(nz);
}
function cpuVuoleUsarePassaggioLungo(zona, dir) { var zonaAv = dir > 0 ? (zona >= 3) : (zona <= 3); return zonaAv; }

function chiediPassaggioLungo(zonaAttuale, direzione, callback) {
  var zNormale = zonaAttuale + direzione; var zLungo = zonaAttuale + direzione * 2;
  document.getElementById('modale-box').innerHTML = '<h2>🎯 Passaggio Lungo</h2><p style="font-size:20px;color:#ccc;margin-bottom:24px">Vuoi usare il bonus? (Z' + zNormale + ' → Z' + zLungo + ')</p><div><button class="primario" onclick="confermaPassaggioLungo(true)">SÌ</button><button onclick="confermaPassaggioLungo(false)">NO</button></div>';
  document.getElementById('modale').classList.remove('nascosto');
  window._passaggioLungoCallback = function(usa) { chiudiModale(); callback(usa); };
}
function confermaPassaggioLungo(usa) { if (window._passaggioLungoCallback) window._passaggioLungoCallback(usa); }
function chiediTiroFuoriArea(zona, callback) {
  document.getElementById('modale-box').innerHTML = '<h2>🚀 Tiro da Fuori Area</h2><p style="font-size:20px;color:#ccc;margin-bottom:24px">Vuoi tirare subito in porta da Z' + zona + '?</p><div><button class="primario" onclick="confermaTiroFuoriArea(true)">SÌ</button><button onclick="confermaTiroFuoriArea(false)">NO</button></div>';
  document.getElementById('modale').classList.remove('nascosto');
  window._tiroFuoriCallback = function(usa) { chiudiModale(); callback(usa); };
}
function confermaTiroFuoriArea(usa) { if (window._tiroFuoriCallback) window._tiroFuoriCallback(usa); }

function animaPallaVersoPorta(squadra, cb) {
  zoomState.seguiIstantaneo = true;
  var palla = document.getElementById('palla-volante'); var scena = document.getElementById('scena');
  if (!palla || !scena) { zoomState.seguiIstantaneo = false; if (cb) cb(); return; }
  var idGiocatore = stato.giocatorePalla;
  var wrapperGiocatore = idGiocatore ? document.querySelector('[data-giocatore-id="' + idGiocatore + '"]') : null;
  var avversario = squadra === 'tu' ? 'cpu' : 'tu';
  var portiere = null;
  for (var i = 0; i < stato.giocatori[avversario].length; i++) if (stato.giocatori[avversario][i].portiere && !stato.giocatori[avversario][i].espulso) { portiere = stato.giocatori[avversario][i]; break; }
  var wrapperPortiere = portiere ? document.querySelector('[data-giocatore-id="' + portiere.id + '"]') : null;
  if (!wrapperGiocatore || !wrapperPortiere) { zoomState.seguiIstantaneo = false; if (cb) cb(); return; }
  var pedG = wrapperGiocatore.querySelector('.pedina') || wrapperGiocatore;
  var pedP = wrapperPortiere.querySelector('.pedina') || wrapperPortiere;
  var box = scena.getBoundingClientRect();
  var rG = pedG.getBoundingClientRect(); var rP = pedP.getBoundingClientRect();
  var startX = (rG.left + rG.width / 2 - box.left) / scalaCorrente;
  var startY = (rG.bottom - box.top) / scalaCorrente;
  var targetX = (rP.left + rP.width / 2 - box.left) / scalaCorrente;
  var targetY = (rP.bottom - box.top) / scalaCorrente;
  var v = document.querySelectorAll('.palla-centro'); for (var k = 0; k < v.length; k++) v[k].remove();
  if (palla.parentNode !== scena) scena.appendChild(palla);
  palla.classList.add('attiva');
  palla.innerHTML = '<div class="palla-inner">' + creaPalloneSVG() + '</div>';
  var pi = palla.querySelector('.palla-inner');
  palla.style.transition = 'none'; palla.style.left = startX + 'px'; palla.style.top = startY + 'px';
  palla.style.transform = 'translate(-50%, -50%) scale(1)'; void palla.offsetWidth;
  var startTime = performance.now(); var durata = 900;
  var dx = targetX - startX; var dy = targetY - startY;
  function anima(now) {
    var t = Math.min((now - startTime) / durata, 1);
    var ease = t * t * (3 - 2 * t);
    var arcoY = -Math.sin(Math.PI * t) * Math.min(140, Math.sqrt(dx*dx+dy*dy) * 0.35);
    palla.style.left = (startX + dx * ease) + 'px'; palla.style.top = (startY + dy * ease + arcoY) + 'px';
    var sc = 1 - 0.15 * ease;
    palla.style.transform = 'translate(-50%, -50%) scale(' + sc + ')';
    if (t < 1) requestAnimationFrame(anima);
    else { setTimeout(function() { palla.classList.remove('attiva'); palla.style.transform = 'translate(-50%, -50%) scale(1)'; stato.pallaInAnimazione = false; zoomState.seguiIstantaneo = false; renderCampo(); if (cb) cb(); }, 200); }
  }
  requestAnimationFrame(anima);
}

function animaTackle(gVincitore, gPerdente) {
  var wrapperV = document.querySelector('[data-giocatore-id="' + gVincitore.id + '"]'); if (!wrapperV) return;
  var pedinaV = wrapperV.querySelector('.pedina'); if (!pedinaV) return;
  var versoDestra = true;
  if (gPerdente) { var wrapperP = document.querySelector('[data-giocatore-id="' + gPerdente.id + '"]'); if (wrapperP) { var rV = wrapperV.getBoundingClientRect(); var rP = wrapperP.getBoundingClientRect(); versoDestra = ((rP.left + rP.width / 2) >= (rV.left + rV.width / 2)); } }
  pedinaV.classList.remove('pg-in-tackle-dx', 'pg-in-tackle-sx'); void pedinaV.offsetWidth;
  pedinaV.classList.add(versoDestra ? 'pg-in-tackle-dx' : 'pg-in-tackle-sx');
  setTimeout(function() { pedinaV.classList.remove('pg-in-tackle-dx', 'pg-in-tackle-sx'); }, DURATA_SCIVOLATA + 80);
}

/* TIRO */
function posizionaPortiereSu(cx, cy, istantaneo) {
  var pt = document.getElementById('tiro-portiere'); if (!pt) return;
  var wPerc = PORTA_W / 3; var hPerc = PORTA_H * 2 / 3; var offsetY = hPerc * 0.46;
  if (istantaneo) pt.style.transition = 'none';
  pt.style.left = (cx - wPerc / 2) + '%'; pt.style.top = (cy - offsetY) + '%';
  if (istantaneo) { void pt.offsetWidth; pt.style.transition = ''; }
}
function casellaToPos(numero) { var col = (numero - 1) % 3; var row = Math.floor((numero - 1) / 3); return { cx: PORTA_LEFT + (col + 0.5) * PORTA_W / 3, cy: PORTA_TOP + (row + 0.5) * PORTA_H / 3 }; }
function resetPortiere() {
  var pt = document.getElementById('tiro-portiere'); if (!pt) return;
  pt.classList.remove('pg-braccia-alte', 'pg-tuffo-sx', 'pg-tuffo-dx', 'pg-tuffo-centro');
  var pos8 = casellaToPos(8); posizionaPortiereSu(pos8.cx, pos8.cy, true);
  var t = pt.querySelector('.pg-testa'); if (t) t.style.transform = 'rotate(0deg) translateY(0)';
}
function orientaPortiereVerso(c) {
  var pt = document.getElementById('tiro-portiere'); if (!pt) return;
  var t = pt.querySelector('.pg-testa'); if (!t) return;
  var x = CASELLE_PERC[c].x, y = CASELLE_PERC[c].y;
  var dx = 0; if (x < 40) dx = -12; else if (x > 60) dx = 12;
  var dy = 0; if (y < 40) dy = -2; else if (y > 60) dy = 2;
  t.style.transform = 'rotate(' + dx + 'deg) translateY(' + dy + 'px)';
}
function mostraSettoriPortiere(dadoPortiere) {
  var ov = document.getElementById('tiro-settori-overlay'); if (!ov) return;
  ov.innerHTML = ''; ov.classList.add('attivo');
  var mappaSettori = { 1: { col: '1 / 3', row: '1 / 3' }, 2: { col: '2 / 4', row: '1 / 3' }, 3: { col: '1 / 3', row: '2 / 4' }, 4: { col: '2 / 4', row: '2 / 4' } };
  for (var i = 1; i <= 4; i++) {
    var s = document.createElement('div'); s.className = 'tiro-settore'; s.textContent = i;
    s.style.gridColumn = mappaSettori[i].col; s.style.gridRow = mappaSettori[i].row;
    if (i === dadoPortiere) s.classList.add('evidenziato'); else s.classList.add('scartato');
    ov.appendChild(s);
  }
}
function nascondiSettori() { var ov = document.getElementById('tiro-settori-overlay'); if (ov) ov.classList.remove('attivo'); }

function eseguiTuffoPortiere(casellaTiro, parata) {
  var pt = document.getElementById('tiro-portiere'); if (!pt) return;
  pt.classList.remove('pg-braccia-alte', 'pg-tuffo-sx', 'pg-tuffo-dx', 'pg-tuffo-centro');
  var pos8 = casellaToPos(8); posizionaPortiereSu(pos8.cx, pos8.cy, true); void pt.offsetWidth;
  pt.classList.add('pg-braccia-alte');
  var target = parata ? casellaToPos(casellaTiro) : casellaToPos(5);
  setTimeout(function() {
    posizionaPortiereSu(target.cx, target.cy, false);
    var deltaX = target.cx - pos8.cx;
    if (deltaX < -5) pt.classList.add('pg-tuffo-sx');
    else if (deltaX > 5) pt.classList.add('pg-tuffo-dx');
    else pt.classList.add('pg-tuffo-centro');
  }, 100);
}

var tiroInAttesa = null;

function apriSchermataTiro(att, isRigore) {
  var dif = att === 'tu' ? 'cpu' : 'tu';
  stato.statistiche[att].tiri++;

  var por = null;
  for (var i = 0; i < stato.giocatori[dif].length; i++) {
    if (stato.giocatori[dif][i].portiere && !stato.giocatori[dif][i].espulso) { por = stato.giocatori[dif][i]; break; }
  }
  if (por) {
    por.stamina = Math.max(0, por.stamina - 1);
    log('🧤 ' + por.nome + ' si prepara al tiro (stamina ' + por.stamina + '/' + por.staminaMax + ')', '');
  }

  var nomeTir = (trovaGiocatorePerId(att, stato.giocatorePalla)||{}).nome || 'Attaccante';
  log('🎙️ ' + nomeTir + ' va al tiro' + (isRigore?' SU RIGORE':'') + '!', 'highlight');

  apriOverlayTiro(att, dif, !!isRigore);
}

function apriOverlayTiro(att, dif, isRigore) {
  nascondiEntrambiBanner(); stato.bonusUsatoQuestoTiro = { tu:null, cpu:null };
  var ov = document.createElement('div'); ov.className = 'tiro-overlay'; ov.id = 'tiro-overlay';
  var tit = document.createElement('div'); tit.className = 'tiro-titolo';
  tit.textContent = isRigore ? (att === 'tu' ? '🎯 IL TUO RIGORE' : '🎯 RIGORE DELLA CPU') : (att === 'tu' ? '🥅 IL TUO TIRO' : '🥅 TIRO DELLA CPU');
  ov.appendChild(tit);
  var layout = document.createElement('div'); layout.className = 'tiro-layout';
  var colSx = document.createElement('div'); colSx.className = 'tiro-col-sx';
  var info = document.createElement('div'); info.className = 'tiro-info'; info.id = 'tiro-info'; info.textContent = "FASE 1 — Tiro dell'attaccante";
  colSx.appendChild(info);
  var dadi = document.createElement('div'); dadi.className = 'tiro-dadi-info'; dadi.id = 'tiro-dadi-info'; colSx.appendChild(dadi);
  var bc = document.createElement('div'); bc.className = 'tiro-bonus-container'; bc.id = 'tiro-bonus-container'; colSx.appendChild(bc);
  layout.appendChild(colSx);
  var colDx = document.createElement('div'); colDx.className = 'tiro-col-dx';
  var pw = document.createElement('div'); pw.className = 'tiro-porta-wrapper';
  var sf = document.createElement('div'); sf.className = 'tiro-porta-sfondo'; pw.appendChild(sf);
  var gr = document.createElement('div'); gr.className = 'tiro-griglia';
  for (var i=1;i<=9;i++) { var c = document.createElement('div'); c.className = 'tiro-casella'; c.dataset.numero = i; c.innerHTML = '<span class="numero-casella">' + i + '</span>'; gr.appendChild(c); }
  pw.appendChild(gr);
  var settoriOverlay = document.createElement('div'); settoriOverlay.className = 'tiro-settori-overlay'; settoriOverlay.id = 'tiro-settori-overlay'; pw.appendChild(settoriOverlay);
  var pt = document.createElement('div'); pt.className = 'tiro-portiere'; pt.id = 'tiro-portiere';
  var sqP = dif === 'tu' ? stato.squadraTU : stato.squadraCPU;
  pt.innerHTML = creaGiocatoreSVG(SQUADRE[sqP].portiere, 'fermo', '');
  pw.appendChild(pt);
  var pa = document.createElement('div'); pa.className = 'tiro-palla iniziale' + (isRigore ? ' rigore' : ''); pa.id = 'tiro-palla'; pw.appendChild(pa);
  colDx.appendChild(pw); layout.appendChild(colDx);
  ov.appendChild(layout);
  var esito = document.createElement('div'); esito.className = 'tiro-esito'; esito.id = 'tiro-esito'; ov.appendChild(esito);
  document.body.appendChild(ov);
  setTimeout(function() { ov.classList.add('attiva'); }, 50);
  setTimeout(function() { resetPortiere(); popolaBonusTiro(att, dif, isRigore); }, 500);
}

function popolaBonusTiro(att, dif, isRigore) {
  var bc = document.getElementById('tiro-bonus-container'); if (!bc) return;
  bc.innerHTML = '';
  var tuPuoAttivare = false, tuTipoBonus = null;
  if (att === 'tu' && haBonus('tu', 'gol-super')) { tuPuoAttivare = true; tuTipoBonus = 'gol-super'; }
  if (dif === 'tu' && haBonus('tu', 'parata-super')) { tuPuoAttivare = true; tuTipoBonus = 'parata-super'; }
  var cpuVuole = false, cpuTipoBonus = null;
  if (att === 'cpu' && haBonus('cpu', 'gol-super') && cpuVuoleUsareBonusTiro('gol-super', isRigore)) { cpuVuole = true; cpuTipoBonus = 'gol-super'; }
  if (dif === 'cpu' && haBonus('cpu', 'parata-super') && cpuVuoleUsareBonusTiro('parata-super', isRigore)) { cpuVuole = true; cpuTipoBonus = 'parata-super'; }
  if (tuPuoAttivare) {
    setTimeout(function() {
      mostraBonusChoice(tuTipoBonus, function(usa) {
        if (usa) { consumaBonus('tu', tuTipoBonus); stato.bonusUsatoQuestoTiro.tu = tuTipoBonus; mostraBonusBanner('🏆 TU usi: ' + NOMI_BONUS[tuTipoBonus].icona + ' ' + NOMI_BONUS[tuTipoBonus].nome); bc.innerHTML = '<div style="color:#ffd700;font-weight:bold;text-align:center;padding:14px">✅ ' + NOMI_BONUS[tuTipoBonus].nome + '</div>'; }
        else bc.innerHTML = '<div style="color:#aaa;text-align:center;padding:14px">Nessun bonus</div>';
        if (cpuVuole) setTimeout(function() { consumaBonus('cpu', cpuTipoBonus); stato.bonusUsatoQuestoTiro.cpu = cpuTipoBonus; setTimeout(function() { eseguiTiroConGrafica(att, dif, isRigore); }, 600); }, 400);
        else setTimeout(function() { eseguiTiroConGrafica(att, dif, isRigore); }, 600);
      });
    }, 400); return;
  }
  if (cpuVuole) { bc.innerHTML = '<div style="color:#ffd700;text-align:center;padding:14px">🤖 ' + NOMI_BONUS[cpuTipoBonus].nome + '</div>'; setTimeout(function() { consumaBonus('cpu', cpuTipoBonus); stato.bonusUsatoQuestoTiro.cpu = cpuTipoBonus; setTimeout(function() { eseguiTiroConGrafica(att, dif, isRigore); }, 800); }, 600); }
  else { bc.innerHTML = '<div style="color:#aaa;text-align:center;padding:14px">Nessun bonus</div>'; setTimeout(function() { eseguiTiroConGrafica(att, dif, isRigore); }, 400); }
}
function cpuVuoleUsareBonusTiro(tipo, isRigore) {
  var staPerdendo = stato.punteggio.cpu < stato.punteggio.tu;
  var staVincendo = stato.punteggio.cpu > stato.punteggio.tu;
  var minuto = calcolaMinutoTotale(); var ultimiMin = minuto >= 75;
  if (tipo === 'gol-super') return isRigore || staPerdendo || (ultimiMin && !stato.punteggio.cpu > stato.punteggio.tu);
  if (tipo === 'parata-super') return staVincendo || staPerdendo;
  return false;
}

function mostraDadiTiro(dA, dP) {
  var c = document.getElementById('tiro-dadi-info'); if (!c) return;
  var h = '<div class="tiro-dadi-riga"><span class="tiro-dado-label">🎲 Attaccante:</span><div class="tiro-dado attaccante">' + dA + '</div></div>';
  if (dP !== null && dP !== undefined) h += '<div class="tiro-dadi-riga"><span class="tiro-dado-label">🧤 Portiere:</span><div class="tiro-dado portiere">' + dP + '</div></div>';
  c.innerHTML = h;
}
function evidenziaCaselle(caselle) { var tutti = document.querySelectorAll('.tiro-casella'); for (var i=0;i<tutti.length;i++) tutti[i].classList.remove('colpita'); for (var j=0;j<caselle.length;j++) { var cel = document.querySelector('.tiro-casella[data-numero="' + caselle[j] + '"]'); if (cel) cel.classList.add('colpita'); } }

function animaRollDado(targetVal, maxVal, elementId, tipo) {
  return new Promise(function(resolve) {
    var el = document.getElementById(elementId); if (!el) { resolve(); return; }
    var durata = 800; var start = performance.now();
    function step(now) {
      var t = (now - start) / durata;
      if (t < 1) {
        el.textContent = Math.floor(Math.random() * maxVal) + 1;
        requestAnimationFrame(step);
      } else {
        el.textContent = targetVal;
        suonaDado();
        resolve();
      }
    }
    requestAnimationFrame(step);
  });
}

async function eseguiTiroConGrafica(att, dif, isRigore) {
  if (stato.partitaFinita) return;
  resetPortiere();
  var bonusAtt = stato.bonusUsatoQuestoTiro[att]; var bonusDif = stato.bonusUsatoQuestoTiro[dif];
  var golSuperAtt = (bonusAtt === 'gol-super'); var parataSuperAtt = (bonusDif === 'parata-super');

  var dT = Math.floor(Math.random() * 9) + 1;
  var pos = CASELLE_PERC[dT];
  var pa = document.getElementById('tiro-palla');
  if (pa) { pa.classList.remove('iniziale', 'rigore'); pa.style.left = (PORTA_LEFT + (pos.x / 100) * PORTA_W) + '%'; pa.style.top = (PORTA_TOP + (pos.y / 100) * PORTA_H) + '%'; pa.style.bottom = 'auto'; }
  document.getElementById('tiro-info').textContent = "FASE 1 — Tiro dell'attaccante";
  document.getElementById('tiro-dadi-info').innerHTML = '<div class="tiro-dadi-riga"><span class="tiro-dado-label">🎲 Attaccante:</span><div class="tiro-dado attaccante" id="dado-att">-</div></div>';
  orientaPortiereVerso(dT);

  await animaRollDado(dT, 9, 'dado-att', 'attaccante');

  var nomeTir = (trovaGiocatorePerId(att, stato.giocatorePalla)||{}).nome || 'Attaccante';
  log('🎙️ Tiro di ' + nomeTir + ': dado ' + dT + ' (casella ' + dT + ').', '');

  setTimeout(function() {
    if (stato.partitaFinita) return;
    if (golSuperAtt) {
      var dP11 = Math.floor(Math.random() * 11) + 1;
      var coppia = COPPIE_11[dP11]; var parataGS = coppia.indexOf(dT) > -1;
      document.getElementById('tiro-info').textContent = 'FASE 2 — Portiere (Gol Super) tira 1d11...';
      document.getElementById('tiro-dadi-info').innerHTML = '<div class="tiro-dadi-riga"><span class="tiro-dado-label">🎲 Attaccante:</span><div class="tiro-dado attaccante">' + dT + '</div></div><div class="tiro-dadi-riga"><span class="tiro-dado-label">🧤 Portiere:</span><div class="tiro-dado portiere" id="dado-por">-</div></div>';
      animaRollDado(dP11, 11, 'dado-por').then(function() {
        evidenziaCaselle(coppia);
        eseguiTuffoPortiere(dT, parataGS);
        setTimeout(function() {
          if (parataGS) mostraEsitoTiroConGrafica('parata', dT, att, dif, '🧤 PARATA (Gol Super)!');
          else mostraEsitoTiroConGrafica('goal', dT, att, dif, '⚽ GOAL SUPER!');
        }, 2200);
      }); return;
    }
    if (parataSuperAtt) {
      var dP11b = Math.floor(Math.random() * 11) + 1;
      var coppiaB = COPPIE_11[dP11b]; var parataPS = coppiaB.indexOf(dT) === -1;
      document.getElementById('tiro-info').textContent = 'FASE 2 — Portiere (Parata Super) tira 1d11...';
      document.getElementById('tiro-dadi-info').innerHTML = '<div class="tiro-dadi-riga"><span class="tiro-dado-label">🎲 Attaccante:</span><div class="tiro-dado attaccante">' + dT + '</div></div><div class="tiro-dadi-riga"><span class="tiro-dado-label">🧤 Portiere:</span><div class="tiro-dado portiere" id="dado-por">-</div></div>';
      animaRollDado(dP11b, 11, 'dado-por').then(function() {
        var tutte = [1,2,3,4,5,6,7,8,9]; var coperte = tutte.filter(function(n) { return coppiaB.indexOf(n) === -1; });
        evidenziaCaselle(coperte); eseguiTuffoPortiere(dT, parataPS);
        setTimeout(function() {
          if (parataPS) mostraEsitoTiroConGrafica('parata', dT, att, dif, '🧤 PARATA SUPER!');
          else mostraEsitoTiroConGrafica('goal', dT, att, dif, '⚽ GOAL!');
        }, 2200);
      }); return;
    }
    var dP4 = Math.floor(Math.random() * 4) + 1;
    var zonaPortiere = ZONE_PORTIERE_4[dP4]; var parataNormale = zonaPortiere.indexOf(dT) > -1;
    document.getElementById('tiro-info').textContent = 'FASE 2 — Il portiere tira 1d4...';
    document.getElementById('tiro-dadi-info').innerHTML = '<div class="tiro-dadi-riga"><span class="tiro-dado-label">🎲 Attaccante:</span><div class="tiro-dado attaccante">' + dT + '</div></div><div class="tiro-dadi-riga"><span class="tiro-dado-label">🧤 Portiere:</span><div class="tiro-dado portiere" id="dado-por">-</div></div>';
    animaRollDado(dP4, 4, 'dado-por').then(function() {
      log('🎙️ Portiere tira ' + dP4 + ' → settori ' + ZONE_PORTIERE_4[dP4].join(',') + '.', '');
      mostraSettoriPortiere(dP4);
      setTimeout(function() {
        if (stato.partitaFinita) return;
        document.getElementById('tiro-info').textContent = parataNormale ? 'FASE 3 — Il portiere si tuffa verso la palla!' : 'FASE 3 — Il portiere si tuffa al centro!';
        eseguiTuffoPortiere(dT, parataNormale);
        setTimeout(function() {
          nascondiSettori();
          if (parataNormale) { mostraEsitoTiroConGrafica('parata', dT, att, dif, '🧤 PARATA!'); }
          else {
            if (isRigore) fase3RigoreConGrafica(dT, att, dif); else fase3TiroConGrafica(dT, att, dif);
          }
        }, 1200);
      }, 1500);
    });
  }, 500);
}

function fase3TiroConGrafica(dT, att, dif) {
  var cs = mescola([1,2,3,4,5,6,7,8,9]); var cP = cs[0], cA = cs[1], cF = cs[2];
  document.getElementById('tiro-info').textContent = 'FASE 3 — Esito del tiro...';
  document.getElementById('tiro-dadi-info').innerHTML = '<div class="tiro-dadi-riga"><span class="tiro-dado-label">🎲 Esito:</span><div class="tiro-dado" id="dado-esito">-</div></div>';
  var dE = Math.floor(Math.random()*9) + 1;
  animaRollDado(dE, 9, 'dado-esito').then(function() {
    setTimeout(function() {
      if (stato.partitaFinita) return;
      var esito, motivo;
      if (dE === cP) { esito = 'palo'; motivo = '🥅 PALO!'; suonaPalo(); }
      else if (dE === cA) { esito = 'angolo'; motivo = '🚩 ANGOLO!'; }
      else if (dE === cF) { esito = 'fuori'; motivo = '❌ FUORI!'; suonaFuori(); }
      else { esito = 'goal'; motivo = '⚽ GOAL!'; }
      mostraEsitoTiroConGrafica(esito, dT, att, dif, motivo);
    }, 800);
  });
}
function fase3RigoreConGrafica(dT, att, dif) {
  var cs = mescola([1,2,3,4,5,6,7,8,9]); var cP = cs[0], cA = cs[1], cF = cs[2];
  document.getElementById('tiro-info').textContent = 'FASE 3 — Esito del rigore...';
  document.getElementById('tiro-dadi-info').innerHTML = '<div class="tiro-dadi-riga"><span class="tiro-dado-label">🎲 Esito:</span><div class="tiro-dado" id="dado-esito">-</div></div>';
  var dE = Math.floor(Math.random()*9) + 1;
  animaRollDado(dE, 9, 'dado-esito').then(function() {
    setTimeout(function() {
      if (stato.partitaFinita) return;
      var esito, motivo;
      if (dE === cP) { esito = 'palo'; motivo = '🥅 PALO!'; suonaPalo(); }
      else if (dE === cA) { esito = 'angolo'; motivo = '🚩 ANGOLO!'; }
      else if (dE === cF) { esito = 'fuori'; motivo = '❌ FUORI!'; suonaFuori(); }
      else { esito = 'goal'; motivo = '⚽ GOAL!'; }
      mostraEsitoTiroConGrafica(esito, dT, att, dif, motivo);
    }, 800);
  });
}

function mostraEsitoTiroConGrafica(esito, dT, att, dif, motivo) {
  var e = document.getElementById('tiro-esito'); e.textContent = motivo; e.classList.add(esito);
  var i = document.getElementById('tiro-info'); if (i) i.textContent = 'ESITO: ' + motivo;

  var nomeTir = (trovaGiocatorePerId(att, stato.giocatorePalla)||{}).nome || 'Attaccante';
  if (esito === 'goal') log('⚽ GOOOAL! ' + nomeTir + ' batte il portiere!', 'goal');
  else if (esito === 'parata') log('🧤 PARATA! Il portiere ferma ' + nomeTir + '.', 'parata');
  else if (esito === 'palo') log('🥅 PALO! Che sfortuna per ' + nomeTir + '.', 'highlight');
  else if (esito === 'angolo') log('🚩 ANGOLO per ' + (att==='tu'?'TU':'CPU') + '.', '');
  else if (esito === 'fuori') log('❌ FUORI! ' + nomeTir + ' calcia a lato.', '');

  if (esito === 'parata') {
    var pa = document.getElementById('tiro-palla'); var pt = document.getElementById('tiro-portiere');
    if (pa && pt) {
      var wrapperPorta = document.querySelector('.tiro-porta-wrapper');
      if (wrapperPorta) {
        var ptRect = pt.getBoundingClientRect(); var wrapRect = wrapperPorta.getBoundingClientRect();
        var ptCx = ((ptRect.left + ptRect.width / 2 - wrapRect.left) / wrapRect.width) * 100;
        var ptCy = ((ptRect.top + ptRect.height / 2 - wrapRect.top) / wrapRect.height) * 100;
        pa.style.transition = 'left 0.5s ease-out, top 0.5s ease-out';
        pa.style.left = ptCx + '%'; pa.style.top = (ptCy - 2) + '%';
      }
    }
  }
  setTimeout(function() {
    var ov = document.getElementById('tiro-overlay');
    if (ov) { ov.classList.remove('attiva'); setTimeout(function() { ov.remove(); }, 400); }
    tiroInAttesa = null;
    if (stato.partitaFinita) return;
    salvaPartita();
    if (esito === 'goal') gestisciGoal(att, motivo);
    else if (esito === 'parata') { stato.statistiche[dif].parate++; gestisciParata(att, dif); }
    else if (esito === 'palo') { stato.statistiche[att].pali++; gestisciPalo(att, dif); }
    else if (esito === 'angolo') { stato.statistiche[att].angoli++; gestisciAngolo(att, dif); }
    else if (esito === 'fuori') gestisciFuori(att, dif);
  }, 2500);
}

function mostraGoalBanner(v) { var b = document.getElementById('goal-banner'); b.classList.remove('tu', 'cpu', 'attivo'); void b.offsetWidth; b.classList.add(v, 'attivo'); setTimeout(function() { b.classList.remove('attivo'); }, 3200); }
function gestisciGoal(att) {
  if (stato.partitaFinita) return;
  stato.punteggio[att]++; stato.statistiche[att].gol++;
  var minuto = calcolaMinutoTotale();
  var marcatore = stato.giocatorePalla || 'Sconosciuto';
  var gMarc = trovaGiocatorePerId(att, marcatore);
  var nomeMarc = gMarc ? gMarc.nome : 'Sconosciuto';
  stato.statistiche[att].marcatori.push({ nome: nomeMarc, minuto: minuto });
  salvaPartita(); log('⚽ GOAL di ' + nomeMarc + ' al ' + minuto + '\'!', 'goal');
  log('🎙️ ' + nomeMarc + ' esulta! ' + (att==='tu'?'TU':'CPU') + ' ' + stato.punteggio[att] + '-' + stato.punteggio[att==='tu'?'cpu':'tu'] + ' ' + (att==='tu'?'CPU':'TU') + '.', 'goal');
  mostraGoalBanner(att); suonaEsultanza();
  setTimeout(function() { if (stato.partitaFinita) return; var sub = att === 'tu' ? 'cpu' : 'tu'; eseguiCalcioIniziale(sub); }, 3200);
}
function gestisciParata(att, dif) {
  if (stato.partitaFinita) return;
  var por = null;
  for (var i=0;i<stato.giocatori[dif].length;i++) if (stato.giocatori[dif][i].portiere) { por = stato.giocatori[dif][i]; break; }
  var compZ3 = giocatoriInZona(dif, 3, false).filter(function(g){ return !g.portiere && !g.espulso; });
  if (compZ3.length === 0) { setTimeout(function() { if (stato.partitaFinita) return; stato.zonaPalla = 3; stato.metaContesa = 'inf'; stato.possessore = dif; stato.giocatorePalla = null; renderCampo(); renderHeader(); salvaPartita(); setTimeout(function() { mostraEntrambiBanner(); setTimeout(avviaContrasto, 300); }, PAUSA_PRE_AZIONE); }, 600); return; }
  var sc = compZ3[Math.floor(Math.random()*compZ3.length)];
  var idx = compZ3.indexOf(sc); var nMeta = idx === 0 ? 'sup' : 'inf';
  stato.zonaPalla = 3; stato.metaContesa = nMeta; stato.possessore = dif; stato.giocatorePalla = sc.id; stato.pallaInAnimazione = true;
  renderCampo(); renderHeader(); aggiornaSottofondoPerZona(3);
  setTimeout(function() {
    if (stato.partitaFinita) return;
    if (por && sc) { animaPallaInZona(por, sc, function() { if (stato.partitaFinita) return; stato.possessore = dif; stato.giocatorePalla = sc.id; stato.pallaInAnimazione = false; renderCampo(); renderHeader(); salvaPartita(); setTimeout(function() { mostraEntrambiBanner(); setTimeout(avviaContrasto, 300); }, PAUSA_POST_AZIONE); }); }
    else { stato.pallaInAnimazione = false; renderCampo(); renderHeader(); salvaPartita(); setTimeout(function() { mostraEntrambiBanner(); setTimeout(avviaContrasto, 300); }, PAUSA_POST_AZIONE); }
  }, 400);
}
function gestisciPalo(att, dif) {
  if (stato.partitaFinita) return;
  var az = stato.azioneTiroDaPalo;
  if (!az) { setTimeout(function() { if (stato.partitaFinita) return; stato.zonaPalla = 3; stato.possessore = att; stato.metaContesa = 'inf'; renderCampo(); renderHeader(); salvaPartita(); setTimeout(function() { mostraEntrambiBanner(); setTimeout(avviaContrasto, 300); }, PAUSA_PRE_AZIONE); }, 800); return; }
  setTimeout(function() {
    if (stato.partitaFinita) return;
    stato.zonaPalla = az.zona; stato.possessore = az.possessore; stato.metaContesa = az.meta;
    stato.giocatorePalla = az.possessore === az.attaccante ? az.giocatoreAtt : az.giocatoreDif;
    renderCampo(); renderHeader(); aggiornaSottofondoPerZona(az.zona);
    setTimeout(function() { if (stato.partitaFinita) return; salvaPartita(); setTimeout(function() { mostraEntrambiBanner(); setTimeout(avviaContrasto, 300); }, PAUSA_PRE_AZIONE); }, 300);
  }, 800);
}
function gestisciAngolo(att, dif) {
  if (stato.partitaFinita) return;
  setTimeout(function() {
    if (stato.partitaFinita) return;
    var zA = direzionePerSquadra(att) > 0 ? 5 : 1;
    stato.zonaPalla = zA; stato.metaContesa = Math.random() < 0.5 ? 'sup' : 'inf'; stato.possessore = att;
    var c = giocatoriInZona(att, zA, false).filter(function(g){ return !g.portiere && !g.espulso; });
    if (c.length > 0) { var s = c[Math.floor(Math.random()*c.length)]; stato.giocatorePalla = s.id; var idx = c.indexOf(s); stato.metaContesa = idx === 0 ? 'sup' : 'inf'; }
    renderCampo(); renderHeader(); aggiornaSottofondoPerZona(zA); salvaPartita();
    setTimeout(function() { mostraEntrambiBanner(); setTimeout(avviaContrasto, 300); }, PAUSA_PRE_AZIONE);
  }, 800);
}
function gestisciFuori(att, dif) { gestisciParata(att, dif); }
function flashVincitore(sq) { var f = document.getElementById('flash'); f.classList.remove('tu','cpu','attivo'); void f.offsetWidth; f.classList.add(sq, 'attivo'); setTimeout(function() { f.classList.remove('attivo'); }, 600); }

/* FINE TEMPO / PARTITA */
function fineTempoOPartita() {
  if (stato.partitaFinita) return;
  if (stato.tempo === 1) {
    suonaFischietto('fine-tempo');
    stato.tempo = 2; stato.mano = 1;
    stato.invertiCoppie = !stato.invertiCoppie;
    stato.direzioneAttaccoTU = -stato.direzioneAttaccoTU;
    log('⏸️ FINE PRIMO TEMPO. Risultato: ' + stato.punteggio.tu + '-' + stato.punteggio.cpu, 'goal');
    // Intervallo: +3 stamina a tutti, ma falli, falliArea, ammonizioni ed espulsioni RESTANO
    ['tu','cpu'].forEach(function(sq) {
      for (var i = 0; i < stato.giocatori[sq].length; i++) {
        var g = stato.giocatori[sq][i];
        g.stamina = Math.min(g.staminaMax, g.stamina + 3);
        // NON azzerare: g.falli, g.falliArea, g.ammonito, g.espulso
      }
    });
    riempiMano('tu'); riempiMano('cpu'); renderHeader(); salvaPartita();
    mostraFinestraFineTempo(function() { if (stato.partitaFinita) return; var chiBatte = stato.monetaVinta === 'tu' ? 'cpu' : 'tu'; eseguiCalcioIniziale(chiBatte); });
  } else finePartita();
}
function mostraFinestraFineTempo(cb) {
  document.getElementById('modale-box').innerHTML = '<div style="text-align:center;padding:20px"><h2 style="color:#ffd700;margin-bottom:24px;font-size:52px">⏸️ FINE PRIMO TEMPO</h2><p style="font-size:72px;font-weight:bold;margin:24px 0"><span style="color:#4dabf7">' + stato.punteggio.tu + '</span> - <span style="color:#ff6b6b">' + stato.punteggio.cpu + '</span></p><p style="font-size:28px;color:#ffd700;margin:16px 0">🔄 Cambio campo!</p><p style="font-size:22px;color:#aaa">Ripresa tra 3 secondi...</p></div>';
  document.getElementById('modale').classList.remove('nascosto');
  setTimeout(function() { document.getElementById('modale').classList.add('nascosto'); if (cb) cb(); }, 3000);
}
function finePartita() {
  stato.partitaFinita = true; eliminaSalvataggio();
  suonaFischietto('fine-partita'); fermaSottofondo(); salvaAmmonizioniInLocalStorage();
  nascondiEntrambiBanner(); chiudiBonusChoice();
  if (timerPartita) { clearInterval(timerPartita); timerPartita = null; }

  if (TORNEO_MODE === 'seriea') {
    salvaRisultatoTorneo();
    return;
  }

  var msg = stato.punteggio.tu > stato.punteggio.cpu ? '🏆 HAI VINTO!' : stato.punteggio.cpu > stato.punteggio.tu ? '😢 CPU vince' : '🤝 Pareggio';
  var marcatoriTU = stato.statistiche.tu.marcatori.map(function(m){ return m.nome + ' (' + m.minuto + '\')'; }).join(', ') || 'Nessuno';
  var marcatoriCPU = stato.statistiche.cpu.marcatori.map(function(m){ return m.nome + ' (' + m.minuto + '\')'; }).join(', ') || 'Nessuno';

  var html = '<h2>FINE PARTITA</h2><p style="font-size:72px;font-weight:bold;margin:20px 0"><span style="color:#4dabf7">' + stato.punteggio.tu + '</span> - <span style="color:#ff6b6b">' + stato.punteggio.cpu + '</span></p><p style="font-size:32px;color:#ffd700;margin:24px 0">' + msg + '</p>' +
    '<div style="background:rgba(0,0,0,0.4);border-radius:12px;padding:20px;margin:24px 0;text-align:left;font-size:16px"><h3 style="color:#ffd700;margin-bottom:14px;text-align:center">📊 Statistiche</h3><table style="width:100%;border-collapse:collapse;color:#eee"><tr style="border-bottom:1px solid #444"><th style="text-align:left;padding:6px">Stat</th><th style="text-align:center;padding:6px;color:#4dabf7">TU</th><th style="text-align:center;padding:6px;color:#ff6b6b">CPU</th></tr>' +
    '<tr><td style="padding:6px">Gol</td><td style="text-align:center">' + stato.statistiche.tu.gol + '</td><td style="text-align:center">' + stato.statistiche.cpu.gol + '</td></tr>' +
    '<tr><td style="padding:6px">Tiri in porta</td><td style="text-align:center">' + stato.statistiche.tu.tiri + '</td><td style="text-align:center">' + stato.statistiche.cpu.tiri + '</td></tr>' +
    '<tr><td style="padding:6px">Parate</td><td style="text-align:center">' + stato.statistiche.tu.parate + '</td><td style="text-align:center">' + stato.statistiche.cpu.parate + '</td></tr>' +
    '<tr><td style="padding:6px">Calcio d\'angolo</td><td style="text-align:center">' + stato.statistiche.tu.angoli + '</td><td style="text-align:center">' + stato.statistiche.cpu.angoli + '</td></tr>' +
    '<tr><td style="padding:6px">Palo/Traversa</td><td style="text-align:center">' + stato.statistiche.tu.pali + '</td><td style="text-align:center">' + stato.statistiche.cpu.pali + '</td></tr>' +
    '<tr><td style="padding:6px">Falli</td><td style="text-align:center">' + stato.statistiche.tu.falli + '</td><td style="text-align:center">' + stato.statistiche.cpu.falli + '</td></tr>' +
    '<tr><td style="padding:6px">Cartellini</td><td style="text-align:center">' + stato.statistiche.tu.ammonizioni + ' 🟨 / ' + stato.statistiche.tu.espulsioni + ' 🟥</td><td style="text-align:center">' + stato.statistiche.cpu.ammonizioni + ' 🟨 / ' + stato.statistiche.cpu.espulsioni + ' 🟥</td></tr>' +
    '<tr><td style="padding:6px">Contrasti Vinti</td><td style="text-align:center">' + stato.statistiche.tu.vinte + '</td><td style="text-align:center">' + stato.statistiche.cpu.vinte + '</td></tr>' +
    '<tr><td style="padding:6px">Carte Speciali</td><td style="text-align:center">' + stato.statistiche.tu.bonusGuadagnati + '</td><td style="text-align:center">' + stato.statistiche.cpu.bonusGuadagnati + '</td></tr>' +
    '<tr><td style="padding:6px">Sostituzioni</td><td style="text-align:center">' + stato.statistiche.tu.sostituzioni + '</td><td style="text-align:center">' + stato.statistiche.cpu.sostituzioni + '</td></tr>' +
    '</table><div style="margin-top:16px"><strong style="color:#4dabf7">Marcatori TU:</strong> ' + marcatoriTU + '<br><strong style="color:#ff6b6b">Marcatori CPU:</strong> ' + marcatoriCPU + '</div></div>' +
    '<button class="primario" onclick="location.reload()" style="font-size:24px;padding:20px 40px">NUOVA PARTITA</button><button onclick="mostraMenuPrincipale()" style="font-size:24px;padding:20px 40px">MENU</button>';
  document.getElementById('modale-box').innerHTML = html;
  document.getElementById('modale').classList.remove('nascosto');
}
function salvaRisultatoTorneo() {
  var casaOrig = URL_CASA || stato.squadraTU;
  var trasfOrig = URL_TRASFERTA || stato.squadraCPU;
  var r = {
    golTU: stato.punteggio.tu,
    golCPU: stato.punteggio.cpu,
    sqTU: stato.squadraTU,
    sqCPU: stato.squadraCPU,
    casaOriginale: casaOrig,
    trasfertaOriginale: trasfOrig,
    statistiche: JSON.parse(JSON.stringify(stato.statistiche))
  };
  localStorage.setItem('campionato_partita_' + PARTITA_TORNEO, JSON.stringify(r));
  setTimeout(function() { location.href = 'seriea2027.html?risultato=' + encodeURIComponent(PARTITA_TORNEO); }, 1500);
}

/* SOSTITUZIONI */
function apriSostituzioni() { if (stato.sostBloccate) { alert('Bloccate durante il contrasto.'); return; } if (stato.partitaFinita) return; selezioneSost = { campo:null, panchina:null }; renderModaleSostituzioni(); document.getElementById('modale').classList.remove('nascosto'); }
function renderModaleSostituzioni() {
  var sq = 'tu'; var h = '<h2>🔄 Sostituzioni</h2>';
  h += '<div style="background:rgba(0,0,0,0.3);border-radius:12px;padding:16px;margin:20px 0"><h3 style="color:#ffd700">In campo</h3><div style="display:flex;flex-wrap:wrap;gap:10px;justify-content:center">';
  var gs = stato.giocatori[sq].filter(function(g){ return !g.espulso; });
  for (var i=0;i<gs.length;i++) { var g = gs[i]; var sel = selezioneSost.campo === g.id ? 'background:#ffd700;color:#16213e;' : 'background:#0f3460;color:#fff;'; h += '<div style="' + sel + 'border:2px solid #4dabf7;border-radius:8px;padding:10px 16px;cursor:pointer" onclick="selezionaSostCampo(\'' + g.id + '\')"><div>' + g.nome + '</div><div>⚡' + g.stamina + '/10</div></div>'; }
  h += '</div></div><div style="background:rgba(0,0,0,0.3);border-radius:12px;padding:16px;margin:20px 0"><h3 style="color:#ffd700">Panchina</h3><div style="display:flex;flex-wrap:wrap;gap:10px;justify-content:center">';
  for (var k=0;k<stato.panchina[sq].length;k++) { var p = stato.panchina[sq][k]; var sel2 = selezioneSost.panchina === p.id ? 'background:#ffd700;color:#16213e;' : 'background:#0f3460;color:#fff;'; var dis = p.entrato ? 'opacity:0.35;cursor:not-allowed;' : 'cursor:pointer;'; h += '<div style="' + sel2 + dis + 'border:2px solid #4dabf7;border-radius:8px;padding:10px 16px" onclick="selezionaSostPanchina(\'' + p.id + '\')"><div>' + p.nome + ' (' + p.ruolo + ')</div><div>⚡' + p.stamina + '/10</div></div>'; }
  h += '</div></div><div style="margin-top:20px">';
  if (selezioneSost.campo && selezioneSost.panchina) h += '<button class="primario" onclick="confermaSostituzione()">CONFERMA</button>';
  h += '<button onclick="chiudiModale()">CHIUDI</button></div>';
  document.getElementById('modale-box').innerHTML = h;
}
function selezionaSostCampo(id) { selezioneSost.campo = id; renderModaleSostituzioni(); }
function selezionaSostPanchina(id) { var p = null; for (var i=0;i<stato.panchina.tu.length;i++) if (stato.panchina.tu[i].id === id) { p = stato.panchina.tu[i]; break; } if (p && p.entrato) return; selezioneSost.panchina = id; renderModaleSostituzioni(); }
function confermaSostituzione() {
  var sq = 'tu'; var campo = null, pan = null;
  for (var i=0;i<stato.giocatori[sq].length;i++) if (stato.giocatori[sq][i].id === selezioneSost.campo) { campo = stato.giocatori[sq][i]; break; }
  for (var j=0;j<stato.panchina[sq].length;j++) if (stato.panchina[sq][j].id === selezioneSost.panchina) { pan = stato.panchina[sq][j]; break; }
  if (!campo || !pan || pan.entrato) return;
  var n = { id:pan.id+'_sost', squadra:sq, zona:campo.zona, ruolo:pan.ruolo, portiere:pan.portiere, stamina:STAMINA_MAX, staminaMax:STAMINA_MAX, falli:0, falliArea:0, ammonito:false, espulso:false, nome:pan.nome };
  var idx = stato.giocatori[sq].indexOf(campo); stato.giocatori[sq][idx] = n;
  pan.entrato = true; stato.statistiche[sq].sostituzioni++;
  selezioneSost = { campo:null, panchina:null };
  renderCampo(); renderModaleSostituzioni(); salvaPartita();
}

/* RIAVVIO RAPIDO */
function mostraBannerRiavvio() { var b = document.getElementById('banner-riavvio'); if (b) b.classList.add('attivo'); }
function annullaRiavvio() { var b = document.getElementById('banner-riavvio'); if (b) b.classList.remove('attivo'); }
function eseguiRiavvio() { localStorage.removeItem(CHIAVE_SALVATAGGIO); location.reload(); }

window.addEventListener('keydown', function(e) {
  if (e.key === 'PrintScreen' || e.key === 'F9') {
    e.preventDefault();
    mostraBannerRiavvio();
  }
});

window.addEventListener('beforeunload', function(e) {
  if (!stato.partitaFinita && stato.giocatori && stato.giocatori.tu && stato.giocatori.tu.length > 0) { salvaPartita(); e.preventDefault(); e.returnValue = ''; return ''; }
});

/* AVVIO */
try {
  inizializzaAmmonizioni(); ghCaricaConfig();
  adattaScena(); setTimeout(adattaScena, 100); setTimeout(adattaScena, 400);
  avviaLoopZoom(); aggiornaIconaFullscreen();
  var salvata = caricaPartitaSalvata();
  if (salvata) mostraSchermataRipristino(salvata);
  else if (TORNEO_MODE === 'seriea' && PARTITA_TORNEO && URL_SQ_TU && URL_SQ_CPU) {
    if (SQUADRE[URL_SQ_TU] && SQUADRE[URL_SQ_CPU]) avviaPartita(URL_SQ_TU, URL_SQ_CPU, '1P', URL_CASA);
    else mostraMenuPrincipale();
  } else mostraMenuPrincipale();
} catch(err) {
  console.error('Errore avvio:', err);
  document.body.innerHTML = '<div style="background:#8B2020;color:#fff;padding:30px;font-family:monospace"><h2>ERRORE</h2><p>' + err.message + '</p><pre>' + (err.stack||'') + '</pre></div>';
}