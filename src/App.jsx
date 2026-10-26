import { useState, lazy, Suspense } from 'react';
import TabSwitcher from './components/TabSwitcher.jsx';
import StoryView from './components/StoryView.jsx';
import ErrorBoundary from './components/ErrorBoundary.jsx';

// Lazy load tab berat — DashboardView (recharts) dan InteractiveMapView
// dimuat HANYA saat user benar-benar buka tab itu, bukan dari awal.
// Tab Storymap tetap eager karena itu default pertama kali dibuka.
const InteractiveMapView = lazy(() => import('./components/InteractiveMapView.jsx'));
const DashboardView = lazy(() => import('./components/DashboardView.jsx'));

const VIEWS = {
  storymap: StoryView,
  peta: InteractiveMapView,
  dashboard: DashboardView,
};

function TabFallback() {
  return (
    <div className="zl-loading" role="status" aria-live="polite">
      <span className="zl-spinner" aria-hidden="true" />
      <p>Memuat…</p>
      <span className="zl-loading-bar" aria-hidden="true" />
    </div>
  );
}

export default function App() {
  const [activeTab, setActiveTab] = useState('storymap');
  const ActiveView = VIEWS[activeTab];

  return (
    <div className="app">
      <TabSwitcher activeTab={activeTab} onChange={setActiveTab} />
      <ErrorBoundary key={activeTab}>
        <Suspense fallback={<TabFallback />}>
          <ActiveView />
        </Suspense>
      </ErrorBoundary>
    </div>
  );
}
