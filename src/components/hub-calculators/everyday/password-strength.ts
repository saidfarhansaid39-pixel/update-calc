import { z } from 'zod'
import type { CalcDef } from '../../../lib/generic-fallback'

const calcDef: CalcDef = {
  schema: z.object({ password: z.string().min(1, 'Required') }),
  fields: [
    { name: 'password', label: 'Enter Password', type: 'text' },
  ],
  defaults: { password: 'P@ssw0rd!2024' },
  presets: [
    { label: 'Weak (hello123)', values: { password: 'hello123' } },
    { label: 'Moderate (Summer2024!)', values: { password: 'Summer2024!' } },
    { label: 'Strong (Tr0ub4dor&3)', values: { password: 'Tr0ub4dor&3' } },
    { label: 'Very Strong (correct-horse-battery-staple)', values: { password: 'correct-horse-battery-staple' } },
  ],
  compute: (v) => { const pwd = v.password; let score = 0; const len = pwd.length; if (len >= 8) score += 25; if (len >= 12) score += 15; if (len >= 16) score += 10; if (/[a-z]/.test(pwd)) score += 10; if (/[A-Z]/.test(pwd)) score += 15; if (/[0-9]/.test(pwd)) score += 15; if (/[^a-zA-Z0-9]/.test(pwd)) score += 20; const uniqueChars = new Set(pwd).size; const uniqueRatio = uniqueChars / len; if (uniqueRatio >= 0.7) score += 10; const hasRepeat = /(.)\1{2,}/.test(pwd); if (hasRepeat) score -= 10; score = Math.max(0, Math.min(100, score)); const strength = score < 40 ? 'Weak' : score < 70 ? 'Moderate' : score < 90 ? 'Strong' : 'Very Strong'; const crackTime = score < 40 ? 'seconds' : score < 70 ? 'hours-days' : score < 90 ? 'years-centuries' : 'centuries+'; const entropy = len * (Math.log2(26) * (/[a-z]/.test(pwd) ? 1 : 0) + Math.log2(26) * (/[A-Z]/.test(pwd) ? 1 : 0) + Math.log2(10) * (/[0-9]/.test(pwd) ? 1 : 0) + Math.log2(32) * (/[^a-zA-Z0-9]/.test(pwd) ? 1 : 0)); return { result: score, label: 'Password Strength', unit: '/100',
    steps: [
      { label: 'Password Length', value: `${len} characters (${len >= 16 ? 'excellent — 16+ chars recommended' : len >= 12 ? 'good — 12+ is minimum' : len >= 8 ? 'adequate — but 12+ is better' : 'too short — should be 12+ characters'})` },
      { label: 'Contains Lowercase', value: `${/[a-z]/.test(pwd) ? '✓ (+10)' : '✗'}` },
      { label: 'Contains Uppercase', value: `${/[A-Z]/.test(pwd) ? '✓ (+15)' : '✗'}` },
      { label: 'Contains Digit', value: `${/[0-9]/.test(pwd) ? '✓ (+15)' : '✗'}` },
      { label: 'Contains Special Char', value: `${/[^a-zA-Z0-9]/.test(pwd) ? '✓ (+20)' : '✗'}` },
      { label: 'Character Uniqueness', value: `${uniqueChars} unique chars (${(uniqueRatio * 100).toFixed(0)}% — ${uniqueRatio >= 0.7 ? '+10 ✓' : 'too many repeats ✗'})` },
      { label: 'Repeated Patterns', value: hasRepeat ? '-10 (3+ repeated chars in a row — penalty applied)' : 'No repeated patterns ✓' },
      { label: 'Final Score', value: `${score}/100 — ${strength} (est. crack time: ${crackTime})` },
      { label: 'Estimated Entropy', value: `~${entropy.toFixed(0)} bits (${entropy >= 60 ? 'excellent' : entropy >= 40 ? 'good' : 'weak'})` },
    ],
    extras: [
      { label: '🔐 What Makes a Password Strong?', value: 'Length is the most important factor — each additional character multiplies cracking difficulty exponentially. 12+ characters with mixed types is the current minimum. 16+ is recommended for sensitive accounts.' },
      { label: '⚡ How Passwords Get Cracked', value: 'Hashcat can test billions of passwords/second with GPUs. An 8-char password with mixed case + digits (≈ 10^15 combinations) falls in hours to days. A 12-char password (≈ 10^23) takes centuries.' },
      { label: '🔑 Password Managers Are Essential', value: 'The average person has 100+ online accounts. Trying to remember unique, complex passwords for each is impossible. Use a password manager (Bitwarden, 1Password, Apple Keychain, KeePassXC) — they generate and store strong, unique passwords.' },
      { label: '✋ Common Password Mistakes', value: 'Avoid: "password", "123456", "qwerty", "admin", your name, pet name, birthdate, anniversary, common phrases, keyboard patterns (asdfgh), repeating characters (aaa111). These are the first things hackers try.' },
      { label: '📊 Password Length Matters Most', value: 'A 12-char random password with lowercase only: 26^12 ≈ 10^17 combinations. Add uppercase (52^12 ≈ 10^20). Add digits (62^12 ≈ 10^21). Add symbols (94^12 ≈ 10^23). Length beats complexity: 20-char lowercase > 8-char complex.' },
      { label: '🔄 Never Reuse Passwords', value: 'Password reuse is the #1 security risk. One site gets breached → hackers try that email/password on every other site (credential stuffing). Use a unique password for every site. Password managers make this easy.' },
      { label: '🔐 2FA Is Critical', value: 'Two-factor authentication (2FA/MFA) blocks 99.9% of account takeover attacks. Use authenticator apps (Google Authenticator, Authy) or hardware keys (YubiKey) — SMS is better than nothing but vulnerable to SIM swapping.' },
      { label: '🧠 The Diceware Method', value: 'Use 5-6 random words from a dictionary of 7776 words (like "correct horse battery staple"). A 5-word Diceware passphrase: 7776^5 ≈ 2.8 × 10^19 combinations — comparable to a 13-char random password, but much easier to remember.' },
    ]
  } },
  description: 'Check your password strength with a detailed 100-point scoring system evaluating length, character variety, uniqueness, and pattern repetition. Includes crack-time estimates and entropy calculation.',
  formula: 'Score = Length(25 base +15 at 12 +10 at 16) + Lowercase(10) + Uppercase(15) + Digit(15) + Symbol(20) + Uniqueness(10 if >70% unique) − RepeatedChars(10 if 3+ in a row). Score out of 100.',
  interpretation: 'Password strength is primarily about length — a 12-character password with only lowercase letters is stronger than an 8-character one with every symbol type. Modern GPUs can try billions of combinations per second. The minimum acceptable strength for important accounts is "Strong" (score 70+), which should take years to centuries to crack. Use a password manager to generate and store unique 16+ character passwords for every account. Enable two-factor authentication on all accounts that support it — it blocks 99.9% of automated attacks. Never reuse passwords across sites.'
}

export default calcDef
