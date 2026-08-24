// Dashboard — grafik yang bicara, minimal narasi.
// Struktur: Stats kunci → Charts besar → Case cards → Photo evidence → Activity log

import { overview, cases, villages, deforestationTrend, potentialMills, pods, investigationTimeline, fieldEvidence } from '../data/reportData.js';
import DeforestationTrendChart from './charts/DeforestationTrendChart.jsx';
import VillageComparisonChart from './charts/VillageComparisonChart.jsx';
import MillDistanceChart from './charts/MillDistanceChart.jsx';

// ─── Mini components ───────────────────────────────────────────────

function KPI({ value, label, sub, danger }) {
  return (
    <div className={`kpi ${danger ? 'kpi--danger' : ''}`}>
      <div className="kpi__value">{value}</div>
      <div className="kpi__label">{label}</div>
      {sub && <div className="kpi__sub">{sub}</div>}
    </div>
  );
}

function ChartCard({ title, eyebrow, children, wide }) {
  return (
    <div className={`dash-card ${wide ? 'dash-card--wide' : ''}`}>
      {eyebrow && <div className="dash-card__eyebrow">{eyebrow}</div>}
      <div className="dash-card__title">{title}</div>
      <div className="dash-card__body">{children}</div>
    </div>
  );
}

const TYPE_COLOR = { DRONE: '#7ed957', GROUND: '#e0c14d', '360°': '#4d8fe0' };

function PhotoGrid({ items }) {
  return (
    <div className="photo-grid">
      {items.map((p, i) => (
        <div key={i} className="photo-grid__item">
          <img
            src={p.src}
            alt={p.caption}
            className="photo-grid__img"
            loading="lazy"
            onError={(e) => { e.target.style.display = 'none'; e.target.parentNode.classList.add('photo-grid__item--missing'); }}
          />
          <div className="photo-grid__meta">
            <span className="photo-grid__badge" style={{ '--badge-color': TYPE_COLOR[p.type] || '#7ed957' }}>
              {p.type}
            </span>
            <span className="photo-grid__loc">{p.location}</span>
          </div>
          <div className="photo-grid__caption">{p.caption}</div>
        </div>
      ))}
    </div>
  );
}

const TIMELINE_ICON = {
  satellite: '🛰',
  field: '🥾',
  verification: '✓',
  report: '📄',
};

function Timeline({ items }) {
  return (
    <div className="tl">
      {items.map((item, i) => (
        <div key={i} className="tl__item">
          <div className="tl__dot" />
          <div className="tl__content">
            <div className="tl__label">{item.label}</div>
            <div className="tl__meta">
              <span className="tl__date">{item.date}</span>
              <span className="tl__analyst">{item.analyst}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function CaseCard({ c }) {
  return (
    <div className="case-card">
      <div className="case-card__header">
        <span className="case-card__name">{c.name}</span>
        <span className="case-card__year">{c.yearOpened}</span>
      </div>
      <div className="case-card__area">{c.areaHa?.toLocaleString('id-ID')} ha</div>
      <div className="case-card__rows">
        <div className="case-card__row">
          <span>Kawasan</span>
          <span className="case-card__val warn">{c.kawasan}</span>
        </div>
        <div className="case-card__row">
          <span>Dari deforestasi</span>
          <span className="case-card__val">{c.deforestationPercent ? c.deforestationPercent + '%' : '—'}</span>
        </div>
        <div className="case-card__row">
          <span>HGU ditemukan</span>
          <span className="case-card__val danger">{c.hgu ? 'Ada' : 'Tidak'}</span>
        </div>
        <div className="case-card__row">
          <span>Status</span>
          <span className="case-card__val">{c.status}</span>
        </div>
        {c.estimatedHarvestYear && (
          <div className="case-card__row">
            <span>Estimasi panen</span>
            <span className="case-card__val warn">{c.estimatedHarvestYear}</span>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Main dashboard ────────────────────────────────────────────────

export default function DashboardStats() {
  return (
    <div className="dash">

      {/* 1 — KPI STRIP */}
      <div className="kpi-strip">
        <KPI value="3.721 ha" label="Kehilangan hutan" sub="2015 – 2025" />
        <KPI value="22,3%" label="Sawit dalam kawasan hutan" danger />
        <KPI value="592 ha" label="Pembukaan baru" sub="2022 – 2024" />
        <KPI value="0" label="HGU / IUP teridentifikasi" danger />
        <KPI value="5 PoD" label="Pengepul dalam 7,5 km" />
        <KPI value="2027" label="Estimasi panen pertama" sub="Lokasi 3" danger />
      </div>

      {/* 2 — CHARTS 2-COL */}
      <div className="dash-grid dash-grid--2">
        <ChartCard eyebrow="DEFORESTASI" title="Tren kehilangan hutan 2022 – 2025">
          <DeforestationTrendChart />
        </ChartCard>
        <ChartCard eyebrow="EKSPANSI SAWIT" title="Sawit per desa — total vs dalam kawasan">
          <VillageComparisonChart />
        </ChartCard>
      </div>

      {/* 3 — CASE CARDS */}
      <div className="dash-section-label">STUDI KASUS · 3 Lokasi. 1 Pola.</div>
      <div className="dash-grid dash-grid--3">
        {cases.map((c) => <CaseCard key={c.id} c={c} />)}
      </div>

      {/* 4 — SUPPLY CHAIN */}
      <ChartCard eyebrow="RANTAI PASOK" title="Jarak ke 9 Mill/PKS Potensial (km)" wide>
        <MillDistanceChart />
        <div className="pod-chips">
          {pods.map((p) => (
            <div key={p.name} className="pod-chip">
              <span className="pod-chip__name">{p.name}</span>
              <span className="pod-chip__dist">{p.distanceKm} km</span>
            </div>
          ))}
        </div>
        <div className="supply-note">
          ⚠ Berdasarkan wawancara lapangan — WKN dan KSS disebut sebagai tujuan penjualan TBS oleh pemilik PoD
        </div>
      </ChartCard>

      {/* 5 — PHOTO EVIDENCE */}
      <div className="dash-section-label">BUKTI LAPANGAN</div>
      <PhotoGrid items={fieldEvidence} />

      {/* 6 — ACTIVITY LOG */}
      <div className="dash-section-label">TIMELINE INVESTIGASI</div>
      <div className="dash-card">
        <Timeline items={investigationTimeline} />
      </div>

    </div>
  );
}
