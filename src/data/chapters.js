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
    text: 'Tiap tahun hutan yang menjadi sumber air bagi lima desa di Sajingan Besar menyusut sedikit lagi — dari 37.691,62 ha pada 2015 menjadi 33.969,81 ha pada 2025, 3.721,81 ha lenyap dalam satu dekade. Di sebagian lahan yang ditinggalkannya, 30.104,43 ha kebun sawit kini berdiri, dan 6.702,06 ha (22,3%) di antaranya tumbuh di dalam kawasan hutan negara, bukan di tanah yang sah untuk perkebunan. Tiga hamparan di Desa Sanatab dan Kaliau\' jadi pusat perhatian laporan ini: ketiganya berdiri di kawasan Hutan Produksi Terbatas (HPT), dan tidak satu pun mengantongi HGU atau IUP. Panen dari kebun-kebun ini memang belum ada, tapi jalur jualnya sudah terbentuk lebih dulu: lima POD di sekitar lokasi rutin memasok TBS ke PT Wawasan Kebun Nusantara (WKN) dan PT Kalimantan Subur Sawit (KSS). Selama status kawasan dan penguasaan lahan tiga lokasi ini dibiarkan menggantung, hasil panennya kelak bisa masuk ke rantai pasok tanpa jejak sama sekali.',
    stats: [
      { value: '3.721 ha', label: 'Kehilangan tutupan hutan 2015–2025' },
      { value: '22,3%', label: 'Sawit dalam kawasan hutan' },
    ],
    images: ['/images/landscape-aerial.JPG'],
    mapState: { center: [109.59, 1.63], zoom: 10, pitch: 0, bearing: 0 },
    polygons: [kecamatanBoundary],
  },

  // 3. PENDAHULUAN
  {
    id: 'pendahuluan',
    section: 'intro',
    eyebrow: 'PENDAHULUAN',
    title: 'Sajingan Besar',
    text: 'Sajingan Besar terletak di ujung utara Kabupaten Sambas, berbatasan darat langsung dengan Sarawak, Malaysia. Kecamatan seluas 139.120 ha ini adalah kawasan hulu: airnya mengalir turun ke Sambas, membelah lima desa yang hidupnya bergantung pada aliran itu. Empat fungsi kawasan hutan menaunginya — Hutan Lindung (HL), Hutan Produksi (HP), Hutan Produksi Terbatas (HPT), dan Taman Wisata Alam (TWA/HW).[a] Di balik tutupan hutannya, Rafflesia tuan-mudae masih tumbuh, kura-kura duri (Heosemys spinosa) masih berkeliaran, dan puluhan spesies amfibi masih menggantungkan hidup di sana — semuanya berbagi ruang yang sama dengan lima desa di hilirnya.',
    images: ['/images/landscape-forest.JPG', '/images/landscape-aerial.JPG'],
    stats: [
      { value: '139.120 ha', label: 'Luas kecamatan' },
      { value: '5 Desa', label: 'Sei Bening · Sanatab · Santaban · Kaliau\' · Sebunga\'' },
      { value: '4 Fungsi Kawasan Hutan', label: 'HL · HP · HPT · TWA/HW' },
    ],
    footnotes: [
      { id: 'a', text: 'Kawasan hutan mengacu pada SK.6630/MENLHK-PKTL/KUH/PLA.2/10/2021.' },
    ],
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
    text: 'Butuh sepuluh tahun untuk kehilangan 3.721,81 ha hutan di Sajingan Besar — dari 37.691,62 ha pada 2015 menjadi 33.969,81 ha pada 2025. Hutan yang tumbuh selama puluhan tahun bisa habis dalam hitungan musim tebang: deforestasi melonjak 122,4% hanya dalam setahun, dari 428,02 ha (2022) menjadi 951,97 ha (2023), titik tertinggi dalam catatan ini. Angkanya sempat turun ke 740,13 ha (2024) dan 458,30 ha (2025), tapi penurunan itu bukan tanda hutan berhenti hilang, hanya melambat. Sembilan dari sepuluh hektare yang lenyap adalah hutan biasa; sisanya, 8%, adalah hutan gambut — ekosistem yang kalau rusak, butuh waktu jauh lebih lama untuk pulih daripada waktu yang dipakai untuk merusaknya.[b]',
    chart: 'deforestation-trend',
    stats: [
      { value: '37.691 ha', label: 'Tutupan hutan 2015' },
      { value: '33.969 ha', label: 'Tutupan hutan 2025' },
      { value: '951 ha', label: 'Puncak deforestasi 2023 (+122% dari 2022)' },
    ],
    footnotes: [
      { id: 'b', text: 'Dari total 304,76 ha deforestasi pada Peat Forest, sekitar 140,48 ha atau 46,1% telah menjadi kebun kelapa sawit. — Sumber: 0°Latitude Academy' },
    ],
    mapState: { center: [109.59, 1.63], zoom: 10.5, pitch: 20, bearing: 5 },
    overlays: ['storymap-forest'],
    polygons: [kecamatanBoundary],
  },

  // 5. PERKEBUNAN KELAPA SAWIT DI SAJINGAN BESAR
  {
    id: 'perkebunan-sawit',
    section: 'problem',
    eyebrow: 'PERKEBUNAN KELAPA SAWIT DI SAJINGAN BESAR',
    title: '22,3% Kebun Sawit Berada dalam Kawasan Hutan',
    text: '6.702,06 ha, atau 22,3% dari 30.104,43 ha kebun sawit di Sajingan Besar, tumbuh di dalam kawasan hutan negara — bukan di tanah yang sah diperuntukkan bagi kebun. Di Desa Sanatab dan Kaliau\', angkanya jauh lebih parah: 66,5% dan 62,6% kebun sawit di dua desa ini berada dalam kawasan hutan.[c] Angka itu ikut membebani petani kecil yang kebunnya sah sekalipun — mereka tercatat dalam statistik yang sama dengan pembukaan berskala jauh lebih besar. Sebab di antara sebaran kebun-kebun kecil warga, tiga hamparan tampak beda sendiri: luasnya jauh lebih besar, pola bukaannya rapi dan seragam, ciri yang jarang ditemukan pada kebun swadaya petani.',
    chart: 'village-comparison',
    stats: [
      { value: '30.104 ha', label: 'Total kebun sawit di Sajingan Besar (21,65% dari luas kecamatan)' },
      { value: '6.702 ha', label: 'Sawit dalam kawasan hutan (22,3%)' },
      { value: '66,5%', label: 'Tertinggi di Desa Sanatab' },
    ],
    footnotes: [
      { id: 'c', text: 'Sanatab: 1.284,79 ha dari 1.931,78 ha. Kaliau\': 3.241,07 ha dari 5.175,65 ha. Desa Sebunga\' memiliki luas kebun terbesar (16.907,82 ha) dengan pola bukaan terindikasi dari perusahaan (PT. Wana Hijau Semesta). — 0°Latitude Academy' },
    ],
    mapState: { center: [109.600, 1.647], zoom: 10.5, pitch: 25, bearing: 0 },
    overlays: ['storymap-planted', 'storymap-kawasan'],
    polygons: [],
  },

  // 6. TEMUAN UTAMA
  {
    id: 'temuan-utama',
    section: 'problem',
    eyebrow: 'TEMUAN UTAMA',
    title: 'Tiga Hamparan, Satu Pertanyaan Besar',
    text: '627,58 ha lahan dibuka di Desa Sanatab dan Kaliau\' antara 2022 dan 2025 — bukan oleh tangan-tangan kecil satu per satu, tapi lewat pola yang konsisten: rapi, luas, dan menurut penelusuran lapangan dikelola lewat skema ISH/Outgrower. Ketiganya berdiri di kawasan Hutan Produksi Terbatas (HPT), tanpa satu pun HGU atau IUP, dan penguasaan lahannya terkonsentrasi di tangan segelintir aktor. Sajingan Besar adalah hulu bagi empat sungai yang airnya dipakai lima desa di hilir, dan Lokasi 1 dibuka hanya 441,88 meter dari salah satu alurnya. Apa yang terjadi di hulu, cepat atau lambat, akan sampai ke hilir juga.',
    images: ['/images/case-overview-3.JPG'],
    mediaLayout: 'wide',
    stats: [
      { value: '628 ha', label: 'Pembukaan teridentifikasi 2022–2025' },
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
    text: 'Tiga lokasi, satu pola yang sama: ketiganya berdiri di kawasan Hutan Produksi Terbatas (HPT). Bhumi ATR/BPN tidak mencatat HGU atas nama siapa pun di sana, dan observasi lapangan tidak menemukan IUP. Lokasi 1 dan 2 mulai dibuka pada 2023; Lokasi 3 lebih dulu, sejak 2022, dan terus meluas sampai pembaruan citra 2025. Skala pembukaannya, ditambah keterangan warga yang ditemui langsung di lapangan, mengarah pada dugaan kuat keterlibatan investor bermodal besar — jauh dari gambaran petani perorangan yang membuka lahan sendiri sedikit demi sedikit.',
    stats: [
      { value: 'HPT', label: 'Status kawasan — semua lokasi' },
      { value: '2022–2025', label: 'Rentang waktu pembukaan hingga saat ini' },
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
    title: 'Dibakar, Ditanami, dan Masih Meluas',
    text: 'Lokasi 1 berada di 1.65804°LU, 109.57527°BT: hamparan 307,08 ha yang mulai dibuka pada 2023 dan ditanami sawit setahun kemudian. Bukan pembukaan bertahap seperti kebun rakyat pada umumnya — hamparan seluas ini digarap sekaligus, mengikuti kontur lereng bukit, dengan skala yang jauh melampaui kebun-kebun di sekitarnya.[d] Pada Agustus 2025, citra satelit menangkap jejak pembakaran lahan di titik ini; verifikasi lapangan kemudian menemukan sawit sudah tertanam tepat di atas bekas bakaran tersebut. Pembukaan masih berlangsung hingga November 2025, di lahan yang berjarak kurang dari setengah kilometer dari alur sungai. Website resmi Bhumi ATR/BPN tidak mencatat SHM maupun HGU di lokasi ini, dan observasi lapangan juga tidak menemukan IUP. Sejumlah warga menyebut nama seorang investor asal Pemangkat sebagai pihak yang mengendalikan lahan ini, namun klaim tersebut belum bisa kami verifikasi lewat dokumen resmi.',
    images: ['/images/case1-burned.JPG', '/images/lokasi1-tbm.JPG'],
    stats: [
      { value: '307 ha', label: 'Total hamparan Lokasi 1' },
      { value: '23,3%', label: 'Berada dalam zona deforestasi (71,58 ha)' },
      { value: 'TBM 2024', label: 'Mulai ditanam — ekspansi masih aktif' },
    ],
    footnotes: [
      { id: 'd', text: '441,88 m: jarak area pembukaan ke alur sungai. Pola bukaan skala besar dan seragam ini lebih umum ditemukan pada praktik pembukaan lahan yang didanai investor (kerap disebut "cukong" di lapangan) dibanding kebun swadaya petani. — 0°Latitude Academy' },
    ],
    mapState: { center: [109.577, 1.658], zoom: 14.5, pitch: 45, bearing: 10 },
    polygons: [lokasi1Polygon],
  },

  // 9. KASUS 2
  {
    id: 'kasus-2',
    section: 'evidence',
    eyebrow: 'Lokasi 2',
    title: 'Seluruh Hamparan di Kawasan HPT, Kecuali 4,5%',
    text: 'Lokasi 2 berada di 1.64645°LU, 109.59320°BT: hamparan 140,72 ha yang dibuka pada 2023. Sekitar 15,13 ha (11,3%) dari luasnya menempati area yang pernah terpantau sebagai deforestasi aktif. Di sinilah persoalannya jadi rumit: ada tiga bidang SHM yang sah, milik petani kecil yang benar-benar menggarap tanahnya sendiri, tapi luasnya cuma 4,5% dari total hamparan dan posisinya di luar kawasan HPT.[e] Sisa 95,5% — nyaris seluruh hamparan — berada penuh di kawasan HPT, tanpa HGU maupun IUP. Petani pemilik SHM itu kini berbagi hamparan yang sama dengan pembukaan berskala jauh lebih besar yang bukan milik mereka. Nama seorang investor asal Tebas terus muncul tiap kali kami bertanya siapa sebenarnya di balik sisa lahan itu — tapi sejauh ini cuma beredar dari mulut ke mulut, tidak tercatat di satu pun dokumen resmi yang kami periksa.',
    images: ['/images/lokasi2-tbm.JPG'],
    stats: [
      { value: '141 ha', label: 'Total hamparan Lokasi 2' },
      { value: '4,5%', label: 'Porsi SHM di luar HPT (kebun petani kecil)' },
      { value: '95,5%', label: 'Sisa hamparan, penuh dalam kawasan HPT' },
    ],
    footnotes: [
      { id: 'e', text: '3 bidang SHM dikecualikan dari fokus pemeriksaan karena berada di luar HPT. Kondisi ini membuat 31,29% area dikecualikan dari fokus pemeriksaan kebun dalam kawasan. — 0°Latitude Academy' },
    ],
    mapState: { center: [109.593, 1.646], zoom: 14.5, pitch: 40, bearing: -5 },
    polygons: [lokasi2Polygon],
  },

  // 10. KASUS 3
  {
    id: 'kasus-3',
    section: 'evidence',
    eyebrow: 'Lokasi 3',
    title: 'Yang Paling Berkembang — dan Paling Mendesak Diverifikasi',
    text: 'Lokasi 3 berada di 1.62635°LU, 109.58668°BT. Hamparan ini sudah ditanami sawit sejak 2022, paling awal dari ketiganya, dan belum berhenti meluas: pembaruan citra 2025 mencatat luasnya kini mencapai 179,78 ha, naik dari perkiraan sebelumnya. Sekitar 128,7 ha (71,6%) dari luas itu menempati bekas area deforestasi — porsi tertinggi di antara tiga lokasi. Berdasarkan SK kawasan, seluruh hamparan berada dalam HPT, dan tidak ada skema Perhutanan Sosial yang pernah disetujui di sini.[f] Bhumi ATR/BPN tidak mencatat HGU, dan IUP juga tidak ditemukan. Dari tiga lokasi, inilah yang paling siap dipanen: jalannya sudah terbuka dan bisa dilewati mobil, dan warga memperkirakan kebun ini mulai menghasilkan pada 2027 — sisa waktu yang kian pendek untuk menuntaskan verifikasi sebelum buah pertama dipetik.',
    images: ['/images/case-overview-3.JPG'],
    stats: [
      { value: '180 ha', label: 'Total hamparan Lokasi 3 (terus meluas sejak 2022)' },
      { value: '71,6%', label: 'Berada dalam zona deforestasi (128,7 ha)' },
      { value: '2027', label: 'Perkiraan mulai menghasilkan TBS' },
    ],
    footnotes: [
      { id: 'f', text: 'Tidak terdapat skema Perhutanan Sosial yang disetujui. Berdasarkan keterangan warga saat wawancara lapangan — belum diverifikasi lewat dokumen atau proses hukum resmi — penguasaan lahan diduga terkait dengan oknum yang berasal dari kalangan aparat dan legislatif setempat. — 0°Latitude Academy' },
    ],
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
    text: 'Ketiganya dikelola lewat pola ISH/Outgrower, bukan swadaya petani, menurut keterangan warga yang diwawancarai langsung di lapangan. Bhumi ATR/BPN nihil: tidak ada konsesi, SHM, HGU, atau IUP atas nama siapa pun di tiga lokasi ini, dan status kawasannya HPT sepenuhnya. Kebunnya belum menghasilkan TBS, sehingga arah aliran buahnya belum bisa dibuktikan langsung — tapi jalurnya sudah menunggu. Lima POD di sekitar lokasi ini, dikelola orang-orang yang kami temui dan wawancarai satu per satu, rutin memasok TBS ke PT Wawasan Kebun Nusantara (WKN) dan PT Kalimantan Subur Sawit (KSS).[g] Standar NDPE (No Deforestation, No Peat, No Exploitation) mensyaratkan rantai pasok yang bersih dari titik-titik seperti ini. Begitu kebun mulai berbuah, jalur yang sudah siap inilah yang paling mungkin dilalui — kecuali ada yang bertindak lebih dulu.',
    images: ['/images/pod-pais.JPG', '/images/pod-baida.JPG', '/images/pod-arpi.JPG'],
    stats: [
      { value: 'Outgrower', label: 'Pola pengelolaan terindikasi — bukan kebun swadaya petani' },
      { value: '5 POD', label: 'Pengepul disurvei — ada dalam radius 3,1–7,5 km' },
    ],
    footnotes: [
      { id: 'g', text: 'Data mill: Tabel 2 laporan. Data POD: Tabel 3 laporan. Temuan dari wawancara lapangan dengan pemilik POD. — 0°Latitude Academy' },
    ],
    mapState: { center: [109.73, 1.47], zoom: 9.5, pitch: 0, bearing: 0 },
    polygons: [],
    routes: true,
  },

  // 12. PERSPEKTIF RESPONSIBLE AND SUSTAINABLE SOURCING
  {
    id: 'perspektif-sourcing',
    section: 'consequence',
    eyebrow: 'SITUASI DI SAJINGAN BESAR DAN PERSPEKTIF RESPONSIBLE AND SUSTAINABLE SOURCING',
    title: 'Ketika Kebun Mulai Menghasilkan, Apakah Sistemnya Siap?',
    text: 'Responsible sourcing tidak berhenti di gerbang pabrik. Perusahaan yang serius menerapkannya wajib menelusuri sampai ke titik kebun — Traceability to Plantation (TTP), bukan sekadar traceability to mill. Di Sajingan Besar, semua syarat masalah sudah lengkap: kawasan HPT, nihil izin, pembukaan setelah 2020, dan penguasaan lahan yang masih gelap. Begitu TBS dari tiga lokasi ini mulai mengalir lewat POD menuju mill, menelusuri asal-usulnya akan jauh lebih sulit dibanding memverifikasinya sekarang, sebelum tercampur dengan pasokan lain. Jendelanya masih terbuka — tapi tidak akan terbuka selamanya.',
    highlight: true,
    stats: [
      { value: 'TTP', label: 'Traceability to Plantation — kunci verifikasi asal buah' },
      { value: '2027', label: 'Perkiraan panen Lokasi 3 — window verifikasi makin sempit' },
    ],
    mapState: { center: [109.73, 1.47], zoom: 9.5, pitch: 0, bearing: 0 },
    polygons: [],
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
    title: 'Jendela Verifikasi Sebelum Panen Pertama',
    text: 'Pohonnya memang belum berbuah, tapi risikonya sudah berjalan. Ketiga lokasi ini butuh pemantauan aktif mulai sekarang, bukan menunggu musim panen tiba. Status kawasan, legalitas, penguasaan lahan, dan jalur pasokannya harus selesai diverifikasi sampai tingkat kebun sebelum panen pertama datang. Sampai proses itu tuntas, TBS dari 627,58 ha kebun tanpa izin ini tidak boleh masuk ke rantai pasok tanpa jejak yang jelas — bagi hutan yang sudah ditebang, bagi sungai yang jadi sumber hidup lima desa di hilirnya, dan bagi kepastian hukum yang masih ditunggu banyak pihak di Sajingan Besar.',
    highlight: true,
    stats: [
      { value: '3 Lokasi', label: 'Perlu pemantauan aktif dan verifikasi lanjut' },
      { value: '628 ha', label: 'Dalam HPT tanpa izin — gabungan tiga lokasi' },
      { value: 'TTP', label: 'Satu-satunya cara memastikan asal buah terverifikasi' },
    ],
    mapState: { center: [109.585, 1.644], zoom: 13, pitch: 40, bearing: -10 },
    polygons: [lokasi1Polygon, lokasi2Polygon, lokasi3Polygon],
  },
];

export default chapters;
