export default function FootnotePanel({ footnotes }) {
  if (!footnotes || footnotes.length === 0) return null;
  return (
    <div className="footnote-panel">
      {footnotes.map((f) => (
        <p key={f.id} id={`footnote-${f.id}`} className="footnote-panel__item">
          <sup>{f.id}</sup> {f.text}
        </p>
      ))}
    </div>
  );
}

// Render teks dengan sitasi inline [a] → tautan klik ke footnote id "a"
export function renderTextWithCitations(text) {
  const parts = text.split(/(\[[a-z]\])/g);
  return parts.map((part, i) => {
    const match = part.match(/^\[([a-z])\]$/);
    if (match) {
      const id = match[1];
      return (
        <a key={i} href={`#footnote-${id}`} className="citation-link">
          [{id}]
        </a>
      );
    }
    return part;
  });
}
