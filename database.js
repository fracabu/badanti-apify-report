const Database = require('better-sqlite3');
const path = require('path');

const db = new Database(path.join(__dirname, 'badanti.db'));

// Schema database
db.exec(`
  -- Tabella Badanti
  CREATE TABLE IF NOT EXISTS badanti (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL,
    telefono TEXT,
    whatsapp TEXT,
    email TEXT,
    eta INTEGER,
    nazionalita TEXT,
    cittadinanza TEXT,
    genere TEXT DEFAULT 'Donna',
    zona TEXT,
    regione TEXT,
    esperienza_anni INTEGER,
    automunita INTEGER DEFAULT 0,
    qualifica TEXT,
    specializzazioni TEXT,
    tipo_servizio TEXT,
    disponibilita TEXT,
    referenze INTEGER DEFAULT 0,
    documenti_regola INTEGER DEFAULT 0,
    rating INTEGER DEFAULT 3,
    priorita TEXT DEFAULT 'MEDIA',
    note TEXT,
    stato_contatto TEXT DEFAULT 'Da contattare',
    data_ultimo_contatto TEXT,
    creato_il TEXT DEFAULT CURRENT_TIMESTAMP
  );

  -- Tabella Famiglie/Offerte
  CREATE TABLE IF NOT EXISTS offerte (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    titolo TEXT NOT NULL,
    azienda TEXT,
    telefono_contatto TEXT,
    email_contatto TEXT,
    zona TEXT,
    tipo_contratto TEXT,
    stipendio_min REAL,
    stipendio_max REAL,
    tipo_servizio TEXT,
    requisiti TEXT,
    benefit TEXT,
    urgenza TEXT DEFAULT 'NORMALE',
    stato TEXT DEFAULT 'ATTIVA',
    note TEXT,
    creato_il TEXT DEFAULT CURRENT_TIMESTAMP
  );

  -- Tabella Match
  CREATE TABLE IF NOT EXISTS matches (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    badante_id INTEGER NOT NULL,
    offerta_id INTEGER NOT NULL,
    score_compatibilita INTEGER,
    motivo_match TEXT,
    stato TEXT DEFAULT 'PROPOSTO',
    data_creazione TEXT DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (badante_id) REFERENCES badanti(id),
    FOREIGN KEY (offerta_id) REFERENCES offerte(id)
  );

  -- Tabella Telefonate/Contatti
  CREATE TABLE IF NOT EXISTS contatti (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    tipo TEXT NOT NULL,
    riferimento_id INTEGER NOT NULL,
    riferimento_tipo TEXT NOT NULL,
    data_ora TEXT DEFAULT CURRENT_TIMESTAMP,
    esito TEXT,
    note TEXT,
    prossima_azione TEXT,
    data_prossima_azione TEXT,
    operatore TEXT
  );

  -- Tabella Agenzie
  CREATE TABLE IF NOT EXISTS agenzie (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL,
    telefono TEXT,
    email TEXT,
    contatto_referente TEXT,
    zone_copertura TEXT,
    servizi TEXT,
    specializzazioni TEXT,
    note TEXT,
    creato_il TEXT DEFAULT CURRENT_TIMESTAMP
  );

  -- Indici per performance
  CREATE INDEX IF NOT EXISTS idx_badanti_zona ON badanti(zona);
  CREATE INDEX IF NOT EXISTS idx_badanti_stato ON badanti(stato_contatto);
  CREATE INDEX IF NOT EXISTS idx_offerte_zona ON offerte(zona);
  CREATE INDEX IF NOT EXISTS idx_offerte_stato ON offerte(stato);
  CREATE INDEX IF NOT EXISTS idx_matches_score ON matches(score_compatibilita DESC);
`);

console.log('✅ Database schema creato con successo');

module.exports = db;
