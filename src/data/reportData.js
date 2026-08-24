// src/data/reportData.js — Data asli dari laporan "When Forests Lose Their Boundaries"
// Sumber: 0°Latitude Academy / Earthqualizer Foundation

export const overview = {
  kecamatanAreaHa: 139120,
  forestCover2015Ha: 37691.62,
  forestCover2025Ha: 33969.81,
  netForestLossHa: 3721.81,
  netForestLossPercent: 9.87,
  totalPalmOilHa: 30104.43,
  palmOilInForestHa: 6702.06,
  palmInForestAreaPercent: 22.3,
  deforestation2022to2024Ha: 592.29,
  peatForestDeforestationHa: 304.76,
  peatTowardsPalmPercent: 46.1,
};

export const cases = [
  {
    id: 'lokasi-1',
    name: 'Lokasi 1',
    lat: 1.65804, lng: 109.57527,
    areaHa: 307.083,
    yearOpened: 2024,
    openingMethod: 'burned',
    deforestationAreaHa: 79.482,
    deforestationPercent: 26,
    nonDeforestationHa: 227.601,
    status: 'TBM',
    kawasan: 'HPT',
    hgu: false, iup: false,
    ownerLabel: 'Investor asal Pemangkat',
    traceabilityStatus: 'untraced',
    distanceToRiver: 441.88,
    notes: 'Pembukaan masih berlanjut per November 2025. Area bekas pembakaran sudah ditanami kelapa sawit.',
  },
  {
    id: 'lokasi-2',
    name: 'Lokasi 2',
    lat: 1.64645, lng: 109.59320,
    areaHa: 133.588,
    yearOpened: 2023,
    openingMethod: 'cleared',
    deforestationAreaHa: 16.064,
    deforestationPercent: 12,
    nonDeforestationHa: 117.524,
    shmAreaHa: 6.0, shmPercent: 4.5, shmCount: 3,
    status: 'TBM',
    kawasan: 'HPT',
    hgu: false, iup: false,
    ownerLabel: 'Investor asal Tebas',
    traceabilityStatus: 'untraced',
    notes: 'Terdapat 3 bidang SHM di luar HPT (4,5% dari total). 95,5% kebun tanpa HGU/IUP.',
  },
  {
    id: 'lokasi-3',
    name: 'Lokasi 3',
    lat: 1.62635, lng: 109.58668,
    areaHa: 151.618,
    yearOpened: 2022,
    openingMethod: 'cleared',
    deforestationAreaHa: 131.51,
    deforestationPercent: 87,
    nonDeforestationHa: 20.108,
    status: 'TBM',
    kawasan: 'HPT',
    hgu: false, iup: false,
    ownerLabel: 'Investor (oknum aparat & legislatif)',
    traceabilityStatus: 'untraced',
    estimatedHarvestYear: 2027,
    notes: 'Kebun paling matang dari ketiganya. Akses jalan sudah bisa dilalui kendaraan roda empat.',
  },
];

export const villages = [
  { name: 'Sanatab', villageAreaHa: 9428.25, forestAreaHa: 8059.19, aplAreaHa: 1369.06, palmOilHa: 1931.78, palmInForestHa: 1284.79, palmInForestPercent: 66.5 },
  { name: "Kaliau'", villageAreaHa: 15564.95, forestAreaHa: 11693.33, aplAreaHa: 3871.62, palmOilHa: 5175.65, palmInForestHa: 3241.07, palmInForestPercent: 62.6 },
  { name: 'Santaban', villageAreaHa: null, forestAreaHa: null, aplAreaHa: null, palmOilHa: 914.04, palmInForestHa: null, palmInForestPercent: null },
  { name: "Sebunga'", villageAreaHa: null, forestAreaHa: null, aplAreaHa: null, palmOilHa: 16907.82, palmInForestHa: null, palmInForestPercent: null },
  { name: 'Sungai Bening', villageAreaHa: null, forestAreaHa: null, aplAreaHa: null, palmOilHa: 5175.14, palmInForestHa: null, palmInForestPercent: null },
];

// 9 mill dari Tabel 2 laporan
export const potentialMills = [
  { name: 'Wana Hijau Semesta', group: 'DARMEX AGRO', ndpe: false, certification: 'N/A', lat: 1.515000, lng: 109.597999, distanceKm: 25.67, potentialBuyers: [] },
  { name: 'Ledo Lestari', group: 'DARMEX AGRO', ndpe: false, certification: 'N/A', lat: 1.464745, lng: 109.716423, distanceKm: 31.26, potentialBuyers: [] },
  { name: 'Wirata Daya Bangun Persada', group: 'DARMEX AGRO', ndpe: false, certification: 'N/A', lat: 1.429400, lng: 109.602999, distanceKm: 35.36, potentialBuyers: [] },
  { name: 'Agronusa Investama 3 – Sambas', group: 'WILMAR GROUP', ndpe: true, certification: 'RSPO, ISPO', lat: 1.421490, lng: 109.537148, distanceKm: 43.88, potentialBuyers: ['PT Wilmar Cahaya Indonesia', 'AAK', 'Nestlé'] },
  { name: 'Ceria Prima 1', group: 'DARMEX AGRO', ndpe: false, certification: 'N/A', lat: 1.368900, lng: 109.684100, distanceKm: 44.51, potentialBuyers: [] },
  { name: 'Ceria Prima 2', group: 'DARMEX AGRO', ndpe: false, certification: 'N/A', lat: 1.300768, lng: 109.666917, distanceKm: 53.87, potentialBuyers: [] },
  { name: 'PT Kalimantan Subur Sawit (KSS)', group: 'UNKNOWN', ndpe: false, certification: 'N/A', lat: 1.333598, lng: 109.877572, distanceKm: 61.07, potentialBuyers: [], primaryRisk: true },
  { name: 'PT Wawasan Kebun Nusantara (WKN)', group: 'KPN Plantation', ndpe: true, certification: 'ISPO', lat: 1.266890, lng: 109.817139, distanceKm: 72.02, potentialBuyers: ['P&G', 'Colgate-Palmolive'], primaryRisk: true },
  { name: 'Musim Mas', group: 'MUSIM MAS', ndpe: true, certification: 'RSPO, ISPO', lat: 1.358028, lng: 109.383631, distanceKm: 80.86, potentialBuyers: ['P&G'] },
];

