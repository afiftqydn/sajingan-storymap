// src/utils/mapIcons.js
//
// Icon SVG kustom buat titik Mills & PoD di peta (bukan lingkaran polos)
// — MapLibre butuh ini didaftarkan lewat `map.addImage()` SEBELUM layer
// symbol yang pakai `icon-image` ditambahkan, dan itu proses ASYNC
// (nunggu <img> selesai load), makanya loadMapIcons() return Promise.

import { C } from '../theme.js';

const MILL_ICON_SVG = () => `
<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32">
  <rect x="5" y="16" width="22" height="12" rx="1" fill="${C.accentStrong}" stroke="${C.bg}" stroke-width="1.5"/>
  <rect x="9" y="9" width="4" height="8" fill="${C.accentStrong}" stroke="${C.bg}" stroke-width="1.5"/>
  <rect x="16" y="5" width="4" height="12" fill="${C.accentStrong}" stroke="${C.bg}" stroke-width="1.5"/>
  <circle cx="11" cy="7" r="2" fill="${C.text}" stroke="${C.bg}" stroke-width="1"/>
  <circle cx="18" cy="3.5" r="2" fill="${C.text}" stroke="${C.bg}" stroke-width="1"/>
</svg>`.trim();

const POD_ICON_SVG = () => `
<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32">
  <path d="M16 3C10.5 3 6 7.5 6 13c0 7.5 10 16 10 16s10-8.5 10-16c0-5.5-4.5-10-10-10z"
        fill="${C.slate}" stroke="${C.bg}" stroke-width="1.5"/>
  <circle cx="16" cy="13" r="4.5" fill="${C.text}"/>
</svg>`.trim();

const ICONS = {
  mill: { id: 'icon-mill', get svg() { return MILL_ICON_SVG(); } },
  pod: { id: 'icon-pod', get svg() { return POD_ICON_SVG(); } },
};

function loadOneIcon(map, key) {
  const { id, svg } = ICONS[key];
  return new Promise((resolve, reject) => {
    if (map.hasImage(id)) {
      resolve();
      return;
    }

    // Timeout jaga-jaga — kalau onload/onerror DUA-DUANYA tidak pernah
    // terpanggil (jarang, tapi mungkin di beberapa browser/environment),
    // jangan sampai loadMapIcons() nge-hang selamanya (yang berarti
    // SEMUA layer, bukan cuma icon-point, ikut tidak pernah ditambahkan
    // ke peta — karena kodenya `await` icon dulu sebelum nambah layer).
    const timeoutId = setTimeout(() => {
      reject(new Error(`Timeout load icon "${key}" (5 detik)`));
    }, 5000);

    const img = new Image(32, 32);
    img.onload = () => {
      clearTimeout(timeoutId);
      if (!map.hasImage(id)) map.addImage(id, img);
      resolve();
    };
    img.onerror = (e) => {
      clearTimeout(timeoutId);
      reject(new Error(`Gagal load icon "${key}": ${e}`));
    };
    img.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
  });
}

// Panggil sekali di 'load' map — daftarkan SEMUA icon custom yang dipakai
// LAYER_CATALOG (cari `icon: 'nama'` di layers.js), sebelum nambah layer
// symbol manapun yang referensinya ke icon ini.
//
// Return { failedKeys } — array key icon yang GAGAL dimuat (kosong kalau
// semua sukses). Sebelumnya pakai Promise.all (gagal satu = semua
// dianggap gagal, tanpa info yang mana) — sekarang Promise.allSettled,
// jadi tahu persis icon mana yang bermasalah, dan komponen pemanggil
// bisa fallback KE LINGKARAN BIASA khusus buat icon yang gagal itu,
// bukan layer-nya hilang total tanpa penjelasan.
export async function loadMapIcons(map) {
  const keys = Object.keys(ICONS);
  const results = await Promise.allSettled(keys.map((key) => loadOneIcon(map, key)));

  const failedKeys = [];
  results.forEach((result, i) => {
    if (result.status === 'rejected') {
      console.error(`Icon peta "${keys[i]}" gagal dimuat:`, result.reason);
      failedKeys.push(keys[i]);
    }
  });
  return { failedKeys };
}

// Nama id gambar terdaftar di MapLibre untuk key icon tertentu — dipakai
// saat set `icon-image` di layer symbol.
export function iconImageId(key) {
  return ICONS[key]?.id;
}
