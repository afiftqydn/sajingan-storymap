import { useMemo } from 'react';
import { SECTION_LABELS } from '../data/chapters.js';

// Ikon per section — inline SVG sederhana (bukan dependency icon
// library), stroke-based konsisten dengan ThemeToggle. Kalau nambah
// section baru di SECTION_LABELS (chapters.js), tambahkan juga ikonnya
// di sini — fallback ke titik generik kalau belum ada.
const SECTION_ICONS = {
  intro: (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M4 3v18M4 4h13l-2.5 3.5L17 11H4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  problem: (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 3l10 18H2L12 3z" strokeLinejoin="round" />
      <path d="M12 10v4M12 17.5v.01" strokeLinecap="round" />
    </svg>
  ),
  evidence: (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="10.5" cy="10.5" r="6.5" />
      <path d="M20 20l-4.8-4.8" strokeLinecap="round" />
    </svg>
  ),
  consequence: (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M9 15L15 9M10.5 6.5l1-1a3.5 3.5 0 0 1 5 5l-1 1M13.5 17.5l-1 1a3.5 3.5 0 0 1-5-5l1-1" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  penutup: (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="9" />
      <path d="M9 12l2 2 4-4.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
};
const DEFAULT_ICON = (
  <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor">
    <circle cx="12" cy="12" r="4" />
  </svg>
);

// Sidebar nav kiri — kompak: SATU baris per section (ikon + judul
// section saja), BUKAN daftar tiap chapter di bawahnya. Klik section
// meloncat ke chapter PERTAMA di section itu.
export default function StepIndicator({ chapters, activeStepId, onJump, hidden }) {
  const activeSection = chapters.find((ch) => ch.id === activeStepId)?.section;

  // Urutan section = urutan kemunculan pertama di array chapters;
  // simpan juga id chapter pertama tiap section (target klik).
  // `chapters` datanya statis (import, tidak pernah berubah) — di-memo
  // supaya tidak dihitung ulang tiap kali komponen ini re-render (yang
  // sekarang cukup sering, karena ikut berubah tiap chapter aktif
  // gonta-ganti waktu scroll, plus status scroll aktif/idle).
  const { sectionOrder, firstChapterIdBySection } = useMemo(() => {
    const order = [];
    const firstIdMap = {};
    chapters.forEach((ch) => {
      if (!(ch.section in firstIdMap)) {
        firstIdMap[ch.section] = ch.id;
        order.push(ch.section);
      }
    });
    return { sectionOrder: order, firstChapterIdBySection: firstIdMap };
  }, [chapters]);

  return (
    <nav className={`story__nav ${hidden ? 'story__nav--hidden' : ''}`} aria-label="Navigasi section">
      {sectionOrder.map((section) => (
        <button
          key={section}
          className={`story__nav-item ${activeSection === section ? 'is-active' : ''}`}
          onClick={() => onJump(firstChapterIdBySection[section])}
        >
          <span className="story__nav-icon">{SECTION_ICONS[section] ?? DEFAULT_ICON}</span>
          <span className="story__nav-text">{SECTION_LABELS[section] ?? section}</span>
        </button>
      ))}
    </nav>
  );
}
