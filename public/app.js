// Use relative URL so it works both locally and on Render
const API_URL = '/api';

let currentBadanti = [];
let currentOfferte = [];

// ========== INIT ==========
document.addEventListener('DOMContentLoaded', () => {
    loadStats();
    loadBadanti();
    loadOfferte();
    loadMatches();
    loadAgenzie();

    // Search badanti
    document.getElementById('searchBadanti').addEventListener('input', (e) => {
        const search = e.target.value.toLowerCase();
        const filtered = currentBadanti.filter(b =>
            b.nome.toLowerCase().includes(search) ||
            (b.telefono && b.telefono.includes(search)) ||
            (b.zona && b.zona.toLowerCase().includes(search))
        );
        renderBadanti(filtered);
    });

    // Close navbar on mobile after clicking a link
    const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
    const navbarCollapse = document.getElementById('navbarNav');

    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (navbarCollapse.classList.contains('show')) {
                const bsCollapse = new bootstrap.Collapse(navbarCollapse, {
                    toggle: false
                });
                bsCollapse.hide();
            }
        });
    });
});

// ========== STATS ==========
async function loadStats() {
    try {
        const res = await fetch(`${API_URL}/stats`);
        const stats = await res.json();

        document.getElementById('stat-badanti-totali').textContent = stats.badanti_totali;
        document.getElementById('stat-da-contattare').textContent = stats.badanti_da_contattare;
        document.getElementById('stat-offerte').textContent = stats.offerte_attive;
        document.getElementById('stat-matches').textContent = stats.matches_proposti;
    } catch (err) {
        console.error('Errore caricamento stats:', err);
    }
}

// ========== BADANTI ==========
async function loadBadanti(filters = {}) {
    try {
        const params = new URLSearchParams(filters);
        const res = await fetch(`${API_URL}/badanti?${params}`);
        currentBadanti = await res.json();
        renderBadanti(currentBadanti);
        populateCittaFilter();
    } catch (err) {
        console.error('Errore caricamento badanti:', err);
    }
}

function populateCittaFilter() {
    const citta = [...new Set(currentBadanti.map(b => b.zona).filter(z => z))].sort();
    const select = document.getElementById('filterCitta');

    // Mantieni l'opzione "Tutte le città" e aggiungi le città
    const currentValue = select.value;
    select.innerHTML = '<option value="">🌍 Tutte le città</option>' +
        citta.map(c => `<option value="${c}">${c}</option>`).join('');
    select.value = currentValue;
}

function renderBadanti(badanti) {
    const tbody = document.getElementById('badantiTableBody');

    if (badanti.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" class="text-center">Nessuna badante trovata</td></tr>';
        return;
    }

    tbody.innerHTML = badanti.map(b => `
        <tr>
            <td>
                <span class="priority-indicator priority-${b.priorita.toLowerCase()}"></span>
                <strong>${b.nome}</strong>
                ${b.nazionalita ? `<br><small class="text-muted">${b.nazionalita}</small>` : ''}
            </td>
            <td>
                ${b.telefono ? `
                    <a href="tel:${b.telefono}" class="btn btn-sm btn-call">
                        <i class="bi bi-telephone"></i> ${b.telefono}
                    </a>
                ` : '<span class="text-muted">N/D</span>'}
                ${b.whatsapp ? `<br><small><i class="bi bi-whatsapp text-success"></i> WhatsApp</small>` : ''}
            </td>
            <td>
                ${b.zona || 'N/D'}
                ${b.regione ? `<br><small class="text-muted">${b.regione}</small>` : ''}
            </td>
            <td>
                ${b.esperienza_anni ? `${b.esperienza_anni} anni` : 'N/D'}
                ${b.qualifica ? `<br><span class="badge bg-success">${b.qualifica}</span>` : ''}
            </td>
            <td>
                <span class="badge-priority badge-${b.priorita.toLowerCase()}">${b.priorita}</span>
            </td>
            <td>
                <span class="badge bg-${getStatoBadgeColor(b.stato_contatto)}">${b.stato_contatto}</span>
            </td>
            <td>
                <button class="btn btn-sm btn-primary" onclick="viewBadante(${b.id})">
                    <i class="bi bi-eye"></i> Dettagli
                </button>
            </td>
        </tr>
    `).join('');
}

