// src/hooks/ThemeContext.js
//
// Dipakai supaya komponen manapun (termasuk chart Recharts, yang perlu
// warna sebagai VALUE JS biasa, bukan CSS var()) tahu tema aktif secara
// SINKRON dengan state React — bukan baca ulang CSS var lewat
// getComputedStyle (yang rawan "telat satu render" karena atribut
// data-theme baru di-set di useEffect, setelah render selesai).

import { createContext, useContext } from 'react';

export const ThemeContext = createContext('dark');

export function useThemeContext() {
  return useContext(ThemeContext);
}
