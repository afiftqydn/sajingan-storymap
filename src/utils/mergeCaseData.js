// Gabungkan satu entry reportData.js `cases[]` dengan `properties` fitur
// polygon digitasi asli yang cocok (dari public/geojson/lokasi-N.geojson
// — caller yang fetch & cocokkan by name, fungsi ini tidak fetch apa
// pun). Dipakai ObjectInspector.
//
// SENGAJA tidak menimpa field reportCase dengan nilai dari geojson —
// dua sumber ini kadang tidak sepakat (mis. reportCase.yearOpened vs
// geojsonProperties.Thn_Tanam/tahunTanam untuk Lokasi 3: 2022 vs 2025),
// jadi properti geojson mentah diekspos terpisah di bawah key `geo`
// supaya UI bisa nampilin DUA-DUANYA kalau beda, bukan diam-diam milih
// salah satu.
export function mergeCaseData(reportCase, geojsonProperties) {
  return {
    ...reportCase,
    geo: geojsonProperties ?? null,
  };
}
