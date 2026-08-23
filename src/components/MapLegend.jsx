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

export default function MapLegend({ items, title = 'Legenda' }) {
  if (!items || items.length === 0) return null;
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
