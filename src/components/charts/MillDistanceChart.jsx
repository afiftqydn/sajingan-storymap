import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { getChartColors } from './chartTheme.js';
import { useThemeContext } from '../../hooks/ThemeContext.js';
import { potentialMills } from '../../data/reportData.js';

export default function MillDistanceChart() {
  const theme = useThemeContext();
  const c = getChartColors(theme);
  const data = potentialMills.map((m) => ({ name: m.name, jarak: m.distanceKm ?? 0 }));

  if (data.length === 0) {
    return <p style={{ color: c.text, fontSize: 13 }}>Belum ada data mill/dealer potensial.</p>;
  }

  return (
    <ResponsiveContainer width="100%" height={200}>
      <BarChart data={data} layout="vertical">
        <CartesianGrid strokeDasharray="3 3" stroke={c.grid} />
        <XAxis type="number" stroke={c.text} />
        <YAxis type="category" dataKey="name" stroke={c.text} width={120} />
        <Tooltip
          contentStyle={{ background: c.panel, border: `1px solid ${c.border}` }}
          labelStyle={{ color: c.textStrong }}
          itemStyle={{ color: c.textStrong }}
        />
        <Bar dataKey="jarak" fill={c.primary} />
      </BarChart>
    </ResponsiveContainer>
  );
}
