'use client'

import React from 'react'
import { ExtraFieldsProvider } from '@/lib/context/ExtraFieldsContext'
import { ExtraFieldInjector } from '@/components/premium/ExtraFieldInjector'
import { getExtraFieldsForCalculator } from '@/lib/extra-field-pools'
import type { PremiumCalculatorShellProps } from '@/components/premium/PremiumCalculatorShell'

interface InputSectionProps {
  calculator: PremiumCalculatorShellProps['calculator']
  form: React.ReactNode
  extraFieldValues: Record<string, string>
  onExtraFieldsChange: (v: Record<string, string>) => void
}

export function InputSection({ calculator, form, extraFieldValues, onExtraFieldsChange }: InputSectionProps) {
  return (
    <div className="space-y-4 max-w-full overflow-x-auto">
      <ExtraFieldsProvider extraFields={extraFieldValues}>
        <ExtraFieldInjector
          slug={calculator.slug}
          hubSlug={calculator.hubSlug}
          extraFields={getExtraFieldsForCalculator(calculator.slug, calculator.hubSlug)}
          onFieldsChange={onExtraFieldsChange}
        >
          {form}
        </ExtraFieldInjector>
      </ExtraFieldsProvider>
    </div>
  )
}
