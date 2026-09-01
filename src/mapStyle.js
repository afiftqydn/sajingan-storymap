// src/mapStyle.js
//
// Basemap satelit — dipakai SEMUA tab (Storymap, Peta Interaktif,
// Dashboard). Ganti di SINI kalau mau ganti basemap; jangan duplikat
// di komponen lain.
//
// Esri World Imagery: gratis, tanpa API key. BUKAN Google Satellite —
// tile Google di luar produk resmi mereka melanggar ToS dan berisiko diblokir.
//
// Gotcha: domain yang benar server.arcgisonline.com, BUKAN server.arcgis.com.
// Salah ketik ini bikin citra gagal dimuat tanpa error yang jelas.

export const mapStyle = {
  version: 8,
  // WAJIB ada kalau mau pakai layer symbol dengan text-field (label
  // teks) di mana pun di app — tanpa ini, MapLibre gagal render teks
  // TANPA error yang jelas (cuma label kosong, gampang kelewat pas
  // debug). Dipakai pertama kali oleh RouteAnimationLayer.jsx (label
  // titik mill/dealer/kasus).
  glyphs: 'https://fonts.openmaptiles.org/{fontstack}/{range}.pbf',
  sources: {
    'satellite': {
      type: 'raster',
      tiles: [
        'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
      ],
      tileSize: 256,
      attribution:
        'Tiles &copy; Esri — Source: Esri, Maxar, Earthstar Geographics',
    },
  },
  layers: [
    {
      id: 'satellite-layer',
      type: 'raster',
      source: 'satellite',
      minzoom: 0,
      maxzoom: 19,
    },
  ],
};

// Katalog basemap alternatif — dipakai tab Peta Interaktif untuk opsi
// "citra lain yang bisa dipilih". Source id & layer id SELALU 'satellite'
// / 'satellite-layer' (sama dengan di atas) supaya gampang di-swap:
// tinggal remove+re-add source itu saja waktu user ganti pilihan, tanpa
// perlu sentuh layer overlay lain (AOI, kawasan hutan, dst) yang sudah
// ditumpuk di atasnya. `esri-satellite` HARUS tetap index 0 — itu yang
// dipakai sebagai default awal (lihat useMapEngine.js, useState(BASEMAP_
// OPTIONS[0].id)), citra satelit polos bawaan, bukan varian lain.
export const BASEMAP_OPTIONS = [
  {
    id: 'esri-satellite',
    name: 'Esri World Imagery (Satelit)',
    tiles: ['https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'],
    tileSize: 256,
    attribution: 'Tiles &copy; Esri — Source: Esri, Maxar, Earthstar Geographics',
  },
  {
    id: 'esri-topo',
    name: 'Esri World Topographic',
    tiles: ['https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}'],
    tileSize: 256,
    attribution: 'Tiles &copy; Esri — Source: Esri, HERE, Garmin, USGS',
  },
  {
    // Basemap gelap — gaya visual yang sama dengan preset dark mapcn
    // (lihat BasemapPicker.jsx), tapi tile-nya dari CARTO Dark Matter:
    // gratis, tanpa API key, sama seperti dua basemap Esri di atas.
    id: 'carto-dark',
    name: 'Dark Matter (CARTO)',
    tiles: [
      'https://a.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png',
      'https://b.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png',
      'https://c.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png',
      'https://d.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png',
    ],
    tileSize: 256,
    attribution: '&copy; OpenStreetMap contributors &copy; CARTO',
  },
];

// Info sumber citra untuk badge di peta — dipakai MapController.jsx
// dan DashboardMap.jsx supaya teksnya konsisten di semua tab.
//
// PENTING soal `year`: Esri World Imagery itu MOSAIC dari banyak provider
// (Maxar, Earthstar Geographics, dll) yang tanggal potretnya BEDA-BEDA per
// lokasi — bukan citra satu tahun tunggal secara global. Jangan asal isi
// satu tahun tanpa verifikasi.
//
// Cara dapat tahun/tanggal akurat untuk AOI Sajingan Besar:
// 1. Buka Esri World Imagery Wayback: https://livingatlas.arcgis.com/wayback/
// 2. Geser ke koordinat area studi (lihat polygons.js untuk koordinatnya)
// 3. Wayback akan tunjukkan tanggal rilis citra yang tersedia untuk area itu
// 4. Isi field `year` di bawah dengan tanggal/rentang yang kamu dapat
//
export const imagerySource = {
  name: 'Esri World Imagery',
  provider: 'Esri, Maxar, Earthstar Geographics',
  year: 'citra terkini, tanggal bervariasi per lokasi',
};
