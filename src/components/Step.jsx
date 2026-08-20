import StatBlock from './StatBlock.jsx';
import FootnotePanel, { renderTextWithCitations } from './FootnotePanel.jsx';
import MediaGallery from './MediaGallery.jsx';
import DownloadsPanel from './DownloadsPanel.jsx';

// Satu chapter di tab Cerita. `active` = true kalau chapter ini yang
// sedang di tengah viewport (dipakai untuk trigger animasi stat count-up).
export default function Step({ chapter, active }) {
  const { id, align, type, title, text, stats, images, footnotes } = chapter;

  const alignClass = align === 'full' ? 'step--full' : `step--${align}`;
  const typeClass = type ? `step--${type}` : '';

  return (
    <section
      id={id}
      data-step-id={id}
      className={`step ${alignClass} ${typeClass} ${active ? 'step--active' : ''}`}
    >
      <div className="step__card">
        {title && <h2 className="step__title">{title}</h2>}
        {text && <p className="step__text">{renderTextWithCitations(text)}</p>}
        <StatBlock stats={stats} active={active} />
        <MediaGallery images={images} />
        {type === 'downloads' && <DownloadsPanel />}
        <FootnotePanel footnotes={footnotes} />
      </div>
    </section>
  );
}
