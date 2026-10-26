# Alur Development — Storymap Sajingan Besar

Dokumen ini untuk kamu yang baru pertama kali pegang project React ini.
Urutannya sengaja dari paling dasar: siapkan tools → jalankan lokal →
paham struktur → mulai edit → commit → deploy.

---

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
│   ├── styles/tokens.css      # token warna, font, gerak (gaya orphan-case) — sumber warna tunggal
│   ├── styles/base.css        # reset, tipografi dasar, loading state
│   ├── App.css                # styling komponen, hanya pakai token --zl-*
│   ├── theme.js               # C.accent, C.bg, … = token CSS untuk MapLibre & Recharts
│   ├── mapStyle.js            # basemap satelit, dipakai KEDUA tab
│   ├── data/                  # ============ FILE YANG PALING SERING DIEDIT ============
│   │   ├── polygons.js          # koordinat: batas kecamatan, 3 lokasi kasus
│   │   ├── layers.js             # katalog layer peta Peta Interaktif (5 kategori: AOI, Tutupan Lahan, Informasi Tambahan, Status Legal, Supply Chain)
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
`mapStyle.js`, warna cuma di `styles/tokens.css`. Kalau
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

### Ubah/tambah layer peta Peta Interaktif
Edit `src/data/layers.js`, tambah satu objek di `LAYER_CATALOG`. Isi
`geometryType` (`'polygon'` | `'point'` | `'line'`) yang benar, dan
`category` — HARUS salah satu dari 5 kategori yang sudah ada (`AOI`,
`Tutupan Lahan`, `Informasi Tambahan`, `Status Legal`, `Supply Chain`),
atau kategori baru kalau memang perlu. Urutan kategori di panel = urutan
kemunculan pertama di array `LAYER_CATALOG`, bukan alfabetis.

**Pengecualian:** "Prediksi Supply Chain" (layer animasi rute) BUKAN
bagian `LAYER_CATALOG` — dia komponen terpisah (`RouteAnimationLayer.jsx`)
karena mekanismenya beda (animasi, bukan GeoJSON statis). Toggle-nya
ditulis manual di `DashboardMap.jsx`. Kalau mau ubah datanya, itu di
`src/data/routes.js`, bukan `layers.js` — dan koordinat mill/PoD di
`routes.js` diambil OTOMATIS dari `layers.js` (biar konsisten), jadi
cukup ubah di satu tempat (`layers.js`).

### Drag-and-drop GeoJSON/SHP
Tarik file `.geojson`, `.json`, `.shp`, atau `.zip` (bundle shapefile
lengkap: `.shp`+`.dbf`+`.prj`) langsung ke peta di tab Peta Interaktif —
otomatis jadi layer baru di kategori **Informasi Tambahan**, lengkap
toggle show/hide + tombol hapus (×). Logic-nya di
`src/utils/parseGeoFile.js` (pakai library `shpjs`).

Catatan: `.shp` sendirian (tanpa `.dbf`) cuma bawa geometri, atribut/
nama kosong — kalau butuh nama ikut, drop versi `.zip` bundle lengkap.

**Performa:** `shpjs` (~140KB) di-import DINAMIS (`await import('shpjs')`
di dalam `parseGeoFile.js`), BUKAN di top-level file — jadi Vite pisahkan
jadi chunk sendiri yang cuma di-download pas user benar-benar drop file
`.shp`/`.zip`. Kalau nanti nambah dependency besar lain yang cuma
dipakai fitur tertentu (bukan tiap kunjungan), pakai pola yang sama.

### Peta sisipan (inset/locator map) — tab Storymap
Peta kecil pojok kiri-bawah (`src/components/InsetMap.jsx`) — nunjukin
konteks region lebih luas + kotak yang mewakili area yang lagi
ditampilkan peta utama, update real-time ikut peta utama digeser.
Ini peta MapLibre KEDUA yang sungguhan (non-interaktif), bukan gambar
statis. Sengaja hilang di chapter cover/hero (sama seperti nav rail) —
biar tidak mengganggu tampilan depan.

Ubah area yang ditampilkan: edit `INSET_CENTER`/`INSET_ZOOM` di atas
file `InsetMap.jsx`.

### Icon SVG kustom (Mills/PoD)
Titik Mills & PoD pakai icon SVG sendiri (bukan lingkaran polos) —
didefinisikan di `src/utils/mapIcons.js`. Ganti bentuk/warna: edit
string SVG di situ. Nambah jenis icon baru: tambah entri di object
`ICONS` di file yang sama, lalu pakai `geometryType: 'icon-point'` +
`icon: 'nama-key'` di layer terkait (`layers.js`).

### Ubah angka & tabel di tab Peta & Data
Edit `src/data/reportData.js`. **Ingat:** kalau angka yang sama juga
dinarasikan di `chapters.js`, update di KEDUA file (belum digabung jadi
satu sumber).

### Tambah/ubah dokumen unduhan
Edit `src/data/downloads.js`.

### Sumber citra & atribusi (JANGAN dihapus begitu saja)
Badge "Citra satelit: ..." di pojok kanan-bawah peta **bukan cuma
dekorasi** — baris kedua (`© Esri, Maxar, Earthstar Geographics`) itu
syarat lisensi Esri World Imagery (gratis, tanpa API key, tapi wajib
atribusi). Kalau mau ubah tampilannya, boleh — tapi teks provider-nya
harus tetap ada di suatu tempat yang kelihatan. Isinya diatur di
`src/mapStyle.js` (`imagerySource.provider`), dipakai oleh
`MapOverlayStack.jsx`.

