// src/data/polygons.js
//
// Polygon ASLI dari GeoJSON yang diupload.
// Kecamatan: 5 polygon desa dari AOI_BARU.geojson (BIG batasdesa)
// Lokasi 1/2/3: MASIH PLACEHOLDER — user belum punya polygon digitasi terpisah.
//               Perlu diexport dari QGIS sebagai GeoJSON per lokasi.

// Batas kecamatan — merge runtime dari batas-desa.geojson (5 polygon desa)
// akan di-fetch di MapController.jsx saat load. Untuk chapters.js tetap pakai
// placeholder sampai fetch selesai.
function box(cx, cy, wDeg, hDeg) {
  return {
    type: 'Polygon',
    coordinates: [[
      [cx - wDeg / 2, cy - hDeg / 2],
      [cx + wDeg / 2, cy - hDeg / 2],
      [cx + wDeg / 2, cy + hDeg / 2],
      [cx - wDeg / 2, cy + hDeg / 2],
      [cx - wDeg / 2, cy - hDeg / 2],
    ]],
  };
}

// Kecamatan — placeholder bbox dari 5 desa (akan diganti fetch runtime)
export const kecamatanBoundary = {
  type: 'Feature',
  properties: { name: 'Kecamatan Sajingan Besar', category: 'batas-wilayah' },
  geometry: box(109.585, 1.644, 0.35, 0.40),
};

// 3 Lokasi kasus — MASIH PLACEHOLDER
// Koordinat center dari laporan PDF (sudah benar), ukuran kotak kasar
export const lokasi1Polygon = {
  type: 'Feature',
  properties: { name: 'Lokasi 1', category: 'studi-kasus', areaHa: 307.083, yearOpened: 2024 },
  geometry: box(109.57527, 1.65804, 0.022, 0.014),
};
export const lokasi2Polygon = {
  type: 'Feature',
  properties: { name: 'Lokasi 2', category: 'studi-kasus', areaHa: 133.588, yearOpened: 2023 },
  geometry: box(109.59320, 1.64645, 0.013, 0.010),
};
export const lokasi3Polygon = {
  type: 'Feature',
  properties: { name: 'Lokasi 3', category: 'studi-kasus', areaHa: 151.618, yearOpened: 2022 },
  geometry: box(109.58668, 1.62635, 0.014, 0.011),
};
