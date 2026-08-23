// src/theme.js
//
// Warna yang dipakai MapLibre (paint properties peta) — TIDAK bisa baca
// CSS var(), jadi nilainya diduplikat manual di sini. Kalau ganti warna
// utama, ubah DI SINI dan juga di blok :root pada src/App.css.
//
// Palet & tipografi: gaya "modern teknologi" ala geometrack.com —
// dark near-black-green, satu accent hijau, oranye direservasi CTA,
// tipografi sans-serif penuh (bukan serif) untuk kesan platform/tech,
// mono untuk label ID teknis (eyebrow "01 / KASUS-01").

export const theme = {
  colors: {
    background: '#0a0f0c',
    panel: '#111a15',
    text: '#f2f0e8',
    textMuted: '#9fb0a8',
    accent: '#7ed957',
    accentSoft: '#7ed95733',
    cta: '#e8622f',        // oranye — KHUSUS 1 CTA utama, bukan accent umum
    forestLoss: '#c2503f',
    forestIntact: '#3f7a5c',
    palmOil: '#e0c14d',
    burned: '#7a2f2f',
    boundary: '#f2f0e8',
  },
  fontDisplay: "'Space Grotesk', 'Inter', system-ui, sans-serif",
  fontBody: "'Inter', system-ui, sans-serif",
  fontMono: "'IBM Plex Mono', 'Courier New', monospace",
};

export const mapColors = {
  kecamatan: '#f2f0e8',
  lokasi1: '#7ed957',
  lokasi2: '#e0c14d',
  lokasi3: '#c2503f',
  forestLoss: '#c2503f',
  forestIntact: '#3f7a5c',
  palmOil: '#e0c14d',
};
