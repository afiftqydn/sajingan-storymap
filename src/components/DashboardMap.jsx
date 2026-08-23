import { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { mapStyle } from '../mapStyle.js';
import { LAYER_CATALOG, LAYER_CATEGORIES } from '../data/layers.js';
import { loadMapIcons, iconImageId } from '../utils/mapIcons.js';
import { parseGeoFile, inferGeometryType } from '../utils/parseGeoFile.js';
import { getGeoJSONBounds } from '../utils/geojsonBounds.js';
import { routePoints } from '../data/routes.js';
import MapOverlayStack from './MapOverlayStack.jsx';
import RouteAnimationLayer from './RouteAnimationLayer.jsx';

// Warna dirotasi buat layer hasil drag-and-drop (bukan dari LAYER_CATALOG,
// jadi tidak ada warna yang sudah ditentukan manual per layer).
const UPLOAD_COLOR_PALETTE = ['#8a5cc4', '#e0796b', '#5cc48a', '#c4a45c', '#5c8ac4', '#c45c9e'];

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
function addMapLayer(map, layer, visible, popupRef, clickHandlers, failedIcons) {
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
    map.addLayer({
      id: `${layer.id}-fill`, type: 'fill', source: layer.id,
      layout: { visibility: vis },
      paint: { 'fill-color': layer.color, 'fill-opacity': fillOpacity },
    });
    map.addLayer({
      id: `${layer.id}-line`, type: 'line', source: layer.id,
      layout: { visibility: vis },
      paint: { 'line-color': layer.color, 'line-width': lineWidth },
    });
    const handler = (e) => {
      const f = e.features[0];
      const name = f.properties.name ?? layer.name;
      const areaHa = f.properties.areaHa ?? '—';
      popupRef.current.setLngLat(e.lngLat).setHTML(`<strong>${name}</strong><br/>Luas: ${areaHa} ha`).addTo(map);
    };
    map.on('click', `${layer.id}-fill`, handler);
    clickHandlers?.set(`${layer.id}-fill`, handler);
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
        },
      });
    }
    const handler = (e) => {
      const f = e.features[0];
      const name = f.properties.name ?? layer.name;
      // Cuma titik yang punya `photo` di properties-nya (sekarang: PoD
      // saja, lihat layers.js) yang nampilin foto — Mills tidak punya
      // field ini, jadi photoHtml otomatis kosong buat mereka.
      const photo = f.properties.photo;
      const photoHtml = photo
        ? `<img src="${photo}" alt="${name}" style="width:220px;height:130px;object-fit:cover;border-radius:6px;margin-top:6px;display:block;" />`
        : '';
      popupRef.current.setLngLat(e.lngLat).setHTML(`<strong>${name}</strong>${photoHtml}`).addTo(map);
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

function setMapLayerVisibility(map, id, visible) {
  ['fill', 'line', 'point', 'icon'].forEach((suffix) => {
    const layerId = `${id}-${suffix}`;
    if (map.getLayer(layerId)) {
      map.setLayoutProperty(layerId, 'visibility', visible ? 'visible' : 'none');
    }
  });
}

export default function DashboardMap() {
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const popupRef = useRef(null);
  // layerId -> handler function, dipakai buat unbind click listener
  // dengan benar waktu layer upload dihapus (lihat removeUploadedLayer).
  const clickHandlersRef = useRef(new Map());
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
    Object.fromEntries(LAYER_CATALOG.map((l) => [l.id, l.category === 'AOI']))
  );
  // Layer hasil drag-and-drop user — masuk kategori "Informasi Tambahan".
  const [uploadedLayers, setUploadedLayers] = useState([]);
  const uploadedLayersRef = useRef(uploadedLayers);
  uploadedLayersRef.current = uploadedLayers;

  const [showRoutePrediction, setShowRoutePrediction] = useState(false);

  // Semua kategori DEFAULT TERBUKA — tinggi panel yang scroll penuh
  // ke bawah bukan masalah (sudah dikonfirmasi user). Collapse tetap
  // ada sebagai opsi manual (klik header kategori) buat yang mau
  // meringkas, tapi tidak dipaksa collapse dari awal.
  const [collapsedCategories, setCollapsedCategories] = useState(() => new Set());
  // Khusus mobile (≤640px, lihat App.css): panel legend/layer DEFAULT
  // tertutup total (cuma tombol kecil kelihatan) — beda dari desktop
  // yang selalu tampil. Di layar lebar, state ini diabaikan (CSS media
  // query yang nentuin, bukan JS) — jadi aman biar default false di sini.
  const [mobilePanelOpen, setMobilePanelOpen] = useState(false);
  const toggleCategoryCollapse = (category) => {
    setCollapsedCategories((prev) => {
      const next = new Set(prev);
      if (next.has(category)) next.delete(category);
      else next.add(category);
      return next;
    });
  };

  // LAYER_CATALOG itu data statis (import, tidak pernah berubah) —
  // sebelumnya di-.filter() DUA KALI per kategori di dalam render loop
  // (sekali buat render checkbox, sekali lagi buat hitung activeCount)
  // = 10 kali scan array tiap render untuk 5 kategori. Dikelompokkan
  // sekali di sini, dipakai ulang di bawah.
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
        center: [109.05, 1.35],
        zoom: 9.5,
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
      LAYER_CATALOG.forEach((layer) => {
        if (!layer.data) return;
        addMapLayer(map, layer, !!activeLayers[layer.id], popupRef, clickHandlersRef.current, failedIconsRef.current);
      });
      // Kalau ada layer upload yang masuk SEBELUM peta selesai load
      // (jarang, tapi jaga-jaga), tambahkan juga di sini.
      uploadedLayersRef.current.forEach((layer) => addMapLayer(map, layer, true, popupRef, clickHandlersRef.current, failedIconsRef.current));
    });

    mapRef.current = map;
    setMapInstance(map);
    return () => {
      map.remove();
      mapRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !map.isStyleLoaded()) return;
    // BUG SEBELUMNYA: effect ini cuma loop LAYER_CATALOG — layer hasil
    // upload TIDAK PERNAH ikut di-update visibility-nya di peta setelah
    // pertama kali ditambahkan. Efeknya: uncheck layer upload, state
    // React berubah (checkbox keliatan mati), tapi peta tidak pernah
    // dikasih tahu, jadi polygon-nya tetap kelihatan selamanya.
    [...LAYER_CATALOG, ...uploadedLayers].forEach((layer) =>
      setMapLayerVisibility(map, layer.id, !!activeLayers[layer.id])
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
        addMapLayer(map, layer, !!activeLayers[layer.id], popupRef, clickHandlersRef.current, failedIconsRef.current);
      } catch (err) {
        // Sebelumnya error di sini diam-diam cuma masuk console —
        // gejalanya persis "badge upload muncul, tapi layer tidak
        // tampil di peta" tanpa penjelasan. Sekarang errornya
        // ditampilkan ke user.
        console.error(`Gagal render layer "${layer.name}":`, err);
        setUploadError(`Layer "${layer.name}" gagal ditampilkan di peta: ${err.message || err}`);
      }
    });
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
  const zoomToBounds = (bounds) => {
    if (bounds && mapRef.current) {
      mapRef.current.fitBounds(bounds, { padding: 80, duration: 350, maxZoom: 16 });
    }
  };

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
  const toggleLayer = (id) => {
    const nextValue = !activeLayers[id];
    setActiveLayers((prev) => ({ ...prev, [id]: nextValue }));

    if (nextValue && mapRef.current) {
      const layer = LAYER_CATALOG.find((l) => l.id === id) ?? uploadedLayersRef.current.find((l) => l.id === id);
      if (layer?.data) {
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
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files?.length) handleFiles(e.dataTransfer.files);
  }, [handleFiles]);

  const handleDragOver = (e) => { e.preventDefault(); setIsDragOver(true); };
  const handleDragLeave = (e) => { e.preventDefault(); setIsDragOver(false); };

  return (
    <div
      className={`dashboard-map ${isDragOver ? 'dashboard-map--drag-over' : ''}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {mapError ? (
        <div className="map-controller__fallback">
          <p>Peta tidak bisa dimuat di perangkat/browser ini.</p>
          <p className="map-controller__fallback-detail">{String(mapError?.message || mapError)}</p>
        </div>
      ) : (
        <>
          <div ref={mapContainerRef} className="dashboard-map__canvas" />

          <RouteAnimationLayer map={mapInstance} active={showRoutePrediction} />

          <MapOverlayStack map={mapInstance} bearing={bearing} embedded showInset />

          {isDragOver && (
            <div className="dashboard-map__dropzone-hint">
              Lepas file .geojson / .json / .shp / .zip di sini
            </div>
          )}

          {/* Tombol ini CUMA kelihatan di mobile (lihat CSS) — di
              desktop panel selalu tampil, tombol ini disembunyikan. */}
          <button
            type="button"
            className="dashboard-map__panel-toggle"
            onClick={() => setMobilePanelOpen((v) => !v)}
            aria-expanded={mobilePanelOpen}
          >
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 6h16M4 12h16M4 18h16" strokeLinecap="round" />
            </svg>
            Layer
          </button>

          <div className={`dashboard-map__layer-panel ${mobilePanelOpen ? 'is-open-mobile' : ''}`}>
            <div className="dashboard-map__panel-header">
              <span className="map-legend__title">Legenda & Layer</span>
              {/* Tombol tutup ini SENGAJA ditaruh DI DALAM panel, bukan
                  cuma andalkan tombol toggle di luar — begitu panel
                  terbuka, dia MENUTUPI tombol toggle-nya sendiri
                  (posisi & ukurannya sama), jadi tanpa tombol ini,
                  panel bisa dibuka tapi tidak ada cara menutupnya lagi
                  di mobile. Cuma kelihatan di layar sempit (CSS). */}
              <button
                type="button"
                className="dashboard-map__panel-close"
                onClick={() => setMobilePanelOpen(false)}
                aria-label="Tutup panel layer"
              >
                ×
              </button>
            </div>
            {LAYER_CATEGORIES.map((category) => {
              const isCollapsed = collapsedCategories.has(category);
              const categoryLayers = (layersByCategory[category] ?? []).filter((l) => !l.hiddenFromPanel);
              const activeCount = categoryLayers.filter((l) => activeLayers[l.id]).length
                + (category === 'Informasi Tambahan' ? uploadedLayers.filter((l) => activeLayers[l.id]).length : 0)
                + (category === 'Supply Chain' && showRoutePrediction ? 1 : 0);
              return (
              <div key={category} className="dashboard-map__category">
                <button
                  type="button"
                  className="dashboard-map__category-label"
                  onClick={() => toggleCategoryCollapse(category)}
                  aria-expanded={!isCollapsed}
                >
                  <span className={`dashboard-map__chevron ${isCollapsed ? '' : 'is-open'}`}>▸</span>
                  {category}
                  {activeCount > 0 && <span className="dashboard-map__active-count">{activeCount}</span>}
                </button>
                {!isCollapsed && (
                <>
                {categoryLayers.map((layer) => (
                  <label key={layer.id} className="dashboard-map__checkbox">
                    <input
                      type="checkbox"
                      checked={!!activeLayers[layer.id]}
                      onChange={() => toggleLayer(layer.id)}
                    />
                    <span
                      className={`map-legend__swatch map-legend__swatch--${layer.geometryType === 'line' ? 'line' : 'fill'}`}
                      style={
                        layer.geometryType === 'line'
                          ? { borderColor: layer.color }
                          : { background: layer.color }
                      }
                    />
                    {layer.name}
                    {!layer.data && <span className="dashboard-map__dummy-badge">dummy</span>}
                  </label>
                ))}

                {/* Layer hasil drag-and-drop — cuma tampil di kategori
                    Informasi Tambahan, sesuai permintaan. */}
                {category === 'Informasi Tambahan' && uploadedLayers.map((layer) => (
                  <div key={layer.id} className="dashboard-map__checkbox dashboard-map__checkbox--upload">
                    <label>
                      <input
                        type="checkbox"
                        checked={!!activeLayers[layer.id]}
                        onChange={() => toggleLayer(layer.id)}
                      />
                      <span
                        className={`map-legend__swatch map-legend__swatch--${layer.geometryType === 'line' ? 'line' : 'fill'}`}
                        style={
                          layer.geometryType === 'line'
                            ? { borderColor: layer.color }
                            : { background: layer.color }
                        }
                      />
                      {layer.name}
                      <span className="dashboard-map__upload-badge">upload</span>
                    </label>
                    <button
                      className="dashboard-map__remove-btn"
                      onClick={() => removeUploadedLayer(layer.id)}
                      aria-label={`Hapus layer ${layer.name}`}
                      title="Hapus layer ini"
                    >
                      ×
                    </button>
                  </div>
                ))}

                {category === 'Supply Chain' && (
                  <label className="dashboard-map__checkbox">
                    <input
                      type="checkbox"
                      checked={showRoutePrediction}
                      onChange={toggleRoutePrediction}
                    />
                    <span className="map-legend__swatch map-legend__swatch--fill" style={{ background: '#ff5a3c' }} />
                    Prediksi Supply Chain
                    <span className="dashboard-map__dummy-badge">dummy</span>
                  </label>
                )}
                </>
                )}
              </div>
              );
            })}

            <div className="dashboard-map__upload-hint">
              Tarik file .geojson / .shp / .zip ke peta untuk menambah
              layer sendiri di "Informasi Tambahan".
            </div>
            {uploadError && <p className="dashboard-map__upload-error">{uploadError}</p>}
          </div>
        </>
      )}
    </div>
  );
}
