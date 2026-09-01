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
  // Total gabungan 3 Lokasi Studi Kasus (BUKAN seluruh kecamatan) —
  // dihitung ulang dari polygon hasil digitasi asli (sebelumnya 592,29 ha
  // dari kotak placeholder). Nama field sengaja eksplisit "threeCases"
  // supaya tidak ketuker sama angka level-kecamatan di atas.
  threeCasesTotalHa: 627.58,
  peatForestDeforestationHa: 304.76,
  peatTowardsPalmPercent: 46.1,
};

export const cases = [
  {
    id: 'lokasi-1',
    name: 'Lokasi 1',
    lat: 1.65804, lng: 109.57527,
    areaHa: 307.084,
    yearOpened: 2024,
    openingMethod: 'burned',
    deforestationAreaHa: 71.58,
    deforestationPercent: 23.3,
    nonDeforestationHa: 235.504,
    status: 'TBM',
    kawasan: 'HPT',
    hgu: false, iup: false,
    ownerLabel: 'Investor asal Pemangkat',
    traceabilityStatus: 'untraced',
    distanceToRiver: 441.88,
    notes: 'Pembukaan masih berlanjut per November 2025. Area bekas pembakaran sudah ditanami kelapa sawit.',
    // Belum dinilai — menunggu penilaian editorial/legal penulis laporan,
    // JANGAN dihitung otomatis dari jumlah bukti.
    confidenceLevel: null,
  },
  {
    id: 'lokasi-2',
    name: 'Lokasi 2',
    lat: 1.64645, lng: 109.59320,
    areaHa: 140.722,
    yearOpened: 2023,
    openingMethod: 'cleared',
    deforestationAreaHa: 15.13,
    deforestationPercent: 11.3,
    nonDeforestationHa: 125.592,
    shmAreaHa: 6.0, shmPercent: 4.5, shmCount: 3,
    status: 'TBM',
    kawasan: 'HPT',
    hgu: false, iup: false,
    ownerLabel: 'Investor asal Tebas',
    traceabilityStatus: 'untraced',
    notes: 'Terdapat 3 bidang SHM di luar HPT (4,5% dari total). 95,5% kebun tanpa HGU/IUP.',
    // Belum dinilai — menunggu penilaian editorial/legal penulis laporan,
    // JANGAN dihitung otomatis dari jumlah bukti.
    confidenceLevel: null,
  },
  {
    id: 'lokasi-3',
    name: 'Lokasi 3',
    lat: 1.62635, lng: 109.58668,
    areaHa: 179.775,
    yearOpened: 2022,
    openingMethod: 'cleared',
    deforestationAreaHa: 128.7,
    deforestationPercent: 71.6,
    nonDeforestationHa: 51.075,
    status: 'TBM',
    kawasan: 'HPT',
    hgu: false, iup: false,
    ownerLabel: 'Investor (oknum aparat & legislatif)',
    traceabilityStatus: 'untraced',
    estimatedHarvestYear: 2027,
    notes: 'Kebun paling matang dari ketiganya. Akses jalan sudah bisa dilalui kendaraan roda empat.',
    // Belum dinilai — menunggu penilaian editorial/legal penulis laporan,
    // JANGAN dihitung otomatis dari jumlah bukti.
    confidenceLevel: null,
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
  { name: 'Pak Thomas', lat: 1.682176, lng: 109.589432, fruitSource: 'Sungai Bening, Santaban, Sanatab, Batang Air', distanceKm: 6.44 },
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

// Timeline investigasi — ditampilkan di Dashboard sebagai activity log.
// `caseId` (baru): dipakai TimelineScrubber & Object Inspector buat
// filter kronologi per-kasus — cuma diisi kalau teks entry-nya EKSPLISIT
// nyebut satu lokasi spesifik (bukan tebakan dari konteks lain), sisanya
// null (kecamatan-level / bukan spesifik satu lokasi).
export const investigationTimeline = [
  { date: '2022', label: 'Lokasi 3 teridentifikasi via analisis citra satelit', type: 'satellite', analyst: 'Desktop Analysis', caseId: 'lokasi-3' },
  { date: '2023', label: 'Lokasi 1 & 2 teridentifikasi', type: 'satellite', analyst: 'Desktop Analysis', caseId: null },
  { date: 'Aug 2025', label: 'Citra Google Earth konfirmasi pembakaran aktif Lokasi 1', type: 'satellite', analyst: 'Citra Analysis', caseId: 'lokasi-1' },
  { date: 'Nov 2025', label: 'Pembukaan lahan masih aktif teridentifikasi', type: 'satellite', analyst: 'Monitoring', caseId: null },
  { date: '2026', label: 'Verifikasi lapangan dilakukan Tim Sajingan Besar', type: 'field', analyst: 'Tim 0°Latitude', caseId: null },
  { date: '2026', label: 'Wawancara pemilik PoD — 6 PoD disurvei', type: 'field', analyst: 'Tim 0°Latitude', caseId: null },
  { date: '2026', label: 'Cross-check data ATR/BPN (Bhumi) — 0 HGU ditemukan', type: 'verification', analyst: 'Verified', caseId: null },
  { date: '2026', label: 'Laporan final disusun dan dipublikasikan', type: 'report', analyst: '0°Latitude Academy', caseId: null },
];

// Bukti foto lapangan per lokasi — dipakai di photo grid dashboard.
// `period`/`pairId` (baru, OPSIONAL): dipakai BeforeAfterSlider lewat
// getBeforeAfterPairs() — cuma diisi utk pasangan foto yang BENAR-BENAR
// before/after yang sama (waktu beda, subjek sama), bukan sekadar dua
// foto dari lokasi yang sama. Lokasi 2 (aerial vs ground, sudut beda,
// bukan waktu beda) dan Lokasi 3 (tidak ada pasangan valid) SENGAJA
// tidak ditandai — UI perbandingan harus nampilin "tidak ada
// perbandingan" utk keduanya, bukan memaksakan pasangan yang tidak jujur.
export const fieldEvidence = [
  { src: '/images/case-overview-1.JPG', type: 'DRONE', caption: 'Lokasi 1 — aerial view', location: 'Lokasi 1' },
  { src: '/images/case1-burned.JPG', type: 'DRONE', caption: 'Bekas pembakaran ditanami sawit', location: 'Lokasi 1', period: 'before', pairId: 'lokasi-1-burn-tbm' },
  { src: '/images/lokasi1-tbm.JPG', type: 'GROUND', caption: 'Tanaman Belum Menghasilkan (TBM)', location: 'Lokasi 1', period: 'after', pairId: 'lokasi-1-burn-tbm' },
  { src: '/images/lokasi2-aerial.JPG', type: 'DRONE', caption: 'Lokasi 2 — aerial view', location: 'Lokasi 2' },
  { src: '/images/lokasi2-tbm.JPG', type: 'GROUND', caption: 'TBM Lokasi 2 — penanaman 2023', location: 'Lokasi 2' },
  { src: '/images/case-overview-3.JPG', type: 'DRONE', caption: 'Lokasi 3 — aerial view', location: 'Lokasi 3' },
  { src: '/images/case3-field.JPG', type: 'GROUND', caption: 'Akses jalan sudah bisa dilalui mobil', location: 'Lokasi 3' },
  { src: '/images/pod-pais.JPG', type: 'GROUND', caption: 'PoD Pais — 3,1 km dari pusat lokasi', location: 'PoD' },
  { src: '/images/pod-baida.JPG', type: 'GROUND', caption: 'PoD Baida — 3,57 km', location: 'PoD' },
];
