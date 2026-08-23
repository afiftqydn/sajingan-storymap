// src/components/DashboardStats.jsx
// Dashboard lengkap — cukup buka tab ini saja untuk paham seluruh temuan investigasi.
// Struktur: Temuan Kunci → Hutan & Deforestasi → Ekspansi Sawit → Studi Kasus → Rantai Pasok → Rekomendasi

import { overview, cases, villages, deforestationTrend, potentialMills, pods } from '../data/reportData.js';
import DeforestationTrendChart from './charts/DeforestationTrendChart.jsx';
import VillageComparisonChart from './charts/VillageComparisonChart.jsx';
import MillDistanceChart from './charts/MillDistanceChart.jsx';

function N(v, suffix = '') {
  return v === null || v === undefined ? '—' : `${typeof v === 'number' ? v.toLocaleString('id-ID') : v}${suffix}`;
}

function StatCard({ value, label, accent }) {
  return (
    <div className={`db-card ${accent ? 'db-card--accent' : ''}`}>
      <div className="db-card__value">{value}</div>
      <div className="db-card__label">{label}</div>
    </div>
  );
}

function SectionTitle({ label, title }) {
  return (
    <div className="db-section-title">
      <span className="db-section-title__label">{label}</span>
      <h2 className="db-section-title__h">{title}</h2>
    </div>
  );
}

