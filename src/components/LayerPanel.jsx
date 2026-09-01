import { useState } from 'react';
import { LAYER_CATEGORIES } from '../data/layers.js';
import BasemapPicker from './BasemapPicker.jsx';

// Diekstrak dari DashboardMap.jsx (dulu JSX panel layer ada inline di
// sana). Sekarang cuma satu pemanggil (Peta Interaktif) — Dashboard
// sudah tidak punya map lagi sejak revert console, jadi variant="report"
// yang sebelumnya membatasi ke kategori AOI saja sudah tidak dipakai
// dan dihapus.
//
// Dirender FLOATING di atas peta, default COLLAPSED di semua ukuran
// layar (kebalikan dari MapLegend.jsx yang default terbuka) — dibuka
// lewat tombol toggle, biar peta tidak langsung tertutup panel begitu
// tab dibuka.
//
// State collapse kategori & buka/tutup panel tetap LOKAL di sini (bukan
// di useMapEngine) karena murni UI panel, tidak berhubungan dengan mesin peta.
export default function LayerPanel({
  layersByCategory,
  activeLayers,
  uploadedLayers = [],
  layerOpacity,
  onToggleLayer,
  onSetLayerOpacity,
  onRemoveUploadedLayer,
  showRoutePrediction,
  onToggleRoutePrediction,
  basemapId,
  onSetBasemapId,
  uploadError,
}) {
  // Semua kategori selain AOI di-collapse dari awal — panel tidak penuh
  // sesak saat pertama dibuka. Batas Desa (satu-satunya layer yang default
  // aktif) tetap kelihatan di kategori AOI yang memang terbuka.
  const [collapsedCategories, setCollapsedCategories] = useState(
    () => new Set(LAYER_CATEGORIES.filter((c) => c !== 'AOI'))
  );
  const [panelOpen, setPanelOpen] = useState(false);

  const toggleCategoryCollapse = (category) => {
    setCollapsedCategories((prev) => {
      const next = new Set(prev);
      if (next.has(category)) next.delete(category);
      else next.add(category);
      return next;
    });
  };

  return (
    <>
      <button
        type="button"
        className="dashboard-map__panel-toggle"
        onClick={() => setPanelOpen((v) => !v)}
        aria-expanded={panelOpen}
      >
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M4 6h16M4 12h16M4 18h16" strokeLinecap="round" />
        </svg>
        Layer
      </button>
      <div className={`dashboard-map__layer-panel ${panelOpen ? 'is-open' : ''}`}>
        <div className="dashboard-map__panel-header">
          <span className="map-legend__title">Legenda & Layer</span>
          <button
            type="button"
            className="dashboard-map__panel-close"
            onClick={() => setPanelOpen(false)}
            aria-label="Tutup panel layer"
          >
            ×
          </button>
        </div>

        {/* Opsi citra dasar — dropdown mapcn-style (BasemapPicker.jsx),
            gantikan <select> polos sebelumnya. */}
        <div className="dashboard-map__basemap-picker">
          <span className="dashboard-map__basemap-label">Citra Dasar</span>
          <BasemapPicker basemapId={basemapId} onSetBasemapId={onSetBasemapId} />
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
            {categoryLayers.map((layer) => {
              const defaultOpacity = layer.isUpload ? 0.45 : 0.3;
              const currentOpacity = layerOpacity[layer.id] ?? defaultOpacity;
              return (
              <div key={layer.id} className="dashboard-map__layer-row">
                <label className="dashboard-map__checkbox">
                  <input
                    type="checkbox"
                    checked={!!activeLayers[layer.id]}
                    onChange={() => onToggleLayer(layer.id)}
                  />
                  <span
                    className={`map-legend__swatch map-legend__swatch--${layer.geometryType === 'line' || layer.outlineOnly ? 'line' : 'fill'}`}
                    style={
                      layer.geometryType === 'line' || layer.outlineOnly
                        ? { borderColor: layer.color }
                        : { background: layer.color }
                    }
                  />
                  <span className="dashboard-map__layer-name">{layer.name}</span>
                </label>
                {/* Kontrol opacity kompak — inline di ujung baris yang
                    sama, bukan full-width di baris terpisah di bawah
                    (sebelumnya kelihatan berat/tidak rapi). Track tipis
                    + thumb bulat kecil, gaya panel layer aplikasi GIS
                    modern (ArcGIS Online/Mapbox Studio), bukan slider
                    bawaan browser yang tebal. */}
                <div className="dashboard-map__opacity-control">
                  <input
                    type="range"
                    className="dashboard-map__opacity-slider"
                    min="0"
                    max="100"
                    value={Math.round(currentOpacity * 100)}
                    onChange={(e) => onSetLayerOpacity(layer.id, Number(e.target.value) / 100)}
                    aria-label={`Opacity layer ${layer.name}`}
                  />
                  <span className="dashboard-map__opacity-value">{Math.round(currentOpacity * 100)}%</span>
                </div>
              </div>
              );
            })}

            {/* Layer hasil drag-and-drop — cuma tampil di kategori
                Informasi Tambahan, sesuai permintaan. */}
            {category === 'Informasi Tambahan' && uploadedLayers.map((layer) => {
              const currentOpacity = layerOpacity[layer.id] ?? 0.45;
              return (
              <div key={layer.id} className="dashboard-map__checkbox dashboard-map__checkbox--upload">
                <label>
                  <input
                    type="checkbox"
                    checked={!!activeLayers[layer.id]}
                    onChange={() => onToggleLayer(layer.id)}
                  />
                  <span
                    className={`map-legend__swatch map-legend__swatch--${layer.geometryType === 'line' || layer.outlineOnly ? 'line' : 'fill'}`}
                    style={
                      layer.geometryType === 'line' || layer.outlineOnly
                        ? { borderColor: layer.color }
                        : { background: layer.color }
                    }
                  />
                  {layer.name}
                  <span className="dashboard-map__upload-badge">upload</span>
                </label>
                <div className="dashboard-map__opacity-control">
                  <input
                    type="range"
                    className="dashboard-map__opacity-slider"
                    min="0"
                    max="100"
                    value={Math.round(currentOpacity * 100)}
                    onChange={(e) => onSetLayerOpacity(layer.id, Number(e.target.value) / 100)}
                    aria-label={`Opacity layer ${layer.name}`}
                  />
                  <span className="dashboard-map__opacity-value">{Math.round(currentOpacity * 100)}%</span>
                </div>
                <button
                  className="dashboard-map__remove-btn"
                  onClick={() => onRemoveUploadedLayer(layer.id)}
                  aria-label={`Hapus layer ${layer.name}`}
                  title="Hapus layer ini"
                >
                  ×
                </button>
              </div>
              );
            })}

            {category === 'Supply Chain' && (
              <label className="dashboard-map__checkbox">
                <input
                  type="checkbox"
                  checked={showRoutePrediction}
                  onChange={onToggleRoutePrediction}
                />
                <span className="map-legend__swatch map-legend__swatch--fill" style={{ background: '#ff5a3c' }} />
                Prediksi Supply Chain
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
  );
}
