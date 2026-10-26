# Deep Audit — sajingan-storymap

Tanggal: 2026-10-26 · Branch: `refactor/orphan-style` (commit `c953287`) · Stack: React 18, Vite 5, MapLibre GL 4.7, Recharts 2, JSX (tanpa TypeScript).

## 0. Catatan lingkup

- Project ini **storymap + peta interaktif + dashboard** untuk satu kecamatan (Sajingan Besar), bukan aplikasi daftar *orphan case*. Pemisahan layer Presentation/Domain/Data dan fitur "buffer 50 km" tidak ada di sini. Audit menilai apa yang ada, dan menandai yang tidak berlaku sebagai **N/A**.
- Metode: baca kode, `npm audit`, `vite build`, hitung ulang luas poligon dari GeoJSON, uji tampilan di viewport 390 px dan 360 px (iframe di Chrome). **Tidak diukur:** FPS, Lighthouse, uji perangkat fisik, uji aksesibilitas dengan screen reader. Klaim performa di bawah berbasis ukuran aset dan pembacaan kode, bukan profiling.

## 1. Ringkasan eksekutif

| Area | Nilai | Catatan singkat |
|---|---|---|
| Standar industri & keamanan | Kurang | 1 kerentanan **critical** di dependensi, popup rawan XSS, tanpa CI/lint/test |
| Fungsionalitas & logika | Cukup | Alur utama jalan; data hand-sync dan selisih luas belum terverifikasi |
| Clean architecture | Cukup | Data (`src/data`), hook, komponen terpisah; tapi hook/komponen peta terlalu besar |
| Kualitas kode & reuse | Cukup | 3 berkas mati, komentar sangat panjang, duplikasi pola layer |
| Web GIS & CRS | Baik, dengan 1 temuan | Semua GeoJSON WGS84; luas tersimpan berbeda dari hitung ulang |
| UI/UX & mobile | **Kurang** | Rail navigasi menimpa teks, kartu sumber menimpa judul, kontrol peta saling tindih di HP |

Tiga hal yang paling mendesak: (1) popup peta menyisipkan HTML tanpa escape, termasuk dari berkas yang diunggah pengguna; (2) layout HP rusak di semua tab peta; (3) selisih luas Lokasi 2 dan 3 antara atribut dan hitung ulang geometri.

## 2. Standar industri & best practice

| ID | Temuan | Bukti | Severity |
|---|---|---|---|
| S-1 | `maplibre-gl <=6.4.0` punya advisory **critical** (XSS sanitizer bypass, GHSA-jrc7-96c5-q579). Proyek memakai `^4.7.1`. Perbaikan butuh lompat mayor ke 6.x. | `npm audit --omit=dev` | High |
| S-2 | Popup memakai `setHTML` dengan string template dari properti fitur tanpa escape. Properti `name` dan atribut lain bisa berasal dari berkas yang diunggah pengguna (drag-and-drop GeoJSON/SHP) → HTML/JS tereksekusi di halaman. | `MapController.jsx:299`, `useMapEngine.js:45-70,173,225,238` | High |
| S-3 | Tidak ada CI, linter, formatter, atau test. `CLAUDE.md` menyebut ini sendiri; `npm run build` satu-satunya gerbang. | `package.json` | Medium |
| S-4 | Tidak ada header keamanan (CSP, X-Content-Type-Options, Referrer-Policy). Tidak ada konfigurasi hosting di repo. | tidak ada `vercel.json`/`_headers` | Medium |
| S-5 | `CLAUDE.md` ada di `.gitignore`, jadi dokumentasi arsitektur tidak ikut versi. | `.gitignore:7` | Low |
| S-6 | Tidak ada TypeScript atau PropTypes; kontrak data (`chapters.js`, `layers.js`) hanya divalidasi runtime oleh `validateChapters` yang cuma `console` log. | `utils/validateChapters.js` | Medium |
| S-7 | Tidak memakai `React.StrictMode` (disengaja karena WebGL). Sah, tapi menyembunyikan efek tanpa cleanup yang benar. | `main.jsx` | Low |

Positif: tidak ada secret/`.env` di repo; semua fetch ke aset statis lokal; tile Esri/CARTO lewat HTTPS; `<html lang="id">`.

## 3. Fungsionalitas & logika

