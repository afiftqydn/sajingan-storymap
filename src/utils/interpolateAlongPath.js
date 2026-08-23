// src/utils/interpolateAlongPath.js
//
// Cari titik [lng, lat] di sepanjang polyline pada progress `t` (0-1).
// Dipakai buat animasi "titik berjalan" di sepanjang rute suplai
// (RouteAnimationLayer.jsx) — TIDAK pakai turf.js, sengaja bikin sendiri
// yang ringan karena cuma butuh interpolasi linear sederhana (jarak
// Euclidean di ruang lng/lat), bukan perhitungan geodesic presisi tinggi
// (ini murni efek visual, bukan pengukuran jarak asli).

// Precompute jarak kumulatif SEKALI, return fungsi lookup yang ringan
// buat dipanggil BERULANG (mis. tiap frame animasi). Sebelumnya
// `interpolateAlongPath` menghitung ulang array `cumulative` dari nol
// SETIAP KALI dipanggil — padahal koordinat path-nya statis selama
// animasi jalan (60x/detik × jumlah chain = kerja berulang sia-sia).
// Pakai ini kalau path yang sama akan di-lookup berkali-kali (seperti
// di animation loop); pakai `interpolateAlongPath` biasa kalau cuma
// perlu sekali pakai.
export function createPathInterpolator(coords) {
  if (!coords || coords.length === 0) return () => null;
  if (coords.length === 1) {
    const single = coords[0];
    return () => single;
  }

  const cumulative = [0];
  for (let i = 1; i < coords.length; i++) {
    const [x1, y1] = coords[i - 1];
    const [x2, y2] = coords[i];
    cumulative.push(cumulative[i - 1] + Math.hypot(x2 - x1, y2 - y1));
  }
  const totalLength = cumulative[cumulative.length - 1];

  return function interpolate(t) {
    if (totalLength === 0) return coords[0];
    const clampedT = Math.max(0, Math.min(1, t));
    const targetDistance = clampedT * totalLength;

    for (let i = 1; i < cumulative.length; i++) {
      if (targetDistance <= cumulative[i]) {
        const segStart = cumulative[i - 1];
        const segEnd = cumulative[i];
        const segT = segEnd === segStart ? 0 : (targetDistance - segStart) / (segEnd - segStart);
        const [x1, y1] = coords[i - 1];
        const [x2, y2] = coords[i];
        return [x1 + (x2 - x1) * segT, y1 + (y2 - y1) * segT];
      }
    }
    return coords[coords.length - 1];
  };
}

// Versi sekali-pakai (hitung cumulative tiap panggilan) — dipertahankan
// buat pemakaian di luar loop animasi, di mana precompute tidak ada
// gunanya karena cuma dipanggil sekali.
export function interpolateAlongPath(coords, t) {
  return createPathInterpolator(coords)(t);
}
