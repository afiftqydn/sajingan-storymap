// src/theme.js
//
// Warna yang dipakai MapLibre (paint properties peta) — TIDAK bisa baca
// CSS var(), jadi nilainya diduplikat manual di sini. Kalau ganti warna
// utama, ubah DI SINI dan juga di blok :root pada src/App.css.
//
// Palet & tipografi: GEOINT environmental intelligence (lihat CLAUDE.md) —
// dark near-black BG, teks warm off-white, aksen Olive/Forest/Earth
// (bukan hijau terang lagi), tipografi sans-serif penuh (bukan serif)
// untuk kesan platform/tech, mono untuk label ID teknis (eyebrow
// "01 / KASUS-01").

export const theme = {
  colors: {
    background: '#0b0d0c',
    panel: '#15170f',
    text: '#f1f1ea',
    textMuted: '#a3a895',
    accent: '#b7c98a',     // Olive
    accentSoft: '#b7c98a29',
    cta: '#a99569',        // Earth — KHUSUS 1 CTA utama, bukan accent umum
    forestLoss: '#c2503f',
    forestIntact: '#3f7a5c',
    palmOil: '#e0c14d',
    burned: '#7a2f2f',
    boundary: '#f1f1ea',
  },
  fontDisplay: "'Space Grotesk', 'Inter', system-ui, sans-serif",
  fontBody: "'Inter', system-ui, sans-serif",
  fontMono: "'IBM Plex Mono', 'Courier New', monospace",
};

export const mapColors = {
  kecamatan: '#f1f1ea',
  lokasi1: '#b7c98a',
  lokasi2: '#e0c14d',
  lokasi3: '#c2503f',
  forestLoss: '#c2503f',
  forestIntact: '#3f7a5c',
  palmOil: '#e0c14d',
};
