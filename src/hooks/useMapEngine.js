import { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import maplibregl from 'maplibre-gl';
import { mapStyle, BASEMAP_OPTIONS } from '../mapStyle.js';
import { LAYER_CATALOG } from '../data/layers.js';
import { loadMapIcons, iconImageId } from '../utils/mapIcons.js';
import { parseGeoFile, inferGeometryType } from '../utils/parseGeoFile.js';
import { getGeoJSONBounds } from '../utils/geojsonBounds.js';
import { routePoints } from '../data/routes.js';

// Diekstrak dari DashboardMap.jsx supaya mesin peta (init MapLibre,
// layer catalog, upload, toggle, opacity) bisa dipakai ULANG di lebih
// dari satu tempat (Peta Interaktif & Dashboard) tanpa duplikasi ~900
// baris logic imperatif. DashboardMap.jsx sekarang cuma wrapper tipis
// di atas hook ini; semua perilaku dipertahankan 100% sama seperti
// sebelum diekstrak.

// Warna dirotasi buat layer hasil drag-and-drop (bukan dari LAYER_CATALOG,
// jadi tidak ada warna yang sudah ditentukan manual per layer).
const UPLOAD_COLOR_PALETTE = ['#8a5cc4', '#e0796b', '#5cc48a', '#c4a45c', '#5c8ac4', '#c45c9e'];

// BUG SEBELUMNYA: popup luasan selalu kosong ("Luas: — ha") untuk layer
// Forest Cover, Planted Palm Oil, dan Deforestasi. Bukan karena datanya
// tidak ada — tiap file GeoJSON itu ternyata SUDAH punya kolom luas,
// cuma nama field-nya beda-beda per file (bekas nama kolom shapefile
// yang disanitasi berbeda-beda oleh tiap sumber data):
//   forest-cover.geojson      -> "Area__ha_"
//   planted-palm-oil.geojson  -> "Area (ha)"
//   deforestasi.geojson       -> "Area"
//   lokasi-fokus.geojson      -> "areaHa" (sudah dinormalisasi)
// Kode lama cuma cek `properties.areaHa`, jadi 3 dari 4 sumber di atas
// selalu jatuh ke fallback "—". Fungsi ini cek semua kemungkinan nama.
function readAreaHa(properties) {
  const raw =
    properties.areaHa ?? properties['Area (ha)'] ?? properties.Area__ha_ ?? properties.Area;
  if (raw == null || Number.isNaN(Number(raw))) return null;
  return Number(raw).toLocaleString('id-ID', { maximumFractionDigits: 1 });
}

// Popup disesuaikan per jenis layer — sebelumnya semua polygon (kawasan
// hutan, forest cover, lokasi kasus, dll) dapat popup generik "nama +
// luas" yang sama, padahal masing-masing punya field paling relevan yang
// berbeda (mis. kawasan hutan lebih penting nomor SK & fungsi kawasannya
// daripada luas poligon administratifnya yang bisa meluas ke luar AOI).
function buildPolygonPopupHtml(layerId, name, props) {
  const areaHa = readAreaHa(props);
  const row = (label, value) => (value ? `<div>${label}: ${value}</div>` : '');

  if (layerId === 'kawasan-hutan') {
    return (
      `<strong>${props.keterangan ?? name}</strong>` +
      row('Nama kawasan', props.nkws) +
      row('No. SK', props.nosktap) +
      `<div style="margin-top:4px;font-size:11px;opacity:0.75;">Sumber: Peta Penunjukan Kawasan Hutan KLHK</div>`
    );
  }
  if (props.category === 'studi-kasus') {
    return (
      `<strong>${name}</strong>` +
      row('Luas', areaHa ? `${areaHa} ha` : null) +
      row('Desa', props.desa) +
      row('Status kawasan', props.statusKawasan) +
      row('Aktor terindikasi', props.aktor) +
      row('Tahun tanam', props.tahunTanam)
    );
  }
  if (layerId === 'forest-cover') {
    return `<strong>Forest Cover</strong>` + row('Luas', areaHa ? `${areaHa} ha` : null) + row('Periode', props.Periode) + row('Tipe', props.Type) + row('Fungsi kawasan', props.Keterangan);
  }
  if (layerId === 'planted-palm-oil') {
    return `<strong>Planted Palm Oil</strong>` + row('Luas', areaHa ? `${areaHa} ha` : null) + row('Tahun tanam', props.Thn_Tanam_) + row('Aktor', props.Aktor) + row('Desa', props.NAMOBJ);
  }
  if (layerId === 'deforestasi') {
    return `<strong>Deforestasi</strong>` + row('Luas', areaHa ? `${areaHa} ha` : null) + row('Tahun cleared', props.thn_cleari) + row('Aktor', props.Aktor) + row('Sumber citra', props.Source);
  }
  return `<strong>${name}</strong>` + row('Luas', areaHa ? `${areaHa} ha` : '—');
}

// Nambah source + layer MapLibre yang sesuai `geometryType`. Dipakai
// BERULANG — sekali buat semua layer LAYER_CATALOG waktu peta pertama
// load, dan lagi tiap kali ada layer baru masuk lewat drag-and-drop.
// Satu fungsi ini yang jadi sumber kebenaran "cara render tiap tipe
// geometri", supaya catalog & upload tidak py logic duplikat/beda.
//
// `clickHandlers` (Map, opsional): referensi listener klik disimpan di
// sini supaya bisa di-unbind dengan benar waktu layer dihapus
// (removeUploadedLayer) — sebelumnya listener klik menggantung selamanya
// begitu layer upload dihapus, karena cuma layer & source-nya yang
// dibongkar, listener-nya tidak pernah di-off().
//
// `callbacks.onCaseFeatureClick` (opsional): dipanggil untuk layer
// studi-kasus (properties.category === 'studi-kasus') — dipakai Object
// Inspector untuk set state React `selectedCaseId`. MENGGANTIKAN popup
// native MapLibre untuk klik ini (bukan tambahan lagi) — begitu callout
// leader-line Object Inspector menampilkan detail lengkap, popup kecil
// di bawahnya cuma jadi elemen ganda yang menutupi peta tanpa perlu.
// Tipe polygon lain (forest cover, kawasan hutan, dst) tetap pakai
// popup native seperti biasa, tidak terpengaruh.
function addMapLayer(map, layer, visible, popupRef, clickHandlers, failedIcons, markersRef, callbacks = {}) {
  const { onCaseFeatureClick } = callbacks;
  if (map.getSource(layer.id)) return; // sudah ada, jangan dobel

  map.addSource(layer.id, { type: 'geojson', data: layer.data });
  const vis = visible ? 'visible' : 'none';

  if (layer.geometryType === 'polygon') {
    // Layer upload dibuat sedikit lebih kontras (opacity & line-width
    // lebih tinggi) daripada layer katalog biasa — data upload sering
    // berupa batas administratif/area luas dengan warna yang gampang
    // "hilang" di antara citra satelit kalau terlalu transparan,
    // apalagi begitu di-zoom-out buat muat seluruh areanya.
    const fillOpacity = layer.isUpload ? 0.45 : 0.3;
    const lineWidth = layer.isUpload ? 3 : 2;
    // outlineOnly (dipakai Batas Desa) — cuma gambar garis batas, TANPA
    // fill sama sekali. Sebelumnya batas desa selalu ikut fill (warna
    // rata di seluruh area desa), yang bikin peta ramai/menutupi layer
    // lain di bawahnya padahal batas desa cuma perlu jadi acuan garis.
    if (!layer.outlineOnly) {
      map.addLayer({
        id: `${layer.id}-fill`, type: 'fill', source: layer.id,
        layout: { visibility: vis },
        // fillColorExpression (opsional) = warna data-driven per fitur,
        // dipakai kawasan-hutan supaya tiap fungsi kawasan (HL/HP/HPT/dst)
        // tampil dengan warna resmi KLHK-nya sendiri, bukan satu warna rata.
        paint: { 'fill-color': layer.fillColorExpression ?? layer.color, 'fill-opacity': fillOpacity },
      });
    }
    map.addLayer({
      id: `${layer.id}-line`, type: 'line', source: layer.id,
      layout: { visibility: vis },
      paint: { 'line-color': layer.fillColorExpression ?? layer.color, 'line-width': layer.outlineOnly ? 2 : lineWidth },
    });
    // Label default-visible begitu layer dinyalakan (tidak perlu diklik
    // dulu) — dipakai layer yang mendeklarasikan `labelField` di layers.js.
    if (layer.labelField) {
      map.addLayer({
        id: `${layer.id}-poly-label`, type: 'symbol', source: layer.id,
        layout: {
          visibility: vis,
          'text-field': ['get', layer.labelField],
          'text-font': ['Open Sans Regular'],
          'text-size': 11,
          'symbol-placement': 'point',
          'text-allow-overlap': false,
        },
        paint: { 'text-color': '#f4f1e8', 'text-halo-color': '#0a0f0c', 'text-halo-width': 1.3 },
      });
    }
    // outlineOnly tidak punya layer fill buat diklik — pasang listener
    // klik di layer garisnya sendiri sebagai gantinya (area klik jadi
    // lebih sempit, cuma persis di garisnya, tapi itu konsekuensi wajar
    // dari "outline saja tanpa fill").
    const clickLayerId = layer.outlineOnly ? `${layer.id}-line` : `${layer.id}-fill`;
    const handler = (e) => {
      const f = e.features[0];
      const name = f.properties.name ?? layer.name;
      if (f.properties.category === 'studi-kasus') {
        // Popup native DILEWATI di sini — callout leader-line Object
        // Inspector (lihat MapCallout.jsx) yang menampilkan detailnya.
        onCaseFeatureClick?.(f.properties, e.lngLat);
        return;
      }
      // BUG SEBELUMNYA: popup luasan selalu "—" untuk Forest Cover,
      // Planted Palm Oil, Deforestasi — lihat buildPolygonPopupHtml/
      // readAreaHa di atas untuk penjelasan lengkap kenapa.
      popupRef.current.setLngLat(e.lngLat).setHTML(buildPolygonPopupHtml(layer.id, name, f.properties)).addTo(map);
    };
    map.on('click', clickLayerId, handler);
    clickHandlers?.set(clickLayerId, handler);
  } else if (layer.geometryType === 'icon-point') {
    const iconFailed = failedIcons?.has(layer.icon);
    if (iconFailed) {
      // FALLBACK — icon SVG-nya gagal dimuat (lihat mapIcons.js), jadi
      // dirender sebagai lingkaran warna biasa (persis kayak
      // geometryType:'point') supaya titiknya TETAP KELIHATAN, bukan
      // hilang total tanpa penjelasan. Ini yang sebelumnya bikin
      // "icon mills/pod tidak tampil" — sekarang minimal ada fallback
      // visual, dan errornya juga sudah di-log jelas di console.
      map.addLayer({
        id: `${layer.id}-icon`, type: 'circle', source: layer.id,
        layout: { visibility: vis },
        paint: { 'circle-color': layer.color, 'circle-radius': 6, 'circle-stroke-width': 1.5, 'circle-stroke-color': '#0a0f0c' },
      });
    } else {
      map.addLayer({
        id: `${layer.id}-icon`, type: 'symbol', source: layer.id,
        layout: {
          visibility: vis,
          'icon-image': iconImageId(layer.icon),
          'icon-size': 0.85,
          'icon-allow-overlap': true,
          // Label nama default-visible di samping ikon, tidak perlu
          // diklik dulu — dipakai layer yang mendeklarasikan `labelField`
          // (Mills Terdekat & PoD Terdekat, lihat layers.js).
          ...(layer.labelField
            ? {
                'text-field': ['get', layer.labelField],
                'text-font': ['Open Sans Regular'],
                'text-size': 10,
                'text-offset': [0, 1.1],
                'text-anchor': 'top',
                'text-allow-overlap': false,
                'icon-allow-overlap': true,
              }
            : {}),
        },
        paint: layer.labelField
          ? { 'text-color': '#f4f1e8', 'text-halo-color': '#0a0f0c', 'text-halo-width': 1.2 }
          : {},
      });
    }
    const handler = (e) => {
      const f = e.features[0];
      const name = f.properties.name ?? layer.name;
      // Titik icon-point (Mills, PoD) cuma dapat popup native nama
      // singkat — tidak ada lagi elemen foto (thumbnail atau popup) di
      // titik mana pun, sesuai permintaan "hanya icon saja".
      popupRef.current.setLngLat(e.lngLat).setHTML(`<strong>${name}</strong>`).addTo(map);
    };
    map.on('click', `${layer.id}-icon`, handler);
    clickHandlers?.set(`${layer.id}-icon`, handler);
  } else if (layer.geometryType === 'point') {
    map.addLayer({
      id: `${layer.id}-point`, type: 'circle', source: layer.id,
      layout: { visibility: vis },
      paint: { 'circle-color': layer.color, 'circle-radius': 5, 'circle-stroke-width': 1, 'circle-stroke-color': '#0a0f0c' },
    });
    const handler = (e) => {
      const f = e.features[0];
      const name = f.properties.name ?? layer.name;
      popupRef.current.setLngLat(e.lngLat).setHTML(`<strong>${name}</strong>`).addTo(map);
    };
    map.on('click', `${layer.id}-point`, handler);
    clickHandlers?.set(`${layer.id}-point`, handler);
  } else if (layer.geometryType === 'line') {
    map.addLayer({
      id: `${layer.id}-line`, type: 'line', source: layer.id,
      layout: { visibility: vis },
      paint: { 'line-color': layer.color, 'line-width': 2 },
    });
  }
}

function setMapLayerVisibility(map, id, visible, markersRef) {
  ['fill', 'line', 'point', 'icon', 'poly-label'].forEach((suffix) => {
    const layerId = `${id}-${suffix}`;
    if (map.getLayer(layerId)) {
      map.setLayoutProperty(layerId, 'visibility', visible ? 'visible' : 'none');
    }
  });
  // Thumbnail foto (maplibregl.Marker, bukan layer MapLibre biasa) tidak
  // ikut ke-toggle lewat setLayoutProperty di atas — harus di-toggle
  // manual lewat elemen DOM-nya.
  markersRef?.get(id)?.forEach((marker) => {
    marker.getElement().style.display = visible ? 'block' : 'none';
  });
}

// Hook mesin peta interaktif (non scroll-driven) — dipanggil oleh
// InteractiveMapView.jsx (tab Peta Interaktif, satu-satunya pemanggil
// sejak tab Dashboard tidak lagi punya map sendiri), engine-nya dioper
// sebagai prop ke DashboardMap.jsx (kanvas + overlay, presentational saja).
//
// `initialCenter`/`initialZoom` (opsional): default kamera awal — tidak
// dioper, pakai default lama. `onCaseFeatureClick` (opsional): lihat
// komentar addMapLayer di atas — dipakai callout leader-line
// (MapCallout.jsx) waktu polygon studi-kasus diklik.
export default function useMapEngine({
  initialCenter = [109.05, 1.35],
  initialZoom = 9.5,
  onCaseFeatureClick,
} = {}) {
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const popupRef = useRef(null);
  // layerId -> handler function, dipakai buat unbind click listener
  // dengan benar waktu layer upload dihapus (lihat removeUploadedLayer).
  const clickHandlersRef = useRef(new Map());
  // layerId -> array of maplibregl.Marker (thumbnail foto default-visible,
  // lihat addMapLayer). Dilacak terpisah dari clickHandlersRef karena
  // ini bukan MapLibre layer biasa — perlu di-remove() manual, bukan
  // cuma di-setLayoutProperty.
  const markersRef = useRef(new Map());
  // Diisi setelah loadMapIcons() selesai — Set berisi key icon yang
  // GAGAL dimuat ('mill'/'pod'), dipakai addMapLayer buat nentuin
  // fallback (lingkaran biasa) atau icon SVG asli.
  const failedIconsRef = useRef(new Set());
  const [mapInstance, setMapInstance] = useState(null);
  const [bearing, setBearing] = useState(0);
  const [mapError, setMapError] = useState(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadError, setUploadError] = useState(null);

  const [activeLayers, setActiveLayers] = useState(() =>
    Object.fromEntries(LAYER_CATALOG.map((l) => [l.id, l.id === 'kecamatan']))
  );
  // Layer hasil drag-and-drop user — masuk kategori "Informasi Tambahan".
  const [uploadedLayers, setUploadedLayers] = useState([]);
  const uploadedLayersRef = useRef(uploadedLayers);
  uploadedLayersRef.current = uploadedLayers;

  const [showRoutePrediction, setShowRoutePrediction] = useState(false);
  const [basemapId, setBasemapId] = useState(BASEMAP_OPTIONS[0].id);
  const [layerOpacity, setLayerOpacity] = useState({});

  // LAYER_CATALOG itu data statis (import, tidak pernah berubah) —
  // sebelumnya di-.filter() DUA KALI per kategori di dalam render loop
  // (sekali buat render checkbox, sekali lagi buat hitung activeCount)
  // = 10 kali scan array tiap render untuk 5 kategori. Dikelompokkan
  // sekali di sini, dipakai ulang oleh LayerPanel.
  const layersByCategory = useMemo(() => {
    const grouped = {};
    LAYER_CATALOG.forEach((layer) => {
      (grouped[layer.category] ??= []).push(layer);
    });
    return grouped;
  }, []);

  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapRef.current) return;

    let map;
    try {
      map = new maplibregl.Map({
        container: mapContainerRef.current,
        style: mapStyle,
        center: initialCenter,
        zoom: initialZoom,
        interactive: true,
        attributionControl: false,
      });
    } catch (err) {
      console.error('Gagal inisialisasi peta:', err);
      setMapError(err);
      return;
    }

    map.on('error', (e) => console.error('MapLibre error event:', e?.error || e));
    map.addControl(new maplibregl.NavigationControl(), 'bottom-right');
    map.on('rotate', () => setBearing(map.getBearing()));
    popupRef.current = new maplibregl.Popup({ closeButton: true, closeOnClick: true, maxWidth: '260px' });

    map.on('load', async () => {
      try {
        const { failedKeys } = await loadMapIcons(map); // WAJIB selesai duluan — layer icon-point butuh ini
        failedIconsRef.current = new Set(failedKeys);
      } catch (err) {
        // Kalau loadMapIcons sendiri throw (bukan cuma salah satu
        // icon-nya) — anggap SEMUA icon gagal, biar fallback lingkaran
        // aktif buat semua layer icon-point, bukan malah nge-hang.
        console.error('Gagal load icon peta:', err);
        failedIconsRef.current = new Set(['mill', 'pod']);
      }
      // Fetch batas 5 desa asli, ganti placeholder kotak kecamatanBoundary.
      //
      // BUG SEBELUMNYA (2 penyebab bertumpuk): (1) kode ini mengecek
      // `kecLayer.url`, padahal field yang benar di layers.js adalah
      // `geojsonPath` — jadi kondisinya selalu false, fetch tidak pernah
      // jalan. (2) `fetchLayerData()` juga skip fetch kalau `layer.data`
      // sudah truthy — dan layer ini SELALU punya data (placeholder kotak
      // `fc([kecamatanBoundary])`), jadi walau field-nya dibetulkan,
      // fetchLayerData tetap akan langsung return tanpa fetch apa pun.
      // Efek gabungan keduanya: tab Peta Interaktif menampilkan kotak
      // persegi untuk batas kecamatan SELAMANYA, sama seperti bug yang
      // sudah diperbaiki di tab Storymap (MapController.jsx) — cuma
      // sebab teknisnya beda. Diperbaiki dengan fetch langsung di sini,
      // bukan lewat fetchLayerData().
      const kecLayer = LAYER_CATALOG.find((l) => l.id === 'kecamatan');
      if (kecLayer?.geojsonPath) {
        fetch(kecLayer.geojsonPath)
          .then((res) => (res.ok ? res.json() : Promise.reject(new Error(`HTTP ${res.status}`))))
          .then((geojson) => {
            kecLayer.data = geojson; // cache di objek layer, gantikan placeholder
            if (map.getSource('kecamatan')) {
              map.getSource('kecamatan').setData(geojson);
            }
          })
          .catch((err) => {
            console.error('Gagal fetch batas-desa.geojson (Peta Interaktif), tetap pakai placeholder kotak:', err);
          });
      }

      // Fetch shape 3 Lokasi Kasus asli, ganti placeholder kotak
      // lokasi1/2/3Polygon — analog dengan kecamatan di atas. Di-fetch
      // SEKALI (bukan 3x terpisah), lalu dicocokkan ke 3 layer sekaligus
      // berdasarkan `properties.name`.
      fetch('/geojson/lokasi-fokus.geojson')
        .then((res) => (res.ok ? res.json() : Promise.reject(new Error(`HTTP ${res.status}`))))
        .then((geojson) => {
          ['lokasi-1', 'lokasi-2', 'lokasi-3'].forEach((layerId) => {
            const lokasiLayer = LAYER_CATALOG.find((l) => l.id === layerId);
            const targetName = lokasiLayer?.data?.features?.[0]?.properties?.name;
            const real = geojson.features?.find((f) => f.properties?.name === targetName);
            if (!lokasiLayer || !real) return;
            lokasiLayer.data = { type: 'FeatureCollection', features: [real] };
            if (map.getSource(layerId)) {
              map.getSource(layerId).setData(lokasiLayer.data);
            }
          });
        })
        .catch((err) => {
          console.error('Gagal fetch lokasi-fokus.geojson, tetap pakai placeholder kotak:', err);
        });

      LAYER_CATALOG.forEach((layer) => {
        if (!layer.data) return;
        addMapLayer(map, layer, !!activeLayers[layer.id], popupRef, clickHandlersRef.current, failedIconsRef.current, markersRef.current, { onCaseFeatureClick });
      });
      uploadedLayersRef.current.forEach((layer) => addMapLayer(map, layer, true, popupRef, clickHandlersRef.current, failedIconsRef.current, markersRef.current, { onCaseFeatureClick }));
    });

    mapRef.current = map;
    setMapInstance(map);
    return () => {
      map.remove();
      mapRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Ganti basemap begitu basemapId berubah — remove+re-add source & layer
  // 'satellite'/'satellite-layer' saja (bukan map.setStyle(), yang akan
  // menghapus SEMUA layer lain yang sudah ditumpuk di atasnya: AOI,
  // kawasan hutan, dst). Layer overlay lain tidak disentuh sama sekali.
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    const applyBasemap = () => {
      const option = BASEMAP_OPTIONS.find((b) => b.id === basemapId) ?? BASEMAP_OPTIONS[0];
      if (map.getLayer('satellite-layer')) map.removeLayer('satellite-layer');
      if (map.getSource('satellite')) map.removeSource('satellite');
      map.addSource('satellite', {
        type: 'raster',
        tiles: option.tiles,
        tileSize: option.tileSize,
        attribution: option.attribution,
      });
      // Basemap harus jadi layer PALING BAWAH — masukkan sebelum layer
      // pertama yang sudah ada (kalau ada), bukan addLayer biasa (yang
      // taruh di paling ATAS, ketimpa semua overlay AOI/kawasan hutan).
      const firstLayerId = map.getStyle().layers?.[0]?.id;
      map.addLayer({ id: 'satellite-layer', type: 'raster', source: 'satellite', minzoom: 0, maxzoom: 19 }, firstLayerId);
    };

    if (map.isStyleLoaded()) {
      applyBasemap();
    } else {
      map.once('load', applyBasemap);
    }
  }, [basemapId]);

  // Terapkan opacity per layer — dipisah dari effect visibility di bawah
  // karena beda trigger (slider vs checkbox) dan beda paint property
  // tergantung geometryType layer-nya.
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    Object.entries(layerOpacity).forEach(([id, value]) => {
      ['fill', 'line', 'point', 'icon'].forEach((suffix) => {
        const layerId = `${id}-${suffix}`;
        const layer = map.getLayer(layerId);
        if (!layer) return;
        if (layer.type === 'fill') map.setPaintProperty(layerId, 'fill-opacity', value);
        else if (layer.type === 'line') map.setPaintProperty(layerId, 'line-opacity', value);
        else if (layer.type === 'circle') map.setPaintProperty(layerId, 'circle-opacity', value);
        else if (layer.type === 'symbol') map.setPaintProperty(layerId, 'icon-opacity', value);
      });
    });
  }, [layerOpacity]);

  useEffect(() => {
    const map = mapRef.current;
    // BUG SEBELUMNYA (yang bikin "icon Mills/PoD tidak tampil, padahal
    // titik lokasi & rute sudah tampil duluan"): effect ini sebelumnya
    // juga cek `!map.isStyleLoaded()` dan `return` kalau false. Masalahnya,
    // `isStyleLoaded()` BUKAN flag sekali-jadi — dia bisa balik ke false
    // kapan saja tile viewport baru perlu dimuat (termasuk PERSIS saat
    // kamera di-pan/zoom). Toggle "Prediksi Supply Chain" (lihat
    // toggleRoutePrediction) memanggil zoomToBounds() di baris yang SAMA
    // dengan update activeLayers — jadi race: effect ini jalan TEPAT saat
    // isStyleLoaded() lagi false gara-gara kamera baru saja digeser,
    // sehingga update visibility mills/pod di-skip diam-diam dan TIDAK
    // PERNAH di-retry (efek cuma jalan ulang kalau activeLayers berubah
    // lagi). Efeknya: titik lokasi & garis rute (dari RouteAnimationLayer,
    // komponen terpisah yang tidak pakai guard ini) tetap tampil duluan,
    // tapi ikon mills/PoD (yang lewat effect ini) tidak pernah nongol.
    // Guard yang benar cukup `!map` — setMapLayerVisibility() sendiri
    // SUDAH aman kalau dipanggil sebelum layer ada (cek `map.getLayer()`
    // per layer di dalamnya), jadi tidak butuh guard tambahan di sini.
    if (!map) return;
    [...LAYER_CATALOG, ...uploadedLayers].forEach((layer) =>
      setMapLayerVisibility(map, layer.id, !!activeLayers[layer.id], markersRef.current)
    );
  }, [activeLayers, uploadedLayers]);

  // Tambahkan layer baru ke peta begitu masuk ke state uploadedLayers
  // (drop file berikutnya tidak mengulang yang sudah ada — dicek via
  // map.getSource di dalam addMapLayer).
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !map.isStyleLoaded()) return;
    uploadedLayers.forEach((layer) => {
      try {
        addMapLayer(map, layer, !!activeLayers[layer.id], popupRef, clickHandlersRef.current, failedIconsRef.current, markersRef.current, { onCaseFeatureClick });
      } catch (err) {
        // Sebelumnya error di sini diam-diam cuma masuk console —
        // gejalanya persis "badge upload muncul, tapi layer tidak
        // tampil di peta" tanpa penjelasan. Sekarang errornya
        // ditampilkan ke user.
        console.error(`Gagal render layer "${layer.name}":`, err);
        setUploadError(`Layer "${layer.name}" gagal ditampilkan di peta: ${err.message || err}`);
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [uploadedLayers, activeLayers]);

  // Cek apakah bounds tertentu SUDAH sepenuhnya kelihatan di viewport
  // peta sekarang — dipakai buat nentuin perlu-tidaknya zoom otomatis.
  function isBoundsVisible(map, bounds) {
    const view = map.getBounds();
    const [[minLng, minLat], [maxLng, maxLat]] = bounds;
    return (
      minLng >= view.getWest() &&
      maxLng <= view.getEast() &&
      minLat >= view.getSouth() &&
      maxLat <= view.getNorth()
    );
  }

  // Durasi dipercepat (900ms → 350ms) — biar tetap kerasa responsif
  // waktu memang perlu geser kamera (lihat toggleLayer di bawah:
  // sekarang cuma jalan kalau layernya BELUM kelihatan sama sekali).
  const zoomToBounds = useCallback((bounds) => {
    if (bounds && mapRef.current) {
      mapRef.current.fitBounds(bounds, { padding: 80, duration: 350, maxZoom: 16 });
    }
  }, []);

  // Centang layer → peta CUMA zoom kalau layer itu belum sepenuhnya
  // kelihatan di viewport sekarang. Ini beda dari versi sebelumnya
  // (yang skip zoom untuk SEMUA layer katalog) — itu ternyata bikin
  // Mills/PoD (titiknya tersebar cukup jauh dari pusat kecamatan, TIDAK
  // seperti AOI yang selalu deket) jadi tidak kelihatan waktu dicentang
  // karena sebagian di luar layar dan tidak ada lagi yang menggeser
  // kamera ke sana. Cek "sudah kelihatan atau belum" ini nyelesain
  // dua-duanya: layer yang sudah dalam pandangan (AOI) tidak bikin
  // kamera lompat, layer yang di luar pandangan (Mills/PoD tertentu)
  // tetap otomatis digeser supaya kelihatan.
  const toggleLayer = async (id) => {
    const nextValue = !activeLayers[id];
    setActiveLayers((prev) => ({ ...prev, [id]: nextValue }));

    if (nextValue && mapRef.current) {
      const layer = LAYER_CATALOG.find((l) => l.id === id) ?? uploadedLayersRef.current.find((l) => l.id === id);
      if (!layer) return;

      // Kalau layer belum punya data tapi ada geojsonPath — fetch sekarang
      if (!layer.data && layer.geojsonPath) {
        try {
          const resp = await fetch(layer.geojsonPath);
          if (resp.ok) {
            layer.data = await resp.json();
            if (mapRef.current) {
              addMapLayer(mapRef.current, layer, true, popupRef, clickHandlersRef.current, failedIconsRef.current, markersRef.current, { onCaseFeatureClick });
            }
          }
        } catch (err) {
          console.error(`Gagal fetch ${layer.geojsonPath}:`, err);
        }
      }

      if (layer.data) {
        const bounds = getGeoJSONBounds(layer.data);
        if (bounds && !isBoundsVisible(mapRef.current, bounds)) {
          zoomToBounds(bounds);
        }
      }
    }
  };

  const toggleRoutePrediction = () => {
    const next = !showRoutePrediction;
    setShowRoutePrediction(next);

    // Mills Terdekat & PoD Terdekat SUDAH TIDAK PUNYA checkbox sendiri
    // (digabung jadi satu toggle ini) — jadi nyala/matinya HARUS ikut
    // toggle ini dua-duanya, bukan cuma waktu dinyalakan. Kalau cuma
    // ditangani waktu `next` true, matiin "Prediksi Supply Chain" akan
    // ninggalin ikon Mills/PoD nyangkut kelihatan selamanya tanpa ada
    // cara buat menyembunyikannya lagi.
    setActiveLayers((prevLayers) => ({
      ...prevLayers,
      'mills-terdekat': next,
      'pod-terdekat': next,
    }));

    if (next) {
      // routePoints cuma array koordinat (bukan GeoJSON FeatureCollection)
      // — bungkus jadi bentuk yang getGeoJSONBounds mengerti.
      const asFeatureCollection = {
        type: 'FeatureCollection',
        features: routePoints.map((p) => ({ type: 'Feature', properties: {}, geometry: { type: 'Point', coordinates: p.coords } })),
      };
      const bounds = getGeoJSONBounds(asFeatureCollection);
      if (bounds && mapRef.current && !isBoundsVisible(mapRef.current, bounds)) {
        zoomToBounds(bounds);
      }
    }
  };

  const removeUploadedLayer = (id) => {
    const map = mapRef.current;
    if (map) {
      ['fill', 'line', 'point', 'icon'].forEach((suffix) => {
        const layerId = `${id}-${suffix}`;
        // Unbind listener klik SEBELUM hapus layer — sebelumnya ini
        // tidak dilakukan, listener-nya menggantung di memori
        // selamanya (kecil, tapi menumpuk kalau user sering
        // upload+hapus layer dalam satu sesi).
        const handler = clickHandlersRef.current.get(layerId);
        if (handler && map.getLayer(layerId)) {
          map.off('click', layerId, handler);
        }
        clickHandlersRef.current.delete(layerId);
        if (map.getLayer(layerId)) map.removeLayer(layerId);
      });
      if (map.getSource(id)) map.removeSource(id);
    }
    setUploadedLayers((prev) => prev.filter((l) => l.id !== id));
    setActiveLayers((prev) => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
  };

  const handleFiles = useCallback(async (fileList) => {
    setUploadError(null);
    const files = Array.from(fileList);
    for (const file of files) {
      try {
        const { name, geojson } = await parseGeoFile(file);
        if (!geojson?.features?.length) {
          setUploadError(`"${file.name}" tidak berisi fitur geometri yang bisa dibaca.`);
          continue;
        }
        const geometryType = inferGeometryType(geojson);
        const id = `upload-${Date.now()}-${Math.round(Math.random() * 1000)}`;
        const color = UPLOAD_COLOR_PALETTE[uploadedLayersRef.current.length % UPLOAD_COLOR_PALETTE.length];
        const newLayer = { id, name, category: 'Informasi Tambahan', geometryType, color, data: geojson, isUpload: true };
        setUploadedLayers((prev) => [...prev, newLayer]);
        setActiveLayers((prev) => ({ ...prev, [id]: true }));

        // Auto zoom ke layer yang baru masuk — respons LANGSUNG kelihatan,
        // dan ini juga yang paling sering jadi penyebab "layer ku kok
        // ga muncul": kontennya berhasil ditambahkan, tapi koordinatnya
        // di luar area yang lagi kelihatan di peta (terutama kalau file
        // testing pakai contoh koordinat dari lokasi lain).
        zoomToBounds(getGeoJSONBounds(geojson));
      } catch (err) {
        console.error('Gagal parse file drop:', err);
        setUploadError(err.message || `Gagal membaca "${file.name}".`);
      }
    }
  }, [zoomToBounds]);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files?.length) handleFiles(e.dataTransfer.files);
  }, [handleFiles]);

  const handleDragOver = (e) => { e.preventDefault(); setIsDragOver(true); };
  const handleDragLeave = (e) => { e.preventDefault(); setIsDragOver(false); };

  return {
    mapContainerRef,
    mapInstance,
    bearing,
    mapError,
    isDragOver,
    uploadError,
    activeLayers,
    uploadedLayers,
    showRoutePrediction,
    basemapId,
    setBasemapId,
    layerOpacity,
    setLayerOpacity,
    layersByCategory,
    toggleLayer,
    toggleRoutePrediction,
    removeUploadedLayer,
    handleFiles,
    handleDrop,
    handleDragOver,
    handleDragLeave,
    zoomToBounds,
  };
}
