// src/hooks/useStepObserver.js
//
// Deteksi chapter mana yang sedang aktif saat user scroll di tab Storymap.
// Pakai IntersectionObserver — tiap <Step> punya data-step-id, hook ini
// mengembalikan id chapter yang sedang paling dominan di viewport.
//
// Kalau nanti butuh kontrol scroll lebih presisi (progress bar per-step,
// offset trigger custom), pertimbangkan react-scrollama — API-nya mirip,
// tinggal swap di Story.jsx.

import { useEffect, useState, useRef } from 'react';

export function useStepObserver(stepIds) {
  const [activeStepId, setActiveStepId] = useState(stepIds[0] ?? null);
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const steps = container.querySelectorAll('[data-step-id]');
    if (steps.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        // Pilih entry yang paling besar intersectionRatio-nya (paling
        // dominan di viewport), bukan sekadar entry pertama yang trigger.
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

        if (visible.length > 0) {
          setActiveStepId(visible[0].target.dataset.stepId);
        }
      },
      {
        root: null,
        // Fokuskan deteksi ke pita tengah layar, bukan seluruh viewport,
        // supaya transisi terasa pas saat chapter "masuk" ke tengah.
        rootMargin: '-40% 0px -40% 0px',
        threshold: [0, 0.25, 0.5, 0.75, 1],
      }
    );

    steps.forEach((step) => observer.observe(step));
    return () => observer.disconnect();
  }, [stepIds]);

  return { activeStepId, containerRef };
}
