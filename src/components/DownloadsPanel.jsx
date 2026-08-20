import { downloads } from '../data/downloads.js';

export default function DownloadsPanel() {
  return (
    <div className="downloads-panel">
      {downloads.map((doc) => (
        <a key={doc.id} href={doc.url} className="downloads-panel__item" target="_blank" rel="noreferrer">
          <div className="downloads-panel__title">{doc.title}</div>
          <div className="downloads-panel__desc">{doc.description}</div>
        </a>
      ))}
    </div>
  );
}
