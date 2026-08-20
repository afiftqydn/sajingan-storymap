import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { chartColors } from './chartTheme.js';
import { potentialMills } from '../../data/reportData.js';

export default function MillDistanceChart() {
  const data = potentialMills.map((m) => ({ name: m.name, jarak: m.distanceKm ?? 0 }));

  if (data.length === 0) {
    return <p style={{ color: chartColors.text, fontSize: 13 }}>Belum ada data mill/dealer potensial.</p>;
  }

  return (
    <ResponsiveContainer width="100%" height={200}>
      <BarChart data={data} layout="vertical">
        <CartesianGrid strokeDasharray="3 3" stroke={chartColors.grid} />
        <XAxis type="number" stroke={chartColors.text} />
        <YAxis type="category" dataKey="name" stroke={chartColors.text} width={120} />
        <Tooltip contentStyle={{ background: '#141d19', border: 'none' }} />
        <Bar dataKey="jarak" fill={chartColors.primary} />
      </BarChart>
    </ResponsiveContainer>
  );
}
