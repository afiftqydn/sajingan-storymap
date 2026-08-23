// src/utils/geojsonBounds.js
//
// Hitung bounding box [[minLng,minLat],[maxLng,maxLat]] dari sebuah
// GeoJSON FeatureCollection — dipakai buat auto zoom-ke-layer begitu
// user drop file baru (lihat DashboardMap.jsx). Ditulis manual (bukan
// pakai turf) karena cuma butuh jalan-jalan lurus di semua koordinat,
// tidak butuh perhitungan geodesic.

function eachCoord(geometry, cb) {
  if (!geometry) return;
  const { type, coordinates } = geometry;
  if (type === 'Point') { cb(coordinates); return; }
  if (type === 'MultiPoint' || type === 'LineString') { coordinates.forEach(cb); return; }
  if (type === 'MultiLineString' || type === 'Polygon') { coordinates.forEach((ring) => ring.forEach(cb)); return; }
  if (type === 'MultiPolygon') { coordinates.forEach((poly) => poly.forEach((ring) => ring.forEach(cb))); return; }
  if (type === 'GeometryCollection') { (geometry.geometries ?? []).forEach((g) => eachCoord(g, cb)); }
}

export function getGeoJSONBounds(geojson) {
  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
  (geojson?.features ?? []).forEach((f) => {
    eachCoord(f.geometry, ([x, y]) => {
      if (x < minX) minX = x;
      if (y < minY) minY = y;
      if (x > maxX) maxX = x;
      if (y > maxY) maxY = y;
    });
  });
  if (minX === Infinity) return null; // tidak ada koordinat valid ditemukan
  return [[minX, minY], [maxX, maxY]];
}
