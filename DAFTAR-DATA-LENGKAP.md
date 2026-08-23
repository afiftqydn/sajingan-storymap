# Daftar Lengkap Data yang Perlu Diisi
## Storymap "When Forests Lose Their Boundaries"

---

## A. GAMBAR — `public/images/`

Tidak perlu ubah kode. File ada → langsung tampil.

| # | Nama File | Chapter | Ambil dari PDF |
|---|---|---|---|
| 1 | `hero.jpg` | Cover | Cover PDF — drone lereng hijau + jalan tanah merah |
| 2 | `landscape-forest.jpg` | Pendahuluan | Hal. 4 — hutan/sungai berbatu |
| 3 | `landscape-aerial.jpg` | Pendahuluan | Hal. 6 / back cover — aerial kebun sawit |
| 4 | `case-overview-1.jpg` | Tiga Hamparan | Hal. 8 panel kiri — eksisting Lokasi 1 |
| 5 | `case-overview-2.jpg` | Tiga Hamparan | Hal. 8 panel tengah — eksisting Lokasi 2 |
| 6 | `case-overview-3.jpg` | Tiga Hamparan | Hal. 8 panel kanan — eksisting Lokasi 3 |
| 7 | `case1-burned.jpg` | Lokasi 1 | Hal. 10 foto besar — bekas pembakaran sudah ditanami |
| 8 | `case1-tbm.jpg` | Lokasi 1 | Hal. 10 kanan bawah — pohon sawit TBM |
| 9 | `case2-tbm.jpg` | Lokasi 2 | Hal. 12 — pohon sawit muda |
| 10 | `case3-field.jpg` | Lokasi 3 | Hal. 13 kanan — jalan/kebun sudah dilalui mobil |
| 11 | `pod-pais.jpg` | Jejak yang Belum Lengkap | Hal. 15 kanan atas — PoD Pais |
| 12 | `pod-baida.jpg` | Jejak yang Belum Lengkap | Hal. 15 kanan tengah — PoD Baida |
| 13 | `pod-arpi.jpg` | Jejak yang Belum Lengkap | Hal. 15 kanan bawah — PoD Arpi |

---

## B. GEOJSON — `public/geojson/`

Setelah taruh file, **bilang ke Claude** untuk update kode.

### B1. Storymap + Peta Interaktif (WAJIB — peta meleset 50km tanpa ini)

| # | Nama File | Konten | Sumber | File yang diupdate |
|---|---|---|---|---|
| 1 | `kecamatan-sajingan.geojson` | Polygon batas Kec. Sajingan Besar (bisa 1 atau multi polygon per desa) | BIG batasdesa | `polygons.js` |
| 2 | `lokasi-1.geojson` | Polygon 307 ha, center: 1.65804, 109.57527 | Digitasi QGIS | `polygons.js` |
| 3 | `lokasi-2.geojson` | Polygon 133 ha, center: 1.64645, 109.59320 | Digitasi QGIS | `polygons.js` |
| 4 | `lokasi-3.geojson` | Polygon 151 ha, center: 1.62635, 109.58668 | Digitasi QGIS | `polygons.js` |

### B2. Peta Interaktif saja (opsional — layer masih dummy kalau tidak diisi)

| # | Nama File | Layer | Sumber | File yang diupdate |
|---|---|---|---|---|
| 5 | `forest-cover.geojson` | Tutupan hutan | Hansen GFC / Sentinel-2 | `layers.js` |
| 6 | `planted-palm-oil.geojson` | Perkebunan sawit teridentifikasi | Analisis citra 0°Lat | `layers.js` |
| 7 | `deforestasi.geojson` | 402+38 polygon deforestasi | BIG — sudah diproses | `layers.js` |
| 8 | `feg.geojson` | Fungsi Ekosistem Gambut | BIG ArcGIS REST — sudah diakses | `layers.js` |
| 9 | `biodiversity.geojson` | 238 observasi Flora & Fauna | iNaturalist + IUCN — sudah diproses | `layers.js` |
| 10 | `das.geojson` | Sungai / DAS | BIG / OSM | `layers.js` |
| 11 | `kawasan-hutan.geojson` | Kawasan HL/HP/HPT | BIG SIGAP — sudah diproses | `layers.js` |
| 12 | `perhutanan-sosial.geojson` | Skema Perhutanan Sosial | PIAPS / KLHK | `layers.js` |

---

## C. DASHBOARD — `src/data/reportData.js`

Edit langsung di file `src/data/reportData.js`. Semua nilai sudah ada dari laporan PDF — tinggal konfirmasi angka final.

### C1. `overview` — Ringkasan Kecamatan (SUDAH TERISI dari PDF)

```javascript
// Semua angka ini sudah diisi dari laporan:
kecamatanAreaHa: 139120           ✓ dari PDF hal. 2
forestCover2015Ha: 37691.62       ✓ dari PDF hal. 5
forestCover2025Ha: 33969.81       ✓ dari PDF hal. 5
netForestLossHa: 3721.81          ✓ dari PDF hal. 5
netForestLossPercent: 9.87        ✓ dihitung
totalPalmOilHa: 30104.43          ✓ dari PDF hal. 3
palmOilInForestHa: 6702.06        ✓ dari PDF hal. 3
palmInForestAreaPercent: 22.3     ✓ dari PDF hal. 3
deforestation2022to2024Ha: 592.29 ✓ dari PDF hal. 1
peatForestDeforestationHa: 304.76 ✓ dari PDF hal. 5
peatTowardsPalmPercent: 46.1      ✓ dari PDF hal. 5
```

