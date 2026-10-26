// CSS lebih dulu: theme.js membaca token warna saat modul lain dievaluasi.
import '@fontsource-variable/geist/wght.css';
import '@fontsource-variable/geist-mono/wght.css';
import '@fontsource-variable/space-grotesk/wght.css';
import '@fontsource/ibm-plex-mono/400.css';
import '@fontsource/ibm-plex-mono/500.css';
import '@fontsource/ibm-plex-mono/600.css';
import '@fontsource/michroma/400.css';
import './styles/tokens.css';
import './styles/base.css';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
// Setelah App: maplibre-gl.css (diimpor komponen peta) harus kalah dari aturan kita.
import './App.css';
import chapters, { SECTION_LABELS } from './data/chapters.js';
import { validateChapters, logValidationErrors } from './utils/validateChapters.js';

// Validator ini sudah ditulis dari awal tapi sebelumnya tidak pernah
// dipanggil di mana pun — jadi typo/salah bentuk data di chapters.js
// (mis. field yang salah tipe) tidak pernah ketahuan otomatis, cuma
// gagal diam-diam saat render. Sekarang dijalankan sekali di startup,
// cuma nge-log ke console (tidak menghentikan render) supaya kelihatan
// pas development tanpa mengubah perilaku untuk pengguna akhir.
logValidationErrors(validateChapters(chapters, SECTION_LABELS));

// CATATAN: sengaja TIDAK dibungkus <React.StrictMode>.
//
// StrictMode di React 18 sengaja menjalankan tiap useEffect DUA KALI
// saat development (mount → cleanup → mount lagi) untuk mendeteksi efek
// yang cleanup-nya tidak bersih. MapLibre GL (dan Mapbox GL, library
// sejenisnya) pakai WebGL context yang TIDAK SELALU aman kalau di-destroy
// (`map.remove()`) lalu langsung dibuat ulang secepat itu — hasilnya
// kanvas render hitam. Ini kejadian di SETIAP reload browser saat dev,
// karena tiap reload = mount baru = siklus ganda StrictMode jalan lagi.
//
// Ini bug yang sudah dikenal luas di komunitas React + MapLibre/Mapbox,
// bukan cuma di project ini. Kalau nanti mau StrictMode lagi (untuk
// deteksi bug lain), pertimbangkan cuma bungkus komponen yang TIDAK
// menyentuh peta, bukan seluruh <App />.
ReactDOM.createRoot(document.getElementById('root')).render(<App />);
