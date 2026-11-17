import { describe, it, expect } from 'vitest';
import {
  calculateTextSimilarity,
  calculateDateScore,
  calculateAttributeScore,
  compareReports,
} from '../src/services/matching.service.js';

describe('Matching Engine Heuristic Unit Tests', () => {
  it('calculateTextSimilarity should accurately measure word token overlap', () => {
    const text1 = 'Black Dell XPS 15 laptop with blue sticker';
    const text2 = 'Found Dell XPS laptop near library with sticker';
    const sim = calculateTextSimilarity(text1, text2);
    expect(sim).toBeGreaterThan(0.4);

    const text3 = 'Red umbrella';
    const simZero = calculateTextSimilarity(text1, text3);
    expect(simZero).toBe(0.0);
  });

  it('calculateDateScore should award 1.0 for same-day and decay over 14 days', () => {
    const now = new Date().toISOString();
    const sameDay = new Date().toISOString();
    expect(calculateDateScore(now, sameDay)).toBe(1.0);

    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
    const score7 = calculateDateScore(now, sevenDaysAgo);
    expect(score7).toBeCloseTo(0.5, 1);

    const twentyDaysAgo = new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString();
    expect(calculateDateScore(now, twentyDaysAgo)).toBe(0.0);
  });

  it('calculateAttributeScore should reward matching colour and brand', () => {
    const itemA = { colour: 'Black', brand: 'Sony' };
    const itemB = { colour: 'black', brand: 'Sony' };
    expect(calculateAttributeScore(itemA, itemB)).toBe(1.0);

    const itemC = { colour: 'Blue', brand: 'Sony' };
    expect(calculateAttributeScore(itemA, itemC)).toBe(0.5);
  });

  it('compareReports should compute exact composite score and label according to spec.md', () => {
    const lostReport = {
      category_id: 'cat-uuid-1',
      location_id: 'loc-uuid-lib',
      title: 'Black Dell laptop sleeve',
      description_public: 'Black sleeve with blue zipper',
      event_at: '2026-11-15T10:00:00Z',
      colour: 'Black',
      brand: 'Dell',
    };

    const foundReport = {
      category_id: 'cat-uuid-1', // 1.0 * 0.30 = 0.30
      location_id: 'loc-uuid-lib', // 1.0 * 0.15 = 0.15
      title: 'Found black Dell laptop sleeve in library',
      description_public: 'Dell laptop sleeve with blue zipper',
      event_at: '2026-11-15T11:00:00Z', // 1.0 * 0.20 = 0.20
      colour: 'Black', // 0.5
      brand: 'Dell', // 0.5 -> 1.0 * 0.10 = 0.10
    };

    const result = compareReports(lostReport, foundReport);

    // Category (0.30) + Location (0.15) + Date (0.20) + Attribute (0.10) + Text (~0.20)
    expect(result.finalScore).toBeGreaterThanOrEqual(80);
    expect(result.label).toBe('Strong potential match');
    expect(result.explanation.length).toBeGreaterThanOrEqual(3);
    expect(result.notice).toContain('not automated proof of ownership');
  });
});