### C2. `cases` — Tabel 3 Studi Kasus (SUDAH TERISI dari PDF)

```javascript
// Semua sudah terisi — konfirmasi kalau ada perubahan:
Lokasi 1: 307.083 ha, 2024, burned, TBM, koordinat 1.65804/109.57527
Lokasi 2: 133.588 ha, 2023, cleared, TBM, koordinat 1.64645/109.59320
Lokasi 3: 151.618 ha, 2022, cleared, TBM, koordinat 1.62635/109.58668
```

### C3. `villages` — Tabel per Desa (SUDAH TERISI untuk Sanatab & Kaliau')

```javascript
// Data Sanatab dan Kaliau' sudah lengkap dari Tabel 1 PDF.
// Tiga desa lain (Santaban, Sebunga', Sungai Bening) hanya ada data sawit:
Sanatab: luas 9428.25, hutan 8059.19, APL 1369.06, sawit 1931.78, sawit-kawasan 1284.79 (66.5%)
Kaliau': luas 15564.95, hutan 11693.33, APL 3871.62, sawit 5175.65, sawit-kawasan 3241.07 (62.6%)
Santaban/Sebunga'/Sg.Bening: hanya ada data sawit per desa — luas desa/hutan belum ada
```

**Yang masih kosong:**
- Luas desa, luas hutan, luas APL untuk Santaban, Sebunga', Sungai Bening
- Sumber: BIG batasdesa + overlay kawasan hutan

### C4. `potentialMills` — 9 Mill (SUDAH TERISI dari Tabel 2 PDF)

Koordinat, grup, NDPE, sertifikasi, jarak — semua sudah dari tabel laporan.

Satu yang bisa ditambahkan kalau ada: nama **potential buyers** untuk mill-mill selain Agronusa (Wilmar) dan WKN (KPN). Sekarang hanya dua yang ada buyer-nya.

### C5. `pods` — 5 PoD (SUDAH TERISI dari Tabel 3 PDF)

Nama, koordinat, asal buah, jarak — semua sudah dari tabel laporan.

**Yang bisa ditambahkan:** foto PoD per titik (sudah ada slot `photo` di data layers.js untuk pod-terdekat). Sekarang pakai placeholder online.

### C6. `deforestationTrend` — Grafik Tren (SUDAH TERISI)

```javascript
2022: 428.02 ha  ✓
2023: 951.97 ha  ✓
2024: 740.13 ha  ✓
2025: 458.30 ha  ✓
```

---

## D. DOKUMEN UNDUHAN — `src/data/downloads.js`

| Field | Yang perlu diisi | Contoh |
|---|---|---|
| `url` untuk laporan final | Link Google Drive / URL PDF publik | `https://drive.google.com/...` |
| `url` untuk metodologi | Link dokumen teknis | `https://drive.google.com/...` |
| `url` untuk dataset GeoJSON | Link dataset yang bisa diunduh | `https://drive.google.com/...` |

Edit di `src/data/downloads.js`, ganti `url: '#'` dengan URL asli.

---

## E. FOTO di DATA PoD — `src/data/layers.js`

Di layer `pod-terdekat`, tiap titik PoD sudah ada slot `photo`:

```javascript
// Sekarang pakai placeholder online, ganti dengan path foto asli:
{ name: 'PoD Pais', photo: '/images/pod-pais.jpg' }   // ← kalau foto ada
{ name: 'PoD Baida', photo: '/images/pod-baida.jpg' }
// dst.
```

Foto PoD muncul di popup waktu klik ikon PoD di Peta Interaktif.

---

## F. RINGKASAN STATUS

| Kategori | Status | Yang masih perlu |
|---|---|---|
| **Gambar Storymap** | ✗ 13 file placeholder path | Upload ke `public/images/` |
| **Polygon kecamatan + 3 lokasi** | ⚠ Kotak placeholder | 4 GeoJSON wajib ke `public/geojson/` + bilang Claude |
| **Layer Peta Interaktif** | ⚠ 8 layer null/dummy | 8 GeoJSON opsional ke `public/geojson/` + bilang Claude |
| **Data overview kecamatan** | ✓ SUDAH dari PDF | — |
| **Data 3 kasus** | ✓ SUDAH dari PDF | — |
| **Data desa (Sanatab+Kaliau')** | ✓ SUDAH dari PDF | Santaban/Sebunga'/SgBening masih partial |
| **Data 9 mill + 5 PoD** | ✓ SUDAH dari PDF | Foto PoD opsional |
| **Tren deforestasi** | ✓ SUDAH dari PDF | — |
| **Link unduhan** | ✗ Masih `#` | URL Drive/hosting untuk PDF laporan + dataset |
