// Quick-summary callout untuk satu studi kasus — dirender di dalam
// MapCallout.jsx (Peta Interaktif) waktu polygon studi-kasus diklik.
// Sengaja RINGKAS (bukan lagi WHERE→WHAT→WHEN→EVIDENCE→CONFIDENCE→
// RELATIONSHIP→ACTION penuh, dan tanpa Before/After) — konteksnya
// callout kecil di pinggir peta, bukan panel detail penuh, jadi cuma
// tampilkan angka/status paling penting + satu aksi "Lihat di peta".
// Presentational murni, semua data dari props.
//
// `case` diharapkan sudah lewat mergeCaseData() (src/utils/mergeCaseData.js).
function fmtNum(value, opts) {
  if (value === null || value === undefined || value === '') return null;
  const n = Number(value);
  if (Number.isNaN(n)) return String(value);
  return n.toLocaleString('id-ID', opts ?? { maximumFractionDigits: 2 });
}

function Row({ label, value, valueClass }) {
  if (value === null || value === undefined || value === '') return null;
  return (
    <div className="object-inspector__row">
      <span className="object-inspector__label">{label}</span>
      <span className={`object-inspector__val${valueClass ? ` ${valueClass}` : ''}`}>{value}</span>
    </div>
  );
}

export default function ObjectInspector({ case: mergedCase, onFlyTo }) {
  if (!mergedCase) {
    return (
      <div className="object-inspector object-inspector--empty">
        <p className="object-inspector__empty-text">Klik lokasi di peta untuk detail.</p>
      </div>
    );
  }

  const statusKawasan = mergedCase.statusKawasan ?? mergedCase.kawasan ?? null;

  return (
    <div className="object-inspector">
      <div className="object-inspector__header">
        <span className="object-inspector__eyebrow">{(mergedCase.name ?? mergedCase.id ?? '').toString().toUpperCase()}</span>
        <span className="object-inspector__area">{mergedCase.areaHa != null ? `${fmtNum(mergedCase.areaHa)} ha` : '—'}</span>
      </div>

      <div className="object-inspector__body">
        <Row label="Kawasan" value={statusKawasan} valueClass="warn" />
        <Row label="Metode pembukaan" value={mergedCase.openingMethod} />
        <Row label="Deforestasi" value={mergedCase.deforestationPercent != null ? `${fmtNum(mergedCase.deforestationPercent)}%` : null} valueClass="warn" />
        <Row label="Status" value={mergedCase.status} />
        <Row label="HGU" value={mergedCase.hgu === true ? 'Ada' : mergedCase.hgu === false ? 'Tidak ada' : null} />
        <Row label="IUP" value={mergedCase.iup === true ? 'Ada' : mergedCase.iup === false ? 'Tidak ada' : null} />
        <Row label="Estimasi panen" value={mergedCase.estimatedHarvestYear} valueClass="warn" />
      </div>

      {onFlyTo && (
        <div className="object-inspector__actions">
          <button type="button" className="object-inspector__btn" onClick={() => onFlyTo(mergedCase)}>
            Lihat di peta
          </button>
        </div>
      )}
    </div>
  );
}
