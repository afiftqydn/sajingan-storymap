# Panduan Mengisi Data — Storymap Sajingan Besar

---

## 1. GAMBAR (13 file wajib + opsional)

**Letakkan di:** `public/images/`
**Format:** JPG atau PNG, orientasi landscape, 1500–2000px lebar

### Wajib (dipakai di chapter aktif)

| Nama file | Dipakai di chapter | Ambil dari |
|---|---|---|
| `hero.jpg` | Cover | Cover laporan PDF — foto drone jalan tanah merah membelah lereng |
| `landscape-forest.jpg` | Pendahuluan | Hal. 4 PDF — foto hutan/sungai berbatu |
| `landscape-aerial.jpg` | Pendahuluan | Hal. 6/back cover — aerial kebun sawit luas |
| `case-overview-1.jpg` | Tiga Hamparan | Hal. 8 panel kiri — eksisting Lokasi 1 dari atas |
| `case-overview-2.jpg` | Tiga Hamparan | Hal. 8 panel tengah — eksisting Lokasi 2 |
| `case-overview-3.jpg` | Tiga Hamparan | Hal. 8 panel kanan — eksisting Lokasi 3 |
| `case1-burned.jpg` | Lokasi 1 | Hal. 10 foto besar — area bekas pembakaran sudah ditanami |
| `case1-tbm.jpg` | Lokasi 1 | Hal. 10 kanan bawah — pohon sawit TBM |
| `case2-tbm.jpg` | Lokasi 2 | Hal. 12 — pohon sawit muda Lokasi 2 |
| `case3-field.jpg` | Lokasi 3 | Hal. 13 kanan — jalan/kebun Lokasi 3 bisa dilalui mobil |
| `pod-pais.jpg` | Jejak yang Belum Lengkap | Hal. 15 kanan atas — foto PoD Pais |
| `pod-baida.jpg` | Jejak yang Belum Lengkap | Hal. 15 kanan tengah — foto PoD Baida |
| `pod-arpi.jpg` | Jejak yang Belum Lengkap | Hal. 15 kanan bawah — foto PoD Arpi |

### Opsional (chapter masih tampil tapi tanpa foto)

| Nama file | Chapter yang akan dipasang | Foto yang cocok |
|---|---|---|
| `ringkasan-aerial.jpg` | Ringkasan Eksekutif | Foto overview aerial kecamatan |
| `studi-kasus-pola.jpg` | Studi Kasus (pengantar) | Kolase / overview 3 lokasi |

---

## 2. GEOJSON (4 wajib + 4 opsional)

**Letakkan di:** `public/geojson/`
**Format:** GeoJSON, CRS WGS84 (EPSG:4326, lng-lat)
**Export dari QGIS:** Layer → Save Features As → GeoJSON → CRS: EPSG:4326

### Wajib — polygon masih KOTAK PLACEHOLDER (peta meleset dari realita)

Setelah kamu taruh file GeoJSON di `public/geojson/`, bilang ke aku — aku akan update `polygons.js` dalam 5 menit.

| Nama file | Isi | Status sekarang |
|---|---|---|
| `kecamatan-sajingan.geojson` | Polygon batas Kec. Sajingan Besar | ⚠ Kotak placeholder |
| `lokasi-1.geojson` | Polygon 307 ha, center sekitar 1.65804, 109.57527 | ⚠ Kotak placeholder |
| `lokasi-2.geojson` | Polygon 133 ha, center sekitar 1.64645, 109.59320 | ⚠ Kotak placeholder |
| `lokasi-3.geojson` | Polygon 151 ha, center sekitar 1.62635, 109.58668 | ⚠ Kotak placeholder |

**Sumber GeoJSON yang kamu punya:**
- Kecamatan → BIG batasdesa (sudah diproses sebelumnya)
- 3 Lokasi → hasil digitasi QGIS dari analisis citra

### Opsional — layer Peta Interaktif (tab Peta Interaktif, bukan Storymap)

Kalau ada, masukkan di `public/geojson/` lalu bilang aku update `layers.js`:

| Nama file | Layer | Sumber |
|---|---|---|
| `kawasan-hutan.geojson` | Kawasan Hutan (HL/HP/HPT) | BIG SIGAP — sudah kamu proses |
| `deforestasi.geojson` | Polygon deforestasi (402+38) | BIG — sudah kamu proses |
| `feg.geojson` | Fungsi Ekosistem Gambut | BIG ArcGIS REST — sudah kamu akses |
| `biodiversity.geojson` | Sebaran Flora & Fauna | 238 observasi iNaturalist+IUCN |

---

## 3. CARA MEMASUKKAN FILE

### Gambar (tidak perlu edit kode)
```
project/
└── public/
    └── images/
        ├── hero.jpg           ← taruh di sini
        ├── landscape-forest.jpg
        ├── case1-burned.jpg
        └── ... dst
```
Path sudah tertanam di `chapters.js`. File ada → langsung tampil. Tidak perlu ubah kode.

### GeoJSON polygon (perlu bilang ke Afif → update kode)
```
project/
└── public/
    └── geojson/
        ├── kecamatan-sajingan.geojson   ← taruh di sini
        ├── lokasi-1.geojson
        ├── lokasi-2.geojson
        └── lokasi-3.geojson
```
Setelah file ada, **beritahu aku** — aku akan update `src/data/polygons.js` untuk membaca file asli (sekarang masih generate kotak dari koordinat hardcoded).

### GeoJSON layer Peta Interaktif (juga perlu bilang ke aku)
```
public/
└── geojson/
    ├── kawasan-hutan.geojson
    └── deforestasi.geojson
```
Setelah file ada, aku update `src/data/layers.js` agar layer yang masih `data: null` diganti dengan import GeoJSON asli.

---

## 4. DRAG-AND-DROP (shortcut tanpa edit kode)

Tab **Peta Interaktif** sudah punya fitur drag-and-drop:
- Buka tab Peta Interaktif di browser
- Seret file `.geojson` langsung ke peta
- Layer otomatis muncul di panel kiri bawah "Informasi Tambahan"
- Ini cara cepat **lihat dan verifikasi** GeoJSON sebelum dimasukkan resmi ke kode

---

## 5. PRIORITAS

```
Prioritas 1 — Peta langsung akurat (50 km off sekarang):
  ✗ lokasi-1.geojson
  ✗ lokasi-2.geojson
  ✗ lokasi-3.geojson
  ✗ kecamatan-sajingan.geojson

Prioritas 2 — Visual chapter langsung berubah:
  ✗ hero.jpg            (cover)
  ✗ case1-burned.jpg    (hook visual yang paling kuat)

Prioritas 3 — Sisa foto chapter
  ✗ 11 foto lainnya

Prioritas 4 — Layer Peta Interaktif (tidak mempengaruhi Storymap)
  ✗ kawasan-hutan.geojson, deforestasi.geojson, dll.
```
