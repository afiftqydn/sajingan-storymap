// src/theme.js
//
// Warna yang dipakai MapLibre (paint properties peta) — TIDAK bisa baca
// CSS var(), jadi nilainya diduplikat manual di sini. Kalau ganti warna
// utama, ubah DI SINI dan juga di blok :root pada src/index.css.

export const theme = {
  colors: {
    background: '#0e1512',
    panel: '#141d19',
    text: '#f2f0e8',
    textMuted: '#9fb0a8',
    accent: '#d9a441',      // highlight polygon kasus, tombol utama
    accentSoft: '#d9a44133',
    forestLoss: '#c2503f',  // deforestasi / risiko
    forestIntact: '#3f7a5c',// hutan tersisa
    palmOil: '#e0c14d',     // sawit tertanam
    burned: '#7a2f2f',      // area dibuka dengan pembakaran
    boundary: '#f2f0e8',
  },
  fontDisplay: "'Fraunces', 'Georgia', serif",
  fontBody: "'Inter', system-ui, sans-serif",
};

// Warna polygon untuk MapLibre paint (raw hex, sama dengan theme.colors)
export const mapColors = {
  kecamatan: '#f2f0e8',
  lokasi1: '#d9a441',
  lokasi2: '#e0c14d',
  lokasi3: '#c2503f',
  forestLoss: '#c2503f',
  forestIntact: '#3f7a5c',
  palmOil: '#e0c14d',
};
