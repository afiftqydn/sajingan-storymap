import { SECTION_LABELS } from '../data/chapters.js';

// Nav kiri: titik-titik dikelompokkan per `section`, label dari
// SECTION_LABELS. Chapter dengan quickNav: true dapat tombol lompat cepat.
export default function StepIndicator({ chapters, activeStepId, onJump }) {
  const grouped = chapters.reduce((acc, ch) => {
    (acc[ch.section] ??= []).push(ch);
    return acc;
  }, {});

  return (
    <nav className="step-indicator" aria-label="Navigasi chapter">
      {Object.entries(grouped).map(([section, items]) => (
        <div key={section} className="step-indicator__group">
          <span className="step-indicator__label">{SECTION_LABELS[section] ?? section}</span>
          <div className="step-indicator__dots">
            {items.map((ch) => (
              <button
                key={ch.id}
                className={`step-indicator__dot ${activeStepId === ch.id ? 'is-active' : ''}`}
                onClick={() => onJump(ch.id)}
                aria-label={ch.title || ch.id}
                title={ch.title || ch.id}
              />
            ))}
          </div>
        </div>
      ))}
    </nav>
  );
}
