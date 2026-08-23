import DashboardStats from './DashboardStats.jsx';
import CasesTable from './CasesTable.jsx';
import DownloadsPanel from './DownloadsPanel.jsx';

// Tab "Dashboard" — angka, chart, dan tabel. Peta ada di tab terpisah
// ("Peta Interaktif"), supaya tab ini murni fokus ke data.
export default function DashboardView() {
  return (
    <div className="dashboard-view">
      <div className="dashboard-view__panels">
        <DashboardStats />
        <CasesTable />
        <section className="dashboard-view__downloads">
          <h2>Dokumen & Sumber Data</h2>
          <DownloadsPanel />
        </section>
      </div>
    </div>
  );
}
