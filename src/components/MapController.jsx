import { useEffect, useRef } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { mapStyle } from '../mapStyle.js';

// Peta tab "Cerita" — interactive: false, kamera & polygon berubah
// mengikuti chapter aktif (dikontrol scroll, bukan oleh user).
export default function MapController({ activeChapter }) {
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);

  // Init map sekali saja
  useEffect(() => {
    if (!mapContainerRef.current) return;

    const map = new maplibregl.Map({
      container: mapContainerRef.current,
      style: mapStyle,
      center: activeChapter?.mapState?.center ?? [109.05, 1.35],
      zoom: activeChapter?.mapState?.zoom ?? 9,
      pitch: activeChapter?.mapState?.pitch ?? 0,
      bearing: activeChapter?.mapState?.bearing ?? 0,
      interactive: false, // tab Cerita: kamera dikontrol scroll, bukan user
      attributionControl: { compact: true },
    });

    map.on('load', () => {
      map.addSource('active-polygons', {
        type: 'geojson',
        data: { type: 'FeatureCollection', features: [] },
      });
      map.addLayer({
        id: 'active-polygons-fill',
        type: 'fill',
        source: 'active-polygons',
        paint: { 'fill-color': '#d9a441', 'fill-opacity': 0.25 },
      });
      map.addLayer({
        id: 'active-polygons-line',
        type: 'line',
        source: 'active-polygons',
        paint: { 'line-color': '#d9a441', 'line-width': 2 },
      });
    });

    mapRef.current = map;
    return () => map.remove();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Update kamera & polygon tiap kali chapter aktif berganti
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !activeChapter) return;

    const { center, zoom, pitch, bearing } = activeChapter.mapState;
    map.easeTo({ center, zoom, pitch, bearing, duration: 900 });

    const setPolygons = () => {
      const source = map.getSource('active-polygons');
      if (!source) return;
      source.setData({
        type: 'FeatureCollection',
        features: activeChapter.polygons ?? [],
      });
    };

    if (map.isStyleLoaded()) {
      setPolygons();
    } else {
      map.once('load', setPolygons);
    }
  }, [activeChapter]);

  return <div ref={mapContainerRef} className="map-controller" />;
}
