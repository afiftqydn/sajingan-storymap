import { useState, useEffect, useMemo } from 'react';
import { cases } from '../data/reportData.js';
import { mergeCaseData } from '../utils/mergeCaseData.js';

// File individual per lokasi (properti mentah QGIS: Thn_Tanam, Status_Kws,
// Desa, Imagery, Aktor) — DIBEDAKAN dari lokasi-fokus.geojson (versi
// ternormalisasi yang dipakai peta) supaya Object Inspector bisa
// nampilin field yang tidak ada di versi ternormalisasi, termasuk kalau
// nilainya beda dari reportData.js (lihat mergeCaseData.js).
const CASE_GEOJSON_PATH = {
  'lokasi-1': '/geojson/lokasi-1.geojson',
  'lokasi-2': '/geojson/lokasi-2.geojson',
  'lokasi-3': '/geojson/lokasi-3.geojson',
};

// Dipakai InteractiveMapView.jsx: fetch properti GeoJSON asli lalu
// gabung dengan reportData.cases[] (mergeCaseData.js) untuk callout
// quick-summary (ObjectInspector.jsx) waktu polygon studi-kasus diklik.
export function useCaseInspectorData(caseId) {
  const [geoProps, setGeoProps] = useState(null);

  useEffect(() => {
    if (!caseId) { setGeoProps(null); return; }
    let cancelled = false;
    fetch(CASE_GEOJSON_PATH[caseId])
      .then((res) => (res.ok ? res.json() : null))
      .then((geojson) => {
        if (cancelled) return;
        setGeoProps(geojson?.features?.[0]?.properties ?? null);
      })
      .catch(() => { if (!cancelled) setGeoProps(null); });
    return () => { cancelled = true; };
  }, [caseId]);

  const selectedCase = useMemo(() => {
    const reportCase = cases.find((c) => c.id === caseId);
    if (!reportCase) return null;
    return mergeCaseData(reportCase, geoProps);
  }, [caseId, geoProps]);

  return { selectedCase };
}

export { CASE_GEOJSON_PATH };
