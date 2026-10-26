import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { chartColors } from './chartTheme.js';

// Dari laporan: 304.76 ha deforestasi peat forest, 140.48 ha (46.1%) jadi sawit
const PEAT_DATA = [
  { name: 'Menjadi Sawit (46,1%)', value: 140.48 },
  { name: 'Tutupan Lain (53,9%)', value: 164.28 },
];

const FOREST_TYPE_DATA = [
  { name: 'Hutan Biasa (92%)', value: 92 },
  { name: 'Peat Forest (8%)', value: 8 },
];

const RADIAN = Math.PI / 180;
function CustomLabel({ cx, cy, midAngle, innerRadius, outerRadius, percent, name }) {
  const r = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + r * Math.cos(-midAngle * RADIAN);
  const y = cy + r * Math.sin(-midAngle * RADIAN);
  if (percent < 0.08) return null;
  return (
    <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" fontSize={11} fontWeight="600">
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
}

export default function ForestShareDonut() {
  const c = chartColors();

  return (
    <div style={{ display: 'flex', gap: 8 }}>
      <div style={{ flex: 1 }}>
        <p style={{ color: c.text, fontSize: 10, textAlign: 'center', marginBottom: 4, fontFamily: 'var(--zl-font-mono)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Tipe deforestasi</p>
        <ResponsiveContainer width="100%" height={150}>
          <PieChart>
            <Pie data={FOREST_TYPE_DATA} cx="50%" cy="50%" outerRadius={56} dataKey="value"
              isAnimationActive animationDuration={800} labelLine={false} label={CustomLabel}>
              <Cell fill={c.secondary} />
              <Cell fill={c.danger} />
            </Pie>
            <Tooltip contentStyle={{ background: c.panel, border: `1px solid ${c.border}`, fontSize: 11, borderRadius: 6 }}
              formatter={(v, name) => [`${v}%`, name]} />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div style={{ flex: 1 }}>
        <p style={{ color: c.danger, fontSize: 10, textAlign: 'center', marginBottom: 4, fontFamily: 'var(--zl-font-mono)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Nasib gambut yang hilang</p>
        <ResponsiveContainer width="100%" height={150}>
          <PieChart>
            <Pie data={PEAT_DATA} cx="50%" cy="50%" outerRadius={56} dataKey="value"
              isAnimationActive animationDuration={1000} animationBegin={200} labelLine={false} label={CustomLabel}>
              <Cell fill={c.danger} />
              <Cell fill={c.grid} />
            </Pie>
            <Tooltip contentStyle={{ background: c.panel, border: `1px solid ${c.border}`, fontSize: 11, borderRadius: 6 }}
              formatter={(v) => [`${v.toFixed(1)} ha`]} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
