// src/utils/validateChapters.js
// Validate chapter data structure on app load to catch typos/missing fields early

const REQUIRED_FIELDS = ['id', 'section', 'title', 'text', 'mapState'];
const VALID_SECTIONS = ['intro', 'problem', 'evidence', 'consequence', 'penutup'];
const VALID_TYPES = ['hero', 'hook', 'standard'];

export function validateChapters(chapters, sectionLabels) {
  const errors = [];

  if (!Array.isArray(chapters) || chapters.length === 0) {
    errors.push('Chapters must be a non-empty array');
    return errors;
  }

  chapters.forEach((chapter, idx) => {
    const prefix = `Chapter [${idx}] (id: "${chapter.id}")`;

    // Check required fields
    REQUIRED_FIELDS.forEach((field) => {
      if (!(field in chapter) || chapter[field] === null || chapter[field] === undefined) {
        errors.push(`${prefix}: Missing required field "${field}"`);
      }
    });

    // Validate id is unique
    const duplicates = chapters.filter((c) => c.id === chapter.id);
    if (duplicates.length > 1) {
      errors.push(`${prefix}: ID is not unique (found ${duplicates.length} chapters with same id)`);
    }

    // Validate section exists in SECTION_LABELS
    if (chapter.section && !Object.keys(sectionLabels).includes(chapter.section)) {
      errors.push(`${prefix}: Invalid section "${chapter.section}". Must be one of: ${Object.keys(sectionLabels).join(', ')}`);
    }

    // Validate type if provided
    if (chapter.type && !VALID_TYPES.includes(chapter.type)) {
      errors.push(`${prefix}: Invalid type "${chapter.type}". Must be one of: ${VALID_TYPES.join(', ')}`);
    }

    // Validate mapState structure
    if (chapter.mapState) {
      const { center, zoom, pitch, bearing } = chapter.mapState;
      if (!Array.isArray(center) || center.length !== 2) {
        errors.push(`${prefix}: mapState.center must be [lng, lat] array`);
      }
      if (typeof zoom !== 'number' || zoom < 0 || zoom > 24) {
        errors.push(`${prefix}: mapState.zoom must be a number between 0-24`);
      }
      if (typeof pitch !== 'number' || pitch < 0 || pitch > 60) {
        errors.push(`${prefix}: mapState.pitch must be a number between 0-60`);
      }
      if (typeof bearing !== 'number') {
        errors.push(`${prefix}: mapState.bearing must be a number`);
      }
    }

    // Validate arrays if provided
    if (chapter.polygons && !Array.isArray(chapter.polygons)) {
      errors.push(`${prefix}: polygons must be an array`);
    }
    if (chapter.stats && !Array.isArray(chapter.stats)) {
      errors.push(`${prefix}: stats must be an array`);
    }
    if (chapter.images && !Array.isArray(chapter.images)) {
      errors.push(`${prefix}: images must be an array`);
    }
    if (chapter.footnotes && !Array.isArray(chapter.footnotes)) {
      errors.push(`${prefix}: footnotes must be an array`);
    }
  });

  return errors;
}

export function logValidationErrors(errors) {
  if (errors.length === 0) return true;

  console.error('❌ Chapter data validation failed:');
  errors.forEach((err) => console.error(`   - ${err}`));

  // Also show in console with styling for visibility
  console.error(
    '%cChapter validation errors detected. Check data/chapters.js for issues.',
    'background: #f8d7da; color: #721c24; padding: 8px; border-radius: 4px; font-weight: bold;'
  );

  return false;
}