function getStatoBadgeColor(stato) {
    const colors = {
        'Da contattare': 'warning',
        'Contattata': 'info',
        'Interessata': 'success',
        'Non interessata': 'secondary',
        'Assunta': 'primary',
        'Non disponibile': 'danger'
    };
    return colors[stato] || 'secondary';
}

function filterBadanti(filter) {
    // Reset filtro città quando si usa filtro priorità/stato
    document.getElementById('filterCitta').value = '';

    if (filter === 'all') {
        renderBadanti(currentBadanti);
    } else if (['MASSIMA', 'ALTA', 'MEDIA'].includes(filter)) {
        const filtered = currentBadanti.filter(b => b.priorita === filter);
        renderBadanti(filtered);
    } else {
        const filtered = currentBadanti.filter(b => b.stato_contatto === filter);
        renderBadanti(filtered);
    }
}

function filterByCitta() {
    const citta = document.getElementById('filterCitta').value;

    if (!citta) {
        renderBadanti(currentBadanti);
    } else {
        const filtered = currentBadanti.filter(b => b.zona === citta);
        renderBadanti(filtered);
    }
}

async function viewBadante(id) {
    try {
        const res = await fetch(`${API_URL}/badanti/${id}`);
        const badante = await res.json();

        const modalBody = document.getElementById('badanteModalBody');
        modalBody.innerHTML = `
            <div class="row">
                <div class="col-md-6">
                    <h6><i class="bi bi-person"></i> Informazioni Personali</h6>
                    <table class="table table-sm">
                        <tr><td><strong>Nome:</strong></td><td>${badante.nome}</td></tr>
                        <tr><td><strong>Età:</strong></td><td>${badante.eta || 'N/D'}</td></tr>
                        <tr><td><strong>Nazionalità:</strong></td><td>${badante.nazionalita || 'N/D'}</td></tr>
                        <tr><td><strong>Cittadinanza:</strong></td><td>${badante.cittadinanza || 'N/D'}</td></tr>
                        <tr><td><strong>Telefono:</strong></td><td>${badante.telefono || 'N/D'}</td></tr>
                        <tr><td><strong>WhatsApp:</strong></td><td>${badante.whatsapp ? '✅' : '❌'}</td></tr>
                        <tr><td><strong>Email:</strong></td><td>${badante.email || 'N/D'}</td></tr>
                    </table>
                </div>
                <div class="col-md-6">
                    <h6><i class="bi bi-briefcase"></i> Esperienza e Qualifiche</h6>
                    <table class="table table-sm">
                        <tr><td><strong>Esperienza:</strong></td><td>${badante.esperienza_anni || 'N/D'} anni</td></tr>
                        <tr><td><strong>Qualifica:</strong></td><td>${badante.qualifica || 'N/D'}</td></tr>
                        <tr><td><strong>Zona:</strong></td><td>${badante.zona || 'N/D'}</td></tr>
                        <tr><td><strong>Regione:</strong></td><td>${badante.regione || 'N/D'}</td></tr>
                        <tr><td><strong>Automunita:</strong></td><td>${badante.automunita ? '✅' : '❌'}</td></tr>
                        <tr><td><strong>Referenze:</strong></td><td>${badante.referenze ? '✅' : '❌'}</td></tr>
                        <tr><td><strong>Documenti OK:</strong></td><td>${badante.documenti_regola ? '✅' : '❌'}</td></tr>
                    </table>
                </div>
            </div>

            ${badante.specializzazioni ? `
                <div class="alert alert-info">
                    <strong><i class="bi bi-star"></i> Specializzazioni:</strong><br>
                    ${badante.specializzazioni}
                </div>
            ` : ''}

            ${badante.tipo_servizio ? `
                <div class="alert alert-primary">
                    <strong><i class="bi bi-clock"></i> Tipo Servizio:</strong><br>
                    ${badante.tipo_servizio}
                </div>
            ` : ''}

            ${badante.note ? `
                <div class="alert alert-warning">
                    <strong><i class="bi bi-clipboard"></i> Note:</strong><br>
                    ${badante.note}
                </div>
            ` : ''}

            <hr>

            <h6><i class="bi bi-chat-dots"></i> Registra Contatto</h6>
            <form onsubmit="saveContatto(event, ${badante.id}, 'badante')">
                <div class="row">
                    <div class="col-md-4">
                        <label class="form-label">Tipo</label>
                        <select class="form-select" name="tipo" required>
                            <option value="Telefonata">Telefonata</option>
                            <option value="WhatsApp">WhatsApp</option>
                            <option value="Email">Email</option>
                        </select>
                    </div>
                    <div class="col-md-4">
                        <label class="form-label">Esito</label>
                        <select class="form-select" name="esito" required>
                            <option value="Risposto">Risposto</option>
                            <option value="Non risposto">Non risposto</option>
                            <option value="Interessata">Interessata</option>
                            <option value="Non interessata">Non interessata</option>
                            <option value="Richiamare">Richiamare</option>
                        </select>
                    </div>
                    <div class="col-md-4">
                        <label class="form-label">Stato Badante</label>
                        <select class="form-select" name="stato_contatto" required>
                            <option value="Da contattare" ${badante.stato_contatto === 'Da contattare' ? 'selected' : ''}>Da contattare</option>
                            <option value="Contattata" ${badante.stato_contatto === 'Contattata' ? 'selected' : ''}>Contattata</option>
                            <option value="Interessata" ${badante.stato_contatto === 'Interessata' ? 'selected' : ''}>Interessata</option>
                            <option value="Non interessata" ${badante.stato_contatto === 'Non interessata' ? 'selected' : ''}>Non interessata</option>
                            <option value="Assunta" ${badante.stato_contatto === 'Assunta' ? 'selected' : ''}>Assunta</option>
                            <option value="Non disponibile" ${badante.stato_contatto === 'Non disponibile' ? 'selected' : ''}>Non disponibile</option>
                        </select>
                    </div>
                </div>
                <div class="mt-3">
                    <label class="form-label">Note Contatto</label>
                    <textarea class="form-control" name="note" rows="3"></textarea>
                </div>
                <div class="mt-3">
                    <button type="submit" class="btn btn-success">
                        <i class="bi bi-save"></i> Salva Contatto
                    </button>
                </div>
            </form>

            ${badante.contatti && badante.contatti.length > 0 ? `
                <hr>
                <h6><i class="bi bi-clock-history"></i> Storico Contatti</h6>
                ${badante.contatti.map(c => `
                    <div class="contact-log">
                        <strong>${c.tipo}</strong> - ${new Date(c.data_ora).toLocaleString('it-IT')}
                        <br>
                        <span class="badge bg-info">${c.esito}</span>
                        ${c.note ? `<br><small>${c.note}</small>` : ''}
                    </div>
                `).join('')}
            ` : ''}
        `;

        new bootstrap.Modal(document.getElementById('badanteModal')).show();
    } catch (err) {
        console.error('Errore caricamento dettaglio:', err);
        alert('Errore nel caricamento dei dettagli');
    }
}

