// src/components/RouteAnimationLayer.jsx
//
// Layer animasi rantai pasok — titik lokasi kasus (pulsing alert),
// garis rute (dash "mengalir"), dan titik kecil yang BERJALAN di
// sepanjang tiap chain.
//
// SENGAJA TIDAK gambar titik mill/dealer sendiri di sini — itu tugas
// layer "Mills Terdekat"/"PoD Terdekat" (ikon SVG asli, ada di
// LAYER_CATALOG/layers.js). Toggle "Prediksi Supply Chain" di
// DashboardMap.jsx OTOMATIS ikut nyalakan dua layer itu ("connect"
// ke Mills & PoD) — jadi endpoint rute yang kelihatan selalu ikon
// asli yang sama, bukan titik generik terpisah yang bisa beda posisi/
// gaya dari sumber data yang sama.
//
// Dipasang/dilepas otomatis lewat prop `active` — waktu chapter aktif
// bukan 'pre-harvest-alert', semua source/layer dibongkar total (bukan
// cuma disembunyikan), supaya tidak ada kerja animasi sia-sia waktu
// tidak kelihatan.

import { useEffect, useRef } from 'react';
import { routePoints, routeChains } from '../data/routes.js';
import { createPathInterpolator } from '../utils/interpolateAlongPath.js';

const SOURCE_LINES = 'route-lines';
const SOURCE_ALERT = 'route-case-alert';
const SOURCE_TRAVELERS = 'route-travelers';

// Pola dash yang di-cycle tiap frame — teknik standar buat efek garis
// "mengalir" di MapLibre/Mapbox (bukan CSS animation, karena ini
// digambar di WebGL canvas, bukan DOM).
const DASH_SEQUENCE = [
  [0, 4, 3], [0.5, 4, 2.5], [1, 4, 2], [1.5, 4, 1.5], [2, 4, 1], [2.5, 4, 0.5],
  [3, 4, 0], [0, 0.5, 3, 3.5], [0, 1, 3, 3], [0, 1.5, 3, 2.5], [0, 2, 3, 2],
  [0, 2.5, 3, 1.5], [0, 3, 3, 1], [0, 3.5, 3, 0.5],
];

function pointById(id) {
  return routePoints.find((p) => p.id === id);
}

// Gabungkan koordinat semua titik dalam satu chain jadi satu polyline.
function chainCoordinates(chain) {
  return chain.pointIds.map((id) => pointById(id)?.coords).filter(Boolean);
}

function buildCaseAlertGeoJSON() {
  return {
    type: 'FeatureCollection',
    features: routePoints
      .filter((p) => p.type === 'case')
      .map((p) => ({
        type: 'Feature',
        properties: { label: p.label },
        geometry: { type: 'Point', coordinates: p.coords },
      })),
  };
}

function buildLinesGeoJSON() {
  // SATU FITUR PER SEGMEN (bukan satu polyline per chain) — supaya
  // tiap segmen (kasus→mill, mill→PoD) bisa punya label jarak sendiri-
  // sendiri. Visualnya tetap sama (segmen-segmen yang bersambung
  // kelihatan seperti satu garis utuh), cuma datanya lebih granular.
  return {
    type: 'FeatureCollection',
    features: routeChains.flatMap((chain) =>
      (chain.segments ?? []).map((seg, i) => {
        const fromPoint = pointById(chain.pointIds[i]);
        const toPoint = pointById(chain.pointIds[i + 1]);
        if (!fromPoint || !toPoint) return null;
        return {
          type: 'Feature',
          properties: { distanceLabel: `${seg.distanceKm.toFixed(1)} km` },
          geometry: { type: 'LineString', coordinates: [fromPoint.coords, toPoint.coords] },
        };
      }).filter(Boolean)
    ),
  };
}

