// src/data/polygons.js
//
// SEMUA geometry (boundary AOI/desa/kasus) hidup DI SINI — dipakai kedua
// tab (chapters.js untuk tab Cerita, DashboardMap.jsx untuk tab Peta &
// Data). Jangan definisikan koordinat di tempat lain; edit di sini saja.
//
// Format: GeoJSON Feature standar. Koordinat di bawah adalah PLACEHOLDER
// (persegi kasar di sekitar area Sajingan Besar) — ganti dengan geometry
// asli hasil digitasi QGIS (export sebagai GeoJSON, EPSG:4326).
//
// TODO: ganti seluruh koordinat di file ini dengan data asli.

export const kecamatanBoundary = {
  type: 'Feature',
  properties: {
    id: 'kecamatan-sajingan-besar',
    name: 'Kecamatan Sajingan Besar',
    category: 'batas-wilayah',
  },
  geometry: {
    type: 'Polygon',
    coordinates: [
      [
        [108.95, 1.25],
        [109.20, 1.25],
        [109.20, 1.45],
        [108.95, 1.45],
        [108.95, 1.25],
      ],
    ],
  },
};

export const lokasi1Polygon = {
  type: 'Feature',
  properties: {
    id: 'lokasi-1',
    name: 'Lokasi 1',
    category: 'studi-kasus',
    areaHa: null,
  },
  geometry: {
    type: 'Polygon',
    coordinates: [
      [
        [109.055, 1.335],
        [109.070, 1.335],
        [109.070, 1.348],
        [109.055, 1.348],
        [109.055, 1.335],
      ],
    ],
  },
};

export const lokasi2Polygon = {
  type: 'Feature',
  properties: {
    id: 'lokasi-2',
    name: 'Lokasi 2',
    category: 'studi-kasus',
    areaHa: null,
  },
  geometry: {
    type: 'Polygon',
    coordinates: [
      [
        [109.030, 1.322],
        [109.045, 1.322],
        [109.045, 1.335],
        [109.030, 1.335],
        [109.030, 1.322],
      ],
    ],
  },
};

export const lokasi3Polygon = {
  type: 'Feature',
  properties: {
    id: 'lokasi-3',
    name: 'Lokasi 3',
    category: 'studi-kasus',
    areaHa: null,
    openedByBurning: true,
  },
  geometry: {
    type: 'Polygon',
    coordinates: [
      [
        [109.075, 1.310],
        [109.092, 1.310],
        [109.092, 1.325],
        [109.075, 1.325],
        [109.075, 1.310],
      ],
    ],
  },
};

export const untracedAreaPolygon = {
  type: 'Feature',
  properties: {
    id: 'area-belum-tertelusuri',
    name: 'Area Belum Tertelusuri',
    category: 'batas-wilayah',
  },
  geometry: {
    type: 'Polygon',
    coordinates: [
      [
        [109.010, 1.300],
        [109.025, 1.300],
        [109.025, 1.315],
        [109.010, 1.315],
        [109.010, 1.300],
      ],
    ],
  },
};

export const allCasePolygons = [lokasi1Polygon, lokasi2Polygon, lokasi3Polygon];
