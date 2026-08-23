import { Component } from 'react';

// Error Boundary — WAJIB ada di aplikasi manapun yang menyentuh WebGL
// (peta). Tanpa ini, satu error kecil di mana pun (MapLibre gagal init
// karena WebGL tidak tersedia, tile gagal dimuat, dsb) akan bikin React
// unmount SELURUH aplikasi — hasilnya layar hitam total tanpa pesan
// apa pun, karena background gelap tetap ada padahal tidak ada satu pun
// komponen yang berhasil render.
//
// Dengan boundary ini, error ditangkap SEBELUM sempat merusak seluruh
// tree, dan pesan errornya ditampilkan supaya bisa didiagnosis — bukan
// cuma "layar hitam" tanpa petunjuk.
export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, info) {
    // Tetap log ke console supaya kelihatan di DevTools (F12 → Console)
    // walau UI fallback-nya sudah menampilkan pesan.
    console.error('ErrorBoundary menangkap error:', error, info);
  }

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.error) {
      return (
        <div className="error-boundary">
          <div className="error-boundary__box">
            <h2>Terjadi kesalahan</h2>
            <p>
              Ada bagian aplikasi yang gagal dimuat. Ini sering terjadi kalau
              browser/perangkat tidak mendukung WebGL (dibutuhkan untuk
              render peta), atau ada masalah jaringan saat memuat citra
              satelit.
            </p>
            <pre className="error-boundary__message">
              {String(this.state.error?.message || this.state.error)}
            </pre>
            <button onClick={this.handleReload}>Muat Ulang</button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
