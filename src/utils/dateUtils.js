/**
 * Computes a numeric comparison score for dates and date ranges (e.g. "2024 - 2025", "May 2024 - Jul 2024", "2026 - Present", "2025").
 * Higher score = more recent date (for descending sort: latest first).
 */
export const parseDateScore = (dateStr) => {
  if (!dateStr) return -1;
  const raw = dateStr.toString().trim().toLowerCase();
  if (!raw) return -1;

  // Ongoing / Present projects take the highest priority
  if (raw.includes('present') || raw.includes('current') || raw.includes('now')) {
    const startYearMatch = raw.match(/\b(19\d\d|20\d\d)\b/);
    const startYear = startYearMatch ? parseInt(startYearMatch[1], 10) : 2026;
    return 99990000 + startYear;
  }

  // Split on dash, en-dash, em-dash, or 'to' to isolate the end date of a range
  const parts = raw.split(/[-–—]|(\bto\b)/).filter(Boolean);
  const targetPart = parts.length > 1 ? parts[parts.length - 1].trim() : raw;

  const monthMap = {
    jan: 1, feb: 2, mar: 3, apr: 4, may: 5, jun: 6,
    jul: 7, aug: 8, sep: 9, oct: 10, nov: 11, dec: 12
  };

  let year = 0;
  let month = 12; // default to end of year if no month specified

  // Check for 4-digit year in targetPart first, then anywhere in raw
  const yearMatch = targetPart.match(/\b(19\d\d|20\d\d)\b/) || raw.match(/\b(19\d\d|20\d\d)\b/);
  if (yearMatch) {
    year = parseInt(yearMatch[1], 10);
  }

  // Check for month name in targetPart
  for (const [key, val] of Object.entries(monthMap)) {
    if (targetPart.includes(key)) {
      month = val;
      break;
    }
  }

  // Check for numeric MM/YYYY or MM-YYYY in targetPart
  const numMatch = targetPart.match(/\b(0?[1-9]|1[0-2])[\/.-](19\d\d|20\d\d)\b/);
  if (numMatch) {
    month = parseInt(numMatch[1], 10);
    year = parseInt(numMatch[2], 10);
  }

  if (!year) return 0;

  return year * 100 + month;
};

/**
 * Sorts an array of projects latest first based on dates / year.
 */
export const sortProjectsLatestFirst = (projects = []) => {
  return [...projects].sort((a, b) => {
    const dateA = a.dates || a.year || '';
    const dateB = b.dates || b.year || '';
    const scoreA = parseDateScore(dateA);
    const scoreB = parseDateScore(dateB);

    if (scoreB !== scoreA) {
      return scoreB - scoreA;
    }

    // Tie breaker: featured first
    if (b.featured && !a.featured) return 1;
    if (!b.featured && a.featured) return -1;

    return 0;
  });
};
