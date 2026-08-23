// src/data/routes.js — Data asli dari Tabel 2 & 3 laporan PDF
//
// Berdasarkan wawancara pemilik PoD di lapangan:
// WKN dan KSS paling berpotensi menerima TBS dari ketiga lokasi.
// Chain: Lokasi kasus → PoD terdekat → Mill paling berpotensi

import { haversineKm } from '../utils/distance.js';
import { LAYER_CATALOG } from './layers.js';

export const POINT_TYPES = {
  case: { color: '#ff5a3c', label: 'Lokasi Kasus' },
  pod:  { color: '#f2c94c', label: 'PoD (Pengepul)' },
  mill: { color: '#4d8fe0', label: 'Mill/PKS' },
};

// Koordinat asli dari laporan
const CASE_LOCATIONS = [
  { id: 'case-1', label: 'Lokasi 1', type: 'case', coords: [109.57527, 1.65804] },
  { id: 'case-2', label: 'Lokasi 2', type: 'case', coords: [109.59320, 1.64645] },
  { id: 'case-3', label: 'Lokasi 3', type: 'case', coords: [109.58668, 1.62635] },
];

const POD_POINTS = [
  { id: 'pod-pais',       label: 'PoD Pais',       type: 'pod',  coords: [109.601757, 1.657105], distanceKm: 3.10 },
  { id: 'pod-baida',      label: 'PoD Baida',       type: 'pod',  coords: [109.604266, 1.653802], distanceKm: 3.57 },
  { id: 'pod-arpi',       label: 'PoD Arpi',        type: 'pod',  coords: [109.590249, 1.671903], distanceKm: 4.95 },
  { id: 'pod-pak-thomas', label: 'PoD Pak Thomas',  type: 'pod',  coords: [109.641092, 1.622351], distanceKm: 6.44 },
  { id: 'pod-ika',        label: 'PoD Ika',         type: 'pod',  coords: [109.596890, 1.687970], distanceKm: 7.54 },
];

// KSS dan WKN — dua mill yang disebut paling berpotensi berdasarkan wawancara
const MILL_POINTS = [
  { id: 'mill-kss', label: 'KSS (PT Kalimantan Subur Sawit)', type: 'mill', coords: [109.877572, 1.333598], distanceKm: 61.07 },
  { id: 'mill-wkn', label: 'WKN (PT Wawasan Kebun Nusantara)', type: 'mill', coords: [109.817139, 1.266890], distanceKm: 72.02 },
];

// Chain berdasarkan PoD terdekat dan tujuan mill dari wawancara
export const routeChains = [
  {
    id: 'chain-1',
    pointIds: ['case-1', 'pod-pais', 'mill-kss'],
    segments: [
      { fromLabel: 'Lokasi 1', toLabel: 'PoD Pais', distanceKm: 3.10 },
      { fromLabel: 'PoD Pais', toLabel: 'KSS', distanceKm: haversineKm([109.601757, 1.657105], [109.877572, 1.333598]) },
    ],
  },
  {
    id: 'chain-2',
    pointIds: ['case-2', 'pod-baida', 'mill-wkn'],
    segments: [
      { fromLabel: 'Lokasi 2', toLabel: 'PoD Baida', distanceKm: 3.57 },
      { fromLabel: 'PoD Baida', toLabel: 'WKN', distanceKm: haversineKm([109.604266, 1.653802], [109.817139, 1.266890]) },
    ],
  },
  {
    id: 'chain-3',
    pointIds: ['case-3', 'pod-arpi', 'mill-kss'],
    segments: [
      { fromLabel: 'Lokasi 3', toLabel: 'PoD Arpi', distanceKm: 4.95 },
      { fromLabel: 'PoD Arpi', toLabel: 'KSS', distanceKm: haversineKm([109.590249, 1.671903], [109.877572, 1.333598]) },
    ],
  },
];

export const routePoints = [
  ...CASE_LOCATIONS,
  ...POD_POINTS,
  ...MILL_POINTS,
];

export { haversineKm };
