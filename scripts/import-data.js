const db = require('../database');

console.log('📥 Importazione dati dai report...\n');

// Import TOP 10 Badanti Premium
const badantiPremium = [
  {
    nome: 'Maria Nicoara',
    telefono: '327.327.9932',
    whatsapp: '327.327.9932',
    zona: 'Torino',
    regione: 'Piemonte',
    nazionalita: 'Moldava',
    cittadinanza: 'Italiana',
    esperienza_anni: 25,
    automunita: 1,
    specializzazioni: 'Varie patologie anziani, assistenza specializzata',
    tipo_servizio: 'Diurno 40h/settimana Lunedì-Venerdì',
    disponibilita: 'Immediata',
    referenze: 1,
    documenti_regola: 1,
    rating: 5,
    priorita: 'MASSIMA',
    note: 'Perfetto italiano, 25 anni esperienza, molto qualificata'
  },
  {
    nome: 'Taddei Stella',
    telefono: '346.959.7978',
    zona: 'Roma/Romanina',
    regione: 'Lazio',
    nazionalita: 'Italiana',
    cittadinanza: 'Italiana',
    esperienza_anni: 27,
    qualifica: 'Assistente familiare',
    tipo_servizio: 'Part-time, lungo orario (NO H24, NO spezzato)',
    disponibilita: 'URGENTE',
    referenze: 1,
    documenti_regola: 1,
    rating: 5,
    priorita: 'MASSIMA',
    note: '27 anni esperienza, assistente familiare qualificata italiana'
  },
  {
    nome: 'Vasile Vas',
    eta: 44,
    nazionalita: 'Rumeno',
    genere: 'Uomo',
    esperienza_anni: 20,
    specializzazioni: 'Ictus, Tetraplegici, Tracheostomia, Gastrostomia, Catetere',
    tipo_servizio: 'H24 fisso',
    disponibilita: 'Immediata',
    referenze: 1,
    documenti_regola: 1,
    rating: 5,
    priorita: 'ALTA',
    note: 'Molto esperto in casi complessi, uomo qualificato. Responsabile, educato, clinicamente sano, incensurato'
  },
  {
    nome: 'Felicite Effi',
    telefono: '348.425.2474',
    nazionalita: 'Costa d\'Avorio',
    cittadinanza: 'Italiana',
    zona: 'Gallarate, Legnano',
    regione: 'Lombardia',
    esperienza_anni: 24,
    referenze: 1,
    documenti_regola: 1,
    rating: 5,
    priorita: 'ALTA',
    note: 'Referenziata, molto qualificata. Provincia di Varese'
  },
  {
    nome: 'Nina (ნინიკო)',
    telefono: '+39.329.007.1345',
    whatsapp: '+39.329.007.1345',
    nazionalita: 'Georgiana',
    zona: 'Roma',
    regione: 'Lazio',
    esperienza_anni: 7,
    specializzazioni: 'Assistenza anziani H54',
    disponibilita: 'Immediata',
    referenze: 1,
    documenti_regola: 1,
    rating: 4,
    priorita: 'ALTA',
    note: 'Specializzazione assistenza anziani'
  },
  {
    nome: 'Mercedes Matos',
    telefono: '388.634.8455',
    qualifica: 'OSS (Operatore Socio Sanitario)',
    zona: 'Novara',
    regione: 'Piemonte',
    automunita: 1,
    tipo_servizio: 'Casa di riposo + domicilio',
    referenze: 1,
    documenti_regola: 1,
    rating: 4,
    priorita: 'ALTA',
    note: 'OSS qualificato, automunita'
  },
  {
    nome: 'Dusya Ivanyuk',
    nazionalita: 'Ucraina',
    cittadinanza: 'Italiana',
    esperienza_anni: 23,
    zona: 'Cantù, Giussano, Erba, Como',
    regione: 'Lombardia',
    automunita: 1,
    tipo_servizio: 'Diurno con contratto',
    disponibilita: 'URGENTE',
    referenze: 1,
    documenti_regola: 1,
    rating: 4,
    priorita: 'ALTA'
  },
  {
    nome: 'Violeta Xristova',
    nazionalita: 'Bulgara',
    esperienza_anni: 21,
    tipo_servizio: 'H24',
    disponibilita: 'URGENTE',
    referenze: 1,
    documenti_regola: 1,
    rating: 4,
    priorita: 'ALTA'
  },
  {
    nome: 'Gabriela Gabry',
    telefono: '347.411.4233',
    zona: 'Roma',
    regione: 'Lazio',
    esperienza_anni: 15,
    tipo_servizio: 'H24',
    automunita: 1,
    disponibilita: 'Immediata',
    referenze: 1,
    documenti_regola: 1,
    rating: 4,
    priorita: 'MEDIA',
    note: 'Patentata, documenti in regola, referenze verificabili'
  },
  {
    nome: 'Natalia Miron',
    telefono: '366.174.9941',
    qualifica: 'OSS (Operatore Socio Sanitario)',
    zona: 'Pesaro',
    regione: 'Marche',
    tipo_servizio: 'Badante-OSS-Colf',
    referenze: 1,
    documenti_regola: 1,
    rating: 4,
    priorita: 'MEDIA'
  }
];