### Ubah warna & font
- Satu sumber: `src/styles/tokens.css` (token `--zl-*`, sama dengan orphan-case).
  Warna disimpan sebagai kanal RGB (`--zl-accent-rgb`) supaya bisa diberi
  opasitas: `rgb(var(--zl-accent-rgb) / 0.16)`.
- MapLibre dan Recharts butuh string warna, bukan `var()`. Pakai `C` dari
  `src/theme.js` (`C.accent`, `C.bg`, `C.accentStrong`, …); nilainya dibaca
  dari token yang sama, jadi tidak ada salinan warna.
- `main.jsx` mengimpor tokens sebelum `App` (theme.js membaca token saat
  modul dievaluasi) dan `App.css` sesudah `App` (supaya menang atas
  `maplibre-gl.css`). Jangan ubah urutan itu.
- Hanya tema gelap. Warna kategori data (status kawasan hutan, dll.) di
  `data/layers.js` memang tetap kartografis.

### Beri foto ruang lebih besar di satu chapter
Tambahkan `mediaLayout: 'wide'` di objek chapter (`chapters.js`). Card
jadi lebih lebar (560px, bukan 460px), dan kalau `images` isinya lebih
dari satu, foto pertama otomatis jadi "hero" (lebih besar), sisanya jadi
thumbnail di bawahnya. Dipakai di chapter lanskap dan 3 case study,
karena chapter-chapter itu foto lapangan-nya jadi bukti visual utama,
bukan cuma ilustrasi.

**Popup TIDAK punya scrollbar internal** — sengaja, supaya tidak ada
scroll bersarang (scroll di dalam scroll). Ini artinya kamu bebas
tambah foto sebanyak yang perlu di array `images` — card akan tumbuh
tinggi mengikuti jumlah foto, bukan dipotong. Konsekuensinya: chapter
dengan banyak foto akan "memakan" tinggi layar lebih banyak saat
di-scroll — itu trade-off yang memang diinginkan (dibanding scrollbar
bersarang yang bikin pengalaman scroll jadi membingungkan).

### Animasi rute rantai pasok (chapter "Potensial Mill/Dealer")
Data titik & rute ada di `src/data/routes.js` — TERPISAH dari
`chapters.js`, karena ini data spasial (koordinat), bukan narasi.

- `routePoints` — semua titik: lokasi kasus (`type: 'case'`, merah,
  dapat efek pulsing), mill (`type: 'mill'`, kuning), dealer/port
  (`type: 'dealer'`, biru). Tambah titik baru = tambah satu objek di
  array ini.
- `routeChains` — satu chain = satu "perjalanan" (array id titik
  berurutan, bisa multi-hop: kasus → mill → dealer). Tiap chain dapat
  SATU titik animasi yang jalan sepanjang chain itu, loop terus.
  Garis rute digambar OTOMATIS dari urutan titik di chain — tidak
  perlu gambar polyline manual.

**TODO paling penting:** koordinat mill/dealer di `routePoints` masih
placeholder. Ganti dengan lokasi asli begitu sudah ada datanya. Kalau
mau rute mengikuti jalan asli (bukan garis lurus), itu perlu source
data terpisah (hasil routing engine kayak OSRM) — di luar scope
template ini, kabari kalau butuh dibantu strukturnya.

Animasi ini cuma nyala di chapter yang punya field `routes: true` di
`chapters.js` (sekarang cuma `pre-harvest-alert`). Mau nyalakan di
chapter lain, tambahkan field itu di situ.

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
| Layar HITAM TOTAL (bukan cuma peta — nav, teks, semuanya hilang) | Ada error JS yang crash seluruh React tree (sering: WebGL tidak didukung/diblokir di perangkat). Sudah ada `ErrorBoundary` yang harusnya menangkap ini dan tampilkan pesan error alih-alih blank — kalau MASIH blank total, buka DevTools (F12) → tab Console, dan baca pesan merahnya untuk diagnosis lebih lanjut |
| Peta layar hitam gelap tiap reload (dev) | Sudah diperbaiki — dulu `React.StrictMode` di `main.jsx` konflik dengan WebGL context MapLibre. Kalau nanti nambahkan StrictMode lagi, jangan bungkus komponen yang render peta |
| Peta blank/abu-abu | Cek domain di `mapStyle.js` — harus `server.arcgisonline.com`, BUKAN `server.arcgis.com` |
| `npm install` error | Cek versi Node (`node -v`), harus ≥ 18 |
| Chapter baru tidak muncul di navigasi | Cek `id` unik, dan `section`-nya ada di `SECTION_LABELS` (`chapters.js`) |
| Chart tidak muncul, console warning "id chart tidak dikenal" | Id di field `chart` chapter tidak match dengan yang terdaftar di `ChartBlock.jsx` — cek ejaan |
| Foto tidak muncul | Pastikan file ada di `public/images/`, path di `chapters.js` mulai dengan `/images/...` (bukan `./` atau `../`) |
| Layer dashboard tidak render walau di-toggle | Layer masih dummy (`data: null` di `layers.js`) — isi dengan GeoJSON asli dulu |
| Icon Mills/PoD tidak muncul (titik kosong) | Icon SVG gagal dimuat sebelum layer ditambahkan — cek Console (F12) untuk error dari `mapIcons.js` |
| File drop GeoJSON/SHP gagal / muncul pesan error | Cek format file — cuma `.geojson`/`.json`/`.shp`/`.zip` yang didukung. `.shp` sendirian tanpa `.dbf` tetap bisa asal cuma butuh geometri |
