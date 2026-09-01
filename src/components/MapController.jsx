import { useEffect, useMemo, useRef, useState } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { mapStyle } from '../mapStyle.js';
import MapOverlayStack from './MapOverlayStack.jsx';
import RouteAnimationLayer from './RouteAnimationLayer.jsx';
import { loadMapIcons, iconImageId } from '../utils/mapIcons.js';
import { routePoints } from '../data/routes.js';

// Card popup mengambang di ATAS peta full-bleed (bukan lagi kolom
// terpisah) — di SEMUA ukuran layar sekarang, bukan cuma tablet. Kalau
// map di-center persis di tengah viewport, area yang paling penting
// (polygon highlight) gampang ketutup popup. Fix: pakai `padding`
// bawaan MapLibre di easeTo, yang menggeser PUSAT VISUAL peta menjauhi
// area kiri (area popup), jadi polygon-nya "otomatis" render di ruang
// yang masih kelihatan.
//
// PENTING soal kapan ini relevan:
// - Layar lebar (>PHONE_MAX): popup cuma ~460-560px, sisanya ruang
//   kosong — padding membantu, dihitung proporsional ke lebar layar.
// - Ponsel (≤PHONE_MAX): popup full-width (100%, lihat App.css) — TIDAK
//   ADA ruang kosong sama sekali untuk digeser ke sana, jadi padding di
//   lebar ini justru tidak masuk akal (skip).
// Semua chapter sekarang selalu popup di KIRI (tidak ada lagi varian
// center) — jadi padding ini berlaku seragam untuk semua chapter.
const PHONE_MAX = 640;
const POPUP_WIDTH = 480;

// Foto representatif per Lokasi — dipakai popup waktu polygon-nya
// diklik (lihat map.on('click', 'case-highlight-fill', ...) di bawah).
// Sama dengan foto yang dipakai di masing-masing chapter kasus, supaya
// konsisten dengan apa yang sudah dibaca pengunjung di narasi.
const LOKASI_PHOTO = {
  'Lokasi 1': '/images/lokasi1-tbm.JPG',
  'Lokasi 2': '/images/lokasi2-tbm.JPG',
  'Lokasi 3': '/images/case3-field.JPG',
};

