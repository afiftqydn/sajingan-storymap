# Alur Development — Storymap Sajingan Besar
## 0. Yang perlu di-install di komputer (sekali saja)

| Tool | Cek versi | Kalau belum ada |
|---|---|---|
| **Node.js** (≥ 18) | `node -v` | Download dari nodejs.org, pilih versi LTS |
| **npm** (ikut Node) | `npm -v` | Otomatis ikut Node.js |
| **Git** | `git --version` | Download dari git-scm.com |
| **Editor** | — | VS Code direkomendasikan (extension: ES7+ React snippets, GitLens) |

---

## 1. Bikin repo baru di GitHub

1. Buka github.com → **New repository**.
2. Nama: `sajingan-storymap` (atau nama lain sesuai preferensi tim).
3. **Jangan** centang "Add README" / "Add .gitignore" — project ini sudah
   punya keduanya, biar tidak konflik saat push pertama.
4. Visibility: Private dulu kalau datanya masih sensitif (ownership,
   lokasi persis), bisa dibuka publik nanti setelah tim setuju.
5. Create repository — GitHub akan kasih instruksi `git remote add`, simpan
   dulu URL-nya (`https://github.com/<username>/sajingan-storymap.git`).

---

## 2. Push project ini ke repo baru

Dari folder project (folder yang berisi `package.json` ini):

```bash
git init
git add .
git commit -m "Initial scaffold: storymap 2-tab dengan data placeholder"
git branch -M main
git remote add origin https://github.com/<username>/sajingan-storymap.git
git push -u origin main
```

Setelah ini, `git push` biasa (tanpa `-u origin main`) sudah cukup untuk
push berikutnya.

---

## 3. Jalankan di komputer lokal

```bash
npm install     # sekali saja, atau tiap kali package.json berubah
npm run dev     # start dev server, biasanya di http://localhost:5173
```

Buka URL yang muncul di terminal. Setiap kali kamu save file, browser
otomatis refresh (hot reload) — tidak perlu restart server.

Perintah lain yang tersedia:

```bash
npm run build     # build production ke folder dist/
npm run preview   # jalankan hasil build production secara lokal, untuk cek sebelum deploy
```

---

## 4. Struktur project — apa isinya, apa fungsinya

```
sajingan-storymap/
├── index.html              # entry point HTML, judul tab browser
├── vite.config.js          # config build tool
├── package.json            # daftar dependency + script npm
├── public/
│   └── images/             # taruh SEMUA foto/gambar asli di sini
├── src/
│   ├── main.jsx             # render <App /> ke halaman — jarang perlu diedit
│   ├── App.jsx               # shell 2 tab (TabSwitcher + StoryView/DashboardView)
│   ├── App.css               # SEMUA styling ada di sini
│   ├── theme.js               # warna untuk peta (MapLibre tidak baca CSS var())
│   ├── mapStyle.js            # basemap satelit, dipakai KEDUA tab
│   ├── data/                  # ============ FILE YANG PALING SERING DIEDIT ============
│   │   ├── polygons.js          # koordinat: batas kecamatan, 3 lokasi kasus
│   │   ├── layers.js             # katalog 16 layer peta dashboard
│   │   ├── chapters.js           # isi narasi tab Cerita (14 chapter)
│   │   ├── reportData.js         # angka & tabel tab Peta & Data
│   │   └── downloads.js          # daftar dokumen di chapter penutup
│   ├── hooks/
│   │   └── useStepObserver.js   # deteksi chapter aktif saat scroll — jarang perlu diedit
│   └── components/
│       ├── TabSwitcher.jsx      # tombol switch tab
│       ├── StoryView.jsx         # titik masuk tab Cerita
│       ├── Story.jsx             # orkestrasi scroll + peta + indikator
│       ├── MapController.jsx    # peta scroll-locked (tab Cerita)
│       ├── Step.jsx              # satu chapter — render title/text/stats/foto
│       ├── StepIndicator.jsx     # titik-titik navigasi kanan
│       ├── ScrollProgress.jsx    # bilah progres atas layar
│       ├── StatBlock.jsx         # angka headline dengan count-up
│       ├── FootnotePanel.jsx     # catatan kaki + sitasi [a]
│       ├── MediaGallery.jsx      # grid foto
│       ├── DownloadsPanel.jsx    # list dokumen unduhan
│       ├── ChartBlock.jsx        # pemetaan id chart → komponen chart
│       ├── DashboardView.jsx     # titik masuk tab Peta & Data
│       ├── DashboardMap.jsx      # peta bebas + toggle layer + popup
│       ├── DashboardStats.jsx    # kartu angka + chart ringkasan
│       ├── CasesTable.jsx        # tabel 3 kasus + chart terkait
│       └── charts/               # satu file per jenis chart (recharts)
├── README.md                 # ringkasan singkat project
└── DEVELOPMENT.md            # file ini
```

