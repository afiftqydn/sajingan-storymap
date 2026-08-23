# Asset Table — Storymap "When Forests Lose Their Boundaries"

---

## 🗺️ GEOJSON (6 file) — letakkan di `public/geojson/`

| # | Nama File | Chapter yang memakainya | Deskripsi | Sumber | Priority |
|---|---|---|---|---|---|
| 1 | `kecamatan-sajingan.geojson` | Overview, Landscape, Conclusion | Polygon batas Kec. Sajingan Besar | BIG batasdesa (sudah diproses) | ⭐ WAJIB |
| 2 | `lokasi-1.geojson` | Hook, Focus Case, Supply Chain | 307 ha HPT, center: 1.65804, 109.57527 | Digitasi QGIS | ⭐ WAJIB |
| 3 | `lokasi-2.geojson` | Focus Case, Supply Chain | 133 ha HPT, center: 1.64645, 109.59320 | Digitasi QGIS | ⭐ WAJIB |
| 4 | `lokasi-3.geojson` | Focus Case, Supply Chain | 151 ha HPT, center: 1.62635, 109.58668 | Digitasi QGIS | ⭐ WAJIB |
| 5 | `kawasan-hutan-aoi.geojson` | Deforest & Palm Oil tab | Polygon HL/HP/HPT 5 desa | BIG SIGAP (sudah diproses) | Opsional |
| 6 | `deforestasi.geojson` | Deforest & Palm Oil tab | 402+38 polygon deforestasi | BIG (sudah diproses) | Opsional |

Format: GeoJSON WGS84 (EPSG:4326). Export QGIS → Save Features As → GeoJSON → CRS: EPSG:4326.

---

## 📷 FOTO (15 file) — letakkan di `public/images/`

| # | Nama File | Chapter | Deskripsi | Referensi di PDF |
|---|---|---|---|---|
| 1 | `hero.jpg` | Ch.1 — Cover | Foto drone pembukaan lahan, jalan tanah merah membelah lereng. **Min 2000px lebar, WAJIB portrait/landscape lebar** | Cover PDF |
| 2 | `case1-burned.jpg` | Ch.3 — Hook | Area bekas pembakaran sudah ditanami sawit — foto paling dramatis yang ada | Hal. 10, foto lapangan besar |
| 3 | `landscape-forest.jpg` | Ch.4 — Sajingan | Hutan / sungai berbatu khas Sajingan Besar | Hal. 4 PDF |
| 4 | `landscape-aerial.jpg` | Ch.4 — Sajingan | Aerial sawit di antara hutan | Hal. 6 atas / back cover |
| 5 | `palm-in-forest-aerial.jpg` | Ch.6 — Konversi | Aerial kebun sawit dalam kawasan hutan | Hal. 7 kanan atas |
| 6 | `palm-in-forest-field.jpg` | Ch.6 — Konversi | Lapangan kebun dalam kawasan | Hal. 7 kanan tengah/bawah |
| 7 | `case-overview-1.jpg` | Ch.8 — 3 Lokasi | Eksisting Lokasi 1 tampak jauh | Hal. 8 panel kiri |
| 8 | `case-overview-2.jpg` | Ch.8 — 3 Lokasi | Eksisting Lokasi 2 tampak jauh | Hal. 8 panel tengah |
| 9 | `case-overview-3.jpg` | Ch.8 — 3 Lokasi | Eksisting Lokasi 3 tampak jauh | Hal. 8 panel kanan |
| 10 | `case1-tbm.jpg` | Ch.9 — Lokasi 1 | Pohon sawit TBM Lokasi 1 | Hal. 10 kanan bawah |
| 11 | `case2-tbm.jpg` | Ch.10 — Lokasi 2&3 | Pohon sawit muda Lokasi 2 | Hal. 12 |
| 12 | `case3-field.jpg` | Ch.10 — Lokasi 2&3 | Kebun Lokasi 3, jalan sudah bisa dilalui mobil | Hal. 13 kanan |
| 13 | `pod-pais.jpg` | Ch.11 — Supply Chain | Foto PoD milik Pais | Hal. 15 kanan atas |
| 14 | `pod-baida.jpg` | Ch.11 — Supply Chain | Foto PoD milik Baida | Hal. 15 kanan tengah |
| 15 | `pod-arpi.jpg` | Ch.11 — Supply Chain | Foto PoD milik Arpi | Hal. 15 kanan bawah |

Format: JPG/PNG, landscape, ukuran 1500–2000px. Untuk `hero.jpg` usahakan ≥2000px lebar.

---

## ✅ Urutan Upload yang Disarankan (dari dampak paling besar)

```
Prioritas 1 — Tanpa ini peta meleset ~50 km:
  lokasi-1.geojson, lokasi-2.geojson, lokasi-3.geojson, kecamatan-sajingan.geojson

Prioritas 2 — Visual chapter langsung berubah:
  hero.jpg, case1-burned.jpg (dipakai di 2 chapter sekaligus)

Prioritas 3 — Sisa foto (15 foto total)
  landscape-forest.jpg, landscape-aerial.jpg, dll.

Prioritas 4 — Tab Peta Interaktif:
  kawasan-hutan-aoi.geojson, deforestasi.geojson
```
