import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { chartColors } from './chartTheme.js';
import { forestTrend } from '../../data/reportData.js';

export default function ForestTrendChart() {
  return (
    <ResponsiveContainer width="100%" height={220}>
      <AreaChart data={forestTrend}>
        <CartesianGrid strokeDasharray="3 3" stroke={chartColors.grid} />
        <XAxis dataKey="year" stroke={chartColors.text} />
        <YAxis stroke={chartColors.text} />
        <Tooltip contentStyle={{ background: '#141d19', border: 'none' }} />
        <Area
          type="monotone"
          dataKey="forestHa"
          stroke={chartColors.secondary}
          fill={chartColors.secondary}
          fillOpacity={0.25}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
