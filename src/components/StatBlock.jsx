import { useEffect, useRef, useState } from 'react';

// Angka headline dengan animasi count-up saat masuk layar. Kalau value
// bukan angka murni (mis. "±160 ha", "TODO"), tampil apa adanya tanpa animasi.
function useCountUp(target, active) {
  const [display, setDisplay] = useState(active ? 0 : target);
  useEffect(() => {
    if (!active) return;
    const numeric = parseFloat(String(target).replace(/[^0-9.-]/g, ''));
    if (Number.isNaN(numeric)) {
      setDisplay(target);
      return;
    }
    const duration = 800;
    const start = performance.now();
    let raf;
    const tick = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      setDisplay(Math.round(numeric * progress));
      if (progress < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, active]);
  return display;
}

function Stat({ value, label, active }) {
  const isNumeric = /^-?[\d.,]+$/.test(String(value).trim());
  const display = useCountUp(value, active && isNumeric);
  return (
    <div className="stat-block__item">
      <div className="stat-block__value">{isNumeric ? display : value}</div>
      <div className="stat-block__label">{label}</div>
    </div>
  );
}

export default function StatBlock({ stats, active }) {
  if (!stats || stats.length === 0) return null;
  return (
    <div className="stat-block">
      {stats.map((s) => (
        <Stat key={s.label} value={s.value} label={s.label} active={active} />
      ))}
    </div>
  );
}
