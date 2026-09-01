import { useState, useCallback, useMemo } from 'react';
import useMapEngine from '../hooks/useMapEngine.js';
import { useCaseInspectorData, CASE_GEOJSON_PATH } from '../hooks/useCaseInspectorData.js';
import DashboardMap from './DashboardMap.jsx';
import LayerPanel from './LayerPanel.jsx';
import ObjectInspector from './ObjectInspector.jsx';
import MapCallout from './MapCallout.jsx';
import { cases } from '../data/reportData.js';
import { getGeoJSONBounds } from '../utils/geojsonBounds.js';

// Tab "Peta Interaktif" — peta bebas eksplorasi, full-bleed dengan panel
// layer FLOATING (bukan grid console) supaya area analisis tetap lega.
// Klik polygon studi-kasus tidak lagi buka popup native MapLibre yang
// menutupi peta — jadi callout leader-line (MapCallout.jsx) berisi
// quick-summary yang didok di pinggir peta. Titik PoD/mill TIDAK dapat
// perlakuan khusus lagi (sengaja) — cuma ikon + popup nama singkat
// native seperti layer lain, tidak ada foto sama sekali.
export default function InteractiveMapView() {
  const [selectedCaseId, setSelectedCaseId] = useState(null);
  const [selectedCaseLngLat, setSelectedCaseLngLat] = useState(null);

  // Dipanggil dari useMapEngine waktu polygon studi-kasus diklik di peta
  // (properties.category === 'studi-kasus', lihat addMapLayer di
  // useMapEngine.js) — properties-nya dari lokasi-fokus.geojson
  // (ternormalisasi), name-nya dipakai buat cari case yang cocok.
  const handleCaseFeatureClick = useCallback((props, lngLat) => {
    const match = cases.find((c) => c.name === props?.name);
    if (!match) return;
    setSelectedCaseId(match.id);
    setSelectedCaseLngLat(lngLat);
  }, []);

  const engine = useMapEngine({ onCaseFeatureClick: handleCaseFeatureClick });

  const { selectedCase } = useCaseInspectorData(selectedCaseId);

  const handleFlyTo = useCallback((c) => {
    const path = CASE_GEOJSON_PATH[c?.id];
    if (!path) return;
    fetch(path)
      .then((res) => (res.ok ? res.json() : null))
      .then((geojson) => {
        const bounds = geojson && getGeoJSONBounds(geojson);
        if (bounds) engine.zoomToBounds(bounds);
      })
      .catch(() => {});
  }, [engine]);

  // Legend dinamis — cuma tampilkan layer yang SEDANG aktif (dicentang),
  // bukan daftar statis semua layer di katalog. Sama pola derivasinya
  // dengan legendItems di MapController.jsx (Storymap), versi ini
  // sumbernya activeLayers (toggle checkbox), bukan chapter aktif.
  const legendItems = useMemo(() => {
    const allLayers = Object.values(engine.layersByCategory).flat();
    return allLayers
      .filter((l) => engine.activeLayers[l.id])
      .map((l) => ({
        label: l.name,
        color: l.color,
        type: l.geometryType === 'line' || l.outlineOnly ? 'line' : 'fill',
      }));
  }, [engine.layersByCategory, engine.activeLayers]);

  return (
    <div className="interactive-map-view">
      <DashboardMap engine={engine} legendItems={legendItems}>
        <LayerPanel
          layersByCategory={engine.layersByCategory}
          activeLayers={engine.activeLayers}
          uploadedLayers={engine.uploadedLayers}
          layerOpacity={engine.layerOpacity}
          onToggleLayer={engine.toggleLayer}
          onSetLayerOpacity={(id, value) => engine.setLayerOpacity((prev) => ({ ...prev, [id]: value }))}
          onRemoveUploadedLayer={engine.removeUploadedLayer}
          showRoutePrediction={engine.showRoutePrediction}
          onToggleRoutePrediction={engine.toggleRoutePrediction}
          basemapId={engine.basemapId}
          onSetBasemapId={engine.setBasemapId}
          uploadError={engine.uploadError}
        />

        {selectedCase && selectedCaseLngLat && (
          <MapCallout
            map={engine.mapInstance}
            targetLngLat={selectedCaseLngLat}
            side="right"
            onClose={() => { setSelectedCaseId(null); setSelectedCaseLngLat(null); }}
          >
            <ObjectInspector case={selectedCase} onFlyTo={handleFlyTo} />
          </MapCallout>
        )}
      </DashboardMap>
    </div>
  );
}
