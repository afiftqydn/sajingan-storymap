// src/components/MapLegend.jsx
//
// Legend kartografi — generic, dipakai di MapController (tab Storymap)
// dan DashboardMap (tab Peta Interaktif). Prinsip: legend HARUS
// mencerminkan apa yang benar-benar tampil di peta saat itu — bukan
// daftar statis yang tidak berubah. Makanya komponen ini menerima
// `items` sebagai prop, bukan hardcode di dalam.
//
// `type` per item: 'fill' (kotak solid — dipakai untuk area yang
// di-highlight) atau 'line' (kotak outline saja — dipakai untuk batas
// administrasi, bukan area yang "jadi bukti").

import { useState } from 'react';

// `collapsible` (opsional, default false — MapController.jsx di
// Storymap TIDAK mengoper prop ini, perilakunya tetap sama persis
// seperti sebelum: selalu terbuka, tanpa tombol toggle). Peta
// Interaktif mengoper `collapsible` saja (bukan `defaultCollapsed`) —
// legend dapat tombol toggle tapi default-nya tetap TERBUKA, kebalikan
// dari LayerPanel (lihat LayerPanel.jsx) yang justru default collapsed.
export default function MapLegend({ items, title = 'Legenda', collapsible = false, defaultCollapsed = false }) {
  const [collapsed, setCollapsed] = useState(collapsible && defaultCollapsed);
  if (!items || items.length === 0) return null;

  if (!collapsible) {
    return (
      <div className="map-legend">
        <span className="map-legend__title">{title}</span>
        {items.map((item) => (
          <div key={item.label} className="map-legend__item">
            <span
              className={`map-legend__swatch map-legend__swatch--${item.type ?? 'fill'}`}
              style={
                item.type === 'line'
                  ? { borderColor: item.color }
                  : { background: item.color }
              }
            />
            <span>{item.label}</span>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className={`map-legend ${collapsed ? 'is-collapsed' : ''}`}>
      <button
        type="button"
        className="map-legend__toggle"
        onClick={() => setCollapsed((v) => !v)}
        aria-expanded={!collapsed}
      >
        <span className="map-legend__title">{title}</span>
        <span className={`dashboard-map__chevron ${collapsed ? '' : 'is-open'}`}>▸</span>
      </button>
      {!collapsed && items.map((item) => (
        <div key={item.label} className="map-legend__item">
          <span
            className={`map-legend__swatch map-legend__swatch--${item.type ?? 'fill'}`}
            style={
              item.type === 'line'
                ? { borderColor: item.color }
                : { background: item.color }
            }
          />
          <span>{item.label}</span>
        </div>
      ))}
    </div>
  );
}
