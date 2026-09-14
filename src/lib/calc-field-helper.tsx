'use client'

import React from 'react'
import { useFormContext } from 'react-hook-form'
import { CalculatorFormField } from '@/components/forms/CalculatorFormField'
import { useCurrency } from '@/lib/context/CurrencyContext'
import { CalculatorSlider } from '@/components/forms/CalculatorSlider'
import { FieldGroup } from '@/components/calc-panel/CalculationPanel'

export type FieldMode = 'basic' | 'advanced' | 'professional' | 'expert'

interface FieldDef {
  name: string
  label: string
  type?: string
  min?: number
  max?: number
  step?: number | string
  placeholder?: string
  helperText?: string
  unit?: string
  options?: { label: string; value: string }[]
  mode?: FieldMode
  units?: { value: string; label: string }[]
  defaultUnit?: string
  precisionToggle?: boolean
}

export function renderCalcField(
  field: FieldDef,
  useSlider: boolean,
  lockedFields: Set<string>,
  toggleLock: (name: string) => void
) {
  if (field.type === 'checkbox') {
    return <CheckboxField key={field.name} name={field.name} label={field.label} />
  }
  if (field.type === 'select' && field.options) {
    return (
      <SelectField key={field.name} name={field.name} label={field.label} options={field.options} />
    )
  }
  const stepNum = typeof field.step === 'number' ? field.step : parseFloat(String(field.step))
  const autoPrecision = !isNaN(stepNum) && stepNum > 0 && stepNum < 1
  if (useSlider && field.type !== 'date' && field.type !== 'text' && field.min !== undefined) {
    return (
      <CalculatorSlider
        key={field.name}
        name={field.name}
        label={field.label}
        min={field.min}
        max={field.max}
        step={typeof field.step === 'string' ? parseFloat(field.step) || 1 : (field.step ?? 1)}
        unit={field.unit}
        locked={lockedFields.has(field.name)}
        onLockToggle={toggleLock}
      />
    )
  }
  if (field.units && field.units.length > 0) {
    return <FieldWithUnit key={field.name} field={field} locked={lockedFields.has(field.name)} onLockToggle={toggleLock} />
  }
  return (
      <CalculatorFormField
        key={field.name}
        name={field.name}
        label={field.label}
        type={field.type || 'number'}
        min={field.min}
        max={field.max}
        step={field.step?.toString()}
        placeholder={field.placeholder}
        helperText={field.helperText}
        locked={lockedFields.has(field.name)}
        onLockToggle={toggleLock}
        precisionToggle={field.precisionToggle ?? autoPrecision}
      />
  )
}

export function renderModeField(
  field: FieldDef,
  useSlider: boolean,
  lockedFields: Set<string>,
  toggleLock: (name: string) => void
) {
  return renderCalcField(field, useSlider, lockedFields, toggleLock)
}

export function FieldsByMode({
  fields,
  useSlider,
  lockedFields,
  toggleLock,
}: {
  fields: FieldDef[]
  useSlider: boolean
  lockedFields: Set<string>
  toggleLock: (name: string) => void
}) {
  const basicFields = fields.filter(f => !f.mode || f.mode === 'basic')
  const advancedFields = fields.filter(f => f.mode === 'advanced')
  const professionalFields = fields.filter(f => f.mode === 'professional')
  const expertFields = fields.filter(f => f.mode === 'expert')

  return (
    <div className="space-y-4">
      {basicFields.map(f => renderCalcField(f, useSlider, lockedFields, toggleLock))}
      {advancedFields.length > 0 && (
        <FieldGroup title="Advanced Options">
          {advancedFields.map(f => renderCalcField(f, useSlider, lockedFields, toggleLock))}
        </FieldGroup>
      )}
      {professionalFields.length > 0 && (
        <FieldGroup title="Professional Options">
          {professionalFields.map(f => renderCalcField(f, useSlider, lockedFields, toggleLock))}
        </FieldGroup>
      )}
      {expertFields.length > 0 && (
        <FieldGroup title="Expert Options">
          {expertFields.map(f => renderCalcField(f, useSlider, lockedFields, toggleLock))}
        </FieldGroup>
      )}
    </div>
  )
}

function SelectField({ name, label, options }: { name: string; label: string; options: { label: string; value: string }[] }) {
  const { register } = useFormContext()
  return (
    <div className="space-y-1.5">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">{label}</label>
      <select
        {...register(name)}
        className="flex h-12 w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-4 py-3 text-base text-gray-900 dark:text-gray-100 appearance-none cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#06b6d4] focus-visible:ring-offset-2 hover:border-gray-400 dark:hover:border-gray-500 transition-colors"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
          backgroundPosition: 'right 0.75rem center',
          backgroundSize: '1.25rem',
          backgroundRepeat: 'no-repeat',
          paddingRight: '2.5rem',
        }}
      >
        {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    </div>
  )
}

function CheckboxField({ name, label }: { name: string; label: string }) {
  const { register } = useFormContext()
  return (
    <label className="flex items-center gap-2.5 text-sm text-gray-700 dark:text-gray-200 cursor-pointer select-none">
      <input
        type="checkbox"
        {...register(name)}
        className="h-4 w-4 rounded border-gray-300 text-[#1a3a8a] focus:ring-[#06b6d4] focus:ring-offset-0 dark:border-gray-600 dark:bg-gray-900"
      />
      {label}
    </label>
  )
}

function FieldWithUnit({ field, locked, onLockToggle }: { field: FieldDef; locked: boolean; onLockToggle: (name: string) => void }) {
  const { register } = useFormContext()
  const { currencySymbol } = useCurrency()
  const displayLabel = React.useMemo(() => field.label.replace('($)', `(${currencySymbol})`), [field.label, currencySymbol])
  const unitName = field.name + 'Unit'
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">{displayLabel}</label>
        <button type="button" onClick={() => onLockToggle(field.name)} className="p-1 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:text-gray-300 dark:hover:bg-gray-700 transition-colors" aria-label={locked ? `Unlock ${field.label}` : `Lock ${field.label}`}>
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            {locked
              ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z" />
            }
          </svg>
        </button>
      </div>
      <div className="flex gap-2">
        <input
          type="number"
          {...register(field.name)}
          disabled={locked}
          placeholder={field.placeholder || `Enter ${field.label.toLowerCase()}`}
          className="flex h-12 w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-4 py-3 text-base text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#06b6d4] focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed hover:border-gray-400 dark:hover:border-gray-500 transition-colors"
        />
        <select
          {...register(unitName)}
          defaultValue={field.defaultUnit || (field.units?.[0]?.value ?? '')}
          className="h-12 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 px-3 text-sm font-medium text-gray-700 dark:text-gray-200 appearance-none cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#06b6d4] hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        >
          {field.units?.map(u => <option key={u.value} value={u.value}>{u.label}</option>)}
        </select>
      </div>
    </div>
  )
}
