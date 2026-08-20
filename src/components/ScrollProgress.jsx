import { useEffect, useRef } from 'react';

// Bilah tipis di atas layar menunjukkan progres scroll cerita.
// Pakai transform: scaleX() (bukan width) supaya animasi ditangani GPU
// dan tidak memicu reflow tiap frame scroll.
export default function ScrollProgress({ containerRef }) {
  const barRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    const bar = barRef.current;
    if (!container || !bar) return;

    const onScroll = () => {
      const scrollable = container.scrollHeight - container.clientHeight;
      const progress = scrollable > 0 ? container.scrollTop / scrollable : 0;
      bar.style.transform = `scaleX(${progress})`;
    };

    container.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => container.removeEventListener('scroll', onScroll);
  }, [containerRef]);

  return (
    <div className="scroll-progress">
      <div ref={barRef} className="scroll-progress__bar" />
    </div>
  );
}
