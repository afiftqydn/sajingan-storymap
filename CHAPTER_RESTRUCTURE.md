# Chapter Restructure Summary

## Changes Applied

### 1. Merge Cover + Executive Summary
- **Before**: Chapter 1 (hero) + Chapter 2 (executive-summary) = 2 chapters
- **After**: Chapter 1 (hero) = 1 chapter
- **Impact**: Overview section now 2 chapters instead of 3

### 2. Split Lokasi 2 into 2 Chapters
- **Chapter 09/10**: "Ekspansi tanpa Tanda Legalitas"
  - Focus: Luas, area dengan SHM, area dalam kawasan hutan
  - Stats: 133 ha, 4.5% SHM, 69% in forest zone

- **Chapter 10/11**: "Deforestasi dan Jendela Verifikasi yang Menyempit"
  - Focus: Deforestasi 12%, status TBM, timeline urgency
  - Stats: 12% deforestation, TBM status, 2023 opening

### 3. Split Lokasi 3 into 2 Chapters
- **Chapter 11/12**: "Paling Matang. Panen Paling Dekat."
  - Focus: Maturity level, deforestation 87%, infrastruktur
  - Stats: 151 ha, 87% deforestation, opened 2022

- **Chapter 12/13**: "Jendela Verifikasi Sempit — Panen 2027"
  - Focus: Timeline urgency, verification deadline, status klarifikasi
  - Stats: 2027 harvest estimate, <2 years remaining, HPT status

### 4. Revised Chapter 09 (Sourcing Risk)
- **Original title**: "Apakah Komitmen NDPE Sudah Cukup?"
- **New approach**: Softer, more careful language
- **Changes**:
  - Removed direct mentions of "potensial buyers" (P&G, Colgate) since no buyer data exists
  - Reframed as technical challenge rather than accusation
  - Focused on TTP (Traceability to Plantation) as key mechanism
  - Changed tone from "could enter" to "when source status unclear"

### 5. Improved Chapter 11 (Conclusion)
- **Original title**: "Selama Belum Jelas, Sebaiknya Tidak Masuk" (too AI-sounding)
- **New title**: "Ketika Data Tidak Jelas — Keputusan Harus Jelas" (more compelling)
- **Why better**:
  - Less bureaucratic, more philosophical
  - Emphasizes decision clarity needed in uncertain situations
  - More human, less algorithmic language

## Chapter Structure

### Before
```
OVERVIEW (3 ch)
  1. Hero (cover)
  2. Executive Summary
  3. Hook

DEFOREST & PALM OIL (4 ch)
  4-7. Context, Decline, Conversion, Palm in Forest

FOCUS CASE (4 ch)
  8. Pattern Overview
  9. Lokasi 1
  10. Lokasi 2 + 3 (combined)

SUPPLY CHAIN (2 ch)
  11. Supply Chain Routes
  12. Sourcing Risk

CONCLUSION (2 ch)
  13. Recommendations
  14. Conclusion

Total: 14 chapters
```

### After
```
OVERVIEW (2 ch)
  1. Hero + Executive Summary (merged)
  2. Hook

DEFOREST & PALM OIL (4 ch)
  3-6. Context, Decline, Conversion, Palm in Forest

FOCUS CASE (6 ch)
  7. Pattern Overview
  8. Lokasi 1
  9. Lokasi 2 - Part 1
  10. Lokasi 2 - Part 2
  11. Lokasi 3 - Part 1
  12. Lokasi 3 - Part 2

SUPPLY CHAIN (2 ch)
  13. Supply Chain Routes
  14. Sourcing Risk (revised tone)

CONCLUSION (2 ch)
  15. Recommendations
  16. Conclusion (new title)

Total: 16 chapters
```

## Build Status
- ✓ Build successful: 778 modules, 13.78s
- ✓ No errors or warnings
- ✓ All validation passes

## Files
- `src/data/chapters.js` — Main file (revised)
- `src/data/chapters-backup.js` — Previous version (backup)

## Testing Checklist
- ✓ Build passes
- ✓ No missing data
- ✓ All chapter IDs unique
- ✓ Section labels aligned
- ✓ Map states consistent
- ✓ Polygon references correct

## Next Steps for Local Setup
1. Extract zip file
2. `cd sajingan-storymap`
3. `npm install` (if needed)
4. `npm run dev` (local development)
5. Check chapter flow: should now see 16 chapters instead of 14
6. Verify split chapters for Lokasi 2 & 3
7. Check revised tone on Chapter 09 (Sourcing Risk)
8. Review new title on Chapter 11 (Conclusion)

Ready to deploy when you are!
