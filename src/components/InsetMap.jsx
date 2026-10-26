// src/components/InsetMap.jsx
//
// Peta sisipan (inset/locator map) — elemen kartografi standar,
// sejajar perannya dengan mata angin/skala/legend/sumber citra: bukan
// buat dieksplorasi, cuma referensi orientasi "area yang lagi
// ditampilkan peta utama itu di mana sih, dalam konteks yang lebih
// luas". Nunjukin konteks region yang lebih lebar (zoom keluar jauh),
// dengan KOTAK yang mewakili viewport peta utama — kotaknya update
// REAL-TIME ikut peta utama digeser/di-zoom (lihat useEffect kedua).
//
// Ini peta MapLibre KEDUA yang sungguhan (bukan gambar statis) — kecil,
// non-interaktif, basemap sama seperti peta utama.

import { useEffect, useRef, useState } from 'react';
import maplibregl from 'maplibre-gl';
import { mapStyle } from '../mapStyle.js';
import { C } from '../theme.js';

// TODO: sesuaikan kalau area fokus utama berubah signifikan dari
// Sajingan Besar. Zoom SENGAJA jauh lebih rendah dari peta utama —
// tujuannya nunjukin "ini di mana" secara geografis (kelihatan bentuk
// Pulau Kalimantan), bukan detail wilayah sekitar.
const INSET_CENTER = [109.05, 1.35];
const INSET_ZOOM = 5;

export default function InsetMap({ mainMap, hidden }) {
  const containerRef = useRef(null);
  const insetMapRef = useRef(null);
  const [insetReady, setInsetReady] = useState(false);

  // Setup peta inset — sekali saja.
  useEffect(() => {
    if (!containerRef.current || insetMapRef.current) return;

    const inset = new maplibregl.Map({
      container: containerRef.current,
      style: mapStyle,
      center: INSET_CENTER,
      zoom: INSET_ZOOM,
      interactive: false,
      attributionControl: false,
    });

    inset.on('load', () => {
      inset.addSource('inset-viewport-box', {
        type: 'geojson',
        data: { type: 'FeatureCollection', features: [] },
      });
      inset.addLayer({
        id: 'inset-viewport-fill',
        type: 'fill',
        source: 'inset-viewport-box',
        paint: { 'fill-color': C.accent, 'fill-opacity': 0.2 },
      });
      inset.addLayer({
        id: 'inset-viewport-line',
        type: 'line',
        source: 'inset-viewport-box',
        paint: { 'line-color': C.accent, 'line-width': 1.5 },
      });
      setInsetReady(true);
    });

    insetMapRef.current = inset;
    return () => {
      inset.remove();
      insetMapRef.current = null;
      setInsetReady(false);
    };
  }, []);

  // Update kotak viewport tiap kali peta UTAMA gerak/zoom.
  useEffect(() => {
    if (!mainMap || !insetReady) return;

    const updateBox = () => {
      const inset = insetMapRef.current;
      const source = inset?.getSource('inset-viewport-box');
      if (!source) return;

      const bounds = mainMap.getBounds();
      const box = {
        type: 'Feature',
        properties: {},
        geometry: {
          type: 'Polygon',
          coordinates: [[
            [bounds.getWest(), bounds.getSouth()],
            [bounds.getEast(), bounds.getSouth()],
            [bounds.getEast(), bounds.getNorth()],
            [bounds.getWest(), bounds.getNorth()],
            [bounds.getWest(), bounds.getSouth()],
          ]],
        },
      };
      source.setData({ type: 'FeatureCollection', features: [box] });
    };

    // 'move' bisa nembak PULUHAN kali per detik waktu peta utama
    // di-drag — tanpa throttle, setiap event itu langsung trigger
    // setData() (operasi berat) di peta inset, ikut nyumbang ke lag
    // yang dilaporkan. rAF-coalescing ini gabungkan semua 'move' yang
    // numpuk dalam satu frame jadi CUMA SATU setData, bukan hilangkan
    // update-nya — kotaknya tetap ikut real-time, cuma tidak dobel
    // kerja per frame yang sama.
    let rafId = null;
    const scheduleUpdate = () => {
      if (rafId) return;
      rafId = requestAnimationFrame(() => {
        rafId = null;
        updateBox();
      });
    };

    mainMap.on('move', scheduleUpdate);
    updateBox();
    return () => {
      mainMap.off('move', scheduleUpdate);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [mainMap, insetReady]);

  return (
    <div className={`inset-map ${hidden ? 'inset-map--hidden' : ''}`}>
      <div ref={containerRef} className="inset-map__canvas" />
    </div>
  );
}