| ID | Temuan | Bukti | Severity |
|---|---|---|---|
| F-1 | Angka sama ditulis tangan di dua tempat (narasi `chapters.js` dan `reportData.js`). Sudah ada drift riwayat (komentar "sebelumnya 592,29 ha"), dan sekarang "3,1–7,5 km" (aktif) vs "3–7,5 km" (backup). | `data/chapters.js:232`, `data/chapters-backup.js:211`, `data/reportData.js:14` | Medium |
| F-2 | Banyak `fetch(...).catch(() => {})` yang menelan error. Layer yang gagal dimuat hilang tanpa pesan ke pengguna. | `InteractiveMapView.jsx:46`, `MapController.jsx:287` | Medium |
| F-3 | Tidak ada `AbortController` pada fetch di effect; hanya `useCaseInspectorData` memakai flag `cancelled`. Perpindahan tab cepat bisa memanggil `setState` pada komponen yang sudah lepas. | `MapController.jsx:284,373,391`, `useMapEngine.js:378,395,569` | Low |
| F-4 | Tab tidak punya URL. Tidak bisa dibagikan/di-bookmark per tab atau per chapter, dan tombol Back peramban keluar dari aplikasi. | `App.jsx` (state `activeTab`) | Medium |
| F-5 | Kompas hanya tampilan; tidak bisa diklik untuk reset utara. | `MapOverlayStack.jsx` | Low |

Tidak ditemukan bug fungsional pada alur utama saat diuji manual di desktop: scroll → chapter aktif → kamera bergerak, pindah tab, buka panel layer, legenda, dashboard.

## 4. Arsitektur

Struktur sekarang: `data/` (konten + geometri), `hooks/`, `components/`, `utils/`. Pemisahan kasar sudah ada, tapi bukan Clean Architecture berlapis.

| ID | Temuan | Bukti | Severity |
|---|---|---|---|
| A-1 | `useMapEngine.js` 708 baris dan `MapController.jsx` 572 baris menggabungkan: inisialisasi peta, fetch data, styling layer, popup, event, legenda. Sulit diuji dan diubah. | `wc -l` | Medium |
| A-2 | Fetch data langsung di komponen/hook presentasi (path hardcode `'/geojson/...'` tersebar di 6 tempat). Tidak ada lapisan data tunggal. | `MapController.jsx:373,391`, `useMapEngine.js:395`, `useCaseInspectorData.js:25` | Medium |
| A-3 | Dua implementasi peta paralel (Storymap: `MapController`; Peta Interaktif: `useMapEngine`) mengulang pola menambah layer, popup, dan teks berhalo. | dua berkas di atas | Medium |
| A-4 | Domain logic (jarak haversine, merge data kasus, validasi) sudah di `utils/` dan murni; ini bagus dan layak dijadikan lapisan Domain. | `utils/distance.js`, `mergeCaseData.js` | — |

## 5. Kualitas kode & reusability

| ID | Temuan | Bukti | Severity |
|---|---|---|---|
| Q-1 | Berkas tidak diimpor di mana pun: `components/CasesTable.jsx`, `hooks/useScrollActivity.js`, `data/chapters-backup.js` (276 baris). | skrip pencarian impor | Low |
| Q-2 | Komentar berlapis dan panjang (riwayat keputusan) memenuhi kode produksi; sebagian sudah tidak akurat setelah redesign (mis. nama kelas lama di komentar). Pindahkan ke `DEVELOPMENT.md`/ADR. | `App.css`, `MapController.jsx` | Low |
| Q-3 | `App.css` ±1.700 baris, satu berkas. Token sudah dipusatkan (`styles/tokens.css`), tapi komponen belum punya CSS terpisah. | `src/App.css` | Low |
| Q-4 | Warna kategori data di `data/layers.js` dan `MapController.jsx` (hutan lindung dst.) masih hex literal. Disengaja (kartografi), tapi tidak terdokumentasi di satu tempat. | `MapController.jsx:244-254` | Low |
| Q-5 | Komponen yang baik dipakai ulang: `MapLegend`, `MapScaleBar`, `MapOverlayStack`, `StatBlock`, `PhotoGrid`. | — | — |

## 6. Web GIS & CRS

