import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { chartColors } from './chartTheme.js';
import { cases } from '../../data/reportData.js';

export default function CaseAreaChart() {
  const data = cases.map((c) => ({ name: c.name, luas: c.areaHa ?? 0 }));

  return (
    <ResponsiveContainer width="100%" height={200}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke={chartColors.grid} />
        <XAxis dataKey="name" stroke={chartColors.text} />
        <YAxis stroke={chartColors.text} />
        <Tooltip contentStyle={{ background: '#141d19', border: 'none' }} />
        <Bar dataKey="luas" fill={chartColors.primary} />
      </BarChart>
    </ResponsiveContainer>
  );
}
