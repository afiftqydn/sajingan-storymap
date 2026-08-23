import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { getChartColors } from './chartTheme.js';
import { useThemeContext } from '../../hooks/ThemeContext.js';
import { cases } from '../../data/reportData.js';

export default function CaseAreaChart() {
  const theme = useThemeContext();
  const c = getChartColors(theme);
  const data = cases.map((c2) => ({ name: c2.name, luas: c2.areaHa ?? 0 }));

  return (
    <ResponsiveContainer width="100%" height={200}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke={c.grid} />
        <XAxis dataKey="name" stroke={c.text} />
        <YAxis stroke={c.text} />
        <Tooltip
          contentStyle={{ background: c.panel, border: `1px solid ${c.border}` }}
          labelStyle={{ color: c.textStrong }}
          itemStyle={{ color: c.textStrong }}
        />
        <Bar dataKey="luas" fill={c.primary} />
      </BarChart>
    </ResponsiveContainer>
  );
}
