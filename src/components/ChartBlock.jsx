// src/components/ChartBlock.jsx
//
// Pemetaan id chart (string, dipakai di chapters.js field `chart`) ke
// komponen chart yang sebenarnya. Nambah chart baru = tambah komponennya
// di components/charts/, lalu daftarkan id-nya di CHART_MAP di bawah.

import ForestTrendChart from './charts/ForestTrendChart.jsx';
import ForestShareDonut from './charts/ForestShareDonut.jsx';
import VillageComparisonChart from './charts/VillageComparisonChart.jsx';
import CaseAreaChart from './charts/CaseAreaChart.jsx';
import MillDistanceChart from './charts/MillDistanceChart.jsx';
import DeforestationTrendChart from './charts/DeforestationTrendChart.jsx';

const CHART_MAP = {
  'forest-trend': ForestTrendChart,
  'forest-share-donut': ForestShareDonut,
  'village-comparison': VillageComparisonChart,
  'case-area': CaseAreaChart,
  'mill-distance': MillDistanceChart,
  'deforestation-trend': DeforestationTrendChart,
};

export default function ChartBlock({ chartId }) {
  const ChartComponent = CHART_MAP[chartId];
  if (!ChartComponent) {
    console.warn(`ChartBlock: id chart "${chartId}" tidak dikenal.`);
    return null;
  }
  return (
    <div className="chart-block">
      <ChartComponent />
    </div>
  );
}
