import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { getChartColors, chartCommonProps } from './chartTheme.js';
import { useThemeContext } from '../../hooks/ThemeContext.js';

const DATA = [
  { year: 2015, forestHa: 37691.62 },
  { year: 2016, forestHa: 37263 },
  { year: 2017, forestHa: 36981 },
  { year: 2018, forestHa: 36710 },
  { year: 2019, forestHa: 36400 },
  { year: 2020, forestHa: 36050 },
  { year: 2021, forestHa: 35622 },
  { year: 2022, forestHa: 35194 },
  { year: 2023, forestHa: 34242 },
  { year: 2024, forestHa: 34000 },
  { year: 2025, forestHa: 33969.81 },
];

export default function ForestTrendChart() {
  const theme = useThemeContext();
  const c = getChartColors(theme);

  return (
    <div>
      <p style={{ color: c.text, fontSize: 11, marginBottom: 8, fontFamily: 'var(--font-mono)', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
        Tutupan hutan Sajingan Besar 2015–2025 (ha)
      </p>
      <ResponsiveContainer width="100%" height={180}>
        <AreaChart data={DATA} {...chartCommonProps}>
          <defs>
            <linearGradient id="forestGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={c.primary} stopOpacity={0.35} />
              <stop offset="95%" stopColor={c.primary} stopOpacity={0.02} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke={c.grid} vertical={false} />
          <XAxis dataKey="year" stroke={c.text} tick={{ fontSize: 11, fill: c.text }} axisLine={false} tickLine={false} />
          <YAxis stroke={c.text} tick={{ fontSize: 11, fill: c.text }} axisLine={false} tickLine={false}
            domain={[30000, 40000]} tickFormatter={(v) => `${(v/1000).toFixed(0)}k`} width={36} />
          <Tooltip
            contentStyle={{ background: c.panel, border: `1px solid ${c.border}`, borderRadius: 8, fontSize: 12 }}
            labelStyle={{ color: c.textStrong, fontWeight: 600 }}
            formatter={(v) => [`${v.toLocaleString('id-ID')} ha`, 'Tutupan Hutan']}
          />
          <Area type="monotone" dataKey="forestHa" stroke={c.primary} strokeWidth={2}
            fill="url(#forestGrad)" isAnimationActive animationDuration={1200} animationEasing="ease-out" />
          <ReferenceLine y={37691.62} stroke={c.primary} strokeDasharray="4 4" strokeOpacity={0.4}
            label={{ value: '2015', fill: c.text, fontSize: 10, position: 'insideTopLeft' }} />
        </AreaChart>
      </ResponsiveContainer>
      <p style={{ color: c.danger, fontSize: 11, marginTop: 4 }}>
        ↓ Kehilangan total: 3.721,81 ha dalam 10 tahun
      </p>
    </div>
  );
}
