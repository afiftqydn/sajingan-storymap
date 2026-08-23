// src/components/MapScaleBar.jsx
//
// Skala kustom — BUKAN maplibregl.ScaleControl bawaan. Alasannya: control
// bawaan MapLibre selalu nempel di salah satu dari 4 sudut TETAP milik
// MapLibre sendiri, terpisah dari elemen React kita (mata angin, legend,
// sumber citra) — itu yang bikin dia gampang tumpang tindih/rebutan sudut.
// Dengan bikin sendiri, skala jadi elemen React biasa yang bisa disusun
// dalam SATU kolom bersama tiga lainnya, urutannya presisi terkontrol.
//
// Rumus jarak: proyeksi Web Mercator standar (sama yang dipakai basemap
// ini) — meter per pixel = 156543.03392 * cos(lat) / 2^zoom.

import { useEffect, useState } from 'react';

const NICE_METERS = [
  1, 2, 5, 10, 20, 25, 50, 100, 200, 250, 500,
  1000, 2000, 2500, 5000, 10000, 20000, 25000, 50000,
  100000, 200000, 250000, 500000, 1000000,
];

function computeScale(map, targetPx = 90) {
  if (!map) return null;
  const center = map.getCenter();
  const zoom = map.getZoom();
  const metersPerPixel =
    (156543.03392 * Math.cos((center.lat * Math.PI) / 180)) / Math.pow(2, zoom);
  const maxMeters = metersPerPixel * targetPx;

  let chosen = NICE_METERS[0];
  for (const v of NICE_METERS) {
    if (v <= maxMeters) chosen = v;
    else break;
  }
  const widthPx = chosen / metersPerPixel;
  const label = chosen >= 1000 ? `${chosen / 1000} km` : `${chosen} m`;
  return { widthPx, label };
}

export default function MapScaleBar({ map }) {
  const [scale, setScale] = useState(null);

  useEffect(() => {
    if (!map) return;
    const update = () => setScale(computeScale(map));
    update();
    map.on('zoom', update);
    map.on('move', update);
    return () => {
      map.off('zoom', update);
      map.off('move', update);
    };
  }, [map]);

  if (!scale) return null;

  return (
    <div className="map-scale-bar">
      <div className="map-scale-bar__bar" style={{ width: `${scale.widthPx}px` }} />
      <span className="map-scale-bar__label">{scale.label}</span>
    </div>
  );
}
