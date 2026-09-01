// Dashboard — grafik yang bicara, minimal narasi.
// Struktur: Stats kunci → Charts besar → Case cards → Photo evidence

import { overview, cases, villages, deforestationTrend, potentialMills, pods, fieldEvidence } from '../data/reportData.js';
import DeforestationTrendChart from './charts/DeforestationTrendChart.jsx';
import VillageComparisonChart from './charts/VillageComparisonChart.jsx';
import MillDistanceChart from './charts/MillDistanceChart.jsx';
import PhotoGrid from './PhotoGrid.jsx';
import useAnimatedNumber from '../hooks/useAnimatedNumber.js';
import useInView from '../hooks/useInView.js';

// ─── Mini components ───────────────────────────────────────────────

// KPI dianimasikan sekali begitu strip-nya masuk viewport (bukan langsung
// di page load, waktu section-nya sendiri belum kelihatan) — lihat
// useAnimatedNumber.js untuk cara parsing "3.721 ha" / "22,3%" dst.
function KPI({ value, label, sub, danger, active }) {
  const display = useAnimatedNumber(value, active);
  return (
    <div className={`kpi ${danger ? 'kpi--danger' : ''}`}>
      <div className="kpi__value">{display}</div>
      <div className="kpi__label">{label}</div>
      {sub && <div className="kpi__sub">{sub}</div>}
    </div>
  );
}

// Grup KPI (strip) di-observe SEKALI di sini, bukan per-item, supaya
// semua angka dalam satu strip mulai menghitung bersamaan.
function KpiStrip({ items }) {
  const { ref, inView } = useInView();
  return (
    <div className="kpi-strip" ref={ref}>
      {items.map((item) => (
        <KPI key={item.label} {...item} active={inView} />
      ))}
    </div>
  );
}

// Chart di-remount (key berubah) begitu kartunya masuk viewport, supaya
// animasi masuk Recharts (isAnimationActive, sudah ada di tiap chart)
// benar-benar terpicu pas discroll ke situ — sebelumnya animasi cuma
// jalan sekali di page load, sering kelewat kalau chart-nya di bawah lipatan.
function ChartCard({ title, eyebrow, children, wide }) {
  const { ref, inView } = useInView();
  return (
    <div className={`dash-card ${wide ? 'dash-card--wide' : ''}`} ref={ref}>
      {eyebrow && <div className="dash-card__eyebrow">{eyebrow}</div>}
      <div className="dash-card__title">{title}</div>
      <div className="dash-card__body">{inView ? children : null}</div>
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
          <span className="case-card__val">{c.deforestationPercent ? c.deforestationPercent.toString().replace('.', ',') + '%' : '—'}</span>
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

      {/* 1 — KPI STRIP, dipecah 2 kelompok — SEBELUMNYA semua angka
          ditumpuk jadi satu strip tanpa pembeda, padahal beberapa angka
          itu untuk SELURUH KECAMATAN (hutan hilang, sawit dalam kawasan)
          dan beberapa lainnya cuma untuk 3 LOKASI STUDI KASUS (luas
          pembukaan, HGU/IUP, PoD, estimasi panen) — audience gampang
          salah kira semuanya bicara skala yang sama. */}
      <div className="dash-kpi-group-label">Kecamatan Sajingan Besar (139.120 ha)</div>
      <KpiStrip items={[
        { value: '3.721 ha', label: 'Kehilangan hutan', sub: '2015 – 2025' },
        { value: '22,3%', label: 'Sawit dalam kawasan hutan', danger: true },
      ]} />

      <div className="dash-kpi-group-label">3 Lokasi Studi Kasus (628 ha)</div>
      <KpiStrip items={[
        { value: '628 ha', label: 'Total pembukaan 3 lokasi', sub: '2022 – 2025' },
        { value: '5 PoD', label: 'Pengepul dalam 7,5 km' },
        { value: '2027', label: 'Estimasi panen pertama', sub: 'Lokasi 3', danger: true },
      ]} />

      {/* 2 — CHARTS 2-COL (data level KECAMATAN, bukan 3 lokasi kasus) */}
      <div className="dash-grid dash-grid--2">
        <ChartCard eyebrow="DEFORESTASI · SAJINGAN BESAR" title="Tren kehilangan hutan 2022 – 2025">
          <DeforestationTrendChart />
        </ChartCard>
        <ChartCard eyebrow="EKSPANSI SAWIT · SAJINGAN BESAR" title="Sawit per desa — total vs dalam kawasan">
          <VillageComparisonChart />
        </ChartCard>
      </div>

      {/* 3 — CASE CARDS (data level 3 LOKASI KASUS) */}
      <div className="dash-section-label">STUDI KASUS · 3 Lokasi. 1 Pola. (628 ha)</div>
      <div className="dash-grid dash-grid--3">
        {cases.map((c) => <CaseCard key={c.id} c={c} />)}
      </div>

      {/* 4 — SUPPLY CHAIN (dari 3 lokasi kasus ke mill terdekat) */}
      <ChartCard eyebrow="RANTAI PASOK · DARI 3 LOKASI" title="Jarak ke 9 Mill/PKS Potensial (km)" wide>
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

      {/* 5 — PHOTO EVIDENCE, full-width (Timeline dihapus) */}
      <div className="dash-section-label">BUKTI LAPANGAN</div>
      <PhotoGrid items={fieldEvidence} />

    </div>
  );
}
