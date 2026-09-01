// Diekstrak dari DashboardStats.jsx supaya bisa dipakai ULANG di
// tempat lain (mis. Object Inspector console) tanpa duplikasi.
const TYPE_COLOR = { DRONE: '#7ed957', GROUND: '#e0c14d', '360°': '#4d8fe0' };

export default function PhotoGrid({ items }) {
  return (
    <div className="photo-grid">
      {items.map((p, i) => (
        <div key={i} className="photo-grid__item">
          <img
            src={p.src}
            alt={p.caption}
            className="photo-grid__img"
            loading="lazy"
            onError={(e) => { e.target.style.display = 'none'; e.target.parentNode.classList.add('photo-grid__item--missing'); }}
          />
          <div className="photo-grid__meta">
            <span className="photo-grid__badge" style={{ '--badge-color': TYPE_COLOR[p.type] || '#7ed957' }}>
              {p.type}
            </span>
            <span className="photo-grid__loc">{p.location}</span>
          </div>
          <div className="photo-grid__caption">{p.caption}</div>
        </div>
      ))}
    </div>
  );
}
