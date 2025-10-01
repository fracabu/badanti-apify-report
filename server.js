const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const db = require('./database');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));

// ========== API ENDPOINTS ==========

// === BADANTI ===
app.get('/api/badanti', (req, res) => {
  const { zona, priorita, stato, search } = req.query;

  let query = 'SELECT * FROM badanti WHERE 1=1';
  const params = [];

  if (zona) {
    query += ' AND zona LIKE ?';
    params.push(`%${zona}%`);
  }
  if (priorita) {
    query += ' AND priorita = ?';
    params.push(priorita);
  }
  if (stato) {
    query += ' AND stato_contatto = ?';
    params.push(stato);
  }
  if (search) {
    query += ' AND (nome LIKE ? OR telefono LIKE ? OR zona LIKE ?)';
    params.push(`%${search}%`, `%${search}%`, `%${search}%`);
  }

  query += ' ORDER BY rating DESC, esperienza_anni DESC';

  const badanti = db.prepare(query).all(...params);
  res.json(badanti);
});

app.get('/api/badanti/:id', (req, res) => {
  const badante = db.prepare('SELECT * FROM badanti WHERE id = ?').get(req.params.id);
  if (!badante) return res.status(404).json({ error: 'Badante non trovata' });

  // Prendi anche i contatti
  const contatti = db.prepare('SELECT * FROM contatti WHERE riferimento_id = ? AND riferimento_tipo = ? ORDER BY data_ora DESC')
    .all(req.params.id, 'badante');

  res.json({ ...badante, contatti });
});

app.put('/api/badanti/:id', (req, res) => {
  const { stato_contatto, note, data_ultimo_contatto } = req.body;

  db.prepare(`
    UPDATE badanti
    SET stato_contatto = ?, note = ?, data_ultimo_contatto = ?
    WHERE id = ?
  `).run(stato_contatto, note, data_ultimo_contatto, req.params.id);

  res.json({ success: true });
});

// === OFFERTE ===
app.get('/api/offerte', (req, res) => {
  const { zona, stato } = req.query;

  let query = 'SELECT * FROM offerte WHERE 1=1';
  const params = [];

  if (zona) {
    query += ' AND zona LIKE ?';
    params.push(`%${zona}%`);
  }
  if (stato) {
    query += ' AND stato = ?';
    params.push(stato);
  }

  query += ' ORDER BY urgenza DESC, creato_il DESC';

  const offerte = db.prepare(query).all(...params);
  res.json(offerte);
});

app.get('/api/offerte/:id', (req, res) => {
  const offerta = db.prepare('SELECT * FROM offerte WHERE id = ?').get(req.params.id);
  if (!offerta) return res.status(404).json({ error: 'Offerta non trovata' });
  res.json(offerta);
});

// === MATCHES ===
app.get('/api/matches', (req, res) => {
  const matches = db.prepare(`
    SELECT
      m.*,
      b.nome as badante_nome,
      b.telefono as badante_telefono,
      b.zona as badante_zona,
      o.titolo as offerta_titolo,
      o.azienda as offerta_azienda,
      o.zona as offerta_zona
    FROM matches m
    JOIN badanti b ON m.badante_id = b.id
    JOIN offerte o ON m.offerta_id = o.id
    ORDER BY m.score_compatibilita DESC, m.data_creazione DESC
  `).all();

  res.json(matches);
});

app.post('/api/matches', (req, res) => {
  const { badante_id, offerta_id, score_compatibilita, motivo_match } = req.body;

  const result = db.prepare(`
    INSERT INTO matches (badante_id, offerta_id, score_compatibilita, motivo_match)
    VALUES (?, ?, ?, ?)
  `).run(badante_id, offerta_id, score_compatibilita, motivo_match);

  res.json({ success: true, id: result.lastInsertRowid });
});

app.put('/api/matches/:id', (req, res) => {
  const { stato } = req.body;

  db.prepare('UPDATE matches SET stato = ? WHERE id = ?')
    .run(stato, req.params.id);

  res.json({ success: true });
});

