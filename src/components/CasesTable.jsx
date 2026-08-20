import { cases, potentialMills } from '../data/reportData.js';
import CaseAreaChart from './charts/CaseAreaChart.jsx';
import MillDistanceChart from './charts/MillDistanceChart.jsx';

function fmt(value, suffix = '') {
  return value === null || value === undefined ? '—' : `${value}${suffix}`;
}

export default function CasesTable() {
  return (
    <section className="cases-table">
      <h2>3 Studi Kasus</h2>
      <CaseAreaChart />
      <table className="cases-table__table">
        <thead>
          <tr>
            <th>Lokasi</th>
            <th>Luas (ha)</th>
            <th>Tahun Dibuka</th>
            <th>Metode</th>
            <th>Status</th>
            <th>Traceability</th>
          </tr>
        </thead>
        <tbody>
          {cases.map((c) => (
            <tr key={c.id}>
              <td>{c.name}</td>
              <td>{fmt(c.areaHa)}</td>
              <td>{fmt(c.yearOpened)}</td>
              <td>{c.openingMethod === 'burned' ? 'Dibakar' : 'Dibuka biasa'}</td>
              <td>{c.status}</td>
              <td>{c.traceabilityStatus}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h3>Jarak ke Mill/Dealer Potensial</h3>
      <MillDistanceChart />
      {potentialMills.length === 0 && (
        <p className="cases-table__hint">
          TODO: isi <code>potentialMills</code> di <code>reportData.js</code> untuk chart ini.
        </p>
      )}
    </section>
  );
}
