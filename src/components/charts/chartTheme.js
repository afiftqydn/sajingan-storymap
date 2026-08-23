// src/components/charts/chartTheme.js
//
// Recharts butuh warna sebagai STRING biasa (bukan CSS var()), jadi tidak
// bisa cuma andalkan variabel CSS di App.css seperti komponen lain — itu
// PERSIS bug yang sebelumnya bikin tooltip & grid chart selalu gelap
// walau app sudah pindah ke light mode. Fix-nya: dua palet eksplisit di
// sini (harus di-update BARENGAN kalau token warna di App.css berubah),
// dipilih lewat getChartColors(theme) berdasarkan tema aktif dari
// ThemeContext — bukan baca ulang CSS var, supaya selalu sinkron di
// render yang sama (tidak "telat satu frame").

const DARK = {
  primary: '#7ed957',
  secondary: '#3f7a5c',
  danger: '#c2503f',
  grid: '#22302a',
  text: '#9fb0a8',
  textStrong: '#f2f0e8',
  panel: '#111a15',
  border: '#22302a',
};

const LIGHT = {
  primary: '#146024',
  secondary: '#2f6347',
  danger: '#8a2f22',
  grid: '#c3cec8',
  text: '#3d4a44',
  textStrong: '#10160f',
  panel: '#ffffff',
  border: '#c3cec8',
};

export function getChartColors(theme) {
  return theme === 'light' ? LIGHT : DARK;
}

export const chartCommonProps = {
  margin: { top: 8, right: 16, left: 0, bottom: 8 },
};