// 5 PoD dari Tabel 3 laporan — disurvei langsung di lapangan
export const pods = [
  { name: 'Pais', lat: 1.657105, lng: 109.601757, fruitSource: 'Sanatab & Kaliau\'', distanceKm: 3.10 },
  { name: 'Baida', lat: 1.653802, lng: 109.604266, fruitSource: 'Sanatab & Kaliau\'', distanceKm: 3.57 },
  { name: 'Arpi', lat: 1.671903, lng: 109.590249, fruitSource: 'Sanatab & Kaliau\'', distanceKm: 4.95 },
  { name: 'Pak Thomas', lat: 1.622351, lng: 109.641092, fruitSource: 'Sungai Bening, Santaban, Sanatab, Batang Air', distanceKm: 6.44 },
  { name: 'Ika', lat: 1.687970, lng: 109.596890, fruitSource: 'Desa Santaban', distanceKm: 7.54 },
];

// Tren deforestasi tahunan — dari grafik Gambar 3 laporan
export const deforestationTrend = [
  { year: 2022, lossHa: 428.02 },
  { year: 2023, lossHa: 951.97 },
  { year: 2024, lossHa: 740.13 },
  { year: 2025, lossHa: 458.30 },
];

// Tren tutupan hutan
export const forestTrend = [
  { year: 2015, forestHa: 37691.62 },
  { year: 2025, forestHa: 33969.81 },
];

// Timeline investigasi — ditampilkan di Dashboard sebagai activity log
export const investigationTimeline = [
  { date: '2022', label: 'Lokasi 3 teridentifikasi via analisis citra satelit', type: 'satellite', analyst: 'Desktop Analysis' },
  { date: '2023', label: 'Lokasi 1 & 2 teridentifikasi', type: 'satellite', analyst: 'Desktop Analysis' },
  { date: 'Aug 2025', label: 'Citra Google Earth konfirmasi pembakaran aktif Lokasi 1', type: 'satellite', analyst: 'Citra Analysis' },
  { date: 'Nov 2025', label: 'Pembukaan lahan masih aktif teridentifikasi', type: 'satellite', analyst: 'Monitoring' },
  { date: '2026', label: 'Verifikasi lapangan dilakukan Tim Sajingan Besar', type: 'field', analyst: 'Tim 0°Latitude' },
  { date: '2026', label: 'Wawancara pemilik PoD — 6 PoD disurvei', type: 'field', analyst: 'Tim 0°Latitude' },
  { date: '2026', label: 'Cross-check data ATR/BPN (Bhumi) — 0 HGU ditemukan', type: 'verification', analyst: 'Verified' },
  { date: '2026', label: 'Laporan final disusun dan dipublikasikan', type: 'report', analyst: '0°Latitude Academy' },
];

// Bukti foto lapangan per lokasi — dipakai di photo grid dashboard
export const fieldEvidence = [
  { src: '/images/case-overview-1.jpg', type: 'DRONE', caption: 'Lokasi 1 — aerial view', location: 'Lokasi 1' },
  { src: '/images/case1-burned.jpg', type: 'DRONE', caption: 'Bekas pembakaran ditanami sawit', location: 'Lokasi 1' },
  { src: '/images/case1-tbm.jpg', type: 'GROUND', caption: 'Tanaman Belum Menghasilkan (TBM)', location: 'Lokasi 1' },
  { src: '/images/case-overview-2.jpg', type: 'DRONE', caption: 'Lokasi 2 — aerial view', location: 'Lokasi 2' },
  { src: '/images/case2-tbm.jpg', type: 'GROUND', caption: 'TBM Lokasi 2 — penanaman 2023', location: 'Lokasi 2' },
  { src: '/images/case-overview-3.jpg', type: 'DRONE', caption: 'Lokasi 3 — aerial view', location: 'Lokasi 3' },
  { src: '/images/case3-field.jpg', type: 'GROUND', caption: 'Akses jalan sudah bisa dilalui mobil', location: 'Lokasi 3' },
  { src: '/images/pod-pais.jpg', type: 'GROUND', caption: 'PoD Pais — 3,1 km dari pusat lokasi', location: 'PoD' },
  { src: '/images/pod-baida.jpg', type: 'GROUND', caption: 'PoD Baida — 3,57 km', location: 'PoD' },
];
