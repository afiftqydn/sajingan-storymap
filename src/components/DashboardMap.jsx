import { useEffect, useRef, useState } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { mapStyle } from '../mapStyle.js';
import { LAYER_CATALOG, LAYER_CATEGORIES } from '../data/layers.js';

// Peta tab "Peta & Data" — interactive: true, bebas dikontrol user.
// Generic: render apa pun yang ada di LAYER_CATALOG (lihat layers.js),
// tidak hardcode kategori. Klik polygon → popup label + luas.
export default function DashboardMap() {
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const popupRef = useRef(null);

  // Layer aktif per id — default: hanya "Batas Wilayah" yang asli (ada data)
  const [activeLayers, setActiveLayers] = useState(() =>
    Object.fromEntries(LAYER_CATALOG.map((l) => [l.id, l.category === 'Batas Wilayah']))
  );

  useEffect(() => {
    if (!mapContainerRef.current) return;

    const map = new maplibregl.Map({
      container: mapContainerRef.current,
      style: mapStyle,
      center: [109.05, 1.35],
      zoom: 9.5,
      interactive: true,
      attributionControl: { compact: true },
    });

    map.addControl(new maplibregl.NavigationControl(), 'top-right');
    popupRef.current = new maplibregl.Popup({ closeButton: true, closeOnClick: true });

    map.on('load', () => {
      LAYER_CATALOG.forEach((layer) => {
        if (!layer.data) return; // layer dummy — belum ada geometry, skip render

        map.addSource(layer.id, { type: 'geojson', data: layer.data });

        if (layer.geometryType === 'polygon') {
          map.addLayer({
            id: `${layer.id}-fill`,
            type: 'fill',
            source: layer.id,
            layout: { visibility: activeLayers[layer.id] ? 'visible' : 'none' },
            paint: { 'fill-color': layer.color, 'fill-opacity': 0.3 },
          });
          map.addLayer({
            id: `${layer.id}-line`,
            type: 'line',
            source: layer.id,
            layout: { visibility: activeLayers[layer.id] ? 'visible' : 'none' },
            paint: { 'line-color': layer.color, 'line-width': 2 },
          });
          map.on('click', `${layer.id}-fill`, (e) => {
            const f = e.features[0];
            const name = f.properties.name ?? layer.name;
            const areaHa = f.properties.areaHa ?? '—';
            popupRef.current
              .setLngLat(e.lngLat)
              .setHTML(`<strong>${name}</strong><br/>Luas: ${areaHa} ha`)
              .addTo(map);
          });
        } else if (layer.geometryType === 'point') {
          map.addLayer({
            id: `${layer.id}-point`,
            type: 'circle',
            source: layer.id,
            layout: { visibility: activeLayers[layer.id] ? 'visible' : 'none' },
            paint: { 'circle-color': layer.color, 'circle-radius': 5 },
          });
        } else if (layer.geometryType === 'line') {
          map.addLayer({
            id: `${layer.id}-line`,
            type: 'line',
            source: layer.id,
            layout: { visibility: activeLayers[layer.id] ? 'visible' : 'none' },
            paint: { 'line-color': layer.color, 'line-width': 2 },
          });
        }
      });
    });

    mapRef.current = map;
    return () => map.remove();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Toggle visibility saat checkbox berubah
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !map.isStyleLoaded()) return;
    LAYER_CATALOG.forEach((layer) => {
      ['fill', 'line', 'point'].forEach((suffix) => {
        const layerId = `${layer.id}-${suffix}`;
        if (map.getLayer(layerId)) {
          map.setLayoutProperty(layerId, 'visibility', activeLayers[layer.id] ? 'visible' : 'none');
        }
      });
    });
  }, [activeLayers]);

  const toggleLayer = (id) => setActiveLayers((prev) => ({ ...prev, [id]: !prev[id] }));

  return (
    <div className="dashboard-map">
      <div ref={mapContainerRef} className="dashboard-map__canvas" />
      <div className="dashboard-map__layer-panel">
        {LAYER_CATEGORIES.map((category) => (
          <div key={category} className="dashboard-map__category">
            <span className="dashboard-map__category-label">{category}</span>
            {LAYER_CATALOG.filter((l) => l.category === category).map((layer) => (
              <label key={layer.id} className="dashboard-map__checkbox">
                <input
                  type="checkbox"
                  checked={!!activeLayers[layer.id]}
                  onChange={() => toggleLayer(layer.id)}
                />
                {layer.name}
                {!layer.data && <span className="dashboard-map__dummy-badge">dummy</span>}
              </label>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
