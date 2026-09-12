/**
 * Deduplicates an array or comma-separated string of skills case-insensitively,
 * preserving the original casing of the first occurrence.
 *
 * @param {string[]|string} skillsList
 * @returns {string[]} Array of unique trimmed skills
 */
export const deduplicateSkills = (skillsList) => {
  if (!skillsList) return [];

  const arr = Array.isArray(skillsList)
    ? skillsList
    : typeof skillsList === 'string'
    ? skillsList.split(',').map((s) => s.trim()).filter(Boolean)
    : [];

  const seen = new Set();
  const result = [];

  for (const item of arr) {
    const clean = String(item).trim();
    if (!clean) continue;
    const lower = clean.toLowerCase();
    if (!seen.has(lower)) {
      seen.add(lower);
      result.push(clean);
    }
  }

  return result;
};

/**
 * Detects any duplicate skill names within a single list/panel (case-insensitive).
 *
 * @param {string[]|string} skillsList
 * @returns {string[]} Array of duplicate skill names found
 */
export const findDuplicateSkills = (skillsList) => {
  if (!skillsList) return [];

  const arr = Array.isArray(skillsList)
    ? skillsList
    : typeof skillsList === 'string'
    ? skillsList.split(',').map((s) => s.trim()).filter(Boolean)
    : [];

  const seen = new Set();
  const duplicates = new Set();

  for (const item of arr) {
    const clean = String(item).trim();
    if (!clean) continue;
    const lower = clean.toLowerCase();
    if (seen.has(lower)) {
      duplicates.add(clean);
    } else {
      seen.add(lower);
    }
  }

  return Array.from(duplicates);
};

/**
 * Checks whether a given skill name already exists in the skillset matrix (case-insensitive).
 *
 * @param {Array<{id: string, name: string}>} existingSkills
 * @param {string} skillName
 * @param {string} [excludeId] - Optional ID to ignore (for edit mode)
 * @returns {boolean}
 */
export const isSkillNameDuplicate = (existingSkills = [], skillName = '', excludeId = null) => {
  const clean = String(skillName || '').trim().toLowerCase();
  if (!clean) return false;

  return existingSkills.some((s) => {
    if (excludeId && s.id === excludeId) return false;
    return String(s.name || '').trim().toLowerCase() === clean;
  });
};