| ID | Temuan | Bukti | Severity |
|---|---|---|---|
| G-1 | Semua GeoJSON berada di **WGS84 (EPSG:4326 / CRS84)**; ada yang menyatakan `urn:ogc:def:crs:OGC:1.3:CRS84`, sisanya tanpa anggota `crs` (default RFC 7946 = WGS84). Konsisten. Tampilan MapLibre memakai Web Mercator (EPSG:3857) secara internal; ini benar. | `public/geojson/*.geojson` | OK |
| G-2 | Basemap Esri/CARTO memakai tile XYZ Web Mercator; `MapScaleBar` memakai rumus `156543.03392·cos(lat)/2^z` yang tepat untuk 3857. | `MapScaleBar.jsx:35-37` | OK |
| G-3 | Jarak mill/PoD memakai haversine (R = 6371 km), akurasi cukup (<0,5 %) untuk jarak puluhan km. | `utils/distance.js` | OK |
| G-4 | **Luas tidak dihitung di aplikasi.** Nilai `Area (ha)` ditulis dari QGIS. Hitung ulang geodesik (rumus luas bola, R = 6378137 m) memberi selisih: Lokasi 1 **309,15** vs 307,08 ha; Lokasi 2 **134,63** vs 140,72 ha; Lokasi 3 **161,25** vs 179,78 ha. Total 605,0 vs 627,58 ha (−3,6 %). Lokasi 3 −10 %. Rumus bola bisa menyimpang ±0,5 %, jadi selisih ini bukan pembulatan. Narasi memakai 627,58 ha. | `public/geojson/lokasi-*.geojson` | **High** (perlu verifikasi di QGIS dengan ellipsoid + UTM 49N) |
| G-5 | Tidak ada metadata CRS/ellipsoid/metode luas di UI maupun dokumentasi. Pembaca (Sustainability Manager) tidak bisa menilai asal angka hektar. | — | Medium |
| G-6 | Fitur **buffer 50 km: tidak ada** di project ini (**N/A**). Jika dibutuhkan, hitung di EPSG:32649 (UTM 49N) atau gunakan buffer geodesik, jangan buffer derajat di 4326. | — | N/A |
| G-7 | Unggahan pengguna (SHP/zip) tidak direproyeksi: `shpjs` membaca `.prj` hanya jika ada. Berkas dalam UTM tanpa `.prj` akan salah posisi tanpa peringatan. | `utils/parseGeoFile.js` | Medium |

## 7. UI/UX, responsivitas HP, performa

Diuji di viewport 390 × 780 dan 360 × 640 (iframe).

| ID | Temuan | Bukti | Severity |
|---|---|---|---|
| U-1 | **Rail navigasi menimpa teks narasi.** Di chapter pertama judul "When Forests…" terpotong huruf awalnya; di chapter berikut rail menutupi kolom kiri paragraf. | tangkapan 390/360 px | **High** |
| U-2 | **Kartu sumber citra menimpa judul dan teks hero** (360 px: tepat di atas "Kabupaten Sambas"). | tangkapan 360 px | **High** |
| U-3 | Header tab mengambang (`z-index:100`) menutupi judul kartu yang sedang di-scroll. | tangkapan 390 px | Medium |
| U-4 | Peta Interaktif di HP: kontrol zoom/kompas MapLibre menimpa kartu sumber; tombol "Layer" menimpa kartu sumber; legenda + inset + skala memenuhi sepertiga layar peta. | tangkapan 360 px | **High** |
| U-5 | Inset map dan legenda tampil permanen di HP; tidak ada mode ringkas. | idem | Medium |
| U-6 | Aset gambar **89 MB** di `public/images`; satu PNG 15 MB (`3Lokasii_QGIS.png`) dan beberapa JPG 8–9 MB. Tidak ada `srcset`/WebP. Pada seluler, ini beban terbesar. `loading="lazy"` sudah ada di `PhotoGrid` dan `MediaGallery`, tapi gambar tidak diperkecil. | `du -sh`, `ls -S` | **High** |
| U-7 | GeoJSON terbesar 1,6 MB (`deforestasi`), 4,3 MB total, dimuat tanpa kompresi/simplifikasi; belum diukur pada jaringan lambat. | `public/geojson` | Medium |
| U-8 | Chunk `maplibre` ±800 kB dan `recharts` ±550 kB. Recharts sudah lazy (tab Dashboard); MapLibre ikut pemuatan awal. | `vite build` | Low |
| U-9 | Animasi rute memakai `requestAnimationFrame` dengan cleanup yang benar. **FPS tidak diukur**; risiko jank ada pada pitch peta + banyak layer fill di perangkat murah. | `RouteAnimationLayer.jsx:218,300` | Perlu profiling |
| U-10 | Aksesibilitas: hanya 15 atribut `aria-*`/`role`; peta tidak punya `role="region"` + label; rail navigasi tidak punya `aria-current`; kontras teks sekunder `rgb(146 149 141)` di atas imagery tidak diuji. | grep | Medium |
| U-11 | `prefers-reduced-motion` ditangani untuk animasi header/loading (`styles/base.css`) dan perilaku scroll (`Story.jsx:27`); gerak kamera peta dan animasi rute belum terbukti menghormatinya. | `RouteAnimationLayer.jsx`, `MapController.jsx` | Medium |
| U-12 | Alur navigasi: tiga tab setara tanpa petunjuk urutan; pengguna baru tidak tahu Storymap = cerita, Peta = eksplorasi, Dashboard = angka. Tidak ada tombol "kembali ke awal" dalam Storymap kecuali rail. | `TabSwitcher.jsx` | Low |

