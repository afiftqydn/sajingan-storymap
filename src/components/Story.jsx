import { useMemo } from 'react';
import chapters from '../data/chapters.js';
import { useStepObserver } from '../hooks/useStepObserver.js';
import Step from './Step.jsx';
import StepIndicator from './StepIndicator.jsx';
import ScrollProgress from './ScrollProgress.jsx';
import MapController from './MapController.jsx';

export default function Story() {
  const stepIds = useMemo(() => chapters.map((c) => c.id), []);
  const { activeStepId, containerRef } = useStepObserver(stepIds);

  const activeChapter = chapters.find((c) => c.id === activeStepId) ?? chapters[0];

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
      <MapController activeChapter={activeChapter} />

      <div ref={containerRef} className="story__scroll-container">
        <ScrollProgress containerRef={containerRef} />
        {chapters.map((chapter) => (
          <Step key={chapter.id} chapter={chapter} active={activeStepId === chapter.id} />
        ))}
      </div>

      <StepIndicator chapters={chapters} activeStepId={activeStepId} onJump={handleJump} />
    </div>
  );
}
