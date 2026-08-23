// src/data/chapters.js — Struktur mengikuti laporan PDF
// "When Forests Lose Their Boundaries"
// 0°Latitude Academy / Earthqualizer Foundation

import {
  kecamatanBoundary,
  lokasi1Polygon,
  lokasi2Polygon,
  lokasi3Polygon,
} from './polygons.js';

export const SECTION_LABELS = {
  intro:       'Overview',
  problem:     'Hutan & Sawit',
  evidence:    'Studi Kasus',
  consequence: 'Rantai Pasok',
  penutup:     'Kesimpulan',
};

const chapters = [

  // ══════════════════════════════════════════════════════
  // SECTION: OVERVIEW
  // ══════════════════════════════════════════════════════

  // 1. COVER
  {
    id: 'cover',
    section: 'intro',
    type: 'hero',
    title: 'When Forests Lose Their Boundaries',
    text: 'A Landscape Story from Sajingan Besar · Kabupaten Sambas, Kalimantan Barat.',
    images: ['/images/hero.jpg'],
    mapState: { center: [109.585, 1.644], zoom: 11, pitch: 50, bearing: -15 },
    polygons: [],
  },

  // 2. RINGKASAN EKSEKUTIF
  {
    id: 'ringkasan-eksekutif',
    section: 'intro',
    eyebrow: 'RINGKASAN EKSEKUTIF',
    title: 'Sajingan Besar: Kawasan Hulu di Bawah Tekanan',
    text: 'Sajingan Besar merupakan wilayah hulu di Kabupaten Sambas yang memiliki fungsi penting bagi lanskap sekitarnya. Tekanan terhadap tutupan hutan masih berlangsung — dari 37.691,62 ha pada 2015, tutupan hutan berkurang menjadi 33.969,81 ha pada 2025. Dari 30.104,43 ha kebun sawit yang teridentifikasi, 6.702,06 ha (22,3%) berada dalam kawasan hutan. Tiga hamparan berskala besar ditemukan di Desa Sanatab dan Kaliau\', semuanya dalam kawasan HPT, tanpa HGU maupun IUP. Ketiga lokasi belum menghasilkan TBS, namun jalur pasok sudah terbentuk — enam POD yang disurvei memasok TBS ke PT Wawasan Kebun Nusantara (WKN) dan PT Kalimantan Subur Sawit (KSS). Selama status kawasan, legalitas, penguasaan lahan, dan asal buah belum jelas, potensi masuknya TBS dari ketiga lokasi ke dalam rantai pasok perlu dicegah dan ditelusuri lebih lanjut.',
    stats: [
      { value: '3.721 ha', label: 'Kehilangan tutupan hutan 2015–2025' },
      { value: '22,3%', label: 'Sawit dalam kawasan hutan' },
      { value: '0 HGU / IUP', label: 'Teridentifikasi di bagian kebun yang diperiksa' },
    ],
    mapState: { center: [109.59, 1.63], zoom: 10, pitch: 0, bearing: 0 },
    polygons: [kecamatanBoundary],
  },

  // 3. PENDAHULUAN
  {
    id: 'pendahuluan',
    section: 'intro',
    eyebrow: 'PENDAHULUAN',
    title: 'Sajingan Besar',
    text: 'Kecamatan di ujung utara Kabupaten Sambas, berbatasan langsung dengan Sarawak, Malaysia. Dengan luas 139.120 ha, kecamatan ini berada di bagian hulu sungai yang mengalir menuju Sambas dan terdiri dari lima desa. Posisi ini menjadikan Sajingan Besar sebagai bagian penting dari lanskap hulu, dengan berbagai fungsi kawasan: Hutan Lindung (HL), Hutan Produksi (HP), Hutan Produksi Terbatas (HPT), dan Taman Wisata Alam (TWA/HW). Di dalam lanskap ini, tutupan hutan menjadi habitat bagi satwa bernilai konservasi — termasuk Rafflesia tuan-mudae, kura-kura duri (Heosemys spinosa), dan berbagai spesies amfibi.',
    images: ['/images/landscape-forest.jpg', '/images/landscape-aerial.jpg'],
    stats: [
      { value: '139.120 ha', label: 'Luas kecamatan' },
      { value: '5 Desa', label: 'Sei Bening · Sanatab · Santaban · Kaliau\' · Sebunga\'' },
      { value: '4 Fungsi', label: 'HL · HP · HPT · TWA/HW' },
    ],
    footnotes: ['Kawasan hutan mengacu pada SK.6630/MENLHK-PKTL/KUH/PLA.2/10/2021.'],
    mapState: { center: [109.59, 1.63], zoom: 10, pitch: 0, bearing: 0 },
    polygons: [kecamatanBoundary],
  },

  // ══════════════════════════════════════════════════════
  // SECTION: HUTAN & SAWIT
  // ══════════════════════════════════════════════════════

  // 4. HUTAN YANG TERUS BERKURANG
  {
    id: 'hutan-berkurang',
    section: 'problem',
    eyebrow: 'HUTAN YANG TERUS BERKURANG',
    title: '3.721 Ha dalam Satu Dekade',
    text: 'Pada 2015, Sajingan Besar tercatat memiliki tutupan hutan sebesar 37.691,62 ha. Pada 2025, luas tersebut berkurang menjadi 33.969,81 ha — kehilangan 3.721,81 ha dalam sepuluh tahun. Deforestasi meningkat dari 428,02 ha pada 2022 menjadi 951,97 ha pada 2023, atau naik sekitar 122,4%. Setelah mencapai titik tertinggi pada 2023, luas deforestasi menurun menjadi 740,13 ha pada 2024 dan kembali turun menjadi 458,30 ha pada 2025. Sekitar 92% deforestasi terjadi pada hutan biasa, sedangkan 8% terjadi pada hutan gambut (Peat Forest).',
    chart: 'deforestation-trend',
    stats: [
      { value: '37.691 ha', label: 'Tutupan hutan 2015' },
      { value: '33.969 ha', label: 'Tutupan hutan 2025' },
      { value: '951 ha', label: 'Puncak deforestasi 2023 (+122% dari 2022)' },
    ],
    footnotes: ['Dari total 304,76 ha deforestasi pada Peat Forest, sekitar 140,48 ha atau 46,1% telah menjadi kebun kelapa sawit. — Sumber: 0°Latitude Academy'],
    mapState: { center: [109.59, 1.63], zoom: 10.5, pitch: 20, bearing: 5 },
    polygons: [kecamatanBoundary],
  },

  // 5. PERKEBUNAN KELAPA SAWIT DI SAJINGAN BESAR
  {
    id: 'perkebunan-sawit',
    section: 'problem',
    eyebrow: 'PERKEBUNAN KELAPA SAWIT DI SAJINGAN BESAR',
    title: '22,3% Kebun Sawit Berada dalam Kawasan Hutan',
    text: 'Dari total 30.104,43 ha kebun kelapa sawit yang teridentifikasi di Sajingan Besar, sekitar 6.702,06 ha atau 22,3% berada dalam kawasan hutan. Kondisi ini paling terlihat di Desa Sanatab dan Kaliau\', dengan masing-masing 66,5% dan 62,6% kebun kelapa sawit berada dalam kawasan hutan. Di antara sebaran kebun yang umumnya berupa petak-petak kecil, ditemukan tiga hamparan dengan luasan lebih besar dan pola yang berbeda dari kebun masyarakat di sekitarnya.',
    chart: 'village-comparison',
    stats: [
      { value: '30.104 ha', label: 'Total kebun sawit di Sajingan Besar (21,65% dari luas kecamatan)' },
      { value: '6.702 ha', label: 'Sawit dalam kawasan hutan (22,3%)' },
      { value: '66,5%', label: 'Tertinggi di Desa Sanatab' },
    ],
    footnotes: [
      'Sanatab: 1.284,79 ha dari 1.931,78 ha. Kaliau\': 3.241,07 ha dari 5.175,65 ha. Desa Sebunga\' memiliki luas kebun terbesar (16.907,82 ha) dengan pola bukaan terindikasi dari perusahaan (PT. Wana Hijau Semesta). — 0°Latitude Academy',
    ],
    mapState: { center: [109.600, 1.647], zoom: 12.5, pitch: 25, bearing: 0 },
    polygons: [kecamatanBoundary, lokasi1Polygon, lokasi2Polygon, lokasi3Polygon],
  },

  // 6. TEMUAN UTAMA
  {
    id: 'temuan-utama',
    section: 'problem',
    eyebrow: 'TEMUAN UTAMA',
    title: 'Tiga Hamparan, Satu Pertanyaan Besar',
    text: 'Dalam periode 2022–2024, pembukaan lahan seluas 592,29 ha teridentifikasi di Desa Sanatab dan Kaliau\'. Berdasarkan analisis pola bukaan dan verifikasi lapangan, area tersebut terindikasi dikelola melalui pola ISH/Outgrower. Ketiga lokasi berada di kawasan HPT, tidak ditemukan izin resmi (HGU dan IUP), dan penguasaan lahan terkonsentrasi pada sejumlah aktor. Sajingan Besar juga merupakan hulu bagi empat sungai — di Lokasi 1, area pembukaan berada sekitar 441,88 m dari alur sungai.',
    images: ['/images/case-overview-1.jpg', '/images/case-overview-2.jpg', '/images/case-overview-3.jpg'],
    mediaLayout: 'wide',
    stats: [
      { value: '592 ha', label: 'Pembukaan teridentifikasi 2022–2024' },
      { value: 'HPT', label: 'Status kawasan ketiga lokasi' },
      { value: 'ISH/Outgrower', label: 'Pola terindikasi — bukan kebun petani kecil biasa' },
    ],
    mapState: { center: [109.585, 1.644], zoom: 13, pitch: 40, bearing: -10 },
    polygons: [lokasi1Polygon, lokasi2Polygon, lokasi3Polygon],
  },

  // ══════════════════════════════════════════════════════
  // SECTION: STUDI KASUS
  // ══════════════════════════════════════════════════════

  // 7. STUDI KASUS — PENGANTAR
  {
    id: 'studi-kasus-pengantar',
    section: 'evidence',
    eyebrow: 'STUDI KASUS',
    title: '3 Lokasi. 1 Pola.',
    text: 'Pemeriksaan terhadap tiga lokasi menunjukkan pola yang serupa. Sebagian besar hamparan berada dalam kawasan Hutan Produksi Terbatas (HPT), sementara pemeriksaan data Bhumi ATR/BPN tidak menemukan HGU dan observasi lapangan tidak menemukan IUP yang teridentifikasi. Lokasi 1, 2, dan 3 masing-masing teridentifikasi mulai dibuka pada 2024, 2023, dan 2022. Skala pembukaan dan informasi lapangan menunjukkan adanya dugaan penguasaan lahan oleh investor.',
    stats: [
      { value: 'HPT', label: 'Status kawasan — semua lokasi' },
      { value: '2022–2024', label: 'Rentang waktu pembukaan' },
      { value: 'TBM', label: 'Status seluruh tanaman saat ini' },
    ],
    mapState: { center: [109.585, 1.644], zoom: 13, pitch: 40, bearing: -10 },
    polygons: [lokasi1Polygon, lokasi2Polygon, lokasi3Polygon],
  },

  // 8. KASUS 1
  {
    id: 'kasus-1',
    section: 'evidence',
    eyebrow: 'Lokasi 1',
    title: 'Pembukaan dalam Satu Hamparan Luas Mengikuti Lereng Bukit',
    text: 'Lokasi 1 (1.65804°LU, 109.57527°BT) — hamparan seluas 307,083 ha yang mulai dibuka 2023 dan ditanami sawit 2024. Pembukaan dilakukan dalam satu hamparan luas mengikuti lereng bukit, dengan skala yang lebih besar dibandingkan kebun petani kecil di sekitarnya. Pada Agustus 2025, citra mengindikasikan pembukaan lahan melalui pembakaran. Saat diverifikasi lapangan, area tersebut telah ditanami kelapa sawit. Pembukaan masih teridentifikasi hingga November 2025. Data ATR/BPN tidak menunjukkan HGU; observasi lapangan tidak menemukan IUP. Wawancara mengindikasikan penguasaan oleh investor asal Pemangkat.',
    images: ['/images/case1-burned.jpg', '/images/case1-tbm.jpg'],
    stats: [
      { value: '307 ha', label: 'Total hamparan Lokasi 1' },
      { value: '26%', label: 'Berada dalam zona deforestasi (79,48 ha)' },
      { value: 'TBM 2024', label: 'Mulai ditanam — ekspansi masih aktif' },
    ],
    footnotes: ['441,88 m: jarak area pembukaan ke alur sungai. Pola bukaan memperkuat indikasi peran pemilik modal (cukong). — 0°Latitude Academy'],
    mapState: { center: [109.577, 1.658], zoom: 14.5, pitch: 45, bearing: 10 },
    polygons: [lokasi1Polygon],
  },

  // 9. KASUS 2
  {
    id: 'kasus-2',
    section: 'evidence',
    eyebrow: 'Lokasi 2',
    title: 'Mayoritas dalam Kawasan, 4,5% Bersertifikat',
    text: 'Lokasi 2 (1.64645°LU, 109.59320°BT) — hamparan 133,588 ha yang dibuka 2023. Dari total hamparan, sekitar 16,064 ha atau 12% teridentifikasi berasal dari area deforestasi, sementara 117,524 ha lainnya berada di luar area deforestasi. Terdapat tiga bidang SHM yang berada di luar kawasan HPT dan teridentifikasi sebagai kebun petani kecil yang menggarap lahannya sendiri — namun luasnya hanya mencakup sekitar 4,5% dari total hamparan. Sebanyak 95,5% kebun tidak ditemukan HGU maupun IUP. Sebagian besar hamparan berada dalam kawasan HPT. Wawancara menyebutkan penguasaan oleh investor asal Tebas.',
    images: ['/images/case2-tbm.jpg'],
    stats: [
      { value: '133 ha', label: 'Total hamparan Lokasi 2' },
      { value: '4,5%', label: 'Porsi SHM di luar HPT (kebun petani kecil)' },
      { value: '69%', label: 'Berada dalam kawasan hutan' },
    ],
    footnotes: ['3 bidang SHM dikecualikan dari fokus pemeriksaan karena berada di luar HPT. Kondisi ini membuat 31,29% area dikecualikan dari fokus pemeriksaan kebun dalam kawasan. — 0°Latitude Academy'],
    mapState: { center: [109.593, 1.646], zoom: 14.5, pitch: 40, bearing: -5 },
    polygons: [lokasi2Polygon],
  },

  // 10. KASUS 3
  {
    id: 'kasus-3',
    section: 'evidence',
    eyebrow: 'Lokasi 3',
    title: 'Yang Paling Berkembang — dan Paling Mendesak Diverifikasi',
    text: 'Lokasi 3 (1.62635°LU, 109.58668°BT) — hamparan 151,618 ha yang sudah ditanami sawit sejak 2022. Sekitar 131,51 ha atau 87% merupakan kelapa sawit yang berada pada area teridentifikasi mengalami deforestasi. Berdasarkan SK kawasan SIGAP, hamparan ini berada dalam kawasan HPT dan tidak terdapat skema Perhutanan Sosial yang disetujui. Data ATR/BPN tidak menunjukkan HGU; observasi lapangan tidak menemukan IUP. Kondisi lapangan menunjukkan kebun telah berkembang — akses jalan terbuka dan dapat dilalui kendaraan roda empat. Wawancara memperkirakan kebun mulai menghasilkan pada 2027.',
    images: ['/images/case3-field.jpg'],
    stats: [
      { value: '151 ha', label: 'Total hamparan Lokasi 3' },
      { value: '87%', label: 'Berada dalam zona deforestasi (131,51 ha)' },
      { value: '2027', label: 'Perkiraan mulai menghasilkan TBS' },
    ],
    footnotes: ['Tidak terdapat skema Perhutanan Sosial yang disetujui. Wawancara: penguasaan dikaitkan dengan pihak yang dikaitkan dengan oknum aparat dan oknum legislatif. — 0°Latitude Academy'],
    mapState: { center: [109.587, 1.626], zoom: 14.5, pitch: 40, bearing: 5 },
    polygons: [lokasi3Polygon],
  },

  // ══════════════════════════════════════════════════════
  // SECTION: RANTAI PASOK
  // ══════════════════════════════════════════════════════

  // 11. JEJAK YANG BELUM LENGKAP
  {
    id: 'jejak-belum-lengkap',
    section: 'consequence',
    eyebrow: 'JEJAK YANG BELUM LENGKAP',
    title: 'Kebun Belum Panen, Jalur Pasok Sudah Ada',
    text: 'Ketiga lokasi saat ini belum menghasilkan TBS, sehingga aliran buah dari kebun menuju mill belum dapat dibuktikan secara langsung. Namun, identifikasi mill di sekitar lokasi menunjukkan adanya beberapa tujuan potensial dalam radius 25–81 km. Penelusuran terhadap enam POD yang telah disurvei menunjukkan bahwa POD tersebut memasok TBS ke PT Wawasan Kebun Nusantara (WKN) dan PT Kalimantan Subur Sawit (KSS). Kondisi ini menunjukkan adanya jalur pasok di sekitar lokasi yang perlu diperhatikan ketika kebun mulai menghasilkan.',
    images: ['/images/pod-pais.jpg', '/images/pod-baida.jpg', '/images/pod-arpi.jpg'],
    stats: [
      { value: '9 Mill', label: 'PKS potensial dalam radius 25–81 km' },
      { value: '5 POD', label: 'Pengepul disurvei — dalam radius 3,1–7,5 km' },
      { value: 'WKN & KSS', label: 'Mill yang disebut dalam wawancara POD' },
    ],
    footnotes: ['Data mill: Tabel 2 laporan. Data POD: Tabel 3 laporan. Temuan dari wawancara lapangan dengan pemilik POD. — 0°Latitude Academy'],
    mapState: { center: [109.73, 1.47], zoom: 9, pitch: 0, bearing: 0 },
    polygons: [lokasi1Polygon, lokasi2Polygon, lokasi3Polygon],
    routes: true,
  },

  // 12. PERSPEKTIF RESPONSIBLE AND SUSTAINABLE SOURCING
  {
    id: 'perspektif-sourcing',
    section: 'consequence',
    eyebrow: 'SITUASI DI SAJINGAN BESAR DAN PERSPEKTIF RESPONSIBLE AND SUSTAINABLE SOURCING',
    title: 'Ketika Kebun Mulai Menghasilkan, Apakah Sistemnya Siap?',
    text: 'Penerapan responsible and sustainable sourcing mengharuskan perusahaan memastikan bahwa bahan baku kelapa sawit berasal dari sumber yang dapat ditelusuri dan diproduksi secara bertanggung jawab. Kelayakan pasokan tidak bisa hanya dinilai di tingkat pabrik, tetapi wajib ditelusuri hingga ke kebun melalui pelacakan rantai pasok (Traceability to Plantation/TTP). Dalam konteks Sajingan Besar, kondisi yang ditemukan — kawasan HPT, tanpa izin, pembukaan setelah 2020, dan penguasaan lahan yang belum jelas — meningkatkan risiko sumber pasokan. Ketika kebun mulai menghasilkan dan TBS mengalir melalui POD menuju mill, menelusuri asal-usul buah menjadi jauh lebih kompleks.',
    highlight: true,
    stats: [
      { value: 'TTP', label: 'Traceability to Plantation — kunci verifikasi asal buah' },
      { value: 'HPT + Tanpa Izin', label: 'Kondisi yang perlu dikonfirmasi oleh otoritas berwenang' },
      { value: '2027', label: 'Perkiraan panen Lokasi 3 — window verifikasi makin sempit' },
    ],
    mapState: { center: [109.73, 1.47], zoom: 9.5, pitch: 0, bearing: 0 },
    polygons: [lokasi1Polygon, lokasi2Polygon, lokasi3Polygon],
    routes: true,
  },

  // ══════════════════════════════════════════════════════
  // SECTION: KESIMPULAN
  // ══════════════════════════════════════════════════════

  // 13. KESIMPULAN
  {
    id: 'kesimpulan',
    section: 'penutup',
    eyebrow: 'KESIMPULAN',
    title: 'Pohon Belum Berbuah. Risiko Sudah Ada.',
    text: 'Dengan kondisi tersebut, ketiga lokasi perlu menjadi perhatian dalam pemantauan rantai pasok. Status kawasan, legalitas, penguasaan lahan, dan asal buah masih perlu diverifikasi sampai tingkat kebun. Selama informasi tersebut belum jelas, potensi masuknya TBS dari ketiga lokasi ke dalam rantai pasok perlu dicegah dan ditelusuri lebih lanjut.',
    highlight: true,
    stats: [
      { value: '3 Lokasi', label: 'Perlu pemantauan aktif dan verifikasi lanjut' },
      { value: '592 ha', label: 'Dalam HPT tanpa izin — gabungan tiga lokasi' },
      { value: 'TTP', label: 'Satu-satunya cara memastikan asal buah terverifikasi' },
    ],
    mapState: { center: [109.59, 1.63], zoom: 10, pitch: 10, bearing: 0 },
    polygons: [kecamatanBoundary, lokasi1Polygon, lokasi2Polygon, lokasi3Polygon],
  },
];

export default chapters;
