import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell, LabelList,
} from 'recharts';
import { getChartColors, chartCommonProps } from './chartTheme.js';
import { useThemeContext } from '../../hooks/ThemeContext.js';
import { deforestationTrend } from '../../data/reportData.js';

export default function DeforestationTrendChart() {
  const theme = useThemeContext();
  const c = getChartColors(theme);
  const peak = Math.max(...deforestationTrend.map((d) => d.lossHa));

  return (
    <div>
      <p style={{ color: c.text, fontSize: 11, marginBottom: 8, fontFamily: 'var(--font-mono)', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
        Deforestasi per tahun (ha) — Kec. Sajingan Besar
      </p>
      <ResponsiveContainer width="100%" height={180}>
        <BarChart data={deforestationTrend} {...chartCommonProps}>
          <CartesianGrid strokeDasharray="3 3" stroke={c.grid} vertical={false} />
          <XAxis dataKey="year" stroke={c.text} tick={{ fontSize: 12, fill: c.text }} axisLine={false} tickLine={false} />
          <YAxis stroke={c.text} tick={{ fontSize: 11, fill: c.text }} axisLine={false} tickLine={false} unit=" ha" width={52} />
          <Tooltip
            contentStyle={{ background: c.panel, border: `1px solid ${c.border}`, borderRadius: 8, fontSize: 12 }}
            labelStyle={{ color: c.textStrong, fontWeight: 600 }}
            itemStyle={{ color: c.textStrong }}
            formatter={(v) => [`${v.toLocaleString('id-ID')} ha`, 'Deforestasi']}
          />
          <Bar dataKey="lossHa" radius={[4, 4, 0, 0]} isAnimationActive animationDuration={900} animationEasing="ease-out">
            {deforestationTrend.map((d) => (
              <Cell key={d.year} fill={d.lossHa === peak ? c.danger : c.secondary} />
            ))}
            <LabelList dataKey="lossHa" position="top" style={{ fontSize: 10, fill: c.text }} formatter={(v) => v.toFixed(0)} />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
      <p style={{ color: c.danger, fontSize: 11, marginTop: 4 }}>
        ▲ Puncak 2023: 951 ha — naik 122% dari 2022
      </p>
    </div>
  );
}