**Aturan penting:** koordinat cuma hidup di `polygons.js`, basemap cuma di
`mapStyle.js`, warna cuma di `theme.js` + blok `:root` `App.css`. Kalau
nanti butuh ubah salah satu, cari file-nya di sini dulu — jangan
hardcode di komponen.

---

## 5. Cara customize — per kebutuhan

### Ubah narasi/isi chapter cerita
Edit `src/data/chapters.js`. Tiap chapter itu satu objek di dalam array.
Field yang wajib: `id`, `section`, `align`, `title`, `text`, `mapState`.
Field opsional: `stats`, `chart`, `polygons`, `images`, `footnotes`,
`type`, `quickNav`.

```js
{
  id: 'case-study-1',
  section: 'evidence',
  align: 'right',
  title: 'Lokasi 1',
  text: 'Narasi di sini. Tulis [a] untuk sitasi inline.',
  mapState: { center: [109.06, 1.34], zoom: 14, pitch: 30, bearing: 0 },
  stats: [{ value: '45 ha', label: 'Luas' }],
  polygons: [lokasi1Polygon],
  images: ['/images/lokasi1-aerial.jpg'],
  footnotes: [{ id: 'a', text: 'Sumber: ...' }],
}
```

- **Urutan chapter** = urutan objek di array. Geser posisi untuk ubah urutan.
- **Tambah chapter baru:** copy objek yang mirip, ganti `id` (harus unik).
- **Hapus chapter:** hapus objeknya — navigasi & indikator otomatis
  menyesuaikan.

### Ubah koordinat / tambah lokasi baru
Edit `src/data/polygons.js`. Format GeoJSON Feature standar (bisa
export langsung dari QGIS: EPSG:4326). Setelah nambah polygon baru,
import di `chapters.js` (untuk tab Cerita) dan/atau `layers.js` (untuk
tab Dashboard) sesuai kebutuhan.

### Ubah/tambah layer peta dashboard
Edit `src/data/layers.js`, tambah satu objek di `LAYER_CATALOG`. Isi
`geometryType` (`'polygon'` | `'point'` | `'line'`) yang benar — peta
dashboard otomatis tahu cara render dan toggle-nya.

### Ubah angka & tabel di tab Peta & Data
Edit `src/data/reportData.js`. **Ingat:** kalau angka yang sama juga
dinarasikan di `chapters.js`, update di KEDUA file (belum digabung jadi
satu sumber).

### Tambah/ubah dokumen unduhan
Edit `src/data/downloads.js`.

### Ubah warna & font
- Warna umum UI + font: blok `:root` di `src/App.css`.
- Warna yang dipakai peta (paint MapLibre): `src/theme.js`.
- **Ubah keduanya bareng** kalau ganti warna utama — MapLibre tidak bisa
  baca CSS `var()`.

### Tambah chart baru
1. Buat file baru di `src/components/charts/`, contoh pola dari
   `CaseAreaChart.jsx`.
2. Daftarkan id-nya di `CHART_MAP` dalam `src/components/ChartBlock.jsx`.
3. Panggil dari `chapters.js` lewat field `chart: 'id-baru'`.

