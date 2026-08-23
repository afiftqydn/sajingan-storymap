import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './App.css';

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
