import { overview, villages } from '../data/reportData.js';
import ForestShareDonut from './charts/ForestShareDonut.jsx';
import VillageComparisonChart from './charts/VillageComparisonChart.jsx';

function fmt(value, suffix = '') {
  return value === null || value === undefined ? '—' : `${value}${suffix}`;
}

export default function DashboardStats() {
  return (
    <section className="dashboard-stats">
      <h2>Ringkasan Kecamatan</h2>
      <div className="dashboard-stats__cards">
        <div className="dashboard-stats__card">
          <div className="dashboard-stats__value">{fmt(overview.forestCover2015Ha, ' ha')}</div>
          <div className="dashboard-stats__label">Hutan 2015</div>
        </div>
        <div className="dashboard-stats__card">
          <div className="dashboard-stats__value">{fmt(overview.forestCover2026Ha, ' ha')}</div>
          <div className="dashboard-stats__label">Hutan 2026</div>
        </div>
        <div className="dashboard-stats__card">
          <div className="dashboard-stats__value">{fmt(overview.netForestLossPercent, '%')}</div>
          <div className="dashboard-stats__label">Net loss</div>
        </div>
        <div className="dashboard-stats__card">
          <div className="dashboard-stats__value">{fmt(overview.totalPalmOilHa, ' ha')}</div>
          <div className="dashboard-stats__label">Total sawit</div>
        </div>
      </div>

      <div className="dashboard-stats__charts">
        <div>
          <h3>Hutan → Sawit vs Lainnya</h3>
          <ForestShareDonut />
        </div>
        <div>
          <h3>Perbandingan per Desa</h3>
          <VillageComparisonChart />
        </div>
      </div>

      <table className="dashboard-stats__table">
        <thead>
          <tr>
            <th>Desa</th>
            <th>Luas Desa (ha)</th>
            <th>Luas Hutan (ha)</th>
            <th>Di Kawasan Hutan (ha)</th>
          </tr>
        </thead>
        <tbody>
          {villages.map((v) => (
            <tr key={v.name}>
              <td>{v.name}</td>
              <td>{fmt(v.villageAreaHa)}</td>
              <td>{fmt(v.forestAreaHa)}</td>
              <td>{fmt(v.areaInForestHa)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