## 8. Roadmap perbaikan

### High (sprint 1)

| # | Tindakan | Terkait | Estimasi |
|---|---|---|---|
| H1 | Escape semua nilai di popup (`textContent`/helper `escapeHtml`) atau bangun DOM, bukan string HTML. Tambah uji dengan nama berisi `<img onerror>`. | S-2 | 0,5 hari |
| H2 | Perbaiki layout HP: rail jadi bar bawah atau drawer di ≤640 px; geser/kecilkan kartu sumber; sembunyikan inset dan legenda ringkas di HP; atur ulang posisi kontrol MapLibre dan tombol "Layer". Uji di 320/360/390/430 px. | U-1..U-5 | 2 hari |
| H3 | Verifikasi luas Lokasi 1–3 di QGIS (ellipsoid WGS84, UTM 49N), perbaiki `Area (ha)` dan angka narasi/dashboard bila beda; catat metode di dashboard. | G-4, G-5, F-1 | 1 hari |
| H4 | Kompres gambar: WebP/AVIF, lebar maks 1600 px, `srcset` + `loading="lazy"`; target total <15 MB, tidak ada berkas >500 kB. | U-6 | 1 hari |
| H5 | Rencanakan upgrade `maplibre-gl` ke versi non-rentan; uji regresi peta (breaking change 4→6). Sementara itu, H1 mengurangi permukaan serangan. | S-1 | 1–2 hari |

### Medium (sprint 2)

| # | Tindakan | Terkait |
|---|---|---|
| M1 | Tambah ESLint + Prettier + GitHub Actions (`build`, lint, `npm audit`). | S-3 |
| M2 | Test unit untuk `utils/` (haversine, merge, validasi) dan test render komponen kunci; satu uji e2e per tab (Playwright, viewport desktop dan 390 px). | S-3, A-4 |
| M3 | Router ringan (hash) untuk tab dan chapter agar bisa dibagikan dan Back berfungsi. | F-4 |
| M4 | Lapisan data tunggal (`data/geo.js`) untuk fetch GeoJSON dengan cache, `AbortController`, dan pesan galat yang terlihat pengguna. | A-2, F-2, F-3 |
| M5 | Pecah `useMapEngine`/`MapController`: pisahkan layer builder, popup, dan sumber data; satukan pola layer yang diulang di dua peta. | A-1, A-3 |
| M6 | Deteksi `.prj` saat unggah SHP dan reproyeksi ke 4326 (proj4), atau tolak dengan pesan jelas bila CRS tak diketahui. | G-7 |
| M7 | Header keamanan (CSP, nosniff, referrer) di konfigurasi hosting; tambahkan berkas konfigurasinya ke repo. | S-4 |
| M8 | Aksesibilitas: `aria-current`, label region peta, uji kontras teks di atas citra, hormati `prefers-reduced-motion` untuk kamera dan animasi rute. | U-10, U-11 |
| M9 | Satukan angka narasi dan dashboard ke satu sumber (`reportData.js`) dan rujuk dari `chapters.js`. | F-1 |

### Low (backlog)

| # | Tindakan | Terkait |
|---|---|---|
| L1 | Hapus `CasesTable.jsx`, `useScrollActivity.js`, `chapters-backup.js` (ada di riwayat git). | Q-1 |
| L2 | Pindahkan komentar riwayat keputusan ke `DEVELOPMENT.md`; keluarkan `CLAUDE.md` dari `.gitignore` atau salin ke `docs/`. | Q-2, S-5 |
| L3 | Pecah `App.css` per komponen; dokumentasikan palet kategori kartografi di satu berkas. | Q-3, Q-4 |
| L4 | Kompas interaktif (klik reset utara, seret putar) seperti orphan-case. | F-5 |
| L5 | Profil performa nyata (Chrome Performance, Lighthouse mobile, 4× CPU slowdown); catat hasil FPS. Simplifikasi GeoJSON besar (mapshaper) dan layani dengan gzip/brotli. | U-7, U-8, U-9 |
| L6 | Uji kegunaan dengan 3–5 Sustainability Manager; tambah teks pengantar tiap tab. | U-12 |
| L7 | Pertimbangkan migrasi TypeScript bertahap, mulai dari `data/` dan `utils/`. | S-6 |

## 9. Kriteria selesai yang disarankan

- Tidak ada `npm audit` critical/high pada dependensi produksi.
- Popup lulus uji injeksi HTML.
- Tidak ada elemen saling tindih di 320–430 px pada tiga tab (uji tangkapan layar otomatis).
- Total aset awal <5 MB; LCP seluler terukur dan dicatat.
- Luas hektar di aplikasi cocok dengan QGIS dalam toleransi 0,5 % dan metodenya tertulis.
