// src/data/chapters.js — 14 chapter, 5 section, alur investigasi
// Data: 0°Latitude Academy / Earthqualizer Foundation

import {
  kecamatanBoundary,
  lokasi1Polygon,
  lokasi2Polygon,
  lokasi3Polygon,
} from './polygons.js';

export const SECTION_LABELS = {
  intro:       'Overview',
  problem:     'Deforest & Palm Oil',
  evidence:    'Focus Case',
  consequence: 'Supply Chain',
  penutup:     'Conclusion',
};

const chapters = [

  // ══════════════════════════════════════════════════════
  // SECTION: OVERVIEW (3 chapter)
  // ══════════════════════════════════════════════════════

  // 1. COVER
  {
    id: 'hero',
    section: 'intro',
    type: 'hero',
    title: 'When Forests Lose Their Boundaries',
    text: 'A Landscape Story from Sajingan Besar · Kabupaten Sambas, Kalimantan Barat',
    images: ['/images/hero.jpg'],
    mapState: { center: [109.585, 1.644], zoom: 11, pitch: 50, bearing: -15 },
    polygons: [],
  },

  // 2. EXECUTIVE SUMMARY — tidak explicit, biarkan data bicara
  {
    id: 'executive-summary',
    section: 'intro',
    eyebrow: 'TEMUAN INVESTIGASI',
    title: 'Ada yang Berbeda di Tengah Hutan',
    text: 'Di antara ribuan petak kebun kecil milik petani Sajingan Besar, analisis citra satelit menemukan hamparan-hamparan berskala besar dengan pola yang berbeda. Semuanya berada di kawasan yang seharusnya dilindungi. Tidak ada izin yang ditemukan. Dan pembukaan masih berlangsung.',
    stats: [
      { value: '6.702 ha', label: 'Sawit dalam kawasan hutan' },
      { value: '592 ha', label: 'Pembukaan baru 2022–2024' },
      { value: 'WKN & KSS', label: 'Mill berpotensi terima TBS' },
    ],
    mapState: { center: [109.59, 1.63], zoom: 10, pitch: 10, bearing: 0 },
    polygons: [kecamatanBoundary],
  },

  // 3. HOOK — satu fakta yang menghentak
  {
    id: 'hook',
    section: 'intro',
    type: 'hook',
    eyebrow: 'NOVEMBER 2025',
    title: 'Pembukaan Masih Berlanjut. Bahkan Saat Ini.',
    text: 'Citra November 2025 mengindikasikan aktivitas pembakaran lahan di salah satu dari tiga lokasi yang diperiksa. Saat diverifikasi ke lapangan — area itu sudah ditanami kelapa sawit. Ekspansi kebun tidak berhenti pada pembukaan lahan. Ia berlanjut hingga pengembangan kebun.',
    images: ['/images/case1-burned.jpg'],
    stats: [
      { value: '2025', label: 'Pembukaan masih teridentifikasi' },
      { value: '3', label: 'Lokasi yang perlu pengawasan' },
      { value: '2027', label: 'Perkiraan panen pertama Lokasi 3' },
    ],
    mapState: { center: [109.573, 1.658], zoom: 14, pitch: 55, bearing: 10 },
    polygons: [lokasi1Polygon],
  },

  // ══════════════════════════════════════════════════════
  // SECTION: DEFOREST & PALM OIL (4 chapter)
  // ══════════════════════════════════════════════════════

  // 4. LANSKAP — konteks + bridging ke deforestasi
  {
    id: 'landscape',
    section: 'problem',
    eyebrow: '01 / KONTEKS',
    title: 'Sajingan Besar',
    text: 'Kecamatan di ujung utara Kabupaten Sambas, berbatasan langsung dengan Sarawak, Malaysia. Luas 139.120 ha — kawasan hulu bagi empat sungai dan habitat satwa bernilai konservasi: Rafflesia tuan-mudae, Heosemys spinosa, dan berbagai spesies amfibi endemik. Letaknya menjadikan perlindungan habitat dan pemantauan lintas batas sebagai agenda yang tidak terpisahkan. Namun di dalam lanskap yang sama, tekanan terhadap hutan terus berlangsung.',
    images: ['/images/landscape-forest.jpg', '/images/landscape-aerial.jpg'],
    stats: [
      { value: '139.120 ha', label: 'Luas kecamatan' },
      { value: '5 Desa', label: 'Sei Bening · Sanatab · Santaban · Kaliau\' · Sebunga\'' },
      { value: '4 Sungai', label: 'Hulu Paloh · Bening · Batang Air · Bantanan' },
    ],
    mapState: { center: [109.59, 1.63], zoom: 10, pitch: 0, bearing: 0 },
    polygons: [kecamatanBoundary],
  },

  // 5. FOREST DECLINE — dengan chart + bridging ke konversi
  {
    id: 'forest-decline',
    section: 'problem',
    eyebrow: '02 / DEFORESTASI',
    title: 'Hutan yang Terus Berkurang',
    text: 'Dalam satu dekade (2015–2025), Sajingan Besar kehilangan 3.721,81 ha tutupan hutan. Deforestasi mencapai puncak pada 2023 (951,97 ha) — naik 122,4% dari 2022. Paling mengkhawatirkan: 8% deforestasi terjadi di Peat Forest. Gambut membutuhkan ribuan tahun untuk terbentuk. Begitu rusak, pemulihannya hampir mustahil. Pertanyaannya — ke mana hutan yang hilang itu pergi?',
    chart: 'deforestation-trend',
    stats: [
      { value: '3.721 ha', label: 'Total kehilangan hutan 2015–2025' },
      { value: '951 ha', label: 'Puncak deforestasi (2023)' },
      { value: '304 ha', label: 'Deforestasi di Peat Forest' },
    ],
    mapState: { center: [109.59, 1.63], zoom: 10.5, pitch: 20, bearing: 5 },
    polygons: [kecamatanBoundary],
  },

  // 6. DEFORESTATION → PALM OIL — konversi dengan donut chart
  {
    id: 'deforestation-to-palm',
    section: 'problem',
    eyebrow: '03 / KONVERSI',
    title: 'Mayoritas Deforestasi Berakhir Menjadi Kebun Sawit',
    text: 'Dari total 304,76 ha deforestasi di Peat Forest, 140,48 ha atau 46,1% sudah menjadi kebun kelapa sawit. Hampir separuh hutan gambut yang hilang kini berubah wujud menjadi perkebunan. Tidak hanya berdampak pada tutupan lahan — gambut menyimpan karbon dalam jumlah besar, mengatur tata air, dan menjadi habitat bagi berbagai satwa. Ketika gambut dibuka dan dikeringkan, risiko kebakaran juga meningkat.',
    chart: 'forest-share-donut',
    stats: [
      { value: '46,1%', label: 'Deforestasi gambut → menjadi sawit' },
      { value: '92%', label: 'Deforestasi terjadi di hutan biasa' },
      { value: '30.104 ha', label: 'Total sawit di Sajingan Besar' },
    ],
    footnotes: ['Sumber: analisis spasial 0°Latitude Academy berdasarkan data BIG dan citra Sentinel-2.'],
    mapState: { center: [109.602, 1.650], zoom: 12, pitch: 30, bearing: -5 },
    polygons: [kecamatanBoundary, lokasi1Polygon, lokasi2Polygon, lokasi3Polygon],
  },

  // 7. PALM IN FOREST — 22.3% dengan chart per desa + bridging ke kasus
  {
    id: 'palm-in-forest',
    section: 'problem',
    eyebrow: '04 / EKSPANSI SAWIT',
    title: '22,3% Sawit Berada dalam Kawasan Hutan',
    text: 'Dari 30.104,43 ha kebun sawit di Sajingan Besar, 6.702,06 ha (22,3%) berada dalam kawasan hutan. Kondisi paling kritis di Desa Sanatab (66,5%) dan Kaliau\' (62,6%) — dua desa yang berada dalam satu wilayah adat, dengan ruang APL yang sangat terbatas. Di antara ribuan petak kecil kebun masyarakat, tiga hamparan berskala jauh lebih besar dan pola yang berbeda menarik perhatian untuk diperiksa lebih lanjut.',
    chart: 'village-comparison',
    stats: [
      { value: '6.702 ha', label: 'Sawit dalam kawasan hutan (22,3%)' },
      { value: '66,5%', label: 'Porsi dalam kawasan — Desa Sanatab' },
      { value: '62,6%', label: 'Porsi dalam kawasan — Desa Kaliau\'' },
    ],
    footnotes: ['Sanatab: 1.284,79 ha dari 1.931,78 ha. Kaliau\': 3.241,07 ha dari 5.175,65 ha. — 0°Latitude Academy'],
    mapState: { center: [109.600, 1.647], zoom: 12.5, pitch: 25, bearing: 0 },
    polygons: [kecamatanBoundary, lokasi1Polygon, lokasi2Polygon, lokasi3Polygon],
  },

  // ══════════════════════════════════════════════════════
  // SECTION: FOCUS CASE (4 chapter)
  // ══════════════════════════════════════════════════════

  // 8. POLA — overview 3 kasus, bridging per lokasi
  {
    id: 'cases-pattern',
    section: 'evidence',
    eyebrow: '05 / STUDI KASUS',
    title: '3 Lokasi. 1 Pola.',
    text: 'Tiga hamparan dipilih karena skala dan polanya kontras dengan kebun petani sekitarnya. Pemeriksaan menunjukkan ketiganya berada dalam kawasan Hutan Produksi Terbatas (HPT), dibuka antara 2022–2024, tidak ditemukan HGU maupun IUP pada bagian yang diperiksa, dan penguasaan lahan terindikasi terkonsentrasi pada pemilik modal (cukong) — bukan petani kecil yang menggarap sendiri. Skala pembukaan yang mengikuti kontur bukit memperkuat indikasi ini.',
    images: ['/images/case-overview-1.jpg', '/images/case-overview-2.jpg', '/images/case-overview-3.jpg'],
    mediaLayout: 'wide',
    stats: [
      { value: 'HPT', label: 'Status kawasan ketiga lokasi' },
      { value: '0', label: 'HGU / IUP teridentifikasi' },
      { value: 'Investor', label: 'Pola penguasaan (bukan petani kecil)' },
    ],
    mapState: { center: [109.585, 1.644], zoom: 13, pitch: 40, bearing: -10 },
    polygons: [lokasi1Polygon, lokasi2Polygon, lokasi3Polygon],
  },

  // 9. LOKASI 1
  {
    id: 'lokasi-1',
    section: 'evidence',
    eyebrow: '06 / LOKASI 1 · 307 ha · 2024',
    title: 'Pembukaan dengan Pembakaran, Ekspansi Masih Berlanjut',
    text: 'Lokasi 1 (Lat: 1.65804, Long: 109.57527) adalah hamparan seluas 307,083 ha yang mulai dibuka 2023 dan ditanami sawit pada 2024. Analisis citra menunjukkan pembukaan dilakukan dengan pembakaran. Pada November 2025, aktivitas pembukaan masih teridentifikasi. Dari total hamparan, 79,48 ha (26%) berada pada area deforestasi, sementara 227,60 ha di luar area deforestasi. Data Bhumi ATR/BPN tidak menunjukkan HGU. Wawancara mengindikasikan penguasaan oleh investor asal Pemangkat.',
    images: ['/images/case1-burned.jpg', '/images/case1-tbm.jpg'],
    stats: [
      { value: '307 ha', label: 'Total hamparan' },
      { value: '26%', label: 'Area berada dalam zona deforestasi' },
      { value: '2024', label: 'Mulai ditanami — Status: TBM' },
    ],
    footnotes: [
      '441,88 m: jarak area pembukaan ke alur sungai terdekat. Pasal 38 UU No.41 Tahun 1999 melarang kegiatan perkebunan dalam kawasan hutan produksi tanpa izin.',
    ],
    mapState: { center: [109.577, 1.658], zoom: 14.5, pitch: 45, bearing: 10 },
    polygons: [lokasi1Polygon],
  },

  // 10. LOKASI 2 + 3
  {
    id: 'lokasi-2-3',
    section: 'evidence',
    eyebrow: '07 / LOKASI 2 & 3',
    title: 'Dua Lokasi, Dua Tahap Perkembangan',
    text: 'Lokasi 2 (133,58 ha, 2023): hamparan dengan 3 bidang SHM di luar HPT — namun hanya mencakup 4,5% dari total area. Sebanyak 69% kebun berada dalam kawasan, 12% di area deforestasi. Investasi diduga oleh investor asal Tebas. Lokasi 3 (151,61 ha, 2022): yang paling matang dari ketiganya — 87% merupakan area deforestasi, akses jalan sudah bisa dilalui kendaraan roda empat, dan berdasarkan wawancara kebun diperkirakan mulai menghasilkan pada 2027. Artinya: waktu untuk verifikasi semakin sempit.',
    images: ['/images/case2-tbm.jpg', '/images/case3-field.jpg'],
    mediaLayout: 'wide',
    stats: [
      { value: '133 ha', label: 'Lokasi 2 · dibuka 2023 · 12% dari deforestasi' },
      { value: '151 ha', label: 'Lokasi 3 · dibuka 2022 · 87% dari deforestasi' },
      { value: '2027', label: 'Perkiraan panen Lokasi 3 — window verifikasi sempit' },
    ],
    footnotes: [
      'Lokasi 2: 3 SHM seluas ~6 ha dikecualikan dari fokus pemeriksaan (kebun petani kecil di luar HPT). Lokasi 3: tidak ada skema Perhutanan Sosial yang disetujui pada area ini. — 0°Latitude Academy',
    ],
    mapState: { center: [109.590, 1.636], zoom: 13.5, pitch: 35, bearing: 0 },
    polygons: [lokasi2Polygon, lokasi3Polygon],
  },

  // ══════════════════════════════════════════════════════
  // SECTION: SUPPLY CHAIN (2 chapter)
  // ══════════════════════════════════════════════════════

  // 11. SUPPLY CHAIN — rute animasi
  {
    id: 'supply-chain',
    section: 'consequence',
    eyebrow: '08 / RANTAI PASOK',
    title: 'Jejak yang Belum Lengkap',
    text: 'Ketiga kebun belum menghasilkan TBS. Namun jaringan pengumpulan sudah terbentuk: 5 PoD dalam radius 3–7,5 km sudah menerima TBS dari Sanatab dan Kaliau\'. Berdasarkan wawancara pemilik PoD, PT Wawasan Kebun Nusantara (WKN) dan PT Kalimantan Subur Sawit (KSS) menjadi tujuan yang paling berpotensi menerima buah dari ketiga lokasi. KSS menawarkan harga lebih tinggi; WKN lebih fleksibel dalam persyaratan kualitas.',
    images: ['/images/pod-pais.jpg', '/images/pod-baida.jpg', '/images/pod-arpi.jpg'],
    stats: [
      { value: '9 Mill', label: 'PKS dalam radius 25–81 km' },
      { value: '5 PoD', label: 'Pengepul dalam radius 3–7,5 km' },
      { value: '3,1 km', label: 'Jarak PoD terdekat (PoD Pais)' },
    ],
    footnotes: ['Mill data: Tabel 2. PoD data: Tabel 3. Sumber: 0°Latitude Academy.'],
    mapState: { center: [109.73, 1.47], zoom: 9, pitch: 0, bearing: 0 },
    polygons: [lokasi1Polygon, lokasi2Polygon, lokasi3Polygon],
    routes: true,
  },

  // 12. SOURCING RISK — implikasi industri
  {
    id: 'sourcing-risk',
    section: 'consequence',
    eyebrow: '09 / RISIKO SOURCING',
    title: 'Apakah Komitmen NDPE Sudah Cukup?',
    text: 'WKN (KPN Plantation) memiliki komitmen NDPE dan sertifikasi ISPO. Potential buyers-nya mencakup P&G dan Colgate-Palmolive — dua perusahaan dengan komitmen sustainability publik. Namun komitmen di tingkat pabrik tidak otomatis berarti penelusuran sampai tingkat kebun. Ketika PoD yang memasok ke WKN menerima TBS dari Sanatab tanpa verifikasi asal — buah dari ketiga lokasi berpotensi masuk ke dalam rantai pasok tanpa terdeteksi. Traceability to Plantation (TTP) adalah kuncinya.',
    highlight: true,
    stats: [
      { value: 'NDPE + ISPO', label: 'Komitmen WKN — namun TTP belum tercapai' },
      { value: 'P&G, Colgate', label: 'Potential buyers WKN dengan komitmen sustainability' },
      { value: 'Non-NDPE', label: 'Status KSS — tanpa sertifikasi teridentifikasi' },
    ],
    mapState: { center: [109.73, 1.47], zoom: 9.5, pitch: 0, bearing: 0 },
    polygons: [lokasi1Polygon, lokasi2Polygon, lokasi3Polygon],
    routes: true,
  },

  // ══════════════════════════════════════════════════════
  // SECTION: CONCLUSION (2 chapter)
  // ══════════════════════════════════════════════════════

  // 13. REKOMENDASI AKSI — apa yang perlu dilakukan
  {
    id: 'recommendations',
    section: 'penutup',
    eyebrow: '10 / REKOMENDASI',
    title: 'Tiga Hal yang Perlu Dilakukan Sekarang',
    text: 'Pertama: verifikasi lapangan harus dilakukan sebelum 2027 — tahun perkiraan panen Lokasi 3. Kedua: mill WKN dan KSS perlu memastikan mekanisme TTP berlaku hingga ke PoD yang memasok ke mereka. Ketiga: status kawasan, penguasaan lahan, dan legalitas di ketiga lokasi perlu dikonfirmasi oleh otoritas yang berwenang. Selama ketiga hal ini belum jelas, situasinya tetap sama: potensi TBS dari sumber berisiko masuk ke rantai pasok tanpa terdeteksi.',
    stats: [
      { value: 'Sebelum 2027', label: 'Deadline verifikasi Lokasi 3' },
      { value: 'WKN & KSS', label: 'Prioritas audit rantai pasok' },
      { value: '3 Lokasi', label: 'Perlu pemantauan aktif berkelanjutan' },
    ],
    mapState: { center: [109.59, 1.63], zoom: 10, pitch: 0, bearing: 0 },
    polygons: [kecamatanBoundary, lokasi1Polygon, lokasi2Polygon, lokasi3Polygon],
  },

  // 14. CONCLUSION — pernyataan akhir yang tegas
  {
    id: 'conclusion',
    section: 'penutup',
    eyebrow: '11 / KESIMPULAN',
    title: 'Selama Belum Jelas, Sebaiknya Tidak Masuk',
    text: 'Selama status kawasan, legalitas, penguasaan lahan, dan asal buah dari ketiga lokasi belum jelas — TBS dari ketiga lokasi tersebut sebaiknya tidak masuk ke dalam rantai pasok.',
    highlight: true,
    stats: [
      { value: '3 Lokasi', label: 'HPT · tanpa izin · TBM → menuju produktif' },
      { value: '6.702 ha', label: 'Sawit dalam kawasan hutan di Sajingan Besar' },
      { value: 'TTP', label: 'Satu-satunya cara pastikan buah bersih dari sumber berisiko' },
    ],
    mapState: { center: [109.59, 1.63], zoom: 10, pitch: 10, bearing: 0 },
    polygons: [kecamatanBoundary, lokasi1Polygon, lokasi2Polygon, lokasi3Polygon],
  },
];

export default chapters;
