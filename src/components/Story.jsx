import { useMemo } from 'react';
import chapters from '../data/chapters.js';
import { useStepObserver } from '../hooks/useStepObserver.js';
import { useScrollActivity } from '../hooks/useScrollActivity.js';
import Step from './Step.jsx';
import StepIndicator from './StepIndicator.jsx';
import ScrollProgress from './ScrollProgress.jsx';
import MapController from './MapController.jsx';

// Layout: rail ikon tipis (kiri, selalu ada) → panggung (sisa lebar
// layar) berisi peta FULL-BLEED di belakang + narasi mengambang di
// atasnya sebagai popup semi-transparan (backdrop-blur). Beda dari
// versi 3-kolom sebelumnya: narasi TIDAK lagi punya kolom solid sendiri
// yang makan lebar tetap — dia cuma overlay tipis di atas peta, jadi
// peta selalu dapat hampir seluruh layar (cuma dikurangi rail ikon).
export default function Story() {
  const stepIds = useMemo(() => chapters.map((c) => c.id), []);
  const { activeStepId, containerRef } = useStepObserver(stepIds);
  // Nav rail cuma kelihatan WAKTU aktif di-scroll — begitu diam
  // (termasuk pas awal buka halaman, di cover, belum ada scroll sama
  // sekali), otomatis sembunyi lagi ~1.2 detik kemudian.
  const isScrolling = useScrollActivity(containerRef);

  const activeChapter = chapters.find((c) => c.id === activeStepId) ?? chapters[0];

  // Inset map (lihat MapController) TETAP pakai logic lama (sembunyi
  // di cover) — ini beda kebutuhan dari nav, jadi tidak ikut diubah.
  const isOnCover = activeStepId === chapters[0]?.id;

  const handleJump = (id) => {
    document.getElementById(id)?.scrollIntoView({
      behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches
        ? 'auto'
        : 'smooth',
      block: 'start',
    });
  };

  return (
    <div className="story">
      <StepIndicator
        chapters={chapters}
        activeStepId={activeStepId}
        onJump={handleJump}
        hidden={!isScrolling}
      />

      <div className="story__stage">
        <div className="story__map-panel">
          <MapController activeChapter={activeChapter} isOnCover={isOnCover} />
        </div>

        <div ref={containerRef} className="story__narrative-overlay">
          <ScrollProgress containerRef={containerRef} />
          {chapters.map((chapter) => (
            <Step key={chapter.id} chapter={chapter} active={activeStepId === chapter.id} />
          ))}
        </div>
      </div>
    </div>
  );
}