export default function DashboardStats() {
  return (
    <div className="db">

      {/* ─── 1. TEMUAN KUNCI ─── */}
      <section className="db-section">
        <SectionTitle label="RINGKASAN EKSEKUTIF" title="Temuan Kunci" />
        <div className="db-cards">
          <StatCard value="3.721,81 ha" label="Kehilangan hutan 2015–2025" accent />
          <StatCard value="22,3%" label="Sawit dalam kawasan hutan" accent />
          <StatCard value="592 ha" label="Pembukaan baru 2022–2024 (Sanatab & Kaliau')" />
          <StatCard value="0 HGU / IUP" label="Izin teridentifikasi di 3 lokasi" accent />
          <StatCard value="TBM" label="Status seluruh tanaman — belum menghasilkan" />
          <StatCard value="2027" label="Perkiraan panen pertama (Lokasi 3)" accent />
        </div>
        <p className="db-callout">
          Sajingan Besar merupakan wilayah hulu di Kabupaten Sambas yang memiliki fungsi penting bagi lanskap sekitarnya.
          Tiga hamparan berskala besar ditemukan dalam kawasan HPT tanpa izin resmi — dengan penguasaan lahan terindikasi
          oleh pemilik modal (cukong), bukan petani kecil. Ketiga kebun belum menghasilkan TBS, namun jalur pasok
          menuju mill sudah terbentuk melalui jaringan PoD di sekitar lokasi.
        </p>
      </section>

      {/* ─── 2. HUTAN & DEFORESTASI ─── */}
      <section className="db-section">
        <SectionTitle label="HUTAN YANG TERUS BERKURANG" title="Deforestasi Sajingan Besar" />
        <div className="db-cards db-cards--4">
          <StatCard value={N(overview.forestCover2015Ha, ' ha')} label="Tutupan hutan 2015" />
          <StatCard value={N(overview.forestCover2025Ha, ' ha')} label="Tutupan hutan 2025" />
          <StatCard value={N(overview.netForestLossHa, ' ha')} label="Total kehilangan" accent />
          <StatCard value="9,87%" label="Net loss dalam 10 tahun" />
        </div>
        <div className="db-chart-block">
          <p className="db-chart-label">Tren deforestasi per tahun (ha)</p>
          <DeforestationTrendChart />
        </div>
        <div className="db-infobox">
          <div className="db-infobox__item">
            <span className="db-infobox__val">92%</span>
            <span className="db-infobox__desc">Deforestasi terjadi di hutan biasa (non-gambut)</span>
          </div>
          <div className="db-infobox__item">
            <span className="db-infobox__val">8%</span>
            <span className="db-infobox__desc">Terjadi di Peat Forest (gambut)</span>
          </div>
          <div className="db-infobox__item">
            <span className="db-infobox__val">46,1%</span>
            <span className="db-infobox__desc">Deforestasi gambut sudah menjadi kebun sawit (140 ha dari 305 ha)</span>
          </div>
        </div>
      </section>

      {/* ─── 3. EKSPANSI SAWIT ─── */}
      <section className="db-section">
        <SectionTitle label="PERKEBUNAN KELAPA SAWIT DI SAJINGAN BESAR" title="Ekspansi Sawit & Kawasan Hutan" />
        <div className="db-cards db-cards--3">
          <StatCard value={N(overview.totalPalmOilHa, ' ha')} label="Total sawit di Sajingan Besar (21,65% dari luas kecamatan)" />
          <StatCard value={N(overview.palmOilInForestHa, ' ha')} label="Sawit dalam kawasan hutan" accent />
          <StatCard value={N(overview.palmInForestAreaPercent, '%')} label="Proporsi sawit dalam kawasan" accent />
        </div>
        <div className="db-chart-block">
          <p className="db-chart-label">Luas sawit per desa — total vs dalam kawasan hutan (ha)</p>
          <VillageComparisonChart />
        </div>
        <table className="db-table">
          <thead>
            <tr>
              <th>Desa</th>
              <th>Luas Desa (ha)</th>
              <th>Luas Hutan (ha)</th>
              <th>APL (ha)</th>
              <th>Sawit (ha)</th>
              <th>Sawit dalam Kawasan (ha)</th>
              <th>Porsi dalam Kawasan</th>
            </tr>
          </thead>
          <tbody>
            {villages.map((v) => (
              <tr key={v.name} className={v.palmInForestPercent > 50 ? 'db-table__row--warn' : ''}>
                <td><strong>{v.name}</strong></td>
                <td>{N(v.villageAreaHa)}</td>
                <td>{N(v.forestAreaHa)}</td>
                <td>{N(v.aplAreaHa)}</td>
                <td>{N(v.palmOilHa)}</td>
                <td>{N(v.palmInForestHa)}</td>
                <td>{v.palmInForestPercent ? <strong style={{color:'var(--color-danger)'}}>{v.palmInForestPercent}%</strong> : '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {/* ─── 4. STUDI KASUS ─── */}
      <section className="db-section">
        <SectionTitle label="STUDI KASUS" title="3 Lokasi. 1 Pola." />
        <p className="db-desc">
          Tiga hamparan ditemukan dengan skala dan pola berbeda dari kebun masyarakat sekitarnya.
          Ketiganya berada dalam kawasan HPT, tanpa HGU/IUP, dan penguasaan lahan terindikasi terkonsentrasi
          pada pemilik modal.
        </p>
        <table className="db-table">
          <thead>
            <tr>
              <th>Lokasi</th>
              <th>Koordinat Pusat</th>
              <th>Luas (ha)</th>
              <th>Tahun Dibuka</th>
              <th>Kawasan</th>
              <th>Deforestasi</th>
              <th>HGU</th>
              <th>IUP</th>
              <th>Status Tanaman</th>
            </tr>
          </thead>
          <tbody>
            {cases.map((c) => (
              <tr key={c.id}>
                <td><strong>{c.name}</strong></td>
                <td style={{fontFamily:'var(--font-mono)',fontSize:11}}>{c.lat}°, {c.lng}°</td>
                <td>{N(c.areaHa)}</td>
                <td>{N(c.yearOpened)}</td>
                <td><span className="db-badge db-badge--warn">{c.kawasan}</span></td>
                <td>{c.deforestationPercent ? <strong>{c.deforestationPercent}%</strong> : '—'}</td>
                <td><span className="db-badge db-badge--danger">{c.hgu ? 'Ada' : 'Tidak ditemukan'}</span></td>
                <td><span className="db-badge db-badge--danger">{c.iup ? 'Ada' : 'Tidak ditemukan'}</span></td>
                <td><span className="db-badge">{c.status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="db-cards db-cards--3" style={{marginTop:20}}>
          <StatCard value="307 ha" label="Lokasi 1 · 2024 · bekas pembakaran · ekspansi masih aktif Nov 2025" />
          <StatCard value="133 ha" label="Lokasi 2 · 2023 · 4,5% SHM di luar HPT (kebun petani kecil)" />
          <StatCard value="151 ha" label="Lokasi 3 · 2022 · 87% dari area deforestasi · panen ~2027" />
        </div>
      </section>

      {/* ─── 5. RANTAI PASOK ─── */}
      <section className="db-section">
        <SectionTitle label="JEJAK YANG BELUM LENGKAP" title="Peta Rantai Pasok" />
        <p className="db-desc">
          Ketiga kebun belum menghasilkan TBS. Namun 5 PoD dalam radius 3–7,5 km sudah menerima TBS dari
          Sanatab dan Kaliau'. Berdasarkan wawancara pemilik PoD, PT Wawasan Kebun Nusantara (WKN) dan
          PT Kalimantan Subur Sawit (KSS) adalah mill yang paling berpotensi menerima buah dari ketiga lokasi.
        </p>

        <h3 className="db-subtitle">5 PoD dalam Radius 3–7,5 km</h3>
        <table className="db-table">
          <thead>
            <tr><th>Nama PoD</th><th>Koordinat</th><th>Jarak (km)</th><th>Asal Buah Saat Ini</th></tr>
          </thead>
          <tbody>
            {pods.map((p) => (
              <tr key={p.name}>
                <td><strong>{p.name}</strong></td>
                <td style={{fontFamily:'var(--font-mono)',fontSize:11}}>{p.lat}°, {p.lng}°</td>
                <td>{p.distanceKm}</td>
                <td>{p.fruitSource}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <h3 className="db-subtitle">9 Mill dalam Radius 25–81 km</h3>
        <div className="db-chart-block">
          <MillDistanceChart />
        </div>
        <table className="db-table">
          <thead>
            <tr><th>Mill</th><th>Grup</th><th>NDPE</th><th>Sertifikasi</th><th>Jarak (km)</th><th>Risiko Utama</th></tr>
          </thead>
          <tbody>
            {potentialMills.map((m) => (
              <tr key={m.name} className={m.primaryRisk ? 'db-table__row--primary' : ''}>
                <td><strong>{m.name}</strong></td>
                <td>{m.group}</td>
                <td>{m.ndpe ? <span className="db-badge db-badge--ok">NDPE</span> : <span className="db-badge db-badge--danger">Non-NDPE</span>}</td>
                <td>{m.certification === 'N/A' ? '—' : m.certification}</td>
                <td>{m.distanceKm} km</td>
                <td>{m.primaryRisk ? <span className="db-badge db-badge--warn">⚠ Prioritas Pemantauan</span> : '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="db-callout db-callout--warn">
          <strong>Catatan investigasi:</strong> WKN (KPN Plantation, NDPE+ISPO) dan KSS disebut sebagai tujuan penjualan TBS
          oleh pemilik PoD dalam wawancara lapangan. Traceability to Plantation (TTP) adalah mekanisme kunci
          untuk memverifikasi asal buah sebelum masuk ke rantai pasok.
        </div>
      </section>

      {/* ─── 6. REKOMENDASI ─── */}
      <section className="db-section">
        <SectionTitle label="KESIMPULAN" title="Pohon Belum Berbuah. Risiko Sudah Ada." />
        <div className="db-callout db-callout--accent">
          Status kawasan, legalitas, penguasaan lahan, dan asal buah dari ketiga lokasi masih perlu
          diverifikasi sampai tingkat kebun. Selama informasi tersebut belum jelas, potensi masuknya TBS
          dari ketiga lokasi ke dalam rantai pasok perlu dicegah dan ditelusuri lebih lanjut.
        </div>
        <div className="db-cards db-cards--3">
          <StatCard value="Sebelum 2027" label="Window verifikasi Lokasi 3 — makin sempit" accent />
          <StatCard value="WKN & KSS" label="Prioritas audit penelusuran pemasok" />
          <StatCard value="5 PoD" label="Titik kritis yang perlu dipantau dalam TTP" />
        </div>
      </section>

    </div>
  );
}
