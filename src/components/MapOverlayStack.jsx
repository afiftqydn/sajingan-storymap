// src/components/MapOverlayStack.jsx
//
// DUA grup overlay kartografi, terpisah pojok:
// - Kanan-ATAS: mata angin → skala → inset map (opsional, lihat showInset)
// - Kanan-BAWAH: legend (opsional) → sumber citra
//
// Dipakai di kedua peta (Storymap & Peta Interaktif) supaya posisi dan
// urutannya konsisten.
//
// `legendItems` opsional — di tab Peta Interaktif, legend sudah
// terwakili oleh panel layer di kiri, jadi cukup kirim tanpa prop ini
// (grup kanan-bawah otomatis cuma berisi sumber citra saja).
//
// `showInset` juga opsional — inset map cuma diminta buat tab Storymap,
// JADI JANGAN nyalakan prop ini di DashboardMap.jsx (Peta Interaktif)
// kecuali memang diminta juga di sana nanti.

import MapScaleBar from './MapScaleBar.jsx';
import MapLegend from './MapLegend.jsx';
import InsetMap from './InsetMap.jsx';
import { imagerySource } from '../mapStyle.js';

export default function MapOverlayStack({ map, bearing, legendItems, embedded = false, showInset = false, insetHidden = false }) {
  const embeddedClass = embedded ? 'map-overlay--embedded' : '';

  return (
    <>
      <div className={`map-overlay-top ${embeddedClass}`}>
        <div
          className="map-north-arrow"
          style={{ transform: `rotate(${-bearing}deg)` }}
          aria-label="Arah utara"
        >
          <svg viewBox="0 0 32 40" width="26" height="32">
            <polygon points="16,0 24,32 16,24 8,32" fill="currentColor" />
            <text x="16" y="8" textAnchor="middle" fontSize="10" className="map-north-arrow__label" fontWeight="700">N</text>
          </svg>
        </div>
        <MapScaleBar map={map} />
        {showInset && <InsetMap mainMap={map} hidden={insetHidden} />}
      </div>

      <div className={`map-overlay-bottom ${embeddedClass}`}>
        {legendItems && legendItems.length > 0 && <MapLegend items={legendItems} />}
        <div className="map-source-badge">
          <div>Citra satelit: {imagerySource.name} ({imagerySource.year})</div>
          <div className="map-source-badge__provider">© {imagerySource.provider}</div>
        </div>
      </div>
    </>
  );
}
