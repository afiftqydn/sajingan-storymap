// Warna untuk MapLibre dan Recharts. Keduanya butuh string warna biasa,
// bukan var(), jadi nilainya dibaca dari token CSS (styles/tokens.css) —
// satu-satunya sumber warna. Baca saat dipakai, bukan saat import, dan
// pastikan CSS diimpor lebih dulu di main.jsx.
const cache = new Map();

function toHex(channels) {
  return '#' + channels.trim().split(/\s+/).map((n) => Number(n).toString(16).padStart(2, '0')).join('');
}

function read(token) {
  if (!cache.has(token)) {
    const value = getComputedStyle(document.documentElement).getPropertyValue(`--zl-${token}-rgb`);
    cache.set(token, toHex(value));
  }
  return cache.get(token);
}

// C.accent, C.accentStrong, C.surface3 → --zl-accent-rgb, --zl-accent-strong-rgb, --zl-surface-3-rgb
export const C = new Proxy({}, {
  get: (_, key) => read(String(key).replace(/([A-Z]|\d+)/g, (m) => `-${m.toLowerCase()}`)),
});
