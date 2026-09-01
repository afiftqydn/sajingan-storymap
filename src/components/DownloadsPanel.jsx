import { downloads } from '../data/downloads.js';

// Dokumen tanpa url asli (masih '#', lihat downloads.js) sengaja TIDAK
// dirender sama sekali — bukan ditampilkan sebagai badge "Segera hadir".
// Situs sudah mau go-live; badge "coming soon" untuk deliverable inti
// (laporan, metodologi, dataset) tampak belum selesai. Begitu url asli
// diisi di downloads.js, entrinya otomatis muncul lagi di sini.
export default function DownloadsPanel() {
  const ready = downloads.filter((doc) => doc.url && doc.url !== '#');
  if (ready.length === 0) return null;
  return (
    <div className="downloads-panel">
      {ready.map((doc) => (
        <a key={doc.id} href={doc.url} className="downloads-panel__item" target="_blank" rel="noreferrer">
          <div className="downloads-panel__title">{doc.title}</div>
          <div className="downloads-panel__desc">{doc.description}</div>
        </a>
      ))}
    </div>
  );
}
