# 🏥 Badanti Matcher - Sistema Gestione e Matching

Sistema completo per la gestione di badanti e famiglie con algoritmo di matching automatico domanda/offerta.

![Version](https://img.shields.io/badge/version-1.0.0-blue)
![Node](https://img.shields.io/badge/node-%3E%3D18.0.0-green)
![License](https://img.shields.io/badge/license-MIT-blue)

## 📋 Indice

- [Caratteristiche](#-caratteristiche)
- [Avvio Rapido](#-avvio-rapido)
- [Funzionalità](#-funzionalità)
- [Workflow Operativo](#-workflow-operativo)
- [API Endpoints](#-api-endpoints)
- [Database](#-struttura-database)
- [Screenshots](#-screenshots)
- [Supporto](#-supporto)

## ✨ Caratteristiche

- 📊 **Dashboard in tempo reale** con KPI operativi
- 🔍 **Ricerca avanzata** con filtri multipli
- 🤖 **Matching automatico** con algoritmo intelligente
- 📞 **Tracking telefonate** completo
- 💾 **Database SQLite** - Zero configurazione
- 🎨 **Interfaccia moderna** - Bootstrap 5
- 📱 **Click-to-call** su tutti i numeri
- 🗑️ **Gestione completa** - Crea, modifica, elimina

## 🚀 Avvio Rapido

### Prerequisiti

- Node.js >= 18.0.0
- npm >= 8.0.0

### Installazione

**1. Installa le dipendenze**
```bash
npm install
```

**2. Inizializza il database**
```bash
node scripts/import-data.js
```

Questo comando importa:
- ✅ 10 badanti premium (TOP profili)
- ✅ 5 offerte di lavoro attive
- ✅ 3 agenzie partner

**3. (Opzionale) Aggiungi altre badanti**
```bash
node scripts/add-more-badanti.js
```

Aggiunge 34 badanti extra per un totale di **44 profili**.

**4. Avvia il server**
```bash
npm start
```

🎉 **L'app è disponibile su:** http://localhost:3000

## 📊 Funzionalità

### Dashboard Operatore

#### 📈 Statistiche Real-Time
- Badanti totali nel database
- Badanti da contattare (priorità)
- Offerte di lavoro attive
- Match creati e loro stato

#### 🔍 Database Badanti
- **Ricerca avanzata**: per nome, telefono, zona
- **Filtri intelligenti**:
  - Priorità (MASSIMA/ALTA/MEDIA)
  - Stato contatto
  - Regione
- **Dettaglio completo**: esperienza, qualifiche, documenti
- **Click-to-call**: chiama direttamente dal browser

#### 💼 Gestione Offerte
- Lista offerte di lavoro attive
- Dettagli: zona, stipendio, requisiti
- Funzione "Trova Match" automatica

#### 🎯 Matching Automatico

L'algoritmo valuta la compatibilità su 5 criteri:

| Criterio | Peso | Descrizione |
|----------|------|-------------|
| **Zona** | 30% | Compatibilità geografica |
| **Tipo Servizio** | 25% | H24, Part-time, Diurno |
| **Esperienza** | 20% | Anni di esperienza |
| **Qualifiche** | 15% | OSS, specializzazioni |
| **Requisiti Speciali** | 10% | Patente, lingue |

**Score minimo:** 40% • **Score ottimale:** 85-95%

#### 📞 Tracking Contatti
- Registra telefonate, WhatsApp, email
- Salva esito e note operative
- Storico completo per badante
- Promemoria prossime azioni

#### 🗑️ Gestione Match
- Visualizza tutti i match creati
- Aggiorna stato (PROPOSTO → ACCETTATO → ASSUNTO)
- **Elimina match** con conferma

#### 🏢 Agenzie Partner
Database di 3 agenzie specializzate con:
- Contatti diretti
- Zone di copertura
- Specializzazioni

## 🎯 Workflow Operativo

### 1️⃣ Mattina: Revisione Priorità
```
→ Dashboard: controlla KPI
→ Tab Badanti: filtra "MASSIMA" e "ALTA" priorità
→ Identifica badanti "Da contattare"
→ Pianifica chiamate giornata
```

### 2️⃣ Contatti
```
→ Clicca pulsante telefono
→ Effettua chiamata
→ Clicca "Dettagli" badante
→ Registra esito: Risposto/Non risposto/Interessata/etc
→ Aggiorna stato badante
→ Salva note importanti
```

### 3️⃣ Matching Offerte
```
→ Tab "Offerte Lavoro"
→ Clicca "Trova Match" su offerta
→ Sistema mostra top 10 badanti compatibili con score
→ Seleziona badante
→ Clicca "Crea Match"
```

### 4️⃣ Follow-up
```
→ Tab "Matches"
→ Monitora stato matches
→ Organizza colloqui
→ Aggiorna stato → ACCETTATO
→ Se non adatto: elimina match
```

### 5️⃣ Chiusura
```
→ Badante assunta: aggiorna stato → "Assunta"
→ Offerta coperta: aggiorna stato → "CHIUSA"
→ Rivedi statistiche giornata
```

## 🔧 API Endpoints

### Badanti
```
GET    /api/badanti              # Lista badanti (con filtri)
GET    /api/badanti/:id          # Dettaglio badante
PUT    /api/badanti/:id          # Aggiorna badante
```

**Parametri filtro disponibili:**
- `zona` - Filtra per zona
- `priorita` - MASSIMA, ALTA, MEDIA
- `stato` - Da contattare, Contattata, Interessata, etc
- `search` - Ricerca full-text (nome, telefono, zona)

### Offerte
```
GET    /api/offerte              # Lista offerte
GET    /api/offerte/:id          # Dettaglio offerta
```

### Matching
```
GET    /api/matches              # Lista matches
POST   /api/matches              # Crea match manuale
PUT    /api/matches/:id          # Aggiorna stato match
DELETE /api/matches/:id          # Elimina match
POST   /api/auto-match/:offerta_id  # Match automatico
```

### Contatti
```
GET    /api/contatti             # Lista contatti
POST   /api/contatti             # Registra contatto
```

### Agenzie
```
GET    /api/agenzie              # Lista agenzie
```

### Stats
```
GET    /api/stats                # Dashboard KPI
```

## 📁 Struttura Database

### Tabelle

#### `badanti`
```sql
- id (PRIMARY KEY)
- nome, telefono, whatsapp, email
- eta, nazionalita, cittadinanza, genere
- zona, regione
- esperienza_anni, automunita, qualifica
- specializzazioni, tipo_servizio
- disponibilita, referenze, documenti_regola
- rating (1-5), priorita (MASSIMA/ALTA/MEDIA)
- stato_contatto, data_ultimo_contatto
- note, creato_il
```

#### `offerte`
```sql
- id (PRIMARY KEY)
- titolo, azienda
- telefono_contatto, email_contatto
- zona, tipo_contratto
- stipendio_min, stipendio_max
- tipo_servizio, requisiti, benefit
- urgenza (ALTA/MEDIA/BASSA)
- stato (ATTIVA/CHIUSA)
- note, creato_il
```

#### `matches`
```sql
- id (PRIMARY KEY)
- badante_id (FOREIGN KEY)
- offerta_id (FOREIGN KEY)
- score_compatibilita (0-100)
- motivo_match
- stato (PROPOSTO/ACCETTATO/RIFIUTATO/ASSUNTO)
- data_creazione
```

#### `contatti`
```sql
- id (PRIMARY KEY)
- tipo (Telefonata/WhatsApp/Email)
- riferimento_id, riferimento_tipo
- data_ora, esito
- note, prossima_azione, data_prossima_azione
- operatore
```

#### `agenzie`
```sql
- id (PRIMARY KEY)
- nome, telefono, email
- contatto_referente
- zone_copertura, servizi
- specializzazioni, note
```

## 💡 Tips & Best Practices

### Priorità Contatti
| Priorità | Tempo di Contatto | Azione |
|----------|-------------------|--------|
| 🔴 **MASSIMA** | Entro 2 ore | Chiamata immediata |
| 🟠 **ALTA** | Entro giornata | Pianifica chiamata |
| 🔵 **MEDIA** | Entro 48h | Inserisci in lista |

### Interpretazione Match Score
- **85-95%**: Match quasi perfetto - Contatto immediato
- **70-84%**: Buon match - Valutare attentamente
- **40-69%**: Match possibile - Verificare tutti i requisiti
- **< 40%**: Match scartato automaticamente

### Stati Badante
| Stato | Significato | Azione Successiva |
|-------|-------------|-------------------|
| **Da contattare** | Non ancora chiamata | Prima chiamata |
| **Contattata** | Primo contatto fatto | Follow-up |
| **Interessata** | Disponibile | Proporre offerte |
| **Non interessata** | Non disponibile | Archiviare |
| **Assunta** | Già impegnata | Rimuovere da ricerche |
| **Non disponibile** | Temp. non disponibile | Ricontattare dopo |

## 📞 Agenzie Partner Integrate

### 🏥 ITALIA ASSISTENZA
**Contatto:** Vilma Cecchetti - 📞 379.209.6206
**Zone:** Roma, Viterbo, Rieti, Perugia, Terni
**Specialità:** Casi urgenti, H24, allettati con sondino

### 🏥 LaSegreteria TerzoSocial
**Contatto:** 📞 375.682.6895
**Zone:** Roma (Viale Kant)
**Specialità:** Badanti UOMO per SLA e patologie complesse

### 🏨 Villa Luana
**Contatto:** 📞 339.529.6422
**Ubicazione:** 30 minuti da Roma Nord
**Servizi:** Struttura residenziale con camere private

## 📈 Metriche di Successo

### Target KPI
| Metrica | Target | Formula |
|---------|--------|---------|
| Tasso di risposta | 80% | Risposte / Chiamate |
| Colloqui organizzati | 60% | Colloqui / Risposte positive |
| Assunzioni | 40% | Assunzioni / Colloqui |
| Tempo medio chiusura | 5-7 giorni | Data assunzione - Data match |

### Statistiche Database Attuale
- **44 Badanti** totali
- **4 Priorità MASSIMA** (top urgenti)
- **15 Priorità ALTA** (contatto oggi)
- **25 Priorità MEDIA** (entro 48h)

### Distribuzione Geografica
| Regione | Badanti |
|---------|---------|
| Lazio | 10 |
| Lombardia | 7 |
| Piemonte | 6 |
| Veneto | 3 |
| Toscana | 3 |
| Emilia-Romagna | 3 |
| Campania | 3 |
| Marche | 3 |
| Altre | 6 |

## 🛠 Tecnologie Utilizzate

- **Backend:** Node.js 20.x + Express 4.x
- **Database:** SQLite 3 (better-sqlite3)
- **Frontend:** HTML5 + Bootstrap 5.3 + JavaScript Vanilla
- **Icons:** Bootstrap Icons 1.10
- **HTTP Client:** Fetch API nativa

## 📝 Gestione e Manutenzione

### Backup Database
```bash
# Copia manuale
cp badanti.db badanti_backup_$(date +%Y%m%d).db

# Windows
copy badanti.db badanti_backup_%date%.db
```

### Reset Database
```bash
# Elimina database
rm badanti.db  # Linux/Mac
del badanti.db  # Windows

# Ricrea da zero
node scripts/import-data.js
node scripts/add-more-badanti.js
```

### Aggiungere Nuove Badanti

**Via Interfaccia Web:** Previsto in v1.1

**Via Script:** Crea file in `scripts/` seguendo il formato:
```javascript
const badante = {
  nome: 'Nome Cognome',
  telefono: '333-1234567',
  zona: 'Roma',
  regione: 'Lazio',
  esperienza_anni: 10,
  // ... altri campi
};
```

### Aggiornare Dati Esistenti
```javascript
// Esempio SQL diretto
const db = require('./database');
db.prepare('UPDATE badanti SET telefono = ? WHERE id = ?')
  .run('333-9999999', 1);
```

## 🐛 Troubleshooting

### Porta 3000 già in uso
```bash
# Trova processo
netstat -ano | findstr :3000

# Termina processo (Windows)
taskkill //F //PID <PID>

# Termina processo (Linux/Mac)
kill -9 <PID>
```

### Database corrotto
```bash
# Verifica integrità
sqlite3 badanti.db "PRAGMA integrity_check;"

# Se corrotto, reset completo
rm badanti.db
node scripts/import-data.js
```

### Errori npm install
```bash
# Pulisci cache
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

## 🔄 Aggiornamenti Futuri (Roadmap)

### v1.1 (Prossimo Release)
- [ ] Aggiungi badanti da interfaccia web
- [ ] Export Excel/CSV dei dati
- [ ] Filtri avanzati multipli
- [ ] Calendario appuntamenti

### v1.2
- [ ] Autenticazione utenti
- [ ] Multi-operatore con permessi
- [ ] Dashboard analytics avanzata
- [ ] Email automatiche

### v1.3
- [ ] App mobile companion
- [ ] Notifiche push
- [ ] Integrazione WhatsApp Business API
- [ ] Report PDF automatici

## 📄 Licenza

MIT License - vedi file LICENSE per dettagli

## 👥 Supporto

Per domande, bug o feature request:
- Email: [tuo-email@example.com]
- Issues: [GitHub Issues]

## 🙏 Credits

Sviluppato con ❤️ per ottimizzare il matching badanti-famiglie e accelerare il processo di collocamento.

---

**Versione:** 1.0.0
**Data Rilascio:** Ottobre 2025
**Ultimo Aggiornamento:** 01/10/2025
