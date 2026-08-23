const TABS = [
  { id: 'storymap', label: 'Storymap' },
  { id: 'peta', label: 'Peta Interaktif' },
  { id: 'dashboard', label: 'Dashboard' },
];

export default function TabSwitcher({ activeTab, onChange }) {
  return (
    <nav className="tab-switcher" aria-label="Pilih tab">
      {TABS.map((tab) => (
        <button
          key={tab.id}
          className={activeTab === tab.id ? 'is-active' : ''}
          onClick={() => onChange(tab.id)}
        >
          {tab.label}
        </button>
      ))}
    </nav>
  );
}
