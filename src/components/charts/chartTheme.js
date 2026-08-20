// src/components/charts/chartTheme.js — warna/style dipakai semua chart.
import { theme } from '../../theme.js';

export const chartColors = {
  primary: theme.colors.accent,
  secondary: theme.colors.forestIntact,
  danger: theme.colors.forestLoss,
  grid: '#2a352f',
  text: theme.colors.textMuted,
};

export const chartCommonProps = {
  margin: { top: 8, right: 16, left: 0, bottom: 8 },
};
