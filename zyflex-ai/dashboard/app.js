'use strict';

let zoneChart = null;

// ── Bootstrap ────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  loadDashboard();
  setInterval(loadDashboard, 5 * 60 * 1000); // auto-refresh every 5 min
  setInterval(updateClock, 1000);
  updateClock();
});

function updateClock() {
  const el = document.getElementById('liveClock');
  if (el) el.textContent = new Date().toLocaleTimeString('da-DK', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
}

// ── Main data fetch ───────────────────────────────────────────────
async function loadDashboard() {
  try {
    const res = await fetch('/api/dashboard');
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const d = await res.json();
    renderAll(d);
    document.getElementById('lastUpdated').textContent =
      'Sidst opdateret: ' + new Date().toLocaleTimeString('da-DK', { hour: '2-digit', minute: '2-digit' });
  } catch (err) {
    console.error('Dashboard load failed:', err);
    showError('Kunne ikke hente data. Tjek at serveren kører.');
  }
}

function refresh() { loadDashboard(); }

// ── Render all sections ───────────────────────────────────────────
function renderAll(d) {
  renderKPIs(d.overview);
  renderZones(d.zones, d.overview);
  renderWeather(d.weather);
  renderAgents(d.agents);
  renderAlerts(d.alerts);
  renderEvents(d.events, d.active_events);
  renderLeads(d.leads);
  renderHistory(d.history);
}

// ── KPIs ──────────────────────────────────────────────────────────
function renderKPIs(ov) {
  setText('kpi-demand-val', `${ov.predicted_demand}%`);
  setText('kpi-zone-val', ov.top_zone);
  setText('kpi-earning-val', ov.earning_potential);
  setText('kpi-alerts-val', ov.active_alerts);
  setText('kpi-leads-val', ov.new_leads);
  setText('kpi-context', `${ov.weekday_name} · ${ov.time_label}`);
}

// ── Zone chart + table ────────────────────────────────────────────
function renderZones(zones, ov) {
  const top5 = zones.slice(0, 5);

  // Chart
  const ctx = document.getElementById('zoneChart');
  if (ctx && typeof Chart !== 'undefined') {
    const labels = top5.map(z => z.zone);
    const scores = top5.map(z => z.score);
    const colors = scores.map(s => s >= 70 ? '#34a853' : s >= 50 ? '#1a73e8' : '#f9ab00');

    if (zoneChart) {
      zoneChart.data.labels = labels;
      zoneChart.data.datasets[0].data = scores;
      zoneChart.data.datasets[0].backgroundColor = colors;
      zoneChart.update();
    } else {
      zoneChart = new Chart(ctx, {
        type: 'bar',
        data: {
          labels,
          datasets: [{
            data: scores,
            backgroundColor: colors,
            borderRadius: 6,
            borderSkipped: false,
          }],
        },
        options: {
          indexAxis: 'y',
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            tooltip: {
              callbacks: {
                label: ctx => ` Score: ${ctx.raw}`,
              },
            },
          },
          scales: {
            x: { min: 0, max: 100, grid: { color: '#f1f3f4' }, ticks: { font: { size: 11 } } },
            y: { grid: { display: false }, ticks: { font: { size: 12, weight: '500' } } },
          },
        },
      });
    }
  }

  // Chip for time period
  setText('time-label', ov.time_label);

  // Table (all zones)
  const tbl = document.getElementById('zoneTable');
  if (!tbl) return;
  tbl.innerHTML = zones.slice(0, 8).map(z => {
    const barClass = z.score >= 70 ? 'high' : z.score >= 45 ? 'med' : 'low';
    const eventHtml = z.events && z.events.length
      ? `<span class="zone-event-tag">🎉 ${z.events[0]}</span>`
      : `<span class="zone-no-event">–</span>`;
    return `
      <div class="zone-row">
        <span class="zone-name">${z.zone}</span>
        <div class="zone-bar-wrap"><div class="zone-bar ${barClass}" style="width:${z.score}%"></div></div>
        <span class="zone-score">${z.score}</span>
        ${eventHtml}
      </div>`;
  }).join('');
}

// ── Weather ───────────────────────────────────────────────────────
function renderWeather(w) {
  const box = document.getElementById('weatherBox');
  if (!box) return;
  const icon = weatherIcon(w.weather_code);
  const temp = w.temperature != null ? `${w.temperature}°C` : '–';
  const detail = w.wind_speed != null
    ? `Vind: ${w.wind_speed} km/h · Nedbør: ${w.precipitation || 0} mm`
    : 'Vejrdata utilgængeligt';
  box.innerHTML = `
    <div class="weather-icon">${icon}</div>
    <div>
      <div class="weather-temp">${temp}</div>
      <div class="weather-desc">${w.description}</div>
      <div class="weather-detail">${detail}</div>
    </div>`;
  if (w.demand_boost > 1.0) {
    box.innerHTML += `<span class="chip yellow" style="margin-left:auto">+${Math.round((w.demand_boost-1)*100)}% efterspørgsel</span>`;
  }
}

function weatherIcon(code) {
  if (code === 0) return '☀️';
  if (code <= 3) return '⛅';
  if (code <= 48) return '🌫️';
  if (code <= 67) return '🌧️';
  if (code <= 77) return '❄️';
  if (code <= 82) return '🌦️';
  return '⛈️';
}

// ── Agents ────────────────────────────────────────────────────────
function renderAgents(agents) {
  const list = document.getElementById('agentList');
  if (!list) return;
  list.innerHTML = Object.values(agents).map(a => `
    <div class="agent-row">
      <div class="agent-dot ${a.status === 'ok' ? '' : 'warn'}"></div>
      <div>
        <div class="agent-name">${a.name}</div>
        <div class="agent-result">${a.last_result}</div>
      </div>
    </div>`).join('');
}

