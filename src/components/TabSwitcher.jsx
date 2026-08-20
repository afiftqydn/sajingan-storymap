export default function TabSwitcher({ activeTab, onChange }) {
  return (
    <nav className="tab-switcher" aria-label="Pilih tab">
      <button
        className={activeTab === 'cerita' ? 'is-active' : ''}
        onClick={() => onChange('cerita')}
      >
        Cerita
      </button>
      <button
        className={activeTab === 'dashboard' ? 'is-active' : ''}
        onClick={() => onChange('dashboard')}
      >
        Peta & Data
      </button>
    </nav>
  );
}
