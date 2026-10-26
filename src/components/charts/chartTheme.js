// Recharts butuh warna sebagai string biasa; nilainya diambil dari token
// (styles/tokens.css) lewat theme.js.
import { C } from '../../theme.js';

export function chartColors() {
  return {
    primary: C.accent,
    secondary: C.moss,
    danger: C.critical,
    grid: C.surface3,
    text: C.textSecondary,
    textStrong: C.text,
    panel: C.surface,
    border: C.surface3,
  };
}

export const chartCommonProps = {
  margin: { top: 8, right: 16, left: 0, bottom: 8 },
};
