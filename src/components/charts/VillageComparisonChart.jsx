import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend, LabelList,
} from 'recharts';
import { getChartColors, chartCommonProps } from './chartTheme.js';
import { useThemeContext } from '../../hooks/ThemeContext.js';

const DATA = [
  { desa: "Sanatab", palmTotal: 1931.78, palmInForest: 1284.79, pct: 66.5 },
  { desa: "Kaliau'", palmTotal: 5175.65, palmInForest: 3241.07, pct: 62.6 },
  { desa: "Santaban", palmTotal: 914.04, palmInForest: null, pct: null },
  { desa: "Sebunga'", palmTotal: 16907.82, palmInForest: null, pct: null },
  { desa: "Sg. Bening", palmTotal: 5175.14, palmInForest: null, pct: null },
];

export default function VillageComparisonChart() {
  const theme = useThemeContext();
  const c = getChartColors(theme);

  return (
    <div>
      <p style={{ color: c.text, fontSize: 11, marginBottom: 8, fontFamily: 'var(--font-mono)', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
        Luas kebun kelapa sawit per desa (ha)
      </p>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={DATA} layout="vertical" {...chartCommonProps}>
          <CartesianGrid strokeDasharray="3 3" stroke={c.grid} horizontal={false} />
          <XAxis type="number" stroke={c.text} tick={{ fontSize: 11, fill: c.text }} axisLine={false} tickLine={false} unit=" ha" />
          <YAxis type="category" dataKey="desa" stroke={c.text} tick={{ fontSize: 11, fill: c.text }} axisLine={false} tickLine={false} width={62} />
          <Tooltip
            contentStyle={{ background: c.panel, border: `1px solid ${c.border}`, borderRadius: 8, fontSize: 12 }}
            labelStyle={{ color: c.textStrong, fontWeight: 600 }}
            formatter={(v, name) => [`${v?.toLocaleString('id-ID') ?? '—'} ha`, name === 'palmTotal' ? 'Total Sawit' : 'Dalam Kawasan']}
          />
          <Bar dataKey="palmTotal" fill={c.secondary} radius={[0, 4, 4, 0]} isAnimationActive animationDuration={800} name="palmTotal" />
          <Bar dataKey="palmInForest" fill={c.danger} radius={[0, 4, 4, 0]} isAnimationActive animationDuration={1000} animationBegin={200} name="palmInForest">
            <LabelList dataKey="pct" position="right" style={{ fontSize: 10, fill: c.danger }} formatter={(v) => v ? `${v}%` : ''} />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
      <div style={{ display: 'flex', gap: 12, marginTop: 6 }}>
        <span style={{ fontSize: 10, color: c.text }}><span style={{ display:'inline-block', width:10, height:10, background:c.secondary, borderRadius:2, marginRight:4 }}/>Total sawit</span>
        <span style={{ fontSize: 10, color: c.danger }}><span style={{ display:'inline-block', width:10, height:10, background:c.danger, borderRadius:2, marginRight:4 }}/>Dalam kawasan hutan</span>
      </div>
    </div>
  );
}
