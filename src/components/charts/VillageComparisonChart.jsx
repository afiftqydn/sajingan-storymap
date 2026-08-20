import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { chartColors } from './chartTheme.js';
import { villages } from '../../data/reportData.js';

export default function VillageComparisonChart() {
  const data = villages.map((v) => ({
    name: v.name,
    total: v.villageAreaHa ?? 0,
    dalamHutan: v.areaInForestHa ?? 0,
  }));

  return (
    <ResponsiveContainer width="100%" height={260}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke={chartColors.grid} />
        <XAxis dataKey="name" stroke={chartColors.text} tick={{ fontSize: 11 }} />
        <YAxis stroke={chartColors.text} />
        <Tooltip contentStyle={{ background: '#141d19', border: 'none' }} />
        <Bar dataKey="total" fill={chartColors.secondary} />
        <Bar dataKey="dalamHutan" fill={chartColors.danger} />
      </BarChart>
    </ResponsiveContainer>
  );
}
