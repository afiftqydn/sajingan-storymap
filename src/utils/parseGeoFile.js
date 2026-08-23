// src/utils/parseGeoFile.js
//
// Parse file yang di-drop user jadi GeoJSON FeatureCollection biasa.
// Dukung: .geojson / .json (langsung), .shp mentah (geometri saja,
// tanpa atribut — MapLibre-nya tetap bisa render), .zip (bundle
// shapefile lengkap .shp+.dbf+.prj, atribut ikut lewat shpjs).
//
// PENTING (performa): `shpjs` SENGAJA di-import DINAMIS (`await
// import('shpjs')`), bukan static import di atas file. shpjs ukurannya
// ~720KB (belum di-minify) — kalau di-import static, dia ikut masuk ke
// bundle UTAMA dan dimuat SETIAP kali halaman dibuka, padahal cuma
// dipakai kalau user benar-benar drop file .shp/.zip (fitur yang jarang
// dipakai). Dengan import dinamis, Vite otomatis pisahkan shpjs jadi
// chunk terpisah yang cuma di-fetch pas fungsi ini benar-benar dipanggil
// dengan file .shp/.zip — user yang cuma upload .geojson (atau tidak
// upload sama sekali) tidak pernah men-download shpjs sama sekali.

function stripExtension(filename) {
  return filename.replace(/\.[^/.]+$/, '');
}

function normalizeToFeatureCollection(geojson) {
  // shpjs kadang return array of FeatureCollection (multi-layer dalam
  // satu zip) — gabungkan jadi satu kalau begitu.
  if (Array.isArray(geojson)) {
    const features = geojson.flatMap((fc) => fc.features ?? []);
    return { type: 'FeatureCollection', features };
  }
  return geojson;
}

export async function parseGeoFile(file) {
  const ext = file.name.split('.').pop()?.toLowerCase();
  const name = stripExtension(file.name);

  if (ext === 'geojson' || ext === 'json') {
    const text = await file.text();
    let parsed;
    try {
      parsed = JSON.parse(text);
    } catch {
      throw new Error(`"${file.name}" bukan JSON yang valid.`);
    }
    return { name, geojson: normalizeToFeatureCollection(parsed) };
  }

  if (ext === 'zip') {
    const { default: shp } = await import('shpjs');
    const buffer = await file.arrayBuffer();
    const geojson = await shp(buffer);
    return { name, geojson: normalizeToFeatureCollection(geojson) };
  }

  if (ext === 'shp') {
    // .shp sendirian (tanpa .dbf) — cuma geometri, atribut kosong.
    // Kalau butuh atribut ikut, minta user drop versi .zip (bundle
    // lengkap .shp+.dbf+.prj) sebagai gantinya.
    const { default: shp } = await import('shpjs');
    const buffer = await file.arrayBuffer();
    const geometries = await shp.parseShp(buffer);
    const geojson = {
      type: 'FeatureCollection',
      features: geometries.map((geometry) => ({ type: 'Feature', properties: {}, geometry })),
    };
    return { name, geojson };
  }

  throw new Error(
    `Format ".${ext}" tidak didukung. Pakai .geojson, .json, .shp, atau .zip (bundle shapefile lengkap).`
  );
}

// Tentukan geometryType umum ('polygon' | 'point' | 'line') dari fitur
// pertama — dipakai buat nentuin cara render (fill/circle/line).
export function inferGeometryType(geojson) {
  const type = geojson?.features?.[0]?.geometry?.type ?? '';
  if (type.includes('Polygon')) return 'polygon';
  if (type.includes('LineString')) return 'line';
  if (type.includes('Point')) return 'point';
  return 'polygon'; // fallback aman
}