// ── Alerts ────────────────────────────────────────────────────────
function renderAlerts(alertList) {
  const section = document.getElementById('alertsSection');
  const list = document.getElementById('alertsList');
  if (!section || !list) return;
  if (!alertList || alertList.length === 0) {
    section.style.display = 'none';
    return;
  }
  section.style.display = '';
  list.innerHTML = alertList.map(a => `
    <div class="alert-item ${a.severity}">
      <div>
        <div class="alert-title">${alertIcon(a.type)} ${a.title}</div>
        <div class="alert-msg">${a.message}</div>
      </div>
    </div>`).join('');
}

function alertIcon(type) {
  const icons = { rush_hour: '🚦', weather: '🌧️', event: '🎉', opportunity: '💰', low_demand: '📉' };
  return icons[type] || '📢';
}

// ── Events ────────────────────────────────────────────────────────
function renderEvents(events, activeEvents) {
  const el = document.getElementById('eventsList');
  if (!el) return;
  if (!events || events.length === 0) {
    el.innerHTML = '<div style="color:#5f6368;font-size:13px;padding:10px 0">Ingen kommende events</div>';
    return;
  }
  const activeNames = (activeEvents || []).map(e => e.name);
  el.innerHTML = `
    <table class="data-table">
      <thead><tr>
        <th>Event</th><th>Zone</th><th>Dato</th><th>Efterspørgsel</th><th>Status</th>
      </tr></thead>
      <tbody>
        ${events.map(e => {
          const isActive = activeNames.includes(e.name);
          const mult = e.demand_multiplier || 1;
          const badge = isActive ? '<span class="badge badge-green">Aktiv nu</span>' : '<span class="badge badge-gray">Kommende</span>';
          return `<tr>
            <td><strong>${e.name}</strong></td>
            <td>${e.zone}</td>
            <td>${formatDate(e.start_date)}${e.end_date !== e.start_date ? ' → ' + formatDate(e.end_date) : ''}</td>
            <td><span class="mult-tag">×${mult} efterspørgsel</span></td>
            <td>${badge}</td>
          </tr>`;
        }).join('')}
      </tbody>
    </table>`;
}

// ── Leads ─────────────────────────────────────────────────────────
function renderLeads(leads) {
  const el = document.getElementById('leadsList');
  if (!el) return;
  if (!leads || leads.length === 0) {
    el.innerHTML = '<div style="color:#5f6368;font-size:13px;padding:10px 0">Ingen leads</div>';
    return;
  }
  el.innerHTML = `
    <table class="data-table">
      <thead><tr>
        <th>Virksomhed</th><th>Type</th><th>Mulighed</th><th>Prioritet</th>
      </tr></thead>
      <tbody>
        ${leads.map(l => `
          <tr>
            <td><strong>${l.name}</strong><br><span style="color:#5f6368;font-size:11px">${l.city}</span></td>
            <td>${l.type}</td>
            <td style="font-size:12px;color:#5f6368">${l.opportunity}</td>
            <td>${priorityBadge(l.status)}</td>
          </tr>`).join('')}
      </tbody>
    </table>`;
}

function priorityBadge(status) {
  const map = {
    'Kritisk': 'badge-red',
    'Høj': 'badge-orange',
    'Medium': 'badge-blue',
    'Lav': 'badge-gray',
  };
  return `<span class="badge ${map[status] || 'badge-gray'}">${status}</span>`;
}

// ── History ───────────────────────────────────────────────────────
function renderHistory(h) {
  const el = document.getElementById('historySection');
  if (!el) return;
  if (!h || h.total_trips === 0) {
    el.innerHTML = '<div style="color:#5f6368;font-size:13px">Ingen historik endnu. Tilføj ture i data/trips.csv</div>';
    return;
  }
  const bestHour = h.best_hours.length ? `${h.best_hours[0].hour}:00` : '–';
  const bestZone = h.best_zones.length ? h.best_zones[0].zone : '–';
  el.innerHTML = `
    <div class="history-grid">
      <div class="history-stat">
        <div class="history-stat-val">${h.total_trips}</div>
        <div class="history-stat-label">Registrerede ture</div>
      </div>
      <div class="history-stat">
        <div class="history-stat-val">${h.avg_fare_dkk} kr</div>
        <div class="history-stat-label">Gennemsnitlig tur-pris</div>
      </div>
      <div class="history-stat">
        <div class="history-stat-val">${bestHour}</div>
        <div class="history-stat-label">Bedste time historisk</div>
      </div>
    </div>
    <div style="margin-top:16px">
      <div style="font-size:12px;font-weight:600;color:#5f6368;text-transform:uppercase;letter-spacing:.4px;margin-bottom:10px">Bedste zoner historisk</div>
      ${h.best_zones.map(z => `
        <div class="zone-history-row">
          <span>${z.zone}</span>
          <span style="color:#5f6368">${z.trips} ture
          ${h.zone_avg_fares[z.zone] ? `· gns. ${h.zone_avg_fares[z.zone]} kr` : ''}</span>
        </div>`).join('')}
    </div>`;
}

// ── Helpers ───────────────────────────────────────────────────────
function setText(id, value) {
  const el = document.getElementById(id);
  if (el) el.textContent = value ?? '–';
}

function formatDate(iso) {
  if (!iso) return '';
  const [y, m, d] = iso.split('-');
  return `${d}/${m}`;
}

function showError(msg) {
  const main = document.querySelector('.main');
  if (!main) return;
  const existing = document.getElementById('errorBanner');
  if (existing) existing.remove();
  const div = document.createElement('div');
  div.id = 'errorBanner';
  div.className = 'error-banner';
  div.textContent = '⚠️ ' + msg;
  main.prepend(div);
}
