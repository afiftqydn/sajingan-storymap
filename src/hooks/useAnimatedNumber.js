import { useEffect, useState } from 'react';

// Parser angka format Indonesia: "." pemisah ribuan, "," pemisah desimal.
// "3.721 ha" -> { numeric: 3721, decimals: 0, suffix: ' ha' }
// "22,3%"    -> { numeric: 22.3, decimals: 1, suffix: '%' }
// "5 PoD"    -> { numeric: 5, decimals: 0, suffix: ' PoD' }
// String tanpa angka di depan (mis. "HPT") -> null, tidak dianimasikan.
function parseLeadingNumber(value) {
  const str = String(value).trim();
  const match = str.match(/^(-?[\d.,]+)(.*)$/);
  if (!match) return null;
  const [, numStr, suffix] = match;
  const hasComma = numStr.includes(',');
  let numeric;
  let decimals = 0;
  if (hasComma) {
    const [intPart, decPart] = numStr.split(',');
    numeric = parseFloat(`${intPart.replace(/\./g, '')}.${decPart}`);
    decimals = decPart.length;
  } else {
    numeric = parseFloat(numStr.replace(/\./g, ''));
  }
  if (Number.isNaN(numeric)) return null;
  return { numeric, decimals, suffix };
}

// Dipakai KPI Dashboard — beda dari useCountUp punya StatBlock.jsx
// (Storymap, sengaja tidak disentuh sama sekali per permintaan "keep
// as is"). Nilai KPI di Dashboard datang sebagai satu string berisi
// angka + satuan sekaligus (mis. "3.721 ha"), jadi butuh parser yang
// pisahkan bagian angka (dianimasikan) dari suffix (statis) di atas.
export default function useAnimatedNumber(target, active) {
  const parsed = parseLeadingNumber(target);
  const [display, setDisplay] = useState(active && parsed ? '0' + (parsed.suffix ?? '') : target);

  useEffect(() => {
    if (!active || !parsed) {
      setDisplay(target);
      return;
    }
    const { numeric, decimals, suffix } = parsed;
    const duration = 900;
    const start = performance.now();
    let raf;
    const tick = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - (1 - progress) ** 3; // ease-out cubic
      const value = numeric * eased;
      setDisplay(
        value.toLocaleString('id-ID', { minimumFractionDigits: decimals, maximumFractionDigits: decimals }) + suffix
      );
      if (progress < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target, active]);

  return display;
}
