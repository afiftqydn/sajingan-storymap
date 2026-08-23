import StatBlock from './StatBlock.jsx';
import FootnotePanel, { renderTextWithCitations } from './FootnotePanel.jsx';
import MediaGallery from './MediaGallery.jsx';
import DownloadsPanel from './DownloadsPanel.jsx';
import ChartBlock from './ChartBlock.jsx';

// Satu chapter di tab Storymap. `active` = true kalau chapter ini yang
// sedang di tengah viewport (dipakai untuk trigger animasi stat count-up).
//
// Posisi popup SELALU kiri (tidak ada lagi variasi align kiri/tengah) —
// popup di tengah dulu sempat bikin ketutup bagian penting peta, jadi
// field `align` dihapus total dari data chapter, cukup satu perilaku
// konsisten di CSS (.step).
export default function Step({ chapter, active }) {
  const { id, type, title, text, stats, images, footnotes, eyebrow, highlight, mediaLayout } = chapter;

  const typeClass = type ? `step--${type}` : '';
  const cardClasses = ['step__card'];
  if (highlight) cardClasses.push('step__card--highlight');
  if (mediaLayout === 'wide') cardClasses.push('step__card--wide');

  return (
    <section
      id={id}
      data-step-id={id}
      className={`step ${typeClass} ${active ? 'step--active' : ''}`}
    >
      <div className={cardClasses.join(' ')}>
        {eyebrow && <span className="step__eyebrow">{eyebrow}</span>}
        {title && <h2 className="step__title">{title}</h2>}
        {/* Urutan: narasi → gambar → keyword (stats) */}
        {text && <p className="step__text">{renderTextWithCitations(text)}</p>}
        <MediaGallery images={images} />
        {chapter?.chart && <ChartBlock chartId={chapter.chart} />}
        {type === 'downloads' && <DownloadsPanel />}
        <StatBlock stats={stats} active={active} />
        <FootnotePanel footnotes={footnotes} />
      </div>
    </section>
  );
}
