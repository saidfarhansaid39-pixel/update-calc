import { describe, it, expect } from 'vitest';
import { memoizedCompute } from '../calc-executor';

// Create a mock CalcDef
function mockDef(inputs: any[], compute: (v: any) => any) {
  return { inputs, compute, slug: 'test' } as any;
}

describe('memoizedCompute', () => {
  it('returns correct result', () => {
    const def = mockDef([{ id: 'a', type: 'number' }], (v) => v.a * 2);
    expect(memoizedCompute(def)({ a: 5 })).toBe(10);
  });

  it('caches repeated calls', () => {
    let calls = 0;
    const def = mockDef([{ id: 'a', type: 'number' }], (v) => { calls++; return v.a + 1; });
    memoizedCompute(def)({ a: 1 });
    memoizedCompute(def)({ a: 1 });
    expect(calls).toBe(1);
  });

  it('handles invalid input gracefully', () => {
    const def = mockDef([{ id: 'a', type: 'number' }], (v) => v.a ?? 0);
    expect(memoizedCompute(def)({})).toBe(0);
  });
});