app.delete('/api/matches/:id', (req, res) => {
  try {
    db.prepare('DELETE FROM matches WHERE id = ?').run(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Errore eliminazione match' });
  }
});

// === MATCHING AUTOMATICO ===
app.post('/api/auto-match/:offerta_id', (req, res) => {
  const offerta = db.prepare('SELECT * FROM offerte WHERE id = ?').get(req.params.offerta_id);
  if (!offerta) return res.status(404).json({ error: 'Offerta non trovata' });

  const badanti = db.prepare('SELECT * FROM badanti WHERE stato_contatto != ?').all('Assunta');

  const matches = [];

  badanti.forEach(badante => {
    let score = 0;
    let motivi = [];

    // Compatibilità zona (30 punti)
    if (badante.zona && offerta.zona) {
      const badanteZona = badante.zona.toLowerCase();
      const offertaZona = offerta.zona.toLowerCase();

      if (badanteZona.includes(offertaZona) || offertaZona.includes(badanteZona)) {
        score += 30;
        motivi.push('Zona compatibile');
      } else if (badante.regione && offerta.zona.toLowerCase().includes(badante.regione.toLowerCase())) {
        score += 15;
        motivi.push('Stessa regione');
      }
    }

    // Match tipo servizio (25 punti)
    if (badante.tipo_servizio && offerta.tipo_servizio) {
      const badanteServizio = badante.tipo_servizio.toLowerCase();
      const offertaServizio = offerta.tipo_servizio.toLowerCase();

      if (offertaServizio.includes('h24') && badanteServizio.includes('h24')) {
        score += 25;
        motivi.push('Disponibile H24');
      } else if (offertaServizio.includes('part') && badanteServizio.includes('part')) {
        score += 25;
        motivi.push('Part-time compatibile');
      } else if (offertaServizio.includes('diurn') && badanteServizio.includes('diurn')) {
        score += 25;
        motivi.push('Diurno compatibile');
      }
    }

    // Esperienza (20 punti)
    if (badante.esperienza_anni >= 15) {
      score += 20;
      motivi.push(`${badante.esperienza_anni} anni esperienza`);
    } else if (badante.esperienza_anni >= 5) {
      score += 10;
      motivi.push(`${badante.esperienza_anni} anni esperienza`);
    }

    // Qualifiche speciali (15 punti)
    if (badante.qualifica && badante.qualifica.includes('OSS')) {
      score += 15;
      motivi.push('Qualifica OSS');
    }

    // Patente se richiesta (10 punti)
    if (offerta.requisiti && offerta.requisiti.toLowerCase().includes('patente') && badante.automunita) {
      score += 10;
      motivi.push('Automunita');
    }

    // Bonus priorità e disponibilità
    if (badante.priorita === 'MASSIMA') score += 5;
    if (badante.disponibilita === 'URGENTE' || badante.disponibilita === 'Immediata') score += 5;
    if (badante.referenze) score += 5;
    if (badante.documenti_regola) score += 5;

    if (score >= 40) {
      matches.push({
        badante_id: badante.id,
        badante_nome: badante.nome,
        badante_telefono: badante.telefono,
        score,
        motivo: motivi.join(', ')
      });
    }
  });

  // Ordina per score
  matches.sort((a, b) => b.score - a.score);

  res.json(matches.slice(0, 10));
});

// === CONTATTI/TELEFONATE ===
app.post('/api/contatti', (req, res) => {
  const { tipo, riferimento_id, riferimento_tipo, esito, note, prossima_azione, data_prossima_azione, operatore } = req.body;

  const result = db.prepare(`
    INSERT INTO contatti (tipo, riferimento_id, riferimento_tipo, esito, note, prossima_azione, data_prossima_azione, operatore)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `).run(tipo, riferimento_id, riferimento_tipo, esito, note, prossima_azione, data_prossima_azione, operatore);

  // Aggiorna data ultimo contatto
  if (riferimento_tipo === 'badante') {
    db.prepare('UPDATE badanti SET data_ultimo_contatto = CURRENT_TIMESTAMP WHERE id = ?')
      .run(riferimento_id);
  }

  res.json({ success: true, id: result.lastInsertRowid });
});

app.get('/api/contatti', (req, res) => {
  const { riferimento_id, riferimento_tipo } = req.query;

  let query = 'SELECT * FROM contatti WHERE 1=1';
  const params = [];

  if (riferimento_id) {
    query += ' AND riferimento_id = ?';
    params.push(riferimento_id);
  }
  if (riferimento_tipo) {
    query += ' AND riferimento_tipo = ?';
    params.push(riferimento_tipo);
  }

  query += ' ORDER BY data_ora DESC';

  const contatti = db.prepare(query).all(...params);
  res.json(contatti);
});

// === AGENZIE ===
app.get('/api/agenzie', (req, res) => {
  const agenzie = db.prepare('SELECT * FROM agenzie ORDER BY nome').all();
  res.json(agenzie);
});

// === DASHBOARD STATS ===
app.get('/api/stats', (req, res) => {
  const stats = {
    badanti_totali: db.prepare('SELECT COUNT(*) as count FROM badanti').get().count,
    badanti_da_contattare: db.prepare('SELECT COUNT(*) as count FROM badanti WHERE stato_contatto = ?').get('Da contattare').count,
    badanti_contattate: db.prepare('SELECT COUNT(*) as count FROM badanti WHERE stato_contatto = ?').get('Contattata').count,
    offerte_attive: db.prepare('SELECT COUNT(*) as count FROM offerte WHERE stato = ?').get('ATTIVA').count,
    matches_proposti: db.prepare('SELECT COUNT(*) as count FROM matches WHERE stato = ?').get('PROPOSTO').count,
    matches_accettati: db.prepare('SELECT COUNT(*) as count FROM matches WHERE stato = ?').get('ACCETTATO').count,
    contatti_oggi: db.prepare("SELECT COUNT(*) as count FROM contatti WHERE date(data_ora) = date('now')").get().count
  };

  res.json(stats);
});

// Servire l'interfaccia web
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start server
app.listen(PORT, () => {
  console.log(`\n🚀 Server avviato su http://localhost:${PORT}`);
  console.log(`\n📊 Dashboard disponibile su http://localhost:${PORT}\n`);
});
