import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ password: z.string().min(1, 'Required') }),
  fields: [
    { name: 'password', label: 'Enter Password', type: 'text' },
  ],
  compute: (v) => { const pwd = v.password; let score = 0; const len = pwd.length; if (len >= 8) score += 25; if (len >= 12) score += 15; if (len >= 16) score += 10; if (/[a-z]/.test(pwd)) score += 10; if (/[A-Z]/.test(pwd)) score += 15; if (/[0-9]/.test(pwd)) score += 15; if (/[^a-zA-Z0-9]/.test(pwd)) score += 20; const uniqueChars = new Set(pwd).size; if (uniqueChars >= len * 0.7) score += 10; const hasRepeat = /(.)\1{2,}/.test(pwd); if (hasRepeat) score -= 10; score = Math.max(0, Math.min(100, score)); const strength = score < 40 ? 'Weak' : score < 70 ? 'Moderate' : score < 90 ? 'Strong' : 'Very Strong'; const crackTime = score < 40 ? 'seconds' : score < 70 ? 'hours-days' : score < 90 ? 'years-centuries' : 'centuries+'; return { result: score, label: 'Password Strength', unit: '/100', steps: [{ label: 'Length', value: `${len} chars (${len >= 12 ? 'great' : len >= 8 ? 'good' : 'short'})` }, { label: 'Complexity', value: `Upper: ${/[A-Z]/.test(pwd) ? '✓' : '✗'}, Lower: ${/[a-z]/.test(pwd) ? '✓' : '✗'}, Digit: ${/[0-9]/.test(pwd) ? '✓' : '✗'}, Special: ${/[^a-zA-Z0-9]/.test(pwd) ? '✓' : '✗'}` }, { label: 'Strength', value: strength }, { label: 'Est. Crack Time', value: crackTime }] } },
  description: 'Check your password strength based on length, character variety, uniqueness, and resistance to common cracking techniques.',
  formula: 'Score = Length(25-50) + Lowercase(10) + Uppercase(15) + Digits(15) + Symbols(20) + Uniqueness(10) − RepeatedChars(10)',
  interpretation: 'A strong password: 12+ characters, mix of cases, digits, and symbols. Avoid dictionary words, birthdays, and common patterns. Use a password manager. Never reuse passwords across sites.'
}

export default calcDef
