// src/hooks/useTheme.js
//
// State + persist theme (dark/light). Nilai disimpan di localStorage
// supaya tidak reset tiap kali user buka lagi. Atribut `data-theme` di
// <html> yang jadi switch-nya — semua variabel warna di App.css bereaksi
// ke atribut itu (lihat blok `html[data-theme='light']`).
//
// Catatan flash-of-wrong-theme: initial value dibaca dari atribut yang
// sudah di-set lebih dulu oleh inline script kecil di index.html
// (sebelum React mount), supaya tidak ada kedipan dark→light pas load.

import { useEffect, useState } from 'react';

const STORAGE_KEY = 'sajingan-storymap-theme';

function getInitialTheme() {
  if (typeof document !== 'undefined' && document.documentElement.dataset.theme) {
    return document.documentElement.dataset.theme;
  }
  return 'dark';
}

export function useTheme() {
  const [theme, setTheme] = useState(getInitialTheme);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    try {
      localStorage.setItem(STORAGE_KEY, theme);
    } catch {
      // localStorage bisa gagal (mode private/incognito ketat) — abaikan,
      // toggle tetap jalan untuk sesi ini, cuma tidak persist.
    }
  }, [theme]);

  const toggleTheme = () => setTheme((t) => (t === 'dark' ? 'light' : 'dark'));

  return { theme, toggleTheme };
}
