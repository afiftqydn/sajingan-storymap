import { useState, lazy, Suspense } from 'react';
import TabSwitcher from './components/TabSwitcher.jsx';
import ThemeToggle from './components/ThemeToggle.jsx';
import StoryView from './components/StoryView.jsx';
import ErrorBoundary from './components/ErrorBoundary.jsx';
import { useTheme } from './hooks/useTheme.js';
import { ThemeContext } from './hooks/ThemeContext.js';

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
    <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-text-muted)', fontFamily: 'var(--font-mono)', fontSize: 13 }}>
      Memuat…
    </div>
  );
}

export default function App() {
  const [activeTab, setActiveTab] = useState('storymap');
  const { theme, toggleTheme } = useTheme();
  const ActiveView = VIEWS[activeTab];

  return (
    <ThemeContext.Provider value={theme}>
      <div className="app">
        <div className="app__topbar">
          <TabSwitcher activeTab={activeTab} onChange={setActiveTab} />
          <ThemeToggle theme={theme} onToggle={toggleTheme} />
        </div>
        <ErrorBoundary key={activeTab}>
          <Suspense fallback={<TabFallback />}>
            <ActiveView />
          </Suspense>
        </ErrorBoundary>
      </div>
    </ThemeContext.Provider>
  );
}
