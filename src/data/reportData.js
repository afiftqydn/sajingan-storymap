// src/data/reportData.js
//
// Angka & tabel untuk tab "Peta & Data" (DashboardStats.jsx, CasesTable.jsx).
//
// PENTING: angka di sini HARUS disinkronkan manual dengan angka yang
// dinarasikan di chapters.js (tab Cerita). Belum digabung jadi satu
// sumber karena bentuknya beda (prosa vs tabel). Kalau update satu,
// update juga yang lain.
//
// TODO: ganti semua nilai `null` / placeholder dengan angka asli.

export const overview = {
  kecamatanAreaHa: null,       // TODO
  forestCover2015Ha: null,     // TODO
  forestCover2026Ha: null,     // TODO
  netForestLossHa: null,       // TODO
  netForestLossPercent: null,  // TODO
  totalPalmOilHa: null,        // TODO
  millsOperating: null,        // TODO
  palmInForestAreaPercent: null, // TODO — indikator risiko
};

// 3 kasus studi — sumber untuk CasesTable dan chart terkait
export const cases = [
  {
    id: 'lokasi-1',
    name: 'Lokasi 1',
    areaHa: null,        // TODO
    yearOpened: null,    // TODO
    openingMethod: 'cleared', // 'cleared' | 'burned'
    forestCoverBeforeHa: null, // TODO
    status: 'TBM',        // TBM (belum panen) | productive
    ownerLabel: 'TODO',   // nama/inisial sesuai keputusan privacy tim
    traceabilityStatus: 'untraced', // 'traced' | 'untraced' | 'partial'
  },
  {
    id: 'lokasi-2',
    name: 'Lokasi 2',
    areaHa: null,
    yearOpened: null,
    openingMethod: 'cleared',
    forestCoverBeforeHa: null,
    status: 'TBM',
    ownerLabel: 'TODO',
    traceabilityStatus: 'untraced',
  },
  {
    id: 'lokasi-3',
    name: 'Lokasi 3',
    areaHa: null,
    yearOpened: null,
    openingMethod: 'burned',
    forestCoverBeforeHa: null,
    status: 'TBM',
    ownerLabel: 'TODO',
    traceabilityStatus: 'untraced',
  },
];

// 5 desa — sebagian field null untuk desa non-fokus (draf laporan belum
// memuat angkanya). Komponen tabel harus tahan null → tampil "—".
export const villages = [
  { name: 'TODO Desa A', villageAreaHa: null, forestAreaHa: null, areaInForestHa: null, aplAreaHa: null },
  { name: 'TODO Desa B', villageAreaHa: null, forestAreaHa: null, areaInForestHa: null, aplAreaHa: null },
  { name: 'TODO Desa C', villageAreaHa: null, forestAreaHa: null, areaInForestHa: null, aplAreaHa: null },
  { name: 'TODO Desa D (non-fokus)', villageAreaHa: null, forestAreaHa: null, areaInForestHa: null, aplAreaHa: null },
  { name: 'TODO Desa E (non-fokus)', villageAreaHa: null, forestAreaHa: null, areaInForestHa: null, aplAreaHa: null },
];

// Mill/PKS potensial untuk prediksi rantai pasok (Chapter 11/CasesTable)
export const potentialMills = [
  // { name: 'TODO PKS A', distanceKm: null, estimatedConfidence: 'medium' },
];

// Tren tutupan hutan tahunan — dipakai chart 'forest-trend'
export const forestTrend = [
  { year: 2015, forestHa: null }, // TODO
  { year: 2026, forestHa: null }, // TODO — isi titik antara kalau ada datanya
];

// Tren deforestasi tahunan — dipakai chart 'deforestation-trend'
// `estimated: true` → chart otomatis tampilkan peringatan "angka perkiraan"
export const deforestationTrend = [
  { year: 2021, lossHa: null, estimated: true },
  { year: 2022, lossHa: null, estimated: true },
  { year: 2023, lossHa: null, estimated: true },
  { year: 2024, lossHa: null, estimated: true },
  { year: 2025, lossHa: null, estimated: true },
];
