// src/data/polygons.js
//
// Kecamatan & 3 Lokasi Kasus — SEKARANG SEMUA POLYGON ASLI (bukan kotak
// placeholder lagi). Object di bawah dipakai sebagai fallback SEBELUM
// fetch runtime selesai (lihat MapController.jsx & DashboardMap.jsx —
// keduanya fetch '/geojson/batas-desa.geojson' & '/geojson/lokasi-fokus.geojson'
// lalu substitusi shape kotak ini dengan shape asli berdasarkan
// `properties.name`). Angka areaHa di bawah sudah disamakan dengan
// hasil digitasi asli (public/geojson/lokasi-fokus.geojson).

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

// Kecamatan — fallback bbox 5 desa (diganti fetch runtime dari batas-desa.geojson)
export const kecamatanBoundary = {
  type: 'Feature',
  properties: { name: 'Kecamatan Sajingan Besar', category: 'batas-wilayah' },
  geometry: box(109.585, 1.644, 0.35, 0.40),
};

// 3 Lokasi kasus — fallback kotak (diganti fetch runtime dari
// lokasi-fokus.geojson, hasil digitasi QGIS asli per Agustus 2026).
// Properti areaHa/desa/statusKawasan/aktor/tahunTanam di bawah sudah
// disamakan dengan file asli supaya popup & label tetap akurat SEBELUM
// fetch selesai (mis. koneksi lambat).
export const lokasi1Polygon = {
  type: 'Feature',
  properties: {
    name: 'Lokasi 1', category: 'studi-kasus',
    areaHa: 307.084, desa: 'SANATAB', statusKawasan: 'HPT', aktor: 'Outgrower', tahunTanam: 2023,
  },
  geometry: box(109.57527, 1.65804, 0.022, 0.014),
};
export const lokasi2Polygon = {
  type: 'Feature',
  properties: {
    name: 'Lokasi 2', category: 'studi-kasus',
    areaHa: 140.722, desa: 'SANATAB', statusKawasan: 'HPT', aktor: 'Outgrower', tahunTanam: 2023,
  },
  geometry: box(109.59320, 1.64645, 0.013, 0.010),
};
export const lokasi3Polygon = {
  type: 'Feature',
  properties: {
    name: 'Lokasi 3', category: 'studi-kasus',
    areaHa: 179.775, desa: "KALIAU'", statusKawasan: 'HPT', aktor: 'Outgrower', tahunTanam: 2025,
  },
  geometry: box(109.58668, 1.62635, 0.014, 0.011),
};