async function saveContatto(event, riferimento_id, riferimento_tipo) {
    event.preventDefault();
    const form = event.target;
    const formData = new FormData(form);

    const data = {
        tipo: formData.get('tipo'),
        esito: formData.get('esito'),
        note: formData.get('note'),
        riferimento_id,
        riferimento_tipo,
        operatore: 'Operatore', // TODO: get from session
        data_ora: new Date().toISOString()
    };

    try {
        await fetch(`${API_URL}/contatti`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

        // Aggiorna stato badante
        if (riferimento_tipo === 'badante') {
            await fetch(`${API_URL}/badanti/${riferimento_id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    stato_contatto: formData.get('stato_contatto'),
                    data_ultimo_contatto: new Date().toISOString()
                })
            });
        }

        alert('✅ Contatto salvato con successo!');
        bootstrap.Modal.getInstance(document.getElementById('badanteModal')).hide();
        loadBadanti();
        loadStats();
    } catch (err) {
        console.error('Errore salvataggio contatto:', err);
        alert('❌ Errore nel salvataggio');
    }
}

// ========== OFFERTE ==========
async function loadOfferte() {
    try {
        const res = await fetch(`${API_URL}/offerte`);
        currentOfferte = await res.json();
        renderOfferte(currentOfferte);
    } catch (err) {
        console.error('Errore caricamento offerte:', err);
    }
}

function renderOfferte(offerte) {
    const tbody = document.getElementById('offerteTableBody');

    if (offerte.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" class="text-center">Nessuna offerta trovata</td></tr>';
        return;
    }

    tbody.innerHTML = offerte.map(o => `
        <tr>
            <td>
                <strong>${o.titolo}</strong>
                ${o.tipo_servizio ? `<br><small class="text-muted">${o.tipo_servizio}</small>` : ''}
            </td>
            <td>${o.azienda || 'N/D'}</td>
            <td>${o.zona}</td>
            <td>
                ${o.stipendio_min && o.stipendio_max ?
                    `€${o.stipendio_min}-${o.stipendio_max}/mese` :
                    'Da concordare'}
            </td>
            <td>
                <span class="badge bg-${o.urgenza === 'ALTA' ? 'danger' : 'warning'}">${o.urgenza}</span>
            </td>
            <td>
                <button class="btn btn-sm btn-success" onclick="findMatches(${o.id})">
                    <i class="bi bi-search-heart"></i> Trova Match
                </button>
            </td>
        </tr>
    `).join('');
}

async function findMatches(offertaId) {
    try {
        const res = await fetch(`${API_URL}/auto-match/${offertaId}`, { method: 'POST' });
        const matches = await res.json();

        const offerta = currentOfferte.find(o => o.id === offertaId);

        const modalBody = document.getElementById('matchModalBody');
        modalBody.innerHTML = `
            <h5>Match per: ${offerta.titolo}</h5>
            <p class="text-muted">${offerta.zona} - ${offerta.tipo_servizio}</p>
            <hr>

            ${matches.length === 0 ? '<p class="text-center">Nessun match trovato</p>' : ''}

            <div class="row">
                ${matches.map(m => `
                    <div class="col-md-6 mb-3">
                        <div class="card">
                            <div class="card-body">
                                <div class="d-flex justify-content-between">
                                    <h6>${m.badante_nome}</h6>
                                    <span class="match-score">${m.score}%</span>
                                </div>
                                <p class="text-muted mb-2">
                                    <i class="bi bi-telephone"></i> ${m.badante_telefono || 'N/D'}
                                </p>
                                <p class="small">${m.motivo}</p>
                                <button class="btn btn-sm btn-primary" onclick="createMatch(${m.badante_id}, ${offertaId}, ${m.score}, '${m.motivo}')">
                                    <i class="bi bi-check-circle"></i> Crea Match
                                </button>
                            </div>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;

        new bootstrap.Modal(document.getElementById('matchModal')).show();
    } catch (err) {
        console.error('Errore ricerca match:', err);
        alert('Errore nella ricerca dei match');
    }
}

async function createMatch(badanteId, offertaId, score, motivo) {
    try {
        await fetch(`${API_URL}/matches`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                badante_id: badanteId,
                offerta_id: offertaId,
                score_compatibilita: score,
                motivo_match: motivo
            })
        });

        alert('✅ Match creato con successo!');
        loadMatches();
        loadStats();
        bootstrap.Modal.getInstance(document.getElementById('matchModal')).hide();
    } catch (err) {
        console.error('Errore creazione match:', err);
        alert('❌ Errore nella creazione del match');
    }
}

// ========== MATCHES ==========
async function loadMatches() {
    try {
        const res = await fetch(`${API_URL}/matches`);
        const matches = await res.json();
        renderMatches(matches);
    } catch (err) {
        console.error('Errore caricamento matches:', err);
    }
}

async function deleteMatch(matchId) {
    if (!confirm('Sei sicuro di voler eliminare questo match?')) {
        return;
    }

    try {
        await fetch(`${API_URL}/matches/${matchId}`, {
            method: 'DELETE'
        });
        alert('✅ Match eliminato con successo!');
        loadMatches();
        loadStats();
    } catch (err) {
        console.error('Errore eliminazione match:', err);
        alert('❌ Errore nell\'eliminazione del match');
    }
}

function renderMatches(matches) {
    const container = document.getElementById('matchesContainer');

    if (matches.length === 0) {
        container.innerHTML = '<p class="text-center">Nessun match trovato</p>';
        return;
    }

    container.innerHTML = matches.map(m => `
        <div class="card mb-3">
            <div class="card-body">
                <div class="row align-items-center">
                    <div class="col-md-3">
                        <h6><i class="bi bi-person"></i> ${m.badante_nome}</h6>
                        <small class="text-muted">${m.badante_telefono || 'N/D'}</small><br>
                        <small class="text-muted">${m.badante_zona || 'N/D'}</small>
                    </div>
                    <div class="col-md-1 text-center">
                        <h3><i class="bi bi-arrow-left-right"></i></h3>
                        <span class="match-score">${m.score_compatibilita}%</span>
                    </div>
                    <div class="col-md-4">
                        <h6><i class="bi bi-briefcase"></i> ${m.offerta_titolo}</h6>
                        <small class="text-muted">${m.offerta_azienda || ''}</small><br>
                        <small class="text-muted">${m.offerta_zona}</small>
                    </div>
                    <div class="col-md-3">
                        <span class="badge bg-${m.stato === 'PROPOSTO' ? 'warning' : 'success'} mb-2">${m.stato}</span>
                        <br>
                        <small>${m.motivo_match}</small>
                    </div>
                    <div class="col-md-1 text-end">
                        <button class="btn btn-sm btn-danger" onclick="deleteMatch(${m.id})" title="Elimina match">
                            <i class="bi bi-trash"></i>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `).join('');
}

// ========== AGENZIE ==========
async function loadAgenzie() {
    try {
        const res = await fetch(`${API_URL}/agenzie`);
        const agenzie = await res.json();
        renderAgenzie(agenzie);
    } catch (err) {
        console.error('Errore caricamento agenzie:', err);
    }
}

function renderAgenzie(agenzie) {
    const tbody = document.getElementById('agenzieTableBody');

    if (agenzie.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" class="text-center">Nessuna agenzia trovata</td></tr>';
        return;
    }

    tbody.innerHTML = agenzie.map(a => `
        <tr>
            <td><strong>${a.nome}</strong></td>
            <td>
                ${a.telefono ? `
                    <a href="tel:${a.telefono}" class="btn btn-sm btn-call">
                        <i class="bi bi-telephone"></i> ${a.telefono}
                    </a>
                ` : 'N/D'}
            </td>
            <td>${a.contatto_referente || 'N/D'}</td>
            <td>${a.zone_copertura || 'N/D'}</td>
            <td>
                <small>${a.servizi || 'N/D'}</small>
                ${a.specializzazioni ? `<br><span class="badge bg-info">${a.specializzazioni}</span>` : ''}
            </td>
        </tr>
    `).join('');
}
