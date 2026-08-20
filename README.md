# Storymap — Studi Kasus Sanatab, Sajingan Besar

Aplikasi 2-tab untuk investigasi kelapa sawit di Sajingan Besar, Kabupaten
Sambas:

- **Tab "Cerita"** — scrollytelling: peta bergerak otomatis mengikuti
  narasi yang di-scroll.
- **Tab "Peta & Data"** — dashboard eksplorasi bebas: peta interaktif +
  panel angka & tabel.

Alur cerita saat ini (14 chapter): **Intro → Problem (deforestasi &
ekspansi sawit) → Evidence (3 studi kasus) → Consequence (risiko rantai
pasok) → Call to Action.**

Lihat **`DEVELOPMENT.md`** untuk panduan lengkap: cara jalankan, struktur
project, dan cara customize tiap bagian.

## Jalankan cepat

```bash
npm install
npm run dev
```

## Stack

React + Vite, MapLibre GL (peta), Recharts (chart).

## Status

Scaffold siap jalan dengan data placeholder (`TODO:` tersebar di
`src/data/*.js`). Belum ada foto/citra asli dan sebagian layer peta masih
dummy — lihat checklist di `DEVELOPMENT.md`.
