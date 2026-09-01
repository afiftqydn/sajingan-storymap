import 'maplibre-gl/dist/maplibre-gl.css';
import MapOverlayStack from './MapOverlayStack.jsx';
import RouteAnimationLayer from './RouteAnimationLayer.jsx';

// Kanvas peta + overlay kartografi. Mesin peta (useMapEngine.js) dimiliki
// oleh komponen pemanggil (InteractiveMapView.jsx). `children` (opsional)
// dirender DI DALAM div `.dashboard-map` yang sama (position:relative) —
// dipakai pemanggil buat naruh LayerPanel/MapCallout floating supaya
// posisi absolute-nya relatif terhadap kartu peta ini, bukan viewport.
export default function DashboardMap({ engine, legendItems, children }) {
  return (
    <div
      className={`dashboard-map ${engine.isDragOver ? 'dashboard-map--drag-over' : ''}`}
      onDragOver={engine.handleDragOver}
      onDragLeave={engine.handleDragLeave}
      onDrop={engine.handleDrop}
    >
      {engine.mapError ? (
        <div className="map-controller__fallback">
          <p>Peta tidak bisa dimuat di perangkat/browser ini.</p>
          <p className="map-controller__fallback-detail">{String(engine.mapError?.message || engine.mapError)}</p>
        </div>
      ) : (
        <>
          <div ref={engine.mapContainerRef} className="dashboard-map__canvas" />

          <RouteAnimationLayer map={engine.mapInstance} active={engine.showRoutePrediction} />

          <MapOverlayStack
            map={engine.mapInstance}
            bearing={engine.bearing}
            legendItems={legendItems}
            legendCollapsible={!!legendItems}
            embedded
            showInset
          />

          {engine.isDragOver && (
            <div className="dashboard-map__dropzone-hint">
              Lepas file .geojson / .json / .shp / .zip di sini
            </div>
          )}

          {children}
        </>
      )}
    </div>
  );
}
