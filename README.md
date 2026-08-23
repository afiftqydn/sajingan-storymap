# Storymap — Studi Kasus Sanatab, Sajingan Besar

Aplikasi 3-tab untuk investigasi kelapa sawit di Sajingan Besar, Kabupaten
Sambas:

- **Tab "Storymap"** — scrollytelling: peta bergerak otomatis mengikuti
  narasi yang di-scroll. Overlay peta: mata angin, skala, legend (isinya
  dinamis mengikuti kategori data yang tampil), sumber citra.
- **Tab "Peta Interaktif"** — peta eksplorasi bebas, toggle layer per
  kategori, klik polygon → popup. Panel layer sekaligus jadi legend
  (warna swatch match persis dengan warna di peta).
- **Tab "Dashboard"** — angka, chart, tabel, dan dokumen pendukung.

Alur cerita (14 chapter): **Intro → Problem (deforestasi & ekspansi
sawit) → Evidence (3 studi kasus) → Consequence (risiko rantai pasok) →
Call to Action.**

Visual: dark, sans-serif penuh (Space Grotesk + Inter + IBM Plex Mono),
aksen hijau tunggal + oranye khusus CTA — gaya "modern teknologi" ala
platform sister Geometrack. Chart dipakai hemat (1 chart di seluruh
cerita, sebagai hook data utama) — chapter lain pakai angka besar
(StatBlock) saja.

Lihat **`DEVELOPMENT.md`** untuk panduan lengkap: cara jalankan, struktur
project, dan cara customize tiap bagian.

## Jalankan cepat

```bash
npm install
npm run dev
```

## Yang perlu kamu isi (sudah tidak perlu ubah kode lagi)

Semua ada di `src/data/`:

| File | Isi apa |
|---|---|
| `chapters.js` | Narasi tiap chapter — cari `TODO:` |
| `polygons.js` | Koordinat 3 lokasi kasus (GeoJSON dari QGIS) |
| `reportData.js` | Angka & tabel tab Dashboard |
| `layers.js` | Data GeoJSON untuk 5 layer yang masih dummy |

Foto lapangan: taruh di `public/images/`, referensikan di `chapters.js`
field `images` dengan path `/images/nama-file.jpg`.

## Stack

React + Vite, MapLibre GL (peta), Recharts (chart).
