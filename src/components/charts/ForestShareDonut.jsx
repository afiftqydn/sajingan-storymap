import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { chartColors } from './chartTheme.js';

// TODO: ganti value placeholder dengan angka asli breakdown hutan hilang
const data = [
  { name: 'Hutan → Sawit', value: 70 },
  { name: 'Hutan → Lainnya', value: 30 },
];
const COLORS = [chartColors.primary, chartColors.grid];

export default function ForestShareDonut() {
  return (
    <ResponsiveContainer width="100%" height={220}>
      <PieChart>
        <Pie data={data} dataKey="value" innerRadius={50} outerRadius={80} paddingAngle={2}>
          {data.map((entry, i) => (
            <Cell key={entry.name} fill={COLORS[i % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip contentStyle={{ background: '#141d19', border: 'none' }} />
      </PieChart>
    </ResponsiveContainer>
  );
}
