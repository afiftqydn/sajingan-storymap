import DashboardMap from './DashboardMap.jsx';

// Tab "Peta Interaktif" — peta eksplorasi bebas berdiri sendiri,
// full-page. Dipisah dari tab "Dashboard" (angka/tabel) supaya masing-
// masing tab punya satu fokus: di sini eksplorasi spasial, di Dashboard
// eksplorasi angka.
export default function InteractiveMapView() {
  return (
    <div className="interactive-map-view">
      <DashboardMap />
    </div>
  );
}
