// src/data/routes.js — Data asli dari Tabel 2 & 3 laporan PDF
//
// 9 Mill/PKS + 5 PoD + 3 Lokasi Kasus
// Semua rute start dari center 3 lokasi [109.581, 1.6477]

import { haversineKm } from '../utils/distance.js';
import {
  centerToMillWHS,
  centerToMillLL,
  centerToMillWDBP,
  centerToMillAI3,
  centerToMillCP1,
  centerToMillCP2,
  centerToMillKSS,
  centerToMillWKN,
  centerToMillMM,
  podPaisToCenter,
  podBaidaToCenter,
  podArpiToCenter,
  podPakThomasToCenter,
  podIkaToCenter,
} from './routePaths.js';

export const POINT_TYPES = {
  case: { color: '#ff5a3c', label: 'Lokasi Kasus' },
  pod:  { color: '#f2c94c', label: 'PoD (Pengepul)' },
  mill: { color: '#4d8fe0', label: 'Mill/PKS' },
};

const CASE_LOCATIONS = [
  { id: 'case-1', label: 'Lokasi 1', type: 'case', coords: [109.57527, 1.65804] },
  { id: 'case-2', label: 'Lokasi 2', type: 'case', coords: [109.59320, 1.64645] },
  { id: 'case-3', label: 'Lokasi 3', type: 'case', coords: [109.58668, 1.62635] },
];

// Titik center 3 lokasi — start semua rute
const CENTER = { id: 'center', label: 'Center Lokasi', type: 'case', coords: [109.581, 1.6477] };

const POD_POINTS = [
  { id: 'pod-pais',       label: 'PoD Pais',       type: 'pod',  coords: [109.601757, 1.657105], distanceKm: 3.10 },
  { id: 'pod-baida',      label: 'PoD Baida',      type: 'pod',  coords: [109.604266, 1.653802], distanceKm: 3.57 },
  { id: 'pod-arpi',       label: 'PoD Arpi',       type: 'pod',  coords: [109.590249, 1.671903], distanceKm: 4.95 },
  { id: 'pod-pak-thomas', label: 'PoD Pak Thomas', type: 'pod',  coords: [109.589432, 1.682176], distanceKm: 6.44 },
  { id: 'pod-ika',        label: 'PoD Ika',        type: 'pod',  coords: [109.596890, 1.687970], distanceKm: 7.54 },
];

const MILL_POINTS = [
  { id: 'mill-whs',  label: 'Wana Hijau Semesta',   type: 'mill', coords: [109.597999, 1.515000], distanceKm: 25.67 },
  { id: 'mill-ll',   label: 'Ledo Lestari',          type: 'mill', coords: [109.716423, 1.464745], distanceKm: 31.26 },
  { id: 'mill-wdbp', label: 'Wirata Daya Bangun Persada', type: 'mill', coords: [109.602999, 1.429400], distanceKm: 35.36 },
  { id: 'mill-ai3',  label: 'Agronusa Investama 3',  type: 'mill', coords: [109.537148, 1.421490], distanceKm: 43.88 },
  { id: 'mill-cp1',  label: 'Ceria Prima 1',         type: 'mill', coords: [109.684100, 1.368900], distanceKm: 44.51 },
  { id: 'mill-cp2',  label: 'Ceria Prima 2',         type: 'mill', coords: [109.666917, 1.300768], distanceKm: 53.87 },
  { id: 'mill-kss',  label: 'KSS (PT Kalimantan Subur Sawit)', type: 'mill', coords: [109.877572, 1.333598], distanceKm: 61.07 },
  { id: 'mill-wkn',  label: 'WKN (PT Wawasan Kebun Nusantara)', type: 'mill', coords: [109.817139, 1.266890], distanceKm: 72.02 },
  { id: 'mill-mm',   label: 'Musim Mas',             type: 'mill', coords: [109.383631, 1.358028], distanceKm: 80.86 },
];

