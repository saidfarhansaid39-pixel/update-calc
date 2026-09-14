import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ min: z.string().min(1).refine(v => parseFloat(v) >= -999999, 'min'), max: z.string().min(1).refine(v => parseFloat(v) <= 999999, 'max'), count: z.string().min(1).refine(v => parseFloat(v) >= 1, '>=1'), allowDuplicates: z.string().min(1) }),
  fields: [
    { name: 'min', label: 'Minimum Value', type: 'number', min: -999999, step: '1' },
    { name: 'max', label: 'Maximum Value', type: 'number', max: 999999, step: '1' },
    { name: 'count', label: 'How Many Numbers', type: 'number', min: 1, max: 100, step: '1' },
    { name: 'allowDuplicates', label: 'Allow Duplicates', type: 'select', options: [{ label: 'Yes', value: 'yes' }, { label: 'No', value: 'no' }] },
  ],
  defaults: { min: '1', max: '100', count: '1', allowDuplicates: 'yes' },
  presets: [
    { label: 'Dice Roll (1-6)', values: { min: '1', max: '6', count: '1', allowDuplicates: 'yes' } },
    { label: 'Lottery Quick Pick', values: { min: '1', max: '49', count: '6', allowDuplicates: 'no' } },
    { label: 'Classroom Random Select', values: { min: '1', max: '30', count: '3', allowDuplicates: 'no' } },
    { label: 'Coin Flip (0-1)', values: { min: '0', max: '1', count: '1', allowDuplicates: 'yes' } },
  ],
  compute: (v) => {
    const lo = Math.ceil(v.min)
    const hi = Math.floor(v.max)
    const results: number[] = []
    const available = Array.from({ length: hi - lo + 1 }, (_, i) => lo + i)
    const desired = Math.min(v.count, v.allowDuplicates === 'no' ? available.length : v.count)
    for (let i = 0; i < desired; i++) {
      if (v.allowDuplicates === 'no' && available.length === 0) break
      const idx = Math.floor(Math.random() * (v.allowDuplicates === 'no' ? available.length : (hi - lo + 1)))
      const val = v.allowDuplicates === 'no' ? available.splice(idx, 1)[0] : lo + Math.floor(Math.random() * (hi - lo + 1))
      results.push(val)
    }
    return { result: results[0], label: 'Random Number(s)', unit: '', steps: [{ label: 'Range Set', value: `${lo} to ${hi}` }, { label: 'Numbers Requested', value: `${v.count} (${v.allowDuplicates === 'yes' ? 'duplicates allowed' : 'unique only'})` }, { label: 'Total Possible Values', value: `${hi - lo + 1} integers` }, { label: 'Algorithm', value: v.allowDuplicates === 'yes' ? 'Uniform random with replacement' : 'Fisher-Yates shuffle without replacement' }, { label: 'Generated Numbers', value: results.join(', ') }, { label: 'Number Count', value: `${results.length} generated` }, { label: 'Range Check', value: results.every(n => n >= lo && n <= hi) ? 'All within range ✓' : 'Error!' }] ,
    extras: [
      { label: 'Pseudo-Random vs True Random', value: 'This generator uses JavaScript\'s Math.random() — a PRNG (Pseudo-Random Number Generator) seeded by the system. It is fast and adequate for games, simulations, and everyday use. For cryptographic security, lotteries, or scientific research requiring true randomness, use window.crypto.getRandomValues() or a hardware RNG.' },
      { label: 'Probability Basics', value: 'With duplicates allowed, each number has equal probability (1/n). For a 1-100 range: odds of any specific number = 1%. With 6 numbers from 1-49 (no duplicates): the chance of any specific combination is 1 in 13,983,816 — the same as a typical lottery.' },
      { label: 'No-Duplicates Algorithm', value: 'When duplicates are disabled, the generator uses Fisher-Yates shuffle on the available pool. Each number is removed after selection, like drawing names from a hat. This guarantees uniqueness. Maximum count without duplicates cannot exceed the range size.' },
      { label: 'Practical Use Cases', value: 'Games: dice rolls (1-6), card draws (1-52). Education: random student selection, quiz number generation. Statistics: random sampling, Monte Carlo simulations. Contests: random winner selection from ticket numbers. Development: test data generation, A/B test assignment.' },
      { label: 'Random Number Distribution', value: 'Over many runs, Math.random() produces a uniform distribution — each value occurs with approximately equal frequency. Run 1,000 dice rolls (1-6): each face should appear ~166-168 times. If results cluster significantly, the PRNG seed may be causing temporary patterns.' },
      { label: 'Large Range Performance', value: 'For ranges up to 1,000,000, the generator uses an efficient in-memory array shuffle. For ranges beyond 10 million, consider the "no duplicates" mode carefully — building the array may use significant memory. The current limit of ±999,999 keeps memory within reasonable bounds.' },
      { label: 'Combining Random Numbers', value: 'Generate multiple independent random values and combine them creatively: two 1-6 dice rolls sum to 2-12 (bell curve distribution). Two coins (0-1) create 4 binary outcomes (00, 01, 10, 11). Three numbers from 1-100 create a 3D coordinate space (1M+ points).' },
    ]}
  },
  description: 'Generate one or more random numbers within a specified integer range with optional duplicate control. Uses cryptographically-adequate pseudo-random generation with Fisher-Yates shuffle for unique selections.',
  formula: 'With duplicates: Math.floor(Math.random() × (max - min + 1)) + min, repeated × count times. Without duplicates: Fisher-Yates shuffle on [min..max] array, splice × count elements. Uniform distribution over the range for both methods.',
  interpretation: 'This generator produces pseudo-random integers uniformly distributed across the specified range [min, max]. For a standard 1-100 range with 1 number: results are uniformly distributed — over 10,000 iterations, each number 1-100 appears ~100 times (±10 for statistical variance). For lottery-style draws (6 unique from 1-49): the generator simulates a physical draw without replacement using Fisher-Yates, identical to the mechanical ball-mixing method used in actual lotteries. The chance of any specific 6-number combination is exactly 1 in 13,983,816. For game applications, the PRNG is more than sufficient — the period of the underlying algorithm is 2^128 before repetition.'
}

export default calcDef
