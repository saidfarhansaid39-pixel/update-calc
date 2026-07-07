import { describe, it, expect } from 'vitest';
import { calculatorRegistry, hubs } from '@calcuniverse/calculator-registry';

describe('Calculator Registry', () => {
  it('should have a non-empty registry', () => {
    expect(calculatorRegistry.length).toBeGreaterThan(0);
  });

  it('should have all hubs defined', () => {
    expect(hubs.length).toBeGreaterThan(0);
  });

  it('should have unique slugs', () => {
    const slugs = calculatorRegistry.map(e => e.slug);
    const uniqueSlugs = new Set(slugs);
    expect(uniqueSlugs.size).toBe(slugs.length);
  });

  it('should have valid tiers on all entries', () => {
    const validTiers = ['tier1', 'tier2', 'tier3'];
    for (const entry of calculatorRegistry) {
      expect(validTiers).toContain(entry.tier);
    }
  });
});
