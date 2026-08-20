// src/mapStyle.js
//
// Basemap satelit — dipakai KEDUA tab (Cerita & Peta/Data).
// Ganti di SINI kalau mau ganti basemap; jangan duplikat di komponen lain.
//
// Esri World Imagery: gratis, tanpa API key. BUKAN Google Satellite —
// tile Google di luar produk resmi mereka melanggar ToS dan berisiko diblokir.
//
// Gotcha: domain yang benar server.arcgisonline.com, BUKAN server.arcgis.com.
// Salah ketik ini bikin citra gagal dimuat tanpa error yang jelas.

export const mapStyle = {
  version: 8,
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

// Alternatif basemap kalau Esri bermasalah (mis. diblokir jaringan kantor):
// - EOX Sentinel-2 cloudless (gratis, ~10m resolusi):
//   https://tiles.maps.eox.at/wmts/1.0.0/s2cloudless-2020_3857/default/g/{z}/{y}/{x}.jpg
// - Google Maps Platform Tiles API (resmi tapi butuh API key + billing)
// - Mapbox Satellite (access token, berbayar setelah kuota gratis)
