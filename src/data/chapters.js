// src/data/chapters.js
//
// Isi narasi tab "Cerita" — 14 chapter, alur:
// Intro → Problem → Evidence → Consequence → Call to Action.
//
// Field lengkap & cara customize ada di DEVELOPMENT.md bagian
// "Customize chapters.js". Field wajib: id, section, align, title, text,
// mapState. Sisanya opsional.
//
// TODO: cari "TODO:" di file ini dan ganti dengan data asli.

import {
  kecamatanBoundary,
  lokasi1Polygon,
  lokasi2Polygon,
  lokasi3Polygon,
} from './polygons.js';

export const SECTION_LABELS = {
  intro: 'Pembuka',
  problem: 'Deforestasi & Ekspansi Sawit',
  evidence: 'Studi Kasus',
  consequence: 'Risiko Rantai Pasok',
  penutup: 'Rekomendasi',
};

const chapters = [
  {
    id: 'hero',
    section: 'intro',
    align: 'full',
    type: 'hero',
    title: 'Ketika Hutan Sajingan Besar Kehilangan Batasnya',
    text: 'Investigasi ekspansi kebun sawit di tiga lokasi, Kecamatan Sajingan Besar, Kabupaten Sambas.',
    mapState: { center: [109.05, 1.35], zoom: 9, pitch: 0, bearing: 0 },
    images: ['/images/hero-sajingan-besar.jpg'], // TODO
  },
  {
    id: 'lanskap-sajingan-besar',
    section: 'intro',
    align: 'right',
    title: 'Lanskap Sajingan Besar',
    text: 'Kecamatan Sajingan Besar adalah salah satu kawasan dengan tutupan hutan tersisa terluas di Kabupaten Sambas — sekaligus salah satu yang mengalami perubahan lanskap tercepat dalam satu dekade terakhir. [a]',
    mapState: { center: [109.05, 1.35], zoom: 10.5, pitch: 30, bearing: 0 },
    polygons: [kecamatanBoundary],
    stats: [
      { value: 'TODO ha', label: 'Luas Kecamatan' },
      { value: 'TODO%', label: 'Tutupan hutan 2015' },
    ],
    images: ['/images/lanskap-1.jpg'], // TODO
    footnotes: [{ id: 'a', text: 'TODO: sumber data tutupan hutan 2015.' }],
  },
  {
    id: 'hook-tiga-lokasi',
    section: 'intro',
    align: 'full',
    type: 'hook',
    title: 'Tiga Pembukaan, Satu Pola',
    text: 'Tiga hamparan kebun sawit dibuka di dalam kawasan hutan Sajingan Besar dalam lima tahun terakhir — dengan pola yang hampir identik.',
    mapState: { center: [109.05, 1.35], zoom: 11.5, pitch: 20, bearing: 0 },
    polygons: [lokasi1Polygon, lokasi2Polygon, lokasi3Polygon],
    stats: [
      { value: 'TODO ha', label: 'Total luas 3 lokasi' },
      { value: 'TODO', label: 'Rentang tahun dibuka' },
    ],
  },
  {
    id: 'forest-cover-2015-2026',
    section: 'problem',
    align: 'right',
    title: 'Forest Cover 2015 vs 2026: Deforestasi Berlanjut',
    text: 'Dalam sebelas tahun, Sajingan Besar kehilangan tutupan hutan dalam jumlah signifikan. [b]',
    mapState: { center: [109.05, 1.35], zoom: 10.5, pitch: 0, bearing: 0 },
    polygons: [kecamatanBoundary],
    chart: 'forest-trend',
    stats: [
      { value: 'TODO ha', label: 'Hutan 2015' },
      { value: 'TODO ha', label: 'Hutan 2026' },
      { value: 'TODO%', label: 'Net loss' },
    ],
    footnotes: [{ id: 'b', text: 'TODO: sumber & metodologi hitung deforestasi.' }],
  },
  {
    id: 'hutan-jadi-sawit',
    section: 'problem',
    align: 'left',
    title: 'Ke Mana Perginya Hutan? Menjadi Sawit',
    text: 'Mayoritas hutan yang hilang sejak 2015 kini menjadi kebun sawit tertanam — bukan penggunaan lahan lain.',
    mapState: { center: [109.05, 1.35], zoom: 10.5, pitch: 0, bearing: 0 },
    polygons: [kecamatanBoundary],
    chart: 'forest-share-donut',
    stats: [{ value: 'TODO%', label: 'Hutan hilang jadi sawit' }],
  },
  {
    id: 'ekspansi-sawit-sajingan',
    section: 'problem',
    align: 'right',
    title: 'Sawit di Sajingan Besar',
    text: 'Konteks industri: seberapa luas sawit tertanam saat ini, berapa mill dan dealer beroperasi di sekitar kecamatan, dan berapa besar porsi yang berada di dalam kawasan hutan.',
    mapState: { center: [109.05, 1.35], zoom: 10, pitch: 0, bearing: 0 },
    polygons: [kecamatanBoundary],
    stats: [
      { value: 'TODO ha', label: 'Total sawit teridentifikasi' },
      { value: 'TODO', label: 'Mills beroperasi' },
      { value: 'TODO%', label: 'Sawit dalam kawasan hutan' },
    ],
  },
  {
    id: 'bridging-pola-mencurigakan',
    section: 'evidence',
    align: 'full',
    title: 'Tiga Lokasi, Satu Pola Pembukaan',
    text: 'Ketiganya dibuka dalam lima tahun terakhir, dengan tutupan hutan yang hilang lalu ditanami sawit. Salah satunya dibuka dengan cara dibakar. [c]',
    mapState: { center: [109.05, 1.35], zoom: 12, pitch: 0, bearing: 0 },
    polygons: [lokasi1Polygon, lokasi2Polygon, lokasi3Polygon],
    stats: [
      { value: 'TODO', label: 'Lokasi 1 dibuka' },
      { value: 'TODO', label: 'Lokasi 2 dibuka' },
      { value: 'TODO', label: 'Lokasi 3 dibuka' },
    ],
    footnotes: [{ id: 'c', text: 'TODO: dasar kesimpulan "pola sama".' }],
  },
  {
    id: 'case-study-1',
    section: 'evidence',
    align: 'right',
    quickNav: true,
    title: 'Lokasi 1',
    text: 'TODO: narasi lengkap — luas, tahun dibuka, kondisi hutan sebelum vs sesudah, kondisi terkini, kepemilikan/operator, status traceability.',
    mapState: { center: [109.0625, 1.3415], zoom: 14, pitch: 30, bearing: 0 },
    polygons: [lokasi1Polygon],
    chart: 'case-area',
    stats: [
      { value: 'TODO ha', label: 'Luas' },
      { value: 'TODO', label: 'Tahun dibuka' },
      { value: 'TODO', label: 'Status traceability' },
    ],
    images: ['/images/lokasi1-aerial.jpg'], // TODO
  },
  {
    id: 'case-study-2',
    section: 'evidence',
    align: 'left',
    quickNav: true,
    title: 'Lokasi 2',
    text: 'TODO: narasi lengkap (struktur sama seperti Lokasi 1).',
    mapState: { center: [109.0375, 1.3285], zoom: 14, pitch: 30, bearing: 0 },
    polygons: [lokasi2Polygon],
    chart: 'case-area',
    stats: [
      { value: 'TODO ha', label: 'Luas' },
      { value: 'TODO', label: 'Tahun dibuka' },
      { value: 'TODO', label: 'Status traceability' },
    ],
    images: ['/images/lokasi2-aerial.jpg'], // TODO
  },
  {
    id: 'case-study-3',
    section: 'evidence',
    align: 'right',
    quickNav: true,
    title: 'Lokasi 3',
    text: 'TODO: narasi lengkap. Lokasi ini dibuka dengan cara dibakar — beri penekanan naratif & visual sesuai bukti yang tersedia.',
    mapState: { center: [109.0835, 1.3175], zoom: 14, pitch: 30, bearing: 0 },
    polygons: [lokasi3Polygon],
    chart: 'case-area',
    stats: [
      { value: 'TODO ha', label: 'Luas' },
      { value: 'TODO', label: 'Tahun dibuka' },
      { value: 'Dibakar', label: 'Metode pembukaan' },
    ],
    images: ['/images/lokasi3-aerial.jpg'], // TODO
  },
  {
    id: 'pre-harvest-alert',
    section: 'consequence',
    align: 'full',
    title: 'Belum Panen, Tapi Sudah Bisa Diprediksi',
    text: 'Ketiga kebun masih berstatus TBM. Berdasarkan jarak geografis, infrastruktur, dan pola rantai pasok di sekitar area, hasil panen berpotensi mengalir ke TODO (nama mill/dealer).',
    mapState: { center: [109.05, 1.35], zoom: 10, pitch: 0, bearing: 0 },
    polygons: [lokasi1Polygon, lokasi2Polygon, lokasi3Polygon],
    chart: 'mill-distance',
    stats: [
      { value: 'TODO ton', label: 'Estimasi hasil panen' },
      { value: 'TODO', label: 'Perkiraan waktu panen' },
    ],
  },
  {
    id: 'metodologi-prediksi',
    section: 'consequence',
    align: 'left',
    title: 'Bagaimana Prediksi Ini Dibuat',
    text: 'Prediksi memakai TODO (nama metode/model), mempertimbangkan jarak ke mill/dealer terdekat, infrastruktur jalan, dan pola historis rantai pasok kebun sejenis. Metodologi lengkap tersedia di dokumen lampiran.',
    mapState: { center: [109.05, 1.35], zoom: 9, pitch: 0, bearing: 0 },
  },
  {
    id: 'penutup',
    section: 'penutup',
    align: 'full',
    title: 'Saatnya Memantau, Bukan Menunggu',
    text: 'Tiga lokasi ini menunjukkan pola ekspansi yang perlu direspons sebelum panen tiba. Kami mengajak sustainability manager untuk memasukkan ketiga lokasi ke daftar pantau, dan publik untuk mendukung transparansi.',
    mapState: { center: [109.05, 1.35], zoom: 10, pitch: 0, bearing: 0 },
    polygons: [lokasi1Polygon, lokasi2Polygon, lokasi3Polygon],
  },
  {
    id: 'dokumen-pendukung',
    section: 'penutup',
    align: 'full',
    type: 'downloads',
    title: 'Dokumen & Sumber Data',
    text: 'Unduh laporan lengkap, metodologi teknis, dan dataset pendukung.',
    mapState: { center: [109.05, 1.35], zoom: 9, pitch: 0, bearing: 0 },
  },
];

export default chapters;
