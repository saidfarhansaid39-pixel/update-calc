import { PremiumCalculatorShell as Shell } from '@/components/premium/PremiumCalculatorShell'

// Rendered on the server (no ssr:false) so the form and computed results are
// present in the HTML on first paint and are indexable. Charts inside the shell
// remain client-only (recharts needs the DOM).
export const PremiumCalculatorShell = Shell

export type { UnitSystem } from '@/components/premium/PremiumCalculatorShell'
