// src/data/polygons.js
//
// Koordinat geometri — PLACEHOLDER berdasarkan titik tengah dari laporan PDF.
// Akan diganti GeoJSON asli begitu file tersedia.
// Koordinat asli per PDF:
//   Lokasi 1 — center: 1.65804, 109.57527 — 307 ha
//   Lokasi 2 — center: 1.64645, 109.59320 — 133 ha
//   Lokasi 3 — center: 1.62635, 109.58668 — 151 ha

function box(cx, cy, wDeg, hDeg, props = {}) {
  return {
    type: 'Feature',
    properties: props,
    geometry: {
      type: 'Polygon',
      coordinates: [[
        [cx - wDeg / 2, cy - hDeg / 2],
        [cx + wDeg / 2, cy - hDeg / 2],
        [cx + wDeg / 2, cy + hDeg / 2],
        [cx - wDeg / 2, cy + hDeg / 2],
        [cx - wDeg / 2, cy - hDeg / 2],
      ]],
    },
  };
}

// Batas kecamatan — placeholder kotak besar
export const kecamatanBoundary = {
  type: 'Feature',
  properties: { name: 'Kecamatan Sajingan Besar', category: 'batas-wilayah' },
  geometry: {
    type: 'Polygon',
    coordinates: [[
      [109.43, 1.43], [109.75, 1.43], [109.75, 1.82],
      [109.43, 1.82], [109.43, 1.43],
    ]],
  },
};

// Lokasi 1 — 307 ha, sekitar 0.022° x 0.013° (placeholder sampai GeoJSON asli ada)
export const lokasi1Polygon = {
  type: 'Feature',
  properties: {
    name: 'Lokasi 1',
    category: 'studi-kasus',
    areaHa: 307.083,
    yearOpened: 2024,
    status: 'TBM',
    kawasan: 'HPT',
    lat: 1.65804,
    lng: 109.57527,
  },
  ...box(109.57527, 1.65804, 0.022, 0.014, {}).geometry && {},
  geometry: box(109.57527, 1.65804, 0.022, 0.014).geometry,
};

// Lokasi 2 — 133 ha, sekitar 0.013° x 0.010°
export const lokasi2Polygon = {
  type: 'Feature',
  properties: {
    name: 'Lokasi 2',
    category: 'studi-kasus',
    areaHa: 133.588,
    yearOpened: 2023,
    status: 'TBM',
    kawasan: 'HPT',
    lat: 1.64645,
    lng: 109.59320,
  },
  geometry: box(109.59320, 1.64645, 0.013, 0.010).geometry,
};

// Lokasi 3 — 151 ha, sekitar 0.014° x 0.011°
export const lokasi3Polygon = {
  type: 'Feature',
  properties: {
    name: 'Lokasi 3',
    category: 'studi-kasus',
    areaHa: 151.618,
    yearOpened: 2022,
    status: 'TBM',
    kawasan: 'HPT',
    lat: 1.62635,
    lng: 109.58668,
  },
  geometry: box(109.58668, 1.62635, 0.014, 0.011).geometry,
};
