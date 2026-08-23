// src/data/layers.js — Katalog layer tab Peta Interaktif
// Data asli: mill & PoD dari Tabel 2 & 3 laporan PDF
// Data lain masih dummy sampai GeoJSON asli tersedia

import {
  kecamatanBoundary,
  lokasi1Polygon,
  lokasi2Polygon,
  lokasi3Polygon,
} from './polygons.js';

const fc = (features) => ({ type: 'FeatureCollection', features });

export const LAYER_CATALOG = [
  // ---- AOI ----
  {
    id: 'kecamatan', name: 'Kec. Sajingan Besar', category: 'AOI',
    geometryType: 'polygon', color: '#f2f0e8',
    data: fc([kecamatanBoundary]),
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

  // ---- Tutupan Lahan (dummy — ganti dengan GeoJSON asli) ----
  {
    id: 'forest-cover', name: 'Forest Cover', category: 'Tutupan Lahan',
    geometryType: 'polygon', color: '#3f7a5c', data: null,
  },
  {
    id: 'planted-palm-oil', name: 'Planted Palm Oil', category: 'Tutupan Lahan',
    geometryType: 'polygon', color: '#e0c14d', data: null,
  },
  {
    id: 'deforestasi', name: 'Deforestasi', category: 'Tutupan Lahan',
    geometryType: 'polygon', color: '#c2503f', data: null,
  },

  // ---- Informasi Tambahan (dummy) ----
  {
    id: 'feg', name: 'Fungsi Ekosistem Gambut (FEG)', category: 'Informasi Tambahan',
    geometryType: 'polygon', color: '#8a5cc4', data: null,
  },
  {
    id: 'biodiversity', name: 'Sebaran Flora & Fauna', category: 'Informasi Tambahan',
    geometryType: 'point', color: '#4d8fe0', data: null,
  },
  {
    id: 'das', name: 'Daerah Aliran Sungai', category: 'Informasi Tambahan',
    geometryType: 'line', color: '#4d8fe0', data: null,
  },

  // ---- Status Legal (dummy — ganti kawasan_hutan_aoi.geojson) ----
  {
    id: 'kawasan-hutan', name: 'Kawasan Hutan (HL/HP/HPT)', category: 'Status Legal',
    geometryType: 'polygon', color: '#5c8a6f', data: null,
  },
  {
    id: 'perhutanan-sosial', name: 'Perhutanan Sosial', category: 'Status Legal',
    geometryType: 'polygon', color: '#8a5c6f', data: null,
  },

  // ---- Supply Chain — DATA ASLI dari Tabel 2 & 3 PDF ----
  // `hiddenFromPanel: true` — dikendalikan lewat toggle "Prediksi Supply Chain"
  {
    id: 'mills-terdekat',
    name: 'Mills Terdekat',
    category: 'Supply Chain',
    geometryType: 'icon-point',
    icon: 'mill',
    color: '#4d8fe0',
    hiddenFromPanel: true,
    data: fc([
      { type: 'Feature', properties: { name: 'Wana Hijau Semesta', group: 'DARMEX AGRO', ndpe: 'Non-NDPE', distanceKm: 25.67 }, geometry: { type: 'Point', coordinates: [109.597999, 1.515000] } },
      { type: 'Feature', properties: { name: 'Ledo Lestari', group: 'DARMEX AGRO', ndpe: 'Non-NDPE', distanceKm: 31.26 }, geometry: { type: 'Point', coordinates: [109.716423, 1.464745] } },
      { type: 'Feature', properties: { name: 'Wirata Daya Bangun Persada', group: 'DARMEX AGRO', ndpe: 'Non-NDPE', distanceKm: 35.36 }, geometry: { type: 'Point', coordinates: [109.602999, 1.429400] } },
      { type: 'Feature', properties: { name: 'Agronusa Investama 3 – Sambas', group: 'WILMAR GROUP', ndpe: 'NDPE', certification: 'RSPO, ISPO', distanceKm: 43.88 }, geometry: { type: 'Point', coordinates: [109.537148, 1.421490] } },
      { type: 'Feature', properties: { name: 'Ceria Prima 1', group: 'DARMEX AGRO', ndpe: 'Non-NDPE', distanceKm: 44.51 }, geometry: { type: 'Point', coordinates: [109.684100, 1.368900] } },
      { type: 'Feature', properties: { name: 'Ceria Prima 2', group: 'DARMEX AGRO', ndpe: 'Non-NDPE', distanceKm: 53.87 }, geometry: { type: 'Point', coordinates: [109.666917, 1.300768] } },
      { type: 'Feature', properties: { name: 'PT Kalimantan Subur Sawit (KSS) ⚠', group: 'UNKNOWN', ndpe: 'Non-NDPE', distanceKm: 61.07, primaryRisk: true }, geometry: { type: 'Point', coordinates: [109.877572, 1.333598] } },
      { type: 'Feature', properties: { name: 'PT Wawasan Kebun Nusantara (WKN) ⚠', group: 'KPN Plantation', ndpe: 'NDPE', certification: 'ISPO', distanceKm: 72.02, primaryRisk: true, potentialBuyers: 'P&G, Colgate-Palmolive' }, geometry: { type: 'Point', coordinates: [109.817139, 1.266890] } },
      { type: 'Feature', properties: { name: 'Musim Mas', group: 'MUSIM MAS', ndpe: 'NDPE', certification: 'RSPO, ISPO', distanceKm: 80.86 }, geometry: { type: 'Point', coordinates: [109.383631, 1.358028] } },
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
      { type: 'Feature', properties: { name: 'PoD Pais', fruitSource: "Sanatab & Kaliau'", distanceKm: 3.10, photo: '/images/pod-pais.jpg' }, geometry: { type: 'Point', coordinates: [109.601757, 1.657105] } },
      { type: 'Feature', properties: { name: 'PoD Baida', fruitSource: "Sanatab & Kaliau'", distanceKm: 3.57, photo: '/images/pod-baida.jpg' }, geometry: { type: 'Point', coordinates: [109.604266, 1.653802] } },
      { type: 'Feature', properties: { name: 'PoD Arpi', fruitSource: "Sanatab & Kaliau'", distanceKm: 4.95, photo: '/images/pod-arpi.jpg' }, geometry: { type: 'Point', coordinates: [109.590249, 1.671903] } },
      { type: 'Feature', properties: { name: 'PoD Pak Thomas', fruitSource: 'Sungai Bening, Santaban, Sanatab, Batang Air', distanceKm: 6.44 }, geometry: { type: 'Point', coordinates: [109.641092, 1.622351] } },
      { type: 'Feature', properties: { name: 'PoD Ika', fruitSource: 'Desa Santaban', distanceKm: 7.54 }, geometry: { type: 'Point', coordinates: [109.596890, 1.687970] } },
    ]),
  },
];

export const LAYER_CATEGORIES = [...new Set(LAYER_CATALOG.map((l) => l.category))];
