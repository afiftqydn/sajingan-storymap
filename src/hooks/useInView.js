import { useEffect, useRef, useState } from 'react';

// Hook generik sekali-pakai: true begitu elemen pertama kali masuk
// viewport, lalu observer di-disconnect (tidak perlu terus mengamati
// setelah animasi masuk sudah terpicu sekali). Dipakai Dashboard buat
// mentrigger animasi angka/chart pas discroll ke layar, bukan langsung
// di awal load waktu section itu sendiri belum kelihatan.
export default function useInView({ threshold = 0.3 } = {}) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || inView) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold }
    );
    observer.observe(el);
    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { ref, inView };
}
