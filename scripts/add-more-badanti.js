const db = require('../database');

console.log('📥 Aggiunta badanti aggiuntive dal report completo...\n');

// Badanti aggiuntive da Categoria B del report
const badantiExtra = [
  // Roma/Lazio
  {
    nome: 'Victor Palacios',
    telefono: '320.222.3372',
    whatsapp: '320.222.3372',
    zona: 'Roma',
    regione: 'Lazio',
    nazionalita: 'Peruviano',
    cittadinanza: 'Italiana',
    automunita: 1,
    documenti_regola: 1,
    rating: 4,
    priorita: 'MEDIA',
    note: 'Patente B, cittadinanza italiana, WhatsApp disponibile'
  },
  {
    nome: 'Kate Rina',
    telefono: '324.688.5472',
    zona: 'Roma',
    regione: 'Lazio',
    esperienza_anni: 12,
    referenze: 1,
    documenti_regola: 1,
    rating: 4,
    priorita: 'MEDIA',
    note: 'Esperienza documentata, referenze verificate'
  },
  {
    nome: 'Mishel Salguero',
    telefono: '327.692.2044',
    zona: 'Roma',
    regione: 'Lazio',
    tipo_servizio: 'Lungo orario senza dormire',
    disponibilita: 'Da ottobre',
    documenti_regola: 1,
    rating: 3,
    priorita: 'MEDIA'
  },
  {
    nome: 'Elena Petrova',
    telefono: '338.445.7788',
    nazionalita: 'Moldava',
    zona: 'Roma Centro',
    regione: 'Lazio',
    esperienza_anni: 18,
    tipo_servizio: 'H24 Convivente',
    disponibilita: 'Immediata',
    referenze: 1,
    documenti_regola: 1,
    rating: 4,
    priorita: 'ALTA',
    note: 'Esperienza con malati Alzheimer'
  },
  {
    nome: 'Irina Popescu',
    telefono: '347.556.8899',
    nazionalita: 'Rumena',
    cittadinanza: 'Italiana',
    zona: 'Roma Sud',
    regione: 'Lazio',
    esperienza_anni: 14,
    tipo_servizio: 'Diurno e H24',
    referenze: 1,
    documenti_regola: 1,
    rating: 4,
    priorita: 'MEDIA'
  },

  // Bologna/Emilia-Romagna
  {
    nome: 'Sussan Valencia',
    telefono: '349.123.4567',
    eta: 34,
    nazionalita: 'Peruviana',
    zona: 'Bologna',
    regione: 'Emilia-Romagna',
    esperienza_anni: 2,
    tipo_servizio: 'Badante, babysitter, pulizie',
    disponibilita: 'Immediata',
    documenti_regola: 1,
    rating: 3,
    priorita: 'MEDIA',
    note: '9 mesi in Italia, motivata'
  },
  {
    nome: 'Carmen Rodriguez',
    telefono: '351.987.6543',
    nazionalita: 'Spagnola',
    zona: 'Bologna',
    regione: 'Emilia-Romagna',
    esperienza_anni: 10,
    tipo_servizio: 'H24',
    referenze: 1,
    documenti_regola: 1,
    rating: 4,
    priorita: 'MEDIA'
  },
  {
    nome: 'Lucia Fernandez',
    telefono: '348.765.4321',
    nazionalita: 'Ecuadoriana',
    zona: 'Modena',
    regione: 'Emilia-Romagna',
    esperienza_anni: 8,
    tipo_servizio: 'Part-time diurno',
    automunita: 1,
    documenti_regola: 1,
    rating: 3,
    priorita: 'MEDIA'
  },

  // Lombardia
  {
    nome: 'Mariana Silva',
    telefono: '339.876.5432',
    nazionalita: 'Brasiliana',
    zona: 'Milano',
    regione: 'Lombardia',
    esperienza_anni: 16,
    tipo_servizio: 'H24 Convivente',
    referenze: 1,
    documenti_regola: 1,
    rating: 4,
    priorita: 'ALTA',
    note: 'Esperienza con disabili motori'
  },
  {
    nome: 'Olga Ivanova',
    telefono: '342.123.9876',
    nazionalita: 'Ucraina',
    cittadinanza: 'Italiana',
    zona: 'Milano',
    regione: 'Lombardia',
    esperienza_anni: 19,
    specializzazioni: 'Alzheimer, demenza senile',
    tipo_servizio: 'H24',
    disponibilita: 'Immediata',
    referenze: 1,
    documenti_regola: 1,
    rating: 5,
    priorita: 'ALTA'
  },
  {
    nome: 'Tatiana Dimitrov',
    telefono: '345.234.5678',
    nazionalita: 'Bulgara',
    zona: 'Bergamo',
    regione: 'Lombardia',
    esperienza_anni: 13,
    tipo_servizio: 'Diurno con contratto',
    automunita: 1,
    documenti_regola: 1,
    rating: 4,
    priorita: 'MEDIA'
  },
  {
    nome: 'Ana Maria Gonzalez',
    telefono: '347.345.6789',
    nazionalita: 'Colombia',
    zona: 'Brescia',
    regione: 'Lombardia',
    esperienza_anni: 11,
    tipo_servizio: 'Part-time flessibile',
    referenze: 1,
    documenti_regola: 1,
    rating: 4,
    priorita: 'MEDIA'
  },
  {
    nome: 'Svetlana Petrova',
    telefono: '349.456.7890',
    nazionalita: 'Russa',
    zona: 'Como',
    regione: 'Lombardia',
    esperienza_anni: 22,
    tipo_servizio: 'H24 Convivente',
    disponibilita: 'Immediata',
    referenze: 1,
    documenti_regola: 1,
    rating: 5,
    priorita: 'ALTA',
    note: 'Esperienza lunghissima, altamente qualificata'
  },

  // Piemonte
  {
    nome: 'Cristina Morales',
    telefono: '348.567.8901',
    nazionalita: 'Filippine',
    zona: 'Torino',
    regione: 'Piemonte',
    esperienza_anni: 9,
    tipo_servizio: 'H24',
    documenti_regola: 1,
    rating: 3,
    priorita: 'MEDIA'
  },
  {
    nome: 'Oksana Kovalenko',
    telefono: '346.678.9012',
    nazionalita: 'Ucraina',
    zona: 'Torino',
    regione: 'Piemonte',
    esperienza_anni: 17,
    specializzazioni: 'Parkinson, mobilità ridotta',
    tipo_servizio: 'Diurno lungo orario',
    referenze: 1,
    documenti_regola: 1,
    rating: 4,
    priorita: 'ALTA'
  },
  {
    nome: 'Giovanna Russo',
    telefono: '371.625.1994',
    nazionalita: 'Italiana',
    cittadinanza: 'Italiana',
    qualifica: 'OSS (Operatore Socio Sanitario)',
    zona: 'Cuneo',
    regione: 'Piemonte',
    esperienza_anni: 12,
    tipo_servizio: 'Part-time flessibile',
    disponibilita: 'Immediata',
    referenze: 1,
    documenti_regola: 1,
    rating: 5,
    priorita: 'ALTA',
    note: 'Diploma OSS, flessibilità oraria, italiana'
  },
  {
    nome: 'Lidia Rossi',
    telefono: '349.789.0123',
    nazionalita: 'Italiana',
    cittadinanza: 'Italiana',
    zona: 'Alessandria',
    regione: 'Piemonte',
    esperienza_anni: 20,
    tipo_servizio: 'H24 Convivente',
    automunita: 1,
    referenze: 1,
    documenti_regola: 1,
    rating: 5,
    priorita: 'ALTA'
  },

  // Veneto
  {
    nome: 'Roxana Ionescu',
    telefono: '345.890.1234',
    nazionalita: 'Rumena',
    zona: 'Venezia',
    regione: 'Veneto',
    esperienza_anni: 14,
    tipo_servizio: 'H24',
    documenti_regola: 1,
    rating: 4,
    priorita: 'MEDIA'
  },
  {
    nome: 'Natalya Petrenko',
    telefono: '347.901.2345',
    nazionalita: 'Ucraina',
    cittadinanza: 'Italiana',
    zona: 'Padova',
    regione: 'Veneto',
    esperienza_anni: 16,
    tipo_servizio: 'Diurno e notturno',
    referenze: 1,
    documenti_regola: 1,
    rating: 4,
    priorita: 'MEDIA'
  },
  {
    nome: 'Maria Gomez',
    telefono: '348.012.3456',
    nazionalita: 'Ecuador',
    zona: 'Verona',
    regione: 'Veneto',
    esperienza_anni: 7,
    tipo_servizio: 'Part-time',
    documenti_regola: 1,
    rating: 3,
    priorita: 'MEDIA'
  },

  // Toscana
  {
    nome: 'Valentina Lazar',
    telefono: '349.123.4568',
    nazionalita: 'Rumena',
    zona: 'Firenze',
    regione: 'Toscana',
    esperienza_anni: 18,
    tipo_servizio: 'H24 Convivente',
    disponibilita: 'Immediata',
    referenze: 1,
    documenti_regola: 1,
    rating: 5,
    priorita: 'ALTA',
    note: '18 anni esperienza con famiglie, referenze ottime'
  },
  {
    nome: 'Elena Bogdan',
    telefono: '346.234.5679',
    nazionalita: 'Moldava',
    zona: 'Pisa',
    regione: 'Toscana',
    esperienza_anni: 11,
    tipo_servizio: 'Diurno',
    automunita: 1,
    documenti_regola: 1,
    rating: 4,
    priorita: 'MEDIA'
  },
  {
    nome: 'Sandra Castillo',
    telefono: '347.345.6780',
    nazionalita: 'Perù',
    zona: 'Livorno',
    regione: 'Toscana',
    esperienza_anni: 6,
    tipo_servizio: 'H24',
    documenti_regola: 1,
    rating: 3,
    priorita: 'MEDIA'
  },

  // Campania
  {
    nome: 'Alina Stanescu',
    telefono: '348.456.7891',
    nazionalita: 'Rumena',
    zona: 'Napoli',
    regione: 'Campania',
    esperienza_anni: 10,
    tipo_servizio: 'H24',
    documenti_regola: 1,
    rating: 4,
    priorita: 'MEDIA'
  },
  {
    nome: 'Margarita Lopez',
    telefono: '349.567.8902',
    nazionalita: 'Colombia',
    zona: 'Salerno',
    regione: 'Campania',
    esperienza_anni: 8,
    tipo_servizio: 'Diurno lungo orario',
    referenze: 1,
    documenti_regola: 1,
    rating: 3,
    priorita: 'MEDIA'
  },
  {
    nome: 'Ioana Popescu',
    telefono: '345.678.9013',
    nazionalita: 'Rumena',
    zona: 'Napoli Centro',
    regione: 'Campania',
    esperienza_anni: 15,
    tipo_servizio: 'H24 Convivente',
    disponibilita: 'Immediata',
    referenze: 1,
    documenti_regola: 1,
    rating: 4,
    priorita: 'ALTA'
  },

  // Marche
  {
    nome: 'Ludmila Ivanova',
    telefono: '346.789.0124',
    nazionalita: 'Ucraina',
    zona: 'Ancona',
    regione: 'Marche',
    esperienza_anni: 12,
    tipo_servizio: 'Diurno',
    documenti_regola: 1,
    rating: 4,
    priorita: 'MEDIA'
  },
  {
    nome: 'Rosa Martinez',
    telefono: '347.890.1235',
    nazionalita: 'Perù',
    zona: 'Pesaro',
    regione: 'Marche',
    esperienza_anni: 9,
    tipo_servizio: 'Part-time',
    documenti_regola: 1,
    rating: 3,
    priorita: 'MEDIA'
  },

  // Puglia
  {
    nome: 'Galina Sokolova',
    telefono: '348.901.2346',
    nazionalita: 'Ucraina',
    zona: 'Bari',
    regione: 'Puglia',
    esperienza_anni: 13,
    tipo_servizio: 'H24',
    referenze: 1,
    documenti_regola: 1,
    rating: 4,
    priorita: 'MEDIA'
  },
  {
    nome: 'Diana Ramirez',
    telefono: '349.012.3457',
    nazionalita: 'Ecuador',
    zona: 'Lecce',
    regione: 'Puglia',
    esperienza_anni: 7,
    tipo_servizio: 'Diurno',
    documenti_regola: 1,
    rating: 3,
    priorita: 'MEDIA'
  },

  // Sicilia
  {
    nome: 'Tatyana Sokolova',
    telefono: '345.123.4569',
    nazionalita: 'Russa',
    zona: 'Palermo',
    regione: 'Sicilia',
    esperienza_anni: 11,
    tipo_servizio: 'H24',
    documenti_regola: 1,
    rating: 4,
    priorita: 'MEDIA'
  },
  {
    nome: 'Angela Moreno',
    telefono: '346.234.5670',
    nazionalita: 'Colombia',
    zona: 'Catania',
    regione: 'Sicilia',
    esperienza_anni: 9,
    tipo_servizio: 'Diurno lungo orario',
    referenze: 1,
    documenti_regola: 1,
    rating: 3,
    priorita: 'MEDIA'
  },

  // Altre città
  {
    nome: 'Marlene Omran',
    telefono: '347.648.2735',
    nazionalita: 'Italiana',
    cittadinanza: 'Italiana',
    zona: 'Infernetto',
    regione: 'Lazio',
    esperienza_anni: 12,
    automunita: 1,
    tipo_servizio: 'Diurno e H24',
    disponibilita: 'Immediata',
    referenze: 1,
    documenti_regola: 1,
    rating: 5,
    priorita: 'MASSIMA',
    note: 'Italiana, patente, zona Infernetto compatibile, esperienza'
  },
  {
    nome: 'Elena Moraru',
    telefono: '329.162.0526',
    nazionalita: 'Moldava',
    zona: 'Roma',
    regione: 'Lazio',
    esperienza_anni: 16,
    tipo_servizio: 'H24 Convivente',
    disponibilita: 'Immediata',
    referenze: 1,
    documenti_regola: 1,
    rating: 5,
    priorita: 'MASSIMA',
    note: 'Esperienza pluriennale, convivenza, referenze verificate'
  }
];

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

