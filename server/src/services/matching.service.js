/**
 * Matching Engine for Smart Lost & Found Intelligence System
 * Primary Baseline Formula from spec.md:
 * score = 0.30*category + 0.25*text + 0.20*date + 0.15*location + 0.10*attributes
 */

// Helper to tokenize and clean text
export function tokenize(text) {
  if (!text) return [];
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter((w) => w.length > 2);
}

// Jaccard similarity for tokenized text
export function calculateTextSimilarity(text1, text2) {
  const tokens1 = new Set(tokenize(text1));
  const tokens2 = new Set(tokenize(text2));

  if (tokens1.size === 0 || tokens2.size === 0) return 0.0;

  let intersection = 0;
  for (const token of tokens1) {
    if (tokens2.has(token)) {
      intersection++;
    }
  }

  const union = new Set([...tokens1, ...tokens2]).size;
  return union === 0 ? 0.0 : Number((intersection / union).toFixed(4));
}

// Calculate date closeness score (1.0 if same day, decays over 14 days window)
export function calculateDateScore(date1Str, date2Str) {
  try {
    const d1 = new Date(date1Str).getTime();
    const d2 = new Date(date2Str).getTime();
    const diffMs = Math.abs(d1 - d2);
    const diffDays = diffMs / (1000 * 60 * 60 * 24);

    if (diffDays <= 0.5) return 1.0;
    if (diffDays > 14) return 0.0;

    return Number(Math.max(0, 1 - diffDays / 14).toFixed(4));
  } catch {
    return 0.0;
  }
}

// Compare attributes like colour and brand
export function calculateAttributeScore(item1, item2) {
  let score = 0.0;
  let checks = 0;

  if (item1.colour && item2.colour) {
    checks++;
    if (item1.colour.trim().toLowerCase() === item2.colour.trim().toLowerCase()) {
      score += 0.5;
    }
  }

  if (item1.brand && item2.brand) {
    checks++;
    if (item1.brand.trim().toLowerCase() === item2.brand.trim().toLowerCase()) {
      score += 0.5;
    }
  }

  return Number(score.toFixed(4));
}

/**
 * Compare a Lost report with a Found report
 * Returns { finalScore, label, components, explanation }
 */
export function compareReports(lostReport, foundReport) {
  // 1. Category Score (weight: 0.30)
  const categoryScore = lostReport.category_id === foundReport.category_id ? 1.0 : 0.0;

  // 2. Text Score (weight: 0.25)
  const text1 = `${lostReport.title} ${lostReport.description_public || ''}`;
  const text2 = `${foundReport.title} ${foundReport.description_public || ''}`;
  const textScore = calculateTextSimilarity(text1, text2);

  // 3. Date Score (weight: 0.20)
  const dateScore = calculateDateScore(lostReport.event_at, foundReport.event_at);

  // 4. Location Score (weight: 0.15)
  const locationScore = lostReport.location_id === foundReport.location_id ? 1.0 : 0.2;

  // 5. Attributes Score (weight: 0.10)
  const attributeScore = calculateAttributeScore(lostReport, foundReport);

  // Total raw score out of 1.0
  const rawScore =
    0.30 * categoryScore +
    0.25 * textScore +
    0.20 * dateScore +
    0.15 * locationScore +
    0.10 * attributeScore;

  // Final Score out of 100
  const finalScore = Number((rawScore * 100).toFixed(2));

  // Determine explanation label
  let label = 'Low similarity';
  if (finalScore >= 80) {
    label = 'Strong potential match';
  } else if (finalScore >= 60) {
    label = 'Possible match';
  }

  // Generate explainable reasons
  const explanation = [];
  if (categoryScore === 1.0) {
    explanation.push('Both items share the same primary campus category');
  }
  if (textScore >= 0.2) {
    explanation.push('Item descriptions contain overlapping visual identifiers');
  }
  if (dateScore >= 0.6) {
    explanation.push('Lost and found event timestamps are within close temporal proximity');
  }
  if (locationScore === 1.0) {
    explanation.push('Reported in the exact same campus zone');
  }
  if (attributeScore > 0) {
    explanation.push('Matching color or manufacturer attributes identified');
  }

  if (explanation.length === 0) {
    explanation.push('General campus activity correlation');
  }

  return {
    finalScore,
    label,
    components: {
      category: categoryScore,
      text: textScore,
      date: dateScore,
      location: locationScore,
      attributes: attributeScore,
    },
    explanation,
    notice: 'A suggested match is a heuristic indicator, not automated proof of ownership.',
  };
}
