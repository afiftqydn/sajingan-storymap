// src/data/layers.js
//
// Katalog SEMUA layer yang bisa ditoggle di tab "Peta & Data".
// DashboardMap.jsx generic — render apa pun yang ada di LAYER_CATALOG,
// tidak hardcode kategori. Nambah layer baru = nambah satu objek di sini,
// isi `geometryType` yang benar ('polygon' | 'point' | 'line').
//
// TODO: ganti `data: null` dengan GeoJSON asli (FeatureCollection) begitu
// tersedia. Sebelum diisi, layer tetap muncul di UI (checkbox) tapi tidak
// render apa-apa di peta — itu behavior yang diharapkan untuk data dummy.

import {
  kecamatanBoundary,
  lokasi1Polygon,
  lokasi2Polygon,
  lokasi3Polygon,
  untracedAreaPolygon,
} from './polygons.js';

export const LAYER_CATALOG = [
  // ---- Batas Wilayah (asli, dari polygons.js) ----
  {
    id: 'kecamatan',
    name: 'Kecamatan',
    category: 'Batas Wilayah',
    geometryType: 'polygon',
    color: '#f2f0e8',
    data: {
      type: 'FeatureCollection',
      features: [kecamatanBoundary],
    },
  },
  {
    id: 'kasus',
    name: 'Kasus (3 Lokasi)',
    category: 'Batas Wilayah',
    geometryType: 'polygon',
    color: '#d9a441',
    data: {
      type: 'FeatureCollection',
      features: [lokasi1Polygon, lokasi2Polygon, lokasi3Polygon],
    },
  },
  {
    id: 'area-belum-tertelusuri',
    name: 'Area Belum Tertelusuri',
    category: 'Batas Wilayah',
    geometryType: 'polygon',
    color: '#9fb0a8',
    data: {
      type: 'FeatureCollection',
      features: [untracedAreaPolygon],
    },
  },

  // ---- Tutupan Lahan (dummy) ----
  {
    id: 'forest-cover-2015',
    name: 'Tutupan Hutan 2015',
    category: 'Tutupan Lahan',
    geometryType: 'polygon',
    color: '#3f7a5c',
    data: null, // TODO: GeoJSON tutupan hutan 2015
  },
  {
    id: 'forest-cover-2026',
    name: 'Tutupan Hutan 2026',
    category: 'Tutupan Lahan',
    geometryType: 'polygon',
    color: '#2c5943',
    data: null, // TODO: GeoJSON tutupan hutan 2026
  },
  {
    id: 'planted-palm',
    name: 'Kebun Sawit Tertanam',
    category: 'Tutupan Lahan',
    geometryType: 'polygon',
    color: '#e0c14d',
    data: null, // TODO
  },
  {
    id: 'deforestation-to-palm',
    name: 'Deforestasi → Sawit',
    category: 'Tutupan Lahan',
    geometryType: 'polygon',
    color: '#c2503f',
    // Catatan: layer ini SENGAJA reuse polygon Kasus 1/2/3 kalau memang
    // lokasi yang sama (bukaan hutan yang terkonfirmasi jadi sawit) —
    // bukan data terpisah. Lihat catatan di README lama.
    data: {
      type: 'FeatureCollection',
      features: [lokasi1Polygon, lokasi2Polygon, lokasi3Polygon],
    },
  },

  // ---- Status Legal (dummy) ----
  {
    id: 'kawasan-hutan-legal',
    name: 'Kawasan Hutan (Legal)',
    category: 'Status Legal',
    geometryType: 'polygon',
    color: '#5c8a6f',
    data: null, // TODO
  },
  {
    id: 'perhutanan-sosial',
    name: 'Perhutanan Sosial',
    category: 'Status Legal',
    geometryType: 'polygon',
    color: '#8a5c6f',
    data: null, // TODO
  },

  // ---- Rantai Pasok (dummy) ----
  {
    id: 'palm-oil-dealer',
    name: 'Palm Oil Dealer',
    category: 'Rantai Pasok',
    geometryType: 'point',
    color: '#d9a441',
    data: null, // TODO: titik lokasi dealer
  },
  {
    id: 'route-to-pod',
    name: 'Rute ke POD',
    category: 'Rantai Pasok',
    geometryType: 'line',
    color: '#d9a44199',
    data: null, // TODO
  },
  {
    id: 'mills',
    name: 'Mills',
    category: 'Rantai Pasok',
    geometryType: 'point',
    color: '#c2503f',
    data: null, // TODO: titik lokasi mill/PKS
  },
  {
    id: 'route-to-mills',
    name: 'Rute ke PKS',
    category: 'Rantai Pasok',
    geometryType: 'line',
    color: '#c2503f99',
    data: null, // TODO
  },

  // ---- Biodiversitas (dummy) ----
  {
    id: 'biodiversity',
    name: 'Sebaran Flora & Fauna',
    category: 'Biodiversitas',
    geometryType: 'point',
    color: '#4d8fe0',
    data: null, // TODO: dari IUCN RedList / iNaturalist / GBIF
  },

  // ---- Hidrologi (dummy) ----
  {
    id: 'das',
    name: 'Daerah Aliran Sungai',
    category: 'Hidrologi',
    geometryType: 'line',
    color: '#4d8fe0',
    data: null, // TODO: 4 sungai
  },
];

export const LAYER_CATEGORIES = [...new Set(LAYER_CATALOG.map((l) => l.category))];