// Rute: center 3 lokasi → tiap mill (9 chain)
// + segmen PoD → center untuk 5 PoD (disambung ke chain mill terdekat)
export const routeChains = [
  // --- 9 rute Center → Mill ---
  {
    id: 'chain-mill-whs',
    pointIds: ['center', 'mill-whs'],
    segments: [
      { fromLabel: 'Center', toLabel: 'Wana Hijau Semesta', distanceKm: 25.67, pathCoords: centerToMillWHS },
    ],
  },
  {
    id: 'chain-mill-ll',
    pointIds: ['center', 'mill-ll'],
    segments: [
      { fromLabel: 'Center', toLabel: 'Ledo Lestari', distanceKm: 31.26, pathCoords: centerToMillLL },
    ],
  },
  {
    id: 'chain-mill-wdbp',
    pointIds: ['center', 'mill-wdbp'],
    segments: [
      { fromLabel: 'Center', toLabel: 'Wirata Daya Bangun Persada', distanceKm: 35.36, pathCoords: centerToMillWDBP },
    ],
  },
  {
    id: 'chain-mill-ai3',
    pointIds: ['center', 'mill-ai3'],
    segments: [
      { fromLabel: 'Center', toLabel: 'Agronusa Investama 3', distanceKm: 43.88, pathCoords: centerToMillAI3 },
    ],
  },
  {
    id: 'chain-mill-cp1',
    pointIds: ['center', 'mill-cp1'],
    segments: [
      { fromLabel: 'Center', toLabel: 'Ceria Prima 1', distanceKm: 44.51, pathCoords: centerToMillCP1 },
    ],
  },
  {
    id: 'chain-mill-cp2',
    pointIds: ['center', 'mill-cp2'],
    segments: [
      { fromLabel: 'Center', toLabel: 'Ceria Prima 2', distanceKm: 53.87, pathCoords: centerToMillCP2 },
    ],
  },
  {
    id: 'chain-mill-kss',
    pointIds: ['center', 'mill-kss'],
    segments: [
      { fromLabel: 'Center', toLabel: 'KSS', distanceKm: 61.07, pathCoords: centerToMillKSS },
    ],
  },
  {
    id: 'chain-mill-wkn',
    pointIds: ['center', 'mill-wkn'],
    segments: [
      { fromLabel: 'Center', toLabel: 'WKN', distanceKm: 72.02, pathCoords: centerToMillWKN },
    ],
  },
  {
    id: 'chain-mill-mm',
    pointIds: ['center', 'mill-mm'],
    segments: [
      { fromLabel: 'Center', toLabel: 'Musim Mas', distanceKm: 80.86, pathCoords: centerToMillMM },
    ],
  },
  // --- 5 rute PoD → Center (arah sebaliknya: TBS dari kebun ke PoD ke center) ---
  {
    id: 'chain-pod-pais',
    pointIds: ['pod-pais', 'center'],
    segments: [
      { fromLabel: 'PoD Pais', toLabel: 'Center', distanceKm: 3.10, pathCoords: podPaisToCenter },
    ],
  },
  {
    id: 'chain-pod-baida',
    pointIds: ['pod-baida', 'center'],
    segments: [
      { fromLabel: 'PoD Baida', toLabel: 'Center', distanceKm: 3.57, pathCoords: podBaidaToCenter },
    ],
  },
  {
    id: 'chain-pod-arpi',
    pointIds: ['pod-arpi', 'center'],
    segments: [
      { fromLabel: 'PoD Arpi', toLabel: 'Center', distanceKm: 4.95, pathCoords: podArpiToCenter },
    ],
  },
  {
    id: 'chain-pod-pak-thomas',
    pointIds: ['pod-pak-thomas', 'center'],
    segments: [
      { fromLabel: 'PoD Pak Thomas', toLabel: 'Center', distanceKm: 6.44, pathCoords: podPakThomasToCenter },
    ],
  },
  {
    id: 'chain-pod-ika',
    pointIds: ['pod-ika', 'center'],
    segments: [
      { fromLabel: 'PoD Ika', toLabel: 'Center', distanceKm: 7.54, pathCoords: podIkaToCenter },
    ],
  },
];

export const routePoints = [
  CENTER,
  ...CASE_LOCATIONS,
  ...POD_POINTS,
  ...MILL_POINTS,
];

export { haversineKm };
