import { useEffect, useMemo, useRef, useState } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { mapStyle } from '../mapStyle.js';
import MapOverlayStack from './MapOverlayStack.jsx';
import RouteAnimationLayer from './RouteAnimationLayer.jsx';

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

export default function MapController({ activeChapter, isOnCover }) {
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const [mapInstance, setMapInstance] = useState(null);
  const [bearing, setBearing] = useState(0);
  const [mapError, setMapError] = useState(null);

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

      map.addLayer({
        id: 'admin-boundary-line',
        type: 'line',
        source: 'admin-boundary',
        paint: { 'line-color': '#f2f0e8', 'line-width': 1.5, 'line-dasharray': [2, 2] },
      });
      map.addLayer({
        id: 'case-highlight-fill',
        type: 'fill',
        source: 'case-highlight',
        paint: { 'fill-color': '#7ed957', 'fill-opacity': 0.28 },
      });
      map.addLayer({
        id: 'case-highlight-line',
        type: 'line',
        source: 'case-highlight',
        paint: { 'line-color': '#7ed957', 'line-width': 2 },
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

      const all = activeChapter.polygons ?? [];
      admin.setData({
        type: 'FeatureCollection',
        features: all.filter((f) => f.properties?.category === 'batas-wilayah'),
      });
      cases.setData({
        type: 'FeatureCollection',
        features: all.filter((f) => f.properties?.category === 'studi-kasus'),
      });
    };

    if (map.isStyleLoaded()) {
      setPolygons();
    } else {
      map.once('load', setPolygons);
    }
  }, [activeChapter]);

  const legendItems = useMemo(() => {
    const categories = new Set((activeChapter?.polygons ?? []).map((f) => f.properties?.category));
    const items = [];
    if (categories.has('batas-wilayah')) {
      items.push({ label: 'Batas Administrasi', color: '#f2f0e8', type: 'line' });
    }
    if (categories.has('studi-kasus')) {
      items.push({ label: 'Area Studi Kasus', color: '#7ed957', type: 'fill' });
    }
    if (activeChapter?.routes) {
      items.push({ label: 'Lokasi Kasus', color: '#ff5a3c', type: 'fill' });
      items.push({ label: 'Mill/PKS', color: '#e0c14d', type: 'fill' });
      items.push({ label: 'Dealer/Port', color: '#4d8fe0', type: 'fill' });
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
