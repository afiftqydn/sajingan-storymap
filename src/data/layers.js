// src/data/layers.js — Katalog layer tab Peta Interaktif
// Layer dengan GeoJSON tersedia akan di-fetch runtime dari public/geojson/
// Layer tanpa file → data: null (tidak tampil sampai file tersedia)

import {
  kecamatanBoundary,
  lokasi1Polygon,
  lokasi2Polygon,
  lokasi3Polygon,
} from './polygons.js';

const fc = (features) => ({ type: 'FeatureCollection', features });

// Layer yang perlu fetch GeoJSON dari public/geojson/
// `geojsonPath` di-fetch lazy saat user centang checkbox pertama kali
export const LAYER_CATALOG = [
  // ── AOI ──
  {
    id: 'kecamatan', name: 'Batas Desa (Sajingan Besar)', category: 'AOI',
    geometryType: 'polygon', color: '#f2f0e8', labelField: 'NAMOBJ', outlineOnly: true,
    geojsonPath: '/geojson/batas-desa.geojson',
    data: fc([kecamatanBoundary]), // fallback sampai fetch selesai
  },
  {
    id: 'lokasi-1', name: 'Lokasi 1 (307 ha)', category: 'AOI',
    geometryType: 'polygon', color: '#ff5a3c', labelField: 'name',
    geojsonPath: '/geojson/lokasi-1.geojson',
    data: fc([lokasi1Polygon]), // fallback sampai fetch selesai
  },
  {
    id: 'lokasi-2', name: 'Lokasi 2 (141 ha)', category: 'AOI',
    geometryType: 'polygon', color: '#ff5a3c', labelField: 'name',
    geojsonPath: '/geojson/lokasi-2.geojson',
    data: fc([lokasi2Polygon]), // fallback sampai fetch selesai
  },
  {
    id: 'lokasi-3', name: 'Lokasi 3 (180 ha)', category: 'AOI',
    geometryType: 'polygon', color: '#ff5a3c', labelField: 'name',
    geojsonPath: '/geojson/lokasi-3.geojson',
    data: fc([lokasi3Polygon]), // fallback sampai fetch selesai
  },

  // ── Tutupan Lahan ──
  {
    id: 'forest-cover', name: 'Forest Cover', category: 'Tutupan Lahan',
    geometryType: 'polygon', color: '#3f7a5c',
    geojsonPath: '/geojson/forest-cover.geojson',
    data: null,
  },
  {
    id: 'planted-palm-oil', name: 'Planted Palm Oil', category: 'Tutupan Lahan',
    geometryType: 'polygon', color: '#e0c14d',
    geojsonPath: '/geojson/planted-palm-oil.geojson',
    data: null,
  },
  {
    id: 'deforestasi', name: 'Deforestasi (2020–2025)', category: 'Tutupan Lahan',
    geometryType: 'polygon', color: '#c2503f',
    geojsonPath: '/geojson/deforestasi.geojson',
    data: null,
  },

  // ── Informasi Tambahan ──
  {
    id: 'feg', name: 'Fungsi Ekosistem Gambut', category: 'Informasi Tambahan',
    geometryType: 'polygon', color: '#8a5cc4',
    geojsonPath: '/geojson/feg.geojson',
    data: null,
  },
  {
    id: 'biodiversity', name: 'Sebaran Flora & Fauna', category: 'Informasi Tambahan',
    geometryType: 'point', color: '#4d8fe0',
    geojsonPath: '/geojson/biodiversity.geojson',
    data: null,
  },

  // ── Status Legal ──
  // Warna sesuai Perdirjen PKTL Kementerian LHK No.
  // P.6/PKTL/SETDIT/KUM.1/11/2017 tentang Petunjuk Teknis Penggambaran
  // dan Penyajian Peta Lingkungan Hidup dan Kehutanan:
  //   Hutan Lindung (HL)                 RGB 2,173,0    -> #02ad00
  //   Hutan Produksi Tetap (HP)          RGB 255,255,0  -> #ffff00
  //   Hutan Produksi Terbatas (HPT)      RGB 138,242,0  -> #8af200
  //   Hutan Produksi Konversi (HPK)      RGB 255,94,255 -> #ff5eff
  //   Suaka Alam/Pelestarian Alam (TWA)  RGB 173,63,255 -> #ad3fff
  // `keterangan` di kawasan-hutan.geojson persis pakai istilah di atas.
  {
    id: 'kawasan-hutan', name: 'Kawasan Hutan (Warna Resmi KLHK)', category: 'Status Legal',
    geometryType: 'polygon', color: '#8af200', labelField: 'keterangan',
    fillColorExpression: [
      'match', ['get', 'keterangan'],
      'Hutan Lindung', '#02ad00',
      'Hutan Produksi Tetap', '#ffff00',
      'Hutan Produksi Terbatas', '#8af200',
      'Hutan Produksi Konversi', '#ff5eff',
      'Taman Wisata Alam/Hutan Wisata', '#ad3fff',
      '#5c8a6f', // fallback kalau ada kategori lain yang belum terdaftar
    ],
    geojsonPath: '/geojson/kawasan-hutan.geojson',
    data: null,
  },

  // ── Supply Chain (hidden — dikontrol via toggle "Prediksi Supply Chain") ──
  {
    id: 'mills-terdekat',
    name: 'Mills Terdekat',
    category: 'Supply Chain',
    geometryType: 'icon-point',
    icon: 'mill',
    color: '#4d8fe0',
    labelField: 'name',
    hiddenFromPanel: true,
    data: fc([
      { type: 'Feature', properties: { name: 'Wana Hijau Semesta', group: 'WANA HIJAU SEMESTA', rspo: 'Not RSPO Certified' }, geometry: { type: 'Point', coordinates: [109.598000, 1.515000] } },
      { type: 'Feature', properties: { name: 'Ledo Lestari', group: 'DARMEX AGRO', rspo: 'Not RSPO Certified' }, geometry: { type: 'Point', coordinates: [109.716423, 1.464745] } },
      { type: 'Feature', properties: { name: 'Wirata Daya Bangun Persada', group: 'DARMEX AGRO', rspo: 'Not RSPO Certified' }, geometry: { type: 'Point', coordinates: [109.603000, 1.429400] } },
      { type: 'Feature', properties: { name: 'Agronusa Investama 3 – Sambas', group: 'WILMAR GROUP', rspo: 'RSPO Certified' }, geometry: { type: 'Point', coordinates: [109.537150, 1.421490] } },
      { type: 'Feature', properties: { name: 'Ceria Prima 1', group: 'DARMEX AGRO', rspo: 'Not RSPO Certified' }, geometry: { type: 'Point', coordinates: [109.684100, 1.368900] } },
      { type: 'Feature', properties: { name: 'Ceria Prima 2', group: 'DARMEX AGRO', rspo: 'Not RSPO Certified' }, geometry: { type: 'Point', coordinates: [109.666917, 1.300768] } },
      { type: 'Feature', properties: { name: 'Kalimantan Subur Sawit (KSS)', group: 'UNKNOWN', rspo: 'Not RSPO Certified', primaryRisk: true }, geometry: { type: 'Point', coordinates: [109.877572, 1.333598] } },
      { type: 'Feature', properties: { name: 'Wawasan Kebun Nusantara (WKN)', group: 'GAMA PLANTATIONS', rspo: 'Not RSPO Certified', primaryRisk: true }, geometry: { type: 'Point', coordinates: [109.817139, 1.266890] } },
      { type: 'Feature', properties: { name: 'Sarana Esa Cita (Musim Mas)', group: 'MUSIM MAS', rspo: 'RSPO Certified' }, geometry: { type: 'Point', coordinates: [109.383631, 1.358028] } },
    ]),
  },
  {
    id: 'pod-terdekat',
    name: 'PoD Terdekat',
    category: 'Supply Chain',
    geometryType: 'icon-point',
    icon: 'pod',
    color: '#f2c94c',
    labelField: 'name',
    hiddenFromPanel: true,
    // `photo` SENGAJA tidak ada lagi di sini — PoD sekarang cuma ikon +
    // popup nama singkat seperti Mills, tidak ada elemen foto di peta
    // sama sekali (thumbnail bulat maupun callout foto sebelumnya).
    data: fc([
      { type: 'Feature', properties: { name: 'PoD Pais', fruitSource: 'Desa Santaban', destination: 'Mill KWN' }, geometry: { type: 'Point', coordinates: [109.601757, 1.657105] } },
      { type: 'Feature', properties: { name: 'PoD Baida', fruitSource: 'Desa Santaban', destination: 'Mill KWN' }, geometry: { type: 'Point', coordinates: [109.604266, 1.653802] } },
      { type: 'Feature', properties: { name: 'PoD Arpi', fruitSource: 'Desa Santaban', destination: 'Mill Jagoy, Mill KSS' }, geometry: { type: 'Point', coordinates: [109.590250, 1.671903] } },
      { type: 'Feature', properties: { name: 'PoD Pak Thomas', fruitSource: 'Sungai Bening, Santaban, Sanatab, Batang Air', destination: 'Mill KWN' }, geometry: { type: 'Point', coordinates: [109.641092, 1.622351] } },
      { type: 'Feature', properties: { name: 'PoD Ika', fruitSource: 'Desa Santaban', destination: 'Mill KSS' }, geometry: { type: 'Point', coordinates: [109.596890, 1.687970] } },
    ]),
  },
];

export const LAYER_CATEGORIES = [...new Set(LAYER_CATALOG.map((l) => l.category))];
