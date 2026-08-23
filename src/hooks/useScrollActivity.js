// src/hooks/useScrollActivity.js
//
// Deteksi apakah container lagi AKTIF di-scroll atau lagi diam.
// `true` selama scroll berlangsung, balik `false` otomatis ~1.2 detik
// setelah scroll berhenti (debounce) — dipakai buat nav rail Storymap:
// muncul waktu di-scroll, sembunyi waktu diam.

import { useEffect, useRef, useState } from 'react';

export function useScrollActivity(containerRef, idleDelay = 1200) {
  const [isScrolling, setIsScrolling] = useState(false);
  const timeoutRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      setIsScrolling(true);
      clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => setIsScrolling(false), idleDelay);
    };

    container.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      container.removeEventListener('scroll', handleScroll);
      clearTimeout(timeoutRef.current);
    };
  }, [containerRef, idleDelay]);

  return isScrolling;
}
