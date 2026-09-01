import { useEffect, useRef, useState } from 'react';

// Primitif "leader-line callout" — kartu detail yang didok di pinggir
// peta, dihubungkan garis putus-putus ke fitur yang diklik di peta.
// Dipakai gantikan popup native MapLibre yang sebelumnya menutupi
// sebagian peta (Object Inspector waktu klik polygon studi-kasus, foto
// PoD waktu klik titik) — lihat useMapEngine.js untuk sisi callback-nya.
//
// `side`: 'right' | 'left' — nentuin di pinggir mana kartu didok DAN
// dari sisi mana garis leader-nya keluar dari kartu, supaya dua callout
// (Object Inspector di kanan, foto PoD di kiri) bisa muncul bersamaan
// tanpa saling tumpuk.
export default function MapCallout({ map, targetLngLat, side = 'right', onClose, children }) {
  const [point, setPoint] = useState(null);
  const containerRef = useRef(null);

  useEffect(() => {
    if (!map || !targetLngLat) return;

    const update = () => {
      const container = map.getContainer();
      const p = map.project(targetLngLat);
      setPoint({ x: p.x, y: p.y, width: container.clientWidth, height: container.clientHeight });
    };
    update();
    map.on('move', update);
    return () => map.off('move', update);
  }, [map, targetLngLat]);

  if (!point) return null;

  // Satu patahan SAJA, ditaruh DEKAT KARTU (bukan dekat fitur di peta) —
  // segmen pertama diagonal panjang dari fitur menuju kartu, segmen
  // kedua pendek & mendatar tepat di sebelah kartu, gaya anotasi peta
  // intelijen (bukan garis lurus polos).
  const cardEdgeX = side === 'right' ? point.width - 16 : 16;
  const elbowOffset = 28;
  const elbowX = side === 'right' ? cardEdgeX - elbowOffset : cardEdgeX + elbowOffset;
  const clampedY = Math.max(24, Math.min(point.height - 24, point.y));

  return (
    <>
      <svg className="map-callout__svg" width={point.width} height={point.height}>
        <path
          d={`M ${point.x} ${point.y} L ${elbowX} ${clampedY} L ${cardEdgeX} ${clampedY}`}
          className="map-callout__line"
        />
        <circle cx={point.x} cy={point.y} r="4" className="map-callout__anchor" />
      </svg>
      <div
        ref={containerRef}
        className={`map-callout map-callout--${side}`}
        style={{ top: `${clampedY}px` }}
      >
        <button type="button" className="map-callout__close" onClick={onClose} aria-label="Tutup">×</button>
        {children}
      </div>
    </>
  );
}
