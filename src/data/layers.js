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
    geometryType: 'polygon', color: '#f2f0e8',
    geojsonPath: '/geojson/batas-desa.geojson',
    data: fc([kecamatanBoundary]), // fallback sampai fetch selesai
  },
  {
    id: 'lokasi-1', name: 'Lokasi 1 (307 ha)', category: 'AOI',
    geometryType: 'polygon', color: '#ff5a3c',
    data: fc([lokasi1Polygon]),
  },
  {
    id: 'lokasi-2', name: 'Lokasi 2 (133 ha)', category: 'AOI',
    geometryType: 'polygon', color: '#ff5a3c',
    data: fc([lokasi2Polygon]),
  },
  {
    id: 'lokasi-3', name: 'Lokasi 3 (151 ha)', category: 'AOI',
    geometryType: 'polygon', color: '#ff5a3c',
    data: fc([lokasi3Polygon]),
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
  {
    id: 'kawasan-hutan', name: 'Kawasan Hutan (HL/HP/HPT)', category: 'Status Legal',
    geometryType: 'polygon', color: '#5c8a6f',
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
    hiddenFromPanel: true,
    data: fc([
      { type: 'Feature', properties: { name: 'PoD Pais', fruitSource: 'Desa Santaban', destination: 'Mill KWN', photo: '/images/pod-pais.jpg' }, geometry: { type: 'Point', coordinates: [109.601757, 1.657105] } },
      { type: 'Feature', properties: { name: 'PoD Baida', fruitSource: 'Desa Santaban', destination: 'Mill KWN', photo: '/images/pod-baida.jpg' }, geometry: { type: 'Point', coordinates: [109.604266, 1.653802] } },
      { type: 'Feature', properties: { name: 'PoD Arpi', fruitSource: 'Desa Santaban', destination: 'Mill Jagoy, Mill KSS', photo: '/images/pod-arpi.jpg' }, geometry: { type: 'Point', coordinates: [109.590250, 1.671903] } },
      { type: 'Feature', properties: { name: 'PoD Pak Thomas', fruitSource: 'Sungai Bening, Santaban, Sanatab, Batang Air', destination: 'Mill KWN', photo: '/images/pod-pak-thomas.jpg' }, geometry: { type: 'Point', coordinates: [109.589339, 1.682264] } },
      { type: 'Feature', properties: { name: 'PoD Ika', fruitSource: 'Desa Santaban', destination: 'Mill KSS', photo: '/images/pod-ika.jpg' }, geometry: { type: 'Point', coordinates: [109.596843, 1.687859] } },
    ]),
  },
];

export const LAYER_CATEGORIES = [...new Set(LAYER_CATALOG.map((l) => l.category))];