### Tambah foto
1. Taruh file di `public/images/`.
2. Referensikan di `chapters.js` dengan path absolut: `/images/nama.jpg`
   (bukan `import`, bukan relative path).

---

## 6. Alur kerja sehari-hari (git)

Kalau kerja sendiri di branch `main`:

```bash
git pull                          # sinkron dulu kalau ada perubahan dari device lain
# ... edit file ...
git add .
git commit -m "Isi narasi chapter Lokasi 1"
git push
```

Kalau kerja bareng tim (direkomendasikan begitu lebih dari satu orang
ikut edit):

```bash
git checkout -b isi-data-lokasi-1   # bikin branch baru per task
# ... edit file ...
git add .
git commit -m "Isi narasi & luas Lokasi 1"
git push -u origin isi-data-lokasi-1
```

Lalu buka Pull Request di GitHub dari branch itu ke `main`, review, baru
merge. Ini mencegah kerjaan tim saling menimpa.

**Kapan commit?** Tiap satu unit kerja selesai (satu chapter terisi, satu
layer data masuk) — jangan tunggu semua selesai baru commit sekali,
supaya gampang di-revert kalau ada yang salah.

---

## 7. Deploy

Project ini static site (hasil `npm run build` = folder `dist/` berisi
HTML/CSS/JS murni) — bisa host di mana saja yang serve static file.

### Opsi A — Netlify (paling sederhana)
1. Push repo ke GitHub (sudah dilakukan di langkah 2).
2. Buka netlify.com → **Add new site → Import an existing project** →
   pilih repo ini.
3. Build command: `npm run build`. Publish directory: `dist`.
4. Deploy — Netlify otomatis re-deploy tiap kali kamu `git push` ke `main`.

### Opsi B — GitHub Pages
1. Di `vite.config.js`, ubah `base: '/'` jadi `base: '/sajingan-storymap/'`
   (sesuaikan dengan nama repo — GitHub Pages serve dari sub-path).
2. `npm run build`.
3. Push folder `dist/` ke branch `gh-pages` (bisa manual atau pakai
   package `gh-pages`: `npm install -D gh-pages`, tambah script
   `"deploy": "gh-pages -d dist"` di `package.json`, lalu `npm run deploy`).
4. Di repo GitHub → Settings → Pages → source: branch `gh-pages`.

### Opsi C — Vercel
Sama seperti Netlify: import repo, build command `npm run build`,
output directory `dist`, auto-deploy tiap push.

---

## 8. Checklist sebelum dianggap "siap presentasi"

- [ ] Semua `TODO:` di `src/data/*.js` sudah diganti data asli
- [ ] Foto asli sudah masuk `public/images/`, bukan placeholder lagi
- [ ] Koordinat 3 lokasi di `polygons.js` sudah dari GeoJSON asli (bukan
      persegi placeholder)
- [ ] Angka di `chapters.js` dan `reportData.js` sudah konsisten
- [ ] `npm run build` sukses tanpa error
- [ ] Sudah dicoba `npm run preview` untuk cek hasil build production
- [ ] Sudah di-review minimal satu orang lain di tim sebelum deploy

---

## 9. Troubleshooting umum

| Gejala | Kemungkinan penyebab |
|---|---|
| Peta blank/abu-abu | Cek domain di `mapStyle.js` — harus `server.arcgisonline.com`, BUKAN `server.arcgis.com` |
| `npm install` error | Cek versi Node (`node -v`), harus ≥ 18 |
| Chapter baru tidak muncul di navigasi | Cek `id` unik, dan `section`-nya ada di `SECTION_LABELS` (`chapters.js`) |
| Chart tidak muncul, console warning "id chart tidak dikenal" | Id di field `chart` chapter tidak match dengan yang terdaftar di `ChartBlock.jsx` — cek ejaan |
| Foto tidak muncul | Pastikan file ada di `public/images/`, path di `chapters.js` mulai dengan `/images/...` (bukan `./` atau `../`) |
| Layer dashboard tidak render walau di-toggle | Layer masih dummy (`data: null` di `layers.js`) — isi dengan GeoJSON asli dulu |