// Import Badanti
const insertBadante = db.prepare(`
  INSERT INTO badanti (
    nome, telefono, whatsapp, email, eta, nazionalita, cittadinanza, genere,
    zona, regione, esperienza_anni, automunita, qualifica, specializzazioni,
    tipo_servizio, disponibilita, referenze, documenti_regola, rating, priorita, note
  ) VALUES (
    @nome, @telefono, @whatsapp, @email, @eta, @nazionalita, @cittadinanza, @genere,
    @zona, @regione, @esperienza_anni, @automunita, @qualifica, @specializzazioni,
    @tipo_servizio, @disponibilita, @referenze, @documenti_regola, @rating, @priorita, @note
  )
`);

badantiPremium.forEach(badante => {
  // Set default values for missing fields
  const badanteData = {
    nome: null,
    telefono: null,
    whatsapp: null,
    email: null,
    eta: null,
    nazionalita: null,
    cittadinanza: null,
    genere: 'Donna',
    zona: null,
    regione: null,
    esperienza_anni: null,
    automunita: 0,
    qualifica: null,
    specializzazioni: null,
    tipo_servizio: null,
    disponibilita: null,
    referenze: 0,
    documenti_regola: 0,
    rating: 3,
    priorita: 'MEDIA',
    note: null,
    ...badante
  };
  insertBadante.run(badanteData);
});

console.log(`✅ Importati ${badantiPremium.length} badanti premium`);

// Import Offerte di Lavoro
const offerte = [
  {
    titolo: 'Badante Convivente - Roma Nord',
    azienda: 'Luigi Beltramini',
    zona: 'Roma Nord',
    tipo_contratto: 'Convivenza',
    stipendio_min: 1380,
    stipendio_max: 1380,
    tipo_servizio: 'H24 Convivente',
    requisiti: 'Esperienza con disabilità, qualifica medica preferibile',
    benefit: 'Vitto e alloggio inclusi',
    urgenza: 'ALTA',
    stato: 'ATTIVA',
    note: 'Preferibile candidata con qualifica infermieristica'
  },
  {
    titolo: 'Badante con Patente - Infernetto',
    azienda: 'C\'importa Care',
    zona: 'Roma Sud - Infernetto',
    tipo_contratto: 'Part-time/Full-time',
    stipendio_min: 776,
    stipendio_max: 1556,
    tipo_servizio: 'Diurno con auto',
    requisiti: 'Patente B obbligatoria, esperienza',
    benefit: 'Contributi INPS',
    urgenza: 'MEDIA',
    stato: 'ATTIVA',
    note: 'Necessaria auto per spostamenti'
  },
  {
    titolo: 'Badante Convivente - Roma Centro',
    azienda: 'AVI ONLUS',
    zona: 'Roma Centro',
    tipo_contratto: 'Convivenza',
    stipendio_min: 1060,
    stipendio_max: 1300,
    tipo_servizio: 'H24 Convivente',
    requisiti: 'Esperienza pluriennale, referenze verificabili',
    benefit: 'Vitto, alloggio, contributi',
    urgenza: 'ALTA',
    stato: 'ATTIVA'
  },
  {
    titolo: 'Badante Part-time Flessibile',
    azienda: 'COTRAD ONLUS',
    zona: 'Roma Multi-zona',
    tipo_contratto: 'Part-time',
    stipendio_min: 11.50,
    stipendio_max: 15.00,
    tipo_servizio: 'Part-time flessibile',
    requisiti: 'Diploma OSS preferibile, flessibilità oraria',
    benefit: 'Contributi INPS, flessibilità',
    urgenza: 'MEDIA',
    stato: 'ATTIVA',
    note: 'Retribuzione oraria €11.50-15.00/h'
  },
  {
    titolo: 'Badante Convivente - Roma Centro',
    azienda: 'Family Crew',
    zona: 'Roma Centro',
    tipo_contratto: 'Convivenza',
    stipendio_min: 1300,
    stipendio_max: 1500,
    tipo_servizio: 'H24 Convivente',
    requisiti: '18+ anni esperienza, famiglie con anziani',
    benefit: 'Vitto e alloggio inclusi',
    urgenza: 'ALTA',
    stato: 'ATTIVA',
    note: 'Preferibile esperienza lunga con famiglie'
  }
];