export default function MapController({ activeChapter, isOnCover }) {
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const [mapInstance, setMapInstance] = useState(null);
  const [bearing, setBearing] = useState(0);
  const [mapError, setMapError] = useState(null);
  // Diisi setelah fetch batas-desa.geojson selesai — dipakai untuk
  // menggantikan kecamatanBoundary (kotak placeholder di polygons.js)
  // dengan shape 5 desa asli begitu tersedia. Tetap null (fallback ke
  // placeholder) kalau fetch gagal, supaya peta tidak pernah blank.
  const [realBoundaryFeatures, setRealBoundaryFeatures] = useState(null);
  // Sama seperti di atas, tapi untuk shape 3 Lokasi Kasus asli (hasil
  // digitasi QGIS, lihat public/geojson/lokasi-fokus.geojson) —
  // menggantikan kotak placeholder lokasi1/2/3Polygon di polygons.js.
  const [realLokasiFeatures, setRealLokasiFeatures] = useState(null);
  const popupRef = useRef(null);
  // Flag: apakah layer route-endpoints-icon sudah ditambahkan (async loadMapIcons selesai).
  // Kalau chapter routes:true aktif SEBELUM icon selesai load, toggle visibility perlu diretry
  // begitu icon siap — tanpa ini icon mills/PoD tidak pernah nongol di chapter pertama.
  const iconsReadyRef = useRef(false);

  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapRef.current) return; // jaga-jaga: cegah map dibuat dobel kalau efek ini somehow terpanggil dua kali

    let map;
    try {
      map = new maplibregl.Map({
        container: mapContainerRef.current,
        style: mapStyle,
        center: activeChapter?.mapState?.center ?? [109.05, 1.35],
        zoom: activeChapter?.mapState?.zoom ?? 9,
        pitch: activeChapter?.mapState?.pitch ?? 0,
        bearing: activeChapter?.mapState?.bearing ?? 0,
        interactive: false,
        // Attribution default MapLibre juga nempel di pojok tertentu —
        // matikan, kita render sumber citra sendiri di MapOverlayStack.
        attributionControl: false,
      });
    } catch (err) {
      // Penyebab paling umum: browser/perangkat tidak mendukung WebGL,
      // atau WebGL diblokir (driver GPU, kebijakan enterprise, dsb).
      // Tanpa try/catch ini, error di sini akan menjalar dan bisa
      // membuat SELURUH aplikasi gagal render (lihat ErrorBoundary.jsx
      // untuk lapisan pengaman kedua).
      console.error('Gagal inisialisasi peta:', err);
      setMapError(err);
      return;
    }

    // Error async (tile gagal dimuat, dsb) tidak throw — MapLibre kirim
    // lewat event ini. Log saja, jangan crash render karena ini.
    map.on('error', (e) => {
      console.error('MapLibre error event:', e?.error || e);
    });

    map.on('rotate', () => setBearing(map.getBearing()));

    // Popup foto waktu polygon Lokasi Kasus diklik — BARU, sebelumnya
    // tab Storymap sama sekali tidak interaktif terhadap polygon-nya
    // sendiri (cuma bisa dilihat, tidak ada cara tahu itu polygon apa
    // tanpa balik ke teks narasi). `interactive: false` di konstruktor
    // Map di atas cuma menonaktifkan pan/zoom/drag gesture bawaan — event
    // klik tetap jalan normal, jadi aman ditambahkan di sini tanpa
    // merusak kontrol kamera scroll-driven yang sudah ada.
    popupRef.current = new maplibregl.Popup({ closeButton: true, closeOnClick: true, maxWidth: '260px' });

    // Attribution WAJIB ada (syarat lisensi Esri) — taruh di bottom-left,
    // terpisah dari MapOverlayStack di kanan supaya tidak ikut ramai di
    // satu kolom yang urutannya sudah ditentukan (utara→skala→legend→sumber).
    // Attribution native MapLibre DIHAPUS (bukan diabaikan begitu saja) —
    // syarat lisensi Esri World Imagery tetap harus dipenuhi, tapi
    // sekarang lewat badge sumber citra KITA SENDIRI (lihat
    // MapOverlayStack.jsx), yang teksnya sudah diperbarui memuat daftar
    // provider lengkap ("Esri, Maxar, Earthstar Geographics"), bukan
    // cuma "Esri World Imagery" saja. Jangan hapus provider dari badge
    // itu — itu bagian yang secara hukum wajib ada.

    map.on('load', () => {
      map.addSource('admin-boundary', {
        type: 'geojson',
        data: { type: 'FeatureCollection', features: [] },
      });
      map.addSource('case-highlight', {
        type: 'geojson',
        data: { type: 'FeatureCollection', features: [] },
      });
      // Titik Mill & PoD — BARU. Sebelumnya tab Storymap tidak punya
      // layer ini SAMA SEKALI (cuma RouteAnimationLayer yang gambar
      // garis+titik alert kasus, TIDAK gambar endpoint mill/PoD-nya).
      // Komentar lama di RouteAnimationLayer.jsx bilang "itu tugas layer
      // Mills Terdekat/PoD Terdekat di LAYER_CATALOG" — tapi layer itu
      // cuma ada di DashboardMap.jsx (Peta Interaktif), TIDAK PERNAH
      // disambungkan ke MapController.jsx (Storymap). Akibatnya chapter
      // "Jejak yang Belum Lengkap" & "Perspektif Sourcing" yang bicara
      // spesifik soal WKN/KSS/5 PoD, tidak pernah menampilkan ikonnya
      // sama sekali — cuma garis & titik alert generik.
      map.addSource('route-endpoints', {
        type: 'geojson',
        data: { type: 'FeatureCollection', features: [] },
      });

      map.addLayer({
        id: 'admin-boundary-line',
        type: 'line',
        source: 'admin-boundary',
        paint: { 'line-color': '#f2f0e8', 'line-width': 1.5, 'line-dasharray': [2, 2] },
      });
      // Label nama desa (field NAMOBJ, lihat batas-desa.geojson) —
      // default-visible, konsisten dengan label lain di tab Peta
      // Interaktif. Sebelumnya batas desa tidak punya label sama sekali
      // di tab Storymap, jadi 5 desa yang digambar tidak jelas mana-mana.
      map.addLayer({
        id: 'admin-boundary-label',
        type: 'symbol',
        source: 'admin-boundary',
        layout: {
          'text-field': ['get', 'NAMOBJ'],
          'text-font': ['Open Sans Regular'],
          'text-size': 11,
          'symbol-placement': 'point',
        },
        paint: { 'text-color': '#f2f0e8', 'text-halo-color': '#0a0f0c', 'text-halo-width': 1.2 },
      });
      // WARNA: disamakan jadi #ff5a3c (oranye-merah) — sebelumnya hijau
      // (#7ed957) di sini, padahal Peta Interaktif & RouteAnimationLayer
      // (ring alert kasus) sudah pakai #ff5a3c untuk polygon/titik yang
      // SAMA (Lokasi 1/2/3). Sekarang satu warna dipakai konsisten di
      // semua tempat untuk "Lokasi Kasus", bukan beda-beda tergantung
      // tab/komponen mana yang menggambarnya.
      map.addLayer({
        id: 'case-highlight-fill',
        type: 'fill',
        source: 'case-highlight',
        paint: { 'fill-color': '#ff5a3c', 'fill-opacity': 0.28 },
      });
      map.addLayer({
        id: 'case-highlight-line',
        type: 'line',
        source: 'case-highlight',
        paint: { 'line-color': '#ff5a3c', 'line-width': 2 },
      });
      // Label nama lokasi ('Lokasi 1'/'2'/'3') default-visible di atas
      // area highlight — konsisten dengan tab Peta Interaktif.
      map.addLayer({
        id: 'case-highlight-label',
        type: 'symbol',
        source: 'case-highlight',
        layout: {
          'text-field': ['get', 'name'],
          'text-font': ['Open Sans Regular'],
          'text-size': 12,
          'symbol-placement': 'point',
        },
        paint: { 'text-color': '#f4f1e8', 'text-halo-color': '#0a0f0c', 'text-halo-width': 1.4 },
      });

      // Klik polygon Lokasi Kasus -> popup foto + info singkat. Cursor
      // pointer ditambahkan juga supaya kelihatan area ini bisa diklik
      // (sebelumnya tidak ada indikasi visual apa pun kalau polygon bisa
      // berinteraksi).
      map.on('mouseenter', 'case-highlight-fill', () => { map.getCanvas().style.cursor = 'pointer'; });
      map.on('mouseleave', 'case-highlight-fill', () => { map.getCanvas().style.cursor = ''; });

      // --- Overlay tematik (forest-cover, planted palm oil, kawasan hutan) ---
      // Masing-masing di-fetch sekali dari GeoJSON, lalu visibility-nya
      // di-toggle per chapter lewat field `overlays` di chapters.js.
      const KAWASAN_COLOR = [
        'match', ['get', 'keterangan'],
        'Hutan Lindung', '#02ad00',
        'Hutan Produksi Tetap', '#ffff00',
        'Hutan Produksi Terbatas', '#8af200',
        'Hutan Produksi Konversi', '#ff5eff',
        'Taman Wisata Alam/Hutan Wisata', '#ad3fff',
        '#5c8a6f',
      ];

      const OVERLAYS = [
        { id: 'storymap-forest', path: '/geojson/forest-cover.geojson', color: '#02ad00', opacity: 0.3 },
        { id: 'storymap-planted', path: '/geojson/planted-palm-oil.geojson', color: '#f5a623', opacity: 0.3 },
        { id: 'storymap-kawasan', path: '/geojson/kawasan-hutan.geojson', color: KAWASAN_COLOR, opacity: 0.3, lineColor: KAWASAN_COLOR, hasLabel: true },
      ];
      OVERLAYS.forEach((ov) => {
        map.addSource(ov.id, { type: 'geojson', data: { type: 'FeatureCollection', features: [] } });
        map.addLayer({
          id: `${ov.id}-fill`, type: 'fill', source: ov.id,
          layout: { visibility: 'none' },
          paint: { 'fill-color': ov.color, 'fill-opacity': ov.opacity },
        });
        map.addLayer({
          id: `${ov.id}-line`, type: 'line', source: ov.id,
          layout: { visibility: 'none' },
          paint: { 'line-color': ov.lineColor ?? ov.color, 'line-width': 1 },
        });
        if (ov.hasLabel) {
          map.addLayer({
            id: `${ov.id}-label`, type: 'symbol', source: ov.id,
            layout: {
              visibility: 'none',
              'text-field': ['get', 'keterangan'],
              'text-font': ['Open Sans Regular'],
              'text-size': 10,
              'symbol-placement': 'point',
              'text-allow-overlap': false,
            },
            paint: { 'text-color': '#f4f1e8', 'text-halo-color': '#0a0f0c', 'text-halo-width': 1.2 },
          });
        }
        fetch(ov.path)
          .then((r) => r.json())
          .then((data) => { if (map.getSource(ov.id)) map.getSource(ov.id).setData(data); })
          .catch(() => {});
      });
      map.on('click', 'case-highlight-fill', (e) => {
        const f = e.features[0];
        const p = f.properties;
        const photo = LOKASI_PHOTO[p.name];
        const photoHtml = photo
          ? `<img src="${photo}" alt="${p.name}" style="width:220px;height:130px;object-fit:cover;border-radius:6px;margin-top:6px;display:block;" onerror="this.style.display='none'" />`
          : '';
        const row = (label, value) => (value ? `<div>${label}: ${value}</div>` : '');
        popupRef.current
          .setLngLat(e.lngLat)
          .setHTML(
            `<strong>${p.name}</strong>${photoHtml}` +
              row('Luas', p.areaHa ? `${Number(p.areaHa).toLocaleString('id-ID', { maximumFractionDigits: 1 })} ha` : null) +
              row('Desa', p.desa) +
              row('Status kawasan', p.statusKawasan) +
              row('Aktor terindikasi', p.aktor) +
              row('Tahun tanam', p.tahunTanam)
          )
          .addTo(map);
      });

      // Ikon Mill/PoD — visibility diatur lewat effect di bawah
      // (mengikuti activeChapter.routes), bukan selalu 'visible', supaya
      // tidak nongol di chapter yang tidak bicara soal rantai pasok.
      loadMapIcons(map)
        .then(({ failedKeys }) => {
          const iconExpr = failedKeys.includes('mill') || failedKeys.includes('pod')
            ? null // fallback: kalau salah satu gagal load, pakai circle polos biar tidak pincang (1 ikon asli + 1 kotak-x)
            : ['match', ['get', 'type'], 'mill', iconImageId('mill'), 'pod', iconImageId('pod'), iconImageId('pod')];
          if (iconExpr) {
            map.addLayer({
              id: 'route-endpoints-icon',
              type: 'symbol',
              source: 'route-endpoints',
              layout: {
                visibility: 'none',
                'icon-image': iconExpr,
                'icon-size': 0.8,
                'icon-allow-overlap': true,
                'text-field': ['get', 'label'],
                'text-font': ['Open Sans Regular'],
                'text-size': 10,
                'text-offset': [0, 1.1],
                'text-anchor': 'top',
                'text-allow-overlap': false,
              },
              paint: { 'text-color': '#f4f1e8', 'text-halo-color': '#0a0f0c', 'text-halo-width': 1.2 },
            });
          } else {
            map.addLayer({
              id: 'route-endpoints-icon',
              type: 'circle',
              source: 'route-endpoints',
              layout: { visibility: 'none' },
              paint: {
                'circle-radius': 6,
                'circle-color': ['match', ['get', 'type'], 'mill', '#e0c14d', 'pod', '#f2c94c', '#f2c94c'],
                'circle-stroke-width': 1.5,
                'circle-stroke-color': '#0a0f0c',
              },
            });
          }
          map.getSource('route-endpoints')?.setData({
            type: 'FeatureCollection',
            features: routePoints
              .filter((p) => p.type === 'mill' || p.type === 'pod')
              .map((p) => ({ type: 'Feature', properties: { label: p.label, type: p.type }, geometry: { type: 'Point', coordinates: p.coords } })),
          });
          iconsReadyRef.current = true;
          // Kalau chapter routes:true sudah aktif sebelum icon selesai load,
          // langsung apply visibility sekarang — tanpa ini icon tidak pernah
          // muncul di chapter pertama yang dibuka (race condition async).
          const currentChapter = mapRef.current?.__activeChapter;
          if (currentChapter?.routes && map.getLayer('route-endpoints-icon')) {
            map.setLayoutProperty('route-endpoints-icon', 'visibility', 'visible');
          }
        })
        .catch((err) => console.error('Gagal load icon Mill/PoD di Storymap:', err));

      // Fetch batas 5 desa asli — sebelumnya tab Storymap SELAMANYA
      // menampilkan kotak placeholder dari polygons.js (beda dari tab
      // Peta Interaktif yang sudah fetch data asli ini). Kalau fetch
      // gagal (jaringan/hosting), placeholder kotak tetap dipakai sebagai
      // fallback — peta tidak pernah blank karena ini.
      fetch('/geojson/batas-desa.geojson')
        .then((res) => (res.ok ? res.json() : Promise.reject(new Error(`HTTP ${res.status}`))))
        .then((geojson) => {
          const tagged = (geojson.features ?? []).map((f) => ({
            ...f,
            properties: { ...f.properties, category: 'batas-wilayah' },
          }));
          setRealBoundaryFeatures(tagged);
        })
        .catch((err) => {
          console.error('Gagal fetch batas-desa.geojson, tetap pakai placeholder kotak:', err);
        });

      // Fetch shape 3 Lokasi Kasus asli — sebelumnya SELAMANYA kotak
      // placeholder di tab Storymap juga (baru diperbaiki di tab Peta
      // Interaktif). Propertinya (name: 'Lokasi 1'/'2'/'3') sudah
      // dinormalisasi sama dengan lokasi1/2/3Polygon di polygons.js
      // waktu file ini dibuat, jadi tinggal dicocokkan lewat nama.
      fetch('/geojson/lokasi-fokus.geojson')
        .then((res) => (res.ok ? res.json() : Promise.reject(new Error(`HTTP ${res.status}`))))
        .then((geojson) => {
          setRealLokasiFeatures(geojson.features ?? []);
        })
        .catch((err) => {
          console.error('Gagal fetch lokasi-fokus.geojson, tetap pakai placeholder kotak:', err);
        });
    });

    mapRef.current = map;
    setMapInstance(map); // trigger render supaya MapScaleBar dapat instance map
    return () => {
      map.remove();
      mapRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !activeChapter) return;

    const { center, zoom, pitch, bearing: chapterBearing } = activeChapter.mapState;
    const width = window.innerWidth;
    // Semua popup sekarang SELALU di kiri (field `align` sudah dihapus
    // dari data chapter) — jadi padding kamera berlaku untuk semua
    // chapter, bukan cuma yang dulu align:'left'.
    const needsPadding = width > PHONE_MAX;

    // PENTING: kalau tidak butuh padding, key `padding` JANGAN ikut
    // dikirim sama sekali ke easeTo — bukan dikirim dengan value
    // `undefined`. MapLibre membedakan "key tidak ada" vs "key ada
    // tapi undefined": begitu key `padding` ADA di options (meski
    // isinya undefined), MapLibre langsung coba baca `padding.top` tanpa
    // fallback ke default, dan crash dengan "Cannot read properties of
    // undefined (reading 'top')". Makanya di sini options-nya dibangun
    // kondisional, bukan selalu include padding: padding-mungkin-undefined.
    const cameraOptions = { center, zoom, pitch, bearing: chapterBearing, duration: 900 };
    if (needsPadding) {
      // Jangan sampai padding lebih dari separuh lebar layar (bisa
      // bikin MapLibre pusing hitung viewport efektifnya di layar
      // sempit-medium) — batasi maksimal 45% lebar layar.
      const left = Math.min(POPUP_WIDTH, width * 0.45);
      cameraOptions.padding = { left, top: 0, right: 0, bottom: 0 };
    }
    map.easeTo(cameraOptions);

    const setPolygons = () => {
      const admin = map.getSource('admin-boundary');
      const cases = map.getSource('case-highlight');
      if (!admin || !cases) return;

      const declared = activeChapter.polygons ?? [];
      // Substitusi placeholder kotak (name: 'Kecamatan Sajingan Besar')
      // dengan shape 5 desa asli begitu fetch di atas selesai. Dicek
      // lewat `properties.name`, bukan identity object, supaya tidak
      // perlu import kecamatanBoundary terpisah di sini.
      let all = realBoundaryFeatures
        ? declared.flatMap((f) =>
            f.properties?.name === 'Kecamatan Sajingan Besar' ? realBoundaryFeatures : [f]
          )
        : declared;

      // Substitusi placeholder kotak Lokasi 1/2/3 dengan shape asli hasil
      // digitasi (lihat lokasi-fokus.geojson) — dicocokkan per-nama
      // ('Lokasi 1'/'Lokasi 2'/'Lokasi 3') supaya tiap kotak diganti
      // dengan shape yang benar, bukan asal timpa semua jadi satu.
      if (realLokasiFeatures) {
        all = all.map((f) => {
          if (f.properties?.category !== 'studi-kasus') return f;
          const real = realLokasiFeatures.find((r) => r.properties?.name === f.properties?.name);
          return real ?? f;
        });
      }

      admin.setData({
        type: 'FeatureCollection',
        features: all.filter((f) => f.properties?.category === 'batas-wilayah'),
      });
      cases.setData({
        type: 'FeatureCollection',
        features: all.filter((f) => f.properties?.category === 'studi-kasus'),
      });

      // Ikon Mill/PoD cuma tampil di chapter yang memang bicara soal
      // rantai pasok (routes: true) — lihat chapters.js.
      mapRef.current.__activeChapter = activeChapter;
      if (map.getLayer('route-endpoints-icon')) {
        map.setLayoutProperty('route-endpoints-icon', 'visibility', activeChapter.routes ? 'visible' : 'none');
      }

      // Toggle overlay tematik per chapter — field `overlays` di chapters.js
      // berisi array string id overlay yang harus visible di chapter ini
      // (misal ['storymap-forest'] untuk chapter Hutan Yang Terus Berkurang).
      const activeOverlays = new Set(activeChapter.overlays ?? []);
      ['storymap-forest', 'storymap-planted', 'storymap-kawasan'].forEach((id) => {
        const vis = activeOverlays.has(id) ? 'visible' : 'none';
        if (map.getLayer(`${id}-fill`)) map.setLayoutProperty(`${id}-fill`, 'visibility', vis);
        if (map.getLayer(`${id}-line`)) map.setLayoutProperty(`${id}-line`, 'visibility', vis);
        if (map.getLayer(`${id}-label`)) map.setLayoutProperty(`${id}-label`, 'visibility', vis);
      });
    };

    if (map.isStyleLoaded()) {
      setPolygons();
    } else {
      map.once('load', setPolygons);
    }
  }, [activeChapter, realBoundaryFeatures, realLokasiFeatures]);

  const legendItems = useMemo(() => {
    const categories = new Set((activeChapter?.polygons ?? []).map((f) => f.properties?.category));
    const items = [];
    if (categories.has('batas-wilayah')) {
      items.push({ label: 'Batas Desa', color: '#f2f0e8', type: 'line' });
    }
    if (categories.has('studi-kasus')) {
      items.push({ label: 'Lokasi Kasus', color: '#ff5a3c', type: 'fill' });
    }
    if (activeChapter?.routes) {
      // Tidak ada entri 'Lokasi Kasus' terpisah di sini lagi — sudah
      // diwakili entri 'studi-kasus' di atas (sekarang warnanya SAMA,
      // #ff5a3c, jadi entri ganda cuma bikin legenda bertumpuk untuk
      // hal yang sama persis).
      items.push({ label: 'Mill/PKS', color: '#e0c14d', type: 'fill' });
      items.push({ label: 'PoD/Pengepul', color: '#f2c94c', type: 'fill' });
    }
    const overlaySet = new Set(activeChapter?.overlays ?? []);
    if (overlaySet.has('storymap-forest')) items.push({ label: 'Tutupan Hutan', color: '#02ad00', type: 'fill' });
    if (overlaySet.has('storymap-planted')) items.push({ label: 'Kebun Sawit', color: '#f5a623', type: 'fill' });
    if (overlaySet.has('storymap-kawasan')) {
      items.push({ label: 'Hutan Lindung', color: '#02ad00', type: 'fill' });
      items.push({ label: 'Hutan Produksi Tetap', color: '#ffff00', type: 'fill' });
      items.push({ label: 'Hutan Produksi Terbatas', color: '#8af200', type: 'fill' });
      items.push({ label: 'Taman Wisata Alam', color: '#ad3fff', type: 'fill' });
    }
    return items;
  }, [activeChapter]);

  return (
    <div className="map-controller">
      {mapError ? (
        <div className="map-controller__fallback">
          <p>Peta tidak bisa dimuat di perangkat/browser ini.</p>
          <p className="map-controller__fallback-detail">
            {String(mapError?.message || mapError)}
          </p>
        </div>
      ) : (
        <>
          <div ref={mapContainerRef} className="map-controller__canvas" />
          <RouteAnimationLayer map={mapInstance} active={!!activeChapter?.routes} />
          <MapOverlayStack
            map={mapInstance}
            bearing={bearing}
            legendItems={legendItems}
            showInset
            insetHidden={isOnCover}
          />
        </>
      )}
    </div>
  );
}
