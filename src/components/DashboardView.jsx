import { downloads } from '../data/downloads.js';
import DashboardStats from './DashboardStats.jsx';
import DownloadsPanel from './DownloadsPanel.jsx';

// Tab "Dashboard" — cerita lengkap lewat data & angka.
// Cukup buka tab ini saja untuk memahami seluruh temuan investigasi
// tanpa perlu baca narasi Storymap atau eksplorasi Peta Interaktif.
export default function DashboardView() {
  const hasReadyDownloads = downloads.some((doc) => doc.url && doc.url !== '#');
  return (
    <div className="dashboard-view">
      <div className="dashboard-view__panels">
        <DashboardStats />
        {hasReadyDownloads && (
          <section className="db-section">
            <div className="db-section-title">
              <span className="db-section-title__label">DOKUMEN</span>
              <h2 className="db-section-title__h">Sumber Data &amp; Unduhan</h2>
            </div>
            <DownloadsPanel />
          </section>
        )}
      </div>
    </div>
  );
}
