/**
 * Pure helpers for the shell-level click-to-calculate reveal.
 *
 * The shell cannot recompute results itself (each engine/standalone wrapper
 * owns its compute), so reveal state is driven by a stable signature of the
 * current input context. These helpers keep that logic unit-testable without
 * a DOM.
 */

export interface CalculationSignatureContext {
  inputs?: Record<string, string>
  extraFields?: Record<string, string>
  currency?: string
  measurement?: string
  locale?: string
  unitSystem?: string
}

function normalizeFields(values?: Record<string, string>): Record<string, string> {
  if (!values) return {}
  return Object.fromEntries(
    Object.entries(values)
      .filter((entry): entry is [string, string] => {
        const [, value] = entry
        return value !== undefined && value !== ''
      })
      .sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0)),
  )
}

/**
 * Stable signature for the current calculation context. Key order and empty
 * values do not affect the signature; display preferences (currency,
 * measurement, locale, unit system) do, because they change rendered output.
 */
export function getCalculationSignature(context: CalculationSignatureContext = {}): string {
  return JSON.stringify({
    inputs: normalizeFields(context.inputs),
    extraFields: normalizeFields(context.extraFields),
    currency: context.currency ?? '',
    measurement: context.measurement ?? '',
    locale: context.locale ?? '',
    unitSystem: context.unitSystem ?? '',
  })
}

/**
 * Whether the Calculate control should be enabled.
 *
 * Most engines report a numeric `mainValue` even before the visitor types
 * anything (empty fields coerce to 0/NaN), so `mainValue !== undefined`
 * alone cannot enable the button. Only enable on explicit input, or when a
 * result appeared after mount (e.g. a fallback engine with its own internal
 * Calculate button that populates `mainValue` on click).
 */
export function shouldEnableCalculate(
  hasInputs: boolean | undefined,
  mainValue: unknown,
  hadMainValueAtMount: boolean,
): boolean {
  if (hasInputs) return true
  return mainValue !== undefined && !hadMainValueAtMount
}

/** Sticky-bar / adjustment guard: never display NaN as a result. */
export function isDisplayableMainValue(value: unknown): value is number {
  return typeof value === 'number' && !Number.isNaN(value)
}

/** True when the visitor changed something after the last explicit calculation. */
export function isCalculationStale(
  hasCalculated: boolean,
  calculatedSignature: string | null,
  currentSignature: string,
): boolean {
  return hasCalculated && calculatedSignature !== null && calculatedSignature !== currentSignature
}
