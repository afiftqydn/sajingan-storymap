import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { chartColors } from './chartTheme.js';
import { deforestationTrend } from '../../data/reportData.js';

export default function DeforestationTrendChart() {
  const hasEstimated = deforestationTrend.some((d) => d.estimated);

  return (
    <div>
      {hasEstimated && (
        <p style={{ color: chartColors.danger, fontSize: 12, marginBottom: 4 }}>
          ⚠ Sebagian angka masih perkiraan pembacaan grafik laporan.
        </p>
      )}
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={deforestationTrend}>
          <CartesianGrid strokeDasharray="3 3" stroke={chartColors.grid} />
          <XAxis dataKey="year" stroke={chartColors.text} />
          <YAxis stroke={chartColors.text} />
          <Tooltip contentStyle={{ background: '#141d19', border: 'none' }} />
          <Bar dataKey="lossHa" fill={chartColors.danger} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