const insertOfferta = db.prepare(`
  INSERT INTO offerte (
    titolo, azienda, telefono_contatto, email_contatto, zona, tipo_contratto, stipendio_min, stipendio_max,
    tipo_servizio, requisiti, benefit, urgenza, stato, note
  ) VALUES (
    @titolo, @azienda, @telefono_contatto, @email_contatto, @zona, @tipo_contratto, @stipendio_min, @stipendio_max,
    @tipo_servizio, @requisiti, @benefit, @urgenza, @stato, @note
  )
`);

offerte.forEach(offerta => {
  const offertaData = {
    titolo: null,
    azienda: null,
    telefono_contatto: null,
    email_contatto: null,
    zona: null,
    tipo_contratto: null,
    stipendio_min: null,
    stipendio_max: null,
    tipo_servizio: null,
    requisiti: null,
    benefit: null,
    urgenza: 'MEDIA',
    stato: 'ATTIVA',
    note: null,
    ...offerta
  };
  insertOfferta.run(offertaData);
});

console.log(`✅ Importate ${offerte.length} offerte di lavoro`);

// Import Agenzie
const agenzie = [
  {
    nome: 'ITALIA ASSISTENZA',
    telefono: '379.209.6206',
    contatto_referente: 'Vilma Cecchetti',
    zone_copertura: 'Roma, Viterbo, Rieti, Perugia, Terni',
    servizi: 'Badanti conviventi disponibili',
    specializzazioni: 'Casi urgenti, badanti H24 per allettati con sondino',
    note: 'Urgenze Todi - Badante donna per signora allettata'
  },
  {
    nome: 'LaSegreteria TerzoSocial',
    telefono: '375.682.6895',
    zone_copertura: 'Roma (Viale Kant)',
    servizi: 'Badanti UOMO per casi complessi',
    specializzazioni: 'SLA, signori non autosufficienti con patologie gravi',
    note: 'Requisiti: Ottimo italiano, esperienza specializzata, referenze'
  },
  {
    nome: 'Villa Luana',
    telefono: '339.529.6422',
    zone_copertura: '30 minuti da Roma Nord',
    servizi: 'Struttura residenziale',
    note: 'Camere con bagno privato e aria condizionata'
  }
];

const insertAgenzia = db.prepare(`
  INSERT INTO agenzie (
    nome, telefono, email, contatto_referente, zone_copertura, servizi, specializzazioni, note
  ) VALUES (
    @nome, @telefono, @email, @contatto_referente, @zone_copertura, @servizi, @specializzazioni, @note
  )
`);

agenzie.forEach(agenzia => {
  const agenziaData = {
    nome: null,
    telefono: null,
    email: null,
    contatto_referente: null,
    zone_copertura: null,
    servizi: null,
    specializzazioni: null,
    note: null,
    ...agenzia
  };
  insertAgenzia.run(agenziaData);
});

console.log(`✅ Importate ${agenzie.length} agenzie partner\n`);

// Statistiche finali
const stats = {
  badanti: db.prepare('SELECT COUNT(*) as count FROM badanti').get().count,
  offerte: db.prepare('SELECT COUNT(*) as count FROM offerte').get().count,
  agenzie: db.prepare('SELECT COUNT(*) as count FROM agenzie').get().count
};

console.log('📊 Statistiche Database:');
console.log(`   - Badanti: ${stats.badanti}`);
console.log(`   - Offerte: ${stats.offerte}`);
console.log(`   - Agenzie: ${stats.agenzie}`);
console.log('\n✅ Importazione completata!\n');
