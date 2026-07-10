/**
 * Calculation memoization helpers.
 *
 * Pure calculator compute functions (e.g. `calcDef.compute(inputs)`) are
 * expensive and often invoked repeatedly with identical inputs — across
 * re-renders, scenario comparisons, and multiple widget instances. These
 * helpers cache results keyed by the function reference and its serialized
 * arguments so identical calculations are only performed once.
 */

type AnyFn = (...args: any[]) => unknown

interface MemoOptions {
  /** Max cached entries per function. Defaults to 500. */
  maxSize?: number
}

/**
 * Wrap a pure function so that calls with identical (JSON-serializable)
 * arguments return a cached result instead of re-executing.
 */
export function memoizeCalc<A extends any[], R>(fn: (...args: A) => R, options: MemoOptions = {}): (...args: A) => R {
  const maxSize = options.maxSize ?? 500
  const cache = new Map<string, R>()

  return (...args: A): R => {
    let key: string
    try {
      key = JSON.stringify(args)
    } catch {
      // Non-serializable args — skip caching entirely.
      return fn(...args)
    }

    if (cache.has(key)) {
      return cache.get(key) as R
    }

    const result = fn(...args)

    if (cache.size >= maxSize) {
      // Drop the oldest entry to bound memory.
      const firstKey = cache.keys().next().value
      if (firstKey !== undefined) cache.delete(firstKey)
    }
    cache.set(key, result)
    return result
  }
}

const computeCache = new WeakMap<object, AnyFn>()

/**
 * Given a calculator definition object that exposes a `compute` method,
 * return a memoized version of `compute`. The wrapper is cached per
 * definition instance (via a WeakMap) so results are reused across
 * re-renders and across every place the same definition is used.
 *
 * Usage:
 *   const res = memoizedCompute(def)(vals)
 */
export function memoizedCompute<T extends { compute: AnyFn }>(def: T): T['compute'] {
  let cached = computeCache.get(def)
  if (!cached) {
    cached = memoizeCalc(def.compute)
    computeCache.set(def, cached)
  }
  return cached as T['compute']
}

export default memoizeCalc
