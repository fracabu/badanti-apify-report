# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Badanti Matcher is a caregivers (badanti) and families matching system with an automatic demand/supply matching algorithm. It's a complete CRM for managing caregivers, job offers, and matches between them.

**Tech Stack:**
- Backend: Node.js + Express 4.x
- Database: SQLite 3 (better-sqlite3) - single file database
- Frontend: Vanilla JavaScript + Bootstrap 5.3
- No build step required

## Common Commands

### Development
```bash
# Start server (development or production)
npm start
# or
npm run dev

# Server runs on http://localhost:3000
```

### Database Management
```bash
# Initialize database with 10 premium caregivers + 5 job offers + 3 agencies
node scripts/import-data.js
# or
npm run build

# Add 34 additional caregivers (44 total)
node scripts/add-more-badanti.js

# Database file location: ./badanti.db
```

### Database Backup/Reset
```bash
# Backup database
copy badanti.db badanti_backup_%date%.db  # Windows
cp badanti.db badanti_backup_$(date +%Y%m%d).db  # Linux/Mac

# Reset database
del badanti.db  # Windows
rm badanti.db   # Linux/Mac
node scripts/import-data.js
```

## Architecture

### Core Components

**database.js** - Database schema and initialization
- Creates 5 tables: badanti, offerte, matches, contatti, agenzie
- Auto-creates SQLite database file on first run
- Defines indexes for performance on zona, stato, score fields
- Exports a single database connection instance

**server.js** - Express REST API server
- All API endpoints in a single file (no routing separation)
- Port: 3000 (can be overridden via PORT env var)
- Uses synchronous better-sqlite3 queries (`.all()`, `.get()`, `.run()`)
- CORS enabled for all origins
- Uses body-parser for JSON request parsing

**public/index.html** - Single-page application
- All frontend code in one HTML file (HTML + CSS + JS)
- Uses Bootstrap 5.3 for UI and Bootstrap Icons
- Vanilla JavaScript (no framework)
- Makes fetch() calls to API endpoints
- Tab-based navigation with sections: Dashboard, Badanti, Offerte, Matches, Contatti, Agenzie
- Responsive navbar with logo, hamburger menu, and user dropdown

### Database Schema

**badanti** (caregivers) - Main entity
- Core fields: nome, telefono, whatsapp, email
- Location: zona (city/area), regione (region)
- Skills: esperienza_anni, qualifica, specializzazioni
- Status tracking: stato_contatto, priorita (MASSIMA/ALTA/MEDIA), rating (1-5)
- Service type: tipo_servizio (H24, Part-time, Diurno)

**offerte** (job offers)
- Details: titolo, azienda, zona, tipo_contratto
- Compensation: stipendio_min, stipendio_max
- Requirements: tipo_servizio, requisiti
- Status: stato (ATTIVA/CHIUSA), urgenza (ALTA/MEDIA/BASSA)

**matches** - Junction table linking badanti to offerte
- Foreign keys: badante_id, offerta_id
- Scoring: score_compatibilita (0-100), motivo_match
- Workflow: stato (PROPOSTO → ACCETTATO → RIFIUTATO → ASSUNTO)

**contatti** (contact log)
- Polymorphic: tracks contacts for any riferimento_tipo (badante/offerta)
- Types: tipo (Telefonata, WhatsApp, Email)
- Follow-up: prossima_azione, data_prossima_azione

**agenzie** (partner agencies) - Reference data

### Matching Algorithm

Located in `/api/auto-match/:offerta_id` endpoint (server.js:148-233)

**Scoring system (0-100 points):**
- Zona compatibility: 30 points (exact) or 15 points (same region)
- Tipo servizio match: 25 points (H24, Part-time, or Diurno)
- Experience: 20 points (15+ years) or 10 points (5+ years)
- OSS qualification: 15 points
- Driver's license (if required): 10 points
- Bonuses: +5 each for MASSIMA priority, urgent availability, references, valid documents

**Minimum score:** 40 points (below this, match is rejected)
**Returns:** Top 10 matches sorted by score descending

## Key Workflows

### Adding New Caregivers
Currently done via scripts (scripts/import-data.js pattern). Web UI for adding caregivers is planned for v1.1.

### Contact Tracking
1. POST to /api/contatti with tipo, riferimento_id, riferimento_tipo, esito, note
2. Automatically updates badanti.data_ultimo_contatto if riferimento_tipo='badante'

### Creating Matches
**Automatic:** POST /api/auto-match/:offerta_id → returns scored candidates → user selects → POST /api/matches
**Manual:** Direct POST /api/matches with badante_id, offerta_id, score, motivo

## Important Notes

- Database is a single SQLite file - no migrations system
- All queries are synchronous (better-sqlite3 design)
- No authentication/authorization system (single operator assumed)
- Italian language used throughout (UI, field names, values)
- Phone numbers formatted as Italian mobile (3XX.XXX.XXXX)
- Click-to-call functionality uses tel: links (requires proper browser/OS setup)
- Static files served from `public/` directory via express.static
- Single-page application with tab-based navigation (no URL routing)
- SQLite dates stored as TEXT with CURRENT_TIMESTAMP
- Date queries use SQLite date functions: DATE('now'), DATE(field)

## Full API Reference

### Badanti
```
GET    /api/badanti              # List caregivers (filters: zona, priorita, stato, search)
GET    /api/badanti/:id          # Get caregiver details + contact history
PUT    /api/badanti/:id          # Update caregiver (stato_contatto, note, data_ultimo_contatto)
```

### Offerte
```
GET    /api/offerte              # List job offers (filters: zona, stato)
GET    /api/offerte/:id          # Get job offer details
```

### Matches
```
GET    /api/matches              # List all matches with joined badante/offerta details
POST   /api/matches              # Create manual match (badante_id, offerta_id, score, motivo)
PUT    /api/matches/:id          # Update match status
DELETE /api/matches/:id          # Delete match
POST   /api/auto-match/:offerta_id  # Get top 10 automatic matches for an offer
```

### Contatti
```
GET    /api/contatti             # List contacts (filters: riferimento_id, riferimento_tipo)
POST   /api/contatti             # Log contact (auto-updates badanti.data_ultimo_contatto)
```

### Agenzie & Stats
```
GET    /api/agenzie              # List partner agencies
GET    /api/stats                # Dashboard KPIs (counts by status, today's contacts)
```