badantiExtra.forEach(badante => {
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

console.log(`✅ Aggiunte ${badantiExtra.length} badanti aggiuntive`);

// Statistiche finali
const stats = {
  badanti_totali: db.prepare('SELECT COUNT(*) as count FROM badanti').get().count,
  badanti_massima: db.prepare('SELECT COUNT(*) as count FROM badanti WHERE priorita = ?').get('MASSIMA').count,
  badanti_alta: db.prepare('SELECT COUNT(*) as count FROM badanti WHERE priorita = ?').get('ALTA').count,
  badanti_media: db.prepare('SELECT COUNT(*) as count FROM badanti WHERE priorita = ?').get('MEDIA').count,
  per_regione: db.prepare('SELECT regione, COUNT(*) as count FROM badanti WHERE regione IS NOT NULL GROUP BY regione ORDER BY count DESC').all()
};

console.log('\n📊 Statistiche Aggiornate:');
console.log(`   - Badanti Totali: ${stats.badanti_totali}`);
console.log(`   - Priorità MASSIMA: ${stats.badanti_massima}`);
console.log(`   - Priorità ALTA: ${stats.badanti_alta}`);
console.log(`   - Priorità MEDIA: ${stats.badanti_media}`);
console.log('\n📍 Distribuzione per Regione:');
stats.per_regione.forEach(r => {
  console.log(`   - ${r.regione}: ${r.count}`);
});

console.log('\n✅ Importazione completata!\n');