export default function RouteAnimationLayer({ map, active }) {
  const rafRef = useRef(null);
  const mountedRef = useRef(false);

  useEffect(() => {
    if (!map) return;

    const setup = () => {
      if (mountedRef.current) return;
      mountedRef.current = true;

      map.addSource(SOURCE_LINES, { type: 'geojson', data: buildLinesGeoJSON() });
      map.addSource(SOURCE_ALERT, { type: 'geojson', data: buildCaseAlertGeoJSON() });
      map.addSource(SOURCE_TRAVELERS, {
        type: 'geojson',
        data: { type: 'FeatureCollection', features: [] },
      });

      // Garis rute — dash dianimasikan tiap frame (lihat animate()).
      map.addLayer({
        id: 'route-lines-layer',
        type: 'line',
        source: SOURCE_LINES,
        paint: {
          'line-color': '#e0c14d',
          'line-width': 2,
          'line-opacity': 0.85,
          'line-dasharray': DASH_SEQUENCE[0],
        },
      });

      // Label jarak (km) — ditaruh di tengah tiap segmen garis.
      // Jaraknya dihitung ASLI pakai Haversine di routes.js, bukan
      // taksiran — angka ini yang dilihat audience buat tahu "berapa
      // jauh sih dari kasus ini ke mill/dealer terdekat".
      map.addLayer({
        id: 'route-distance-label',
        type: 'symbol',
        source: SOURCE_LINES,
        layout: {
          'symbol-placement': 'line-center',
          'text-field': ['get', 'distanceLabel'],
          'text-font': ['Open Sans Regular'],
          'text-size': 11,
        },
        paint: {
          'text-color': '#f2f0e8',
          'text-halo-color': '#0a0f0c',
          'text-halo-width': 1.4,
        },
      });

      // Titik kasus — ring luar pulsing (radius+opacity dianimasikan)
      // + titik inti statis, meniru "CASE ALERT" di referensi.
      map.addLayer({
        id: 'route-case-alert-ring',
        type: 'circle',
        source: SOURCE_ALERT,
        paint: {
          'circle-radius': 8,
          'circle-color': '#ff5a3c',
          'circle-opacity': 0.35,
          'circle-stroke-width': 0,
        },
      });
      map.addLayer({
        id: 'route-case-alert-core',
        type: 'circle',
        source: SOURCE_ALERT,
        paint: {
          'circle-radius': 5,
          'circle-color': '#ff5a3c',
          'circle-stroke-width': 1.5,
          'circle-stroke-color': '#0a0f0c',
        },
      });
      map.addLayer({
        id: 'route-case-alert-label',
        type: 'symbol',
        source: SOURCE_ALERT,
        layout: {
          'text-field': ['get', 'label'],
          'text-font': ['Open Sans Regular'],
          'text-size': 11,
          'text-offset': [0, -1.4],
          'text-anchor': 'bottom',
        },
        paint: {
          'text-color': '#ff5a3c',
          'text-halo-color': '#0a0f0c',
          'text-halo-width': 1.2,
        },
      });

      // Titik kecil yang berjalan di sepanjang tiap chain.
      map.addLayer({
        id: 'route-travelers-layer',
        type: 'circle',
        source: SOURCE_TRAVELERS,
        paint: {
          'circle-radius': 4,
          'circle-color': '#f2f0e8',
          'circle-stroke-width': 1,
          'circle-stroke-color': '#e0c14d',
        },
      });

      startAnimation();
    };

    const teardown = () => {
      if (!mountedRef.current) return;
      mountedRef.current = false;
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = null;

      [
        'route-travelers-layer',
        'route-case-alert-label',
        'route-case-alert-core',
        'route-case-alert-ring',
        'route-distance-label',
        'route-lines-layer',
      ].forEach((id) => {
        if (map.getLayer(id)) map.removeLayer(id);
      });
      [SOURCE_TRAVELERS, SOURCE_ALERT, SOURCE_LINES].forEach((id) => {
        if (map.getSource(id)) map.removeSource(id);
      });
    };

    const startAnimation = () => {
      const startTime = performance.now();
      // Precompute SEKALI — bukan hitung ulang jarak kumulatif tiap
      // frame (lihat interpolateAlongPath.js untuk penjelasan lengkap).
      const chainInterpolators = routeChains.map((chain) => createPathInterpolator(chainCoordinates(chain)));
      let lastDashIndex = -1; // buat deteksi "beneran berubah" (lihat di bawah)
      let lastTravelerUpdate = 0;
      // `setData` JAUH lebih berat daripada `setPaintProperty` (dia
      // trigger re-proses ulang GeoJSON di internal MapLibre, bukan
      // cuma ganti nilai style). 30fps di sini SECARA VISUAL nyaris
      // tidak beda dari 60fps (titiknya bergerak pelan), tapi beban
      // kerja MapLibre turun separuh — ini penyebab utama animasi
      // kerasa "lag, tidak realtime" sebelumnya.
      const TRAVELER_UPDATE_INTERVAL = 33;

      const tick = (now) => {
        if (!mountedRef.current) return;
        const elapsed = now - startTime;

        // Dash "mengalir" — pola-nya cuma ganti tiap ~60ms, TAPI frame
        // animasi jalan tiap ~16ms (60fps). Tanpa guard ini,
        // setPaintProperty terpanggil di SETIAP frame walau nilainya
        // 3-4x berturut-turut sama persis — kerja MapLibre sia-sia.
        // Guard `dashIndex !== lastDashIndex` cuma panggil setPaintProperty
        // pas nilainya BENERAN beda.
        const dashIndex = Math.floor(elapsed / 60) % DASH_SEQUENCE.length;
        if (dashIndex !== lastDashIndex) {
          if (map.getLayer('route-lines-layer')) {
            map.setPaintProperty('route-lines-layer', 'line-dasharray', DASH_SEQUENCE[dashIndex]);
          }
          lastDashIndex = dashIndex;
        }

        // Ring pulsing di titik kasus — radius & opacity naik-turun tiap
        // ~1.6 detik. Ini TETAP di-update tiap frame (bukan di-throttle
        // seperti traveler) karena setPaintProperty jauh lebih murah
        // daripada setData, dan pulsing butuh mulus di 60fps.
        const pulsePhase = (elapsed % 1600) / 1600; // 0 → 1
        const pulseRadius = 8 + pulsePhase * 14;
        const pulseOpacity = 0.4 * (1 - pulsePhase);
        if (map.getLayer('route-case-alert-ring')) {
          map.setPaintProperty('route-case-alert-ring', 'circle-radius', pulseRadius);
          map.setPaintProperty('route-case-alert-ring', 'circle-opacity', pulseOpacity);
        }

        // Titik berjalan — di-throttle ke ~30fps (lihat TRAVELER_UPDATE_INTERVAL).
        if (now - lastTravelerUpdate >= TRAVELER_UPDATE_INTERVAL) {
          lastTravelerUpdate = now;
          const travelDuration = 4000;
          const travelerFeatures = chainInterpolators.map((interpolate, i) => {
            const t = ((elapsed + i * 400) % travelDuration) / travelDuration;
            const pos = interpolate(t) ?? [0, 0];
            return { type: 'Feature', properties: {}, geometry: { type: 'Point', coordinates: pos } };
          });
          const travelersSource = map.getSource(SOURCE_TRAVELERS);
          if (travelersSource) {
            travelersSource.setData({ type: 'FeatureCollection', features: travelerFeatures });
          }
        }

        rafRef.current = requestAnimationFrame(tick);
      };

      rafRef.current = requestAnimationFrame(tick);
    };

    if (active) {
      if (map.isStyleLoaded()) {
        setup();
      } else {
        map.once('load', setup);
      }
    } else {
      teardown();
    }

    return () => {
      teardown();
    };
  }, [map, active]);

  return null;
}
