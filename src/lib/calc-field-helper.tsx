'use client'

import React from 'react'
import { useFormContext } from 'react-hook-form'
import { CalculatorFormField } from '@/components/forms/CalculatorFormField'
import { CalculatorSlider } from '@/components/forms/CalculatorSlider'
import { ModeFieldGroup } from '@/components/premium/ModeFieldGroup'

export type FieldMode = 'basic' | 'advanced' | 'professional' | 'expert'

interface FieldDef {
  name: string
  label: string
  type?: string
  min?: number
  max?: number
  step?: number | string
  placeholder?: string
  unit?: string
  options?: { label: string; value: string }[]
  mode?: FieldMode
  units?: { value: string; label: string }[]
  defaultUnit?: string
}

export function renderCalcField(
  field: FieldDef,
  useSlider: boolean,
  lockedFields: Set<string>,
  toggleLock: (name: string) => void
) {
  if (field.type === 'select' && field.options) {
    return (
      <div key={field.name}>
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">{field.label}</label>
        <FieldSelect name={field.name} options={field.options} />
      </div>
    )
  }
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
      locked={lockedFields.has(field.name)}
      onLockToggle={toggleLock}
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
    <>
      {basicFields.map(f => renderCalcField(f, useSlider, lockedFields, toggleLock))}
      {advancedFields.length > 0 && (
        <ModeFieldGroup key="advanced" minMode="advanced" label="Advanced Options">
          {advancedFields.map(f => renderCalcField(f, useSlider, lockedFields, toggleLock))}
        </ModeFieldGroup>
      )}
      {professionalFields.length > 0 && (
        <ModeFieldGroup key="professional" minMode="professional" label="Professional Options">
          {professionalFields.map(f => renderCalcField(f, useSlider, lockedFields, toggleLock))}
        </ModeFieldGroup>
      )}
      {expertFields.length > 0 && (
        <ModeFieldGroup key="expert" minMode="expert" label="Expert Options">
          {expertFields.map(f => renderCalcField(f, useSlider, lockedFields, toggleLock))}
        </ModeFieldGroup>
      )}
    </>
  )
}

function FieldSelect({ name, options }: { name: string; options: { label: string; value: string }[] }) {
  const { register } = useFormContext()
  return (
    <select {...register(name)} className="mt-1 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
      {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
    </select>
  )
}

function FieldWithUnit({ field, locked, onLockToggle }: { field: FieldDef; locked: boolean; onLockToggle: (name: string) => void }) {
  const { register } = useFormContext()
  const unitName = field.name + 'Unit'
  return (
    <div key={field.name} className="space-y-1">
      <div className="flex items-center justify-between">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{field.label}</label>
        <button type="button" onClick={() => onLockToggle(field.name)} className="text-xs text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
          {locked ? (
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
          ) : (
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z" /></svg>
          )}
        </button>
      </div>
      <div className="flex gap-2">
        <input
          type="number"
          {...register(field.name)}
          disabled={locked}
          placeholder={field.placeholder}
          className="flex-1 p-2 text-sm border rounded-lg bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#1a3a8a] focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
        />
        <select
          {...register(unitName)}
          defaultValue={field.defaultUnit || (field.units?.[0]?.value ?? '')}
          className="w-24 p-2 text-sm border rounded-lg bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#1a3a8a] focus:border-transparent"
        >
          {field.units?.map(u => <option key={u.value} value={u.value}>{u.label}</option>)}
        </select>
      </div>
    </div>
  )
}
