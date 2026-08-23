// src/utils/distance.js
//
// Jarak geografis ASLI dalam kilometer (rumus Haversine — memperhitungkan
// kelengkungan bumi), bukan jarak piksel/layar seperti yang dipakai
// interpolateAlongPath.js (itu buat animasi visual, ini buat angka yang
// ditampilkan ke user, harus akurat).

const EARTH_RADIUS_KM = 6371;

export function haversineKm([lng1, lat1], [lng2, lat2]) {
  const toRad = (deg) => (deg * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return EARTH_RADIUS_KM * c;
}

// Cari titik TERDEKAT dari `fromCoord` di antara `points` — dipakai buat
// nentuin "Mill terdekat"/"PoD terdekat" secara ASLI (dihitung, bukan
// dipilih manual).
export function findNearest(fromCoord, points, getCoord = (p) => p.coords) {
  let nearest = null;
  let minDistanceKm = Infinity;
  for (const point of points) {
    const d = haversineKm(fromCoord, getCoord(point));
    if (d < minDistanceKm) {
      minDistanceKm = d;
      nearest = point;
    }
  }
  return { point: nearest, distanceKm: minDistanceKm };
}
