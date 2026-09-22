'use client'

import { useTranslations } from 'next-intl'

/**
 * Hook for translating calculator field labels, UI text, and option labels.
 * Uses the existing `calculatorUI` namespace which has formLabels, shell, buttons, sections, results.
 *
 * Usage in Generic*Calculator components:
 *   const tc = useCalcTranslation()
 *   // Then use tc('formLabels.age') instead of hardcoded 'Age'
 */
export function useCalcTranslation() {
  const t = useTranslations('calculatorUI')

  /** Translate a field label by its field name key. Falls back to the provided fallback. */
  const fieldLabel = (key: string, fallback: string): string => {
    try {
      return t(`formLabels.${key}`)
    } catch {
      return fallback
    }
  }

  /** Translate a select/option label. Falls back to the provided fallback. */
  const optionLabel = (key: string, fallback: string): string => {
    try {
      return t(`formLabels.${key}`)
    } catch {
      return fallback
    }
  }

  /** Translate shell UI text. Falls back to the provided fallback. */
  const shell = (key: string, fallback: string): string => {
    try {
      return t(`shell.${key}`)
    } catch {
      return fallback
    }
  }

  /** Translate button text. Falls back to the provided fallback. */
  const button = (key: string, fallback: string): string => {
    try {
      return t(`buttons.${key}`)
    } catch {
      return fallback
    }
  }

  /** Translate section heading. Falls back to the provided fallback. */
  const section = (key: string, fallback: string): string => {
    try {
      return t(`sections.${key}`)
    } catch {
      return fallback
    }
  }

  /** Translate result label. Falls back to the provided fallback. */
  const result = (key: string, fallback: string): string => {
    try {
      return t(`results.${key}`)
    } catch {
      return fallback
    }
  }

  /** Raw t function for direct access */
  const tRaw = t

  return { fieldLabel, optionLabel, shell, button, section, result, t: tRaw }
}
