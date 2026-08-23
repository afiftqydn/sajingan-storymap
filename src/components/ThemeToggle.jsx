// src/components/ThemeToggle.jsx — tombol switch dark/light.
// Icon SVG inline (bukan dependency icon library baru) — matahari untuk
// "ganti ke light", bulan untuk "ganti ke dark", sesuai state SEKARANG
// (ikon menunjukkan tujuan switch, bukan status saat ini — pola umum toggle).
export default function ThemeToggle({ theme, onToggle }) {
  const isDark = theme === 'dark';
  return (
    <button
      className="theme-toggle"
      onClick={onToggle}
      aria-label={isDark ? 'Ganti ke tampilan terang' : 'Ganti ke tampilan gelap'}
      title={isDark ? 'Tampilan terang' : 'Tampilan gelap'}
    >
      {isDark ? (
        // Matahari — ditampilkan saat mode gelap aktif (ajakan pindah ke terang)
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
        </svg>
      ) : (
        // Bulan — ditampilkan saat mode terang aktif (ajakan pindah ke gelap)
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79Z" />
        </svg>
      )}
    </button>
  );
}
