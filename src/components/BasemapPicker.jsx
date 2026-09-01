import { useEffect, useRef, useState } from 'react';
import { BASEMAP_OPTIONS } from '../mapStyle.js';

// Pengganti <select> polos untuk pemilih citra dasar — trigger button
// (nama basemap aktif + swatch) yang buka popover daftar opsi dengan
// swatch per baris. Dibangun sendiri (bukan library `mapcn`, yang perlu
// scaffolding Tailwind/shadcn yang belum ada di proyek ini) meniru pola
// visual dropdown basemap-picker-nya, dipakai dalam token warna GEOINT
// yang sudah ada supaya tidak nambah bahasa visual baru.
export default function BasemapPicker({ basemapId, onSetBasemapId }) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef(null);
  const current = BASEMAP_OPTIONS.find((b) => b.id === basemapId) ?? BASEMAP_OPTIONS[0];

  useEffect(() => {
    if (!open) return;
    const onDocClick = (e) => {
      if (rootRef.current && !rootRef.current.contains(e.target)) setOpen(false);
    };
    const onEsc = (e) => { if (e.key === 'Escape') setOpen(false); };
    document.addEventListener('mousedown', onDocClick);
    document.addEventListener('keydown', onEsc);
    return () => {
      document.removeEventListener('mousedown', onDocClick);
      document.removeEventListener('keydown', onEsc);
    };
  }, [open]);

  return (
    <div className="basemap-picker" ref={rootRef}>
      <button
        type="button"
        className="basemap-picker__trigger"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
      >
        <span className={`basemap-picker__swatch basemap-picker__swatch--${current.id}`} />
        <span className="basemap-picker__label">{current.name}</span>
        <span className={`basemap-picker__chevron ${open ? 'is-open' : ''}`}>▾</span>
      </button>
      {open && (
        <div className="basemap-picker__menu" role="listbox">
          {BASEMAP_OPTIONS.map((option) => (
            <button
              type="button"
              key={option.id}
              role="option"
              aria-selected={option.id === basemapId}
              className={`basemap-picker__option ${option.id === basemapId ? 'is-active' : ''}`}
              onClick={() => { onSetBasemapId(option.id); setOpen(false); }}
            >
              <span className={`basemap-picker__swatch basemap-picker__swatch--${option.id}`} />
              {option.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
