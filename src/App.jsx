import { useState } from 'react';
import TabSwitcher from './components/TabSwitcher.jsx';
import StoryView from './components/StoryView.jsx';
import DashboardView from './components/DashboardView.jsx';

export default function App() {
  const [activeTab, setActiveTab] = useState('cerita');

  return (
    <div className="app">
      <TabSwitcher activeTab={activeTab} onChange={setActiveTab} />
      {activeTab === 'cerita' ? <StoryView /> : <DashboardView />}
    </div>
  );
}
