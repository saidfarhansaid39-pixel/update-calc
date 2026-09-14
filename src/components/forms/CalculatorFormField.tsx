'use client'

import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { useController, useFormContext } from 'react-hook-form'
import { useId } from 'react'
import { Lock, Unlock } from 'lucide-react'
import { useCurrency } from '@/lib/context/CurrencyContext'
import { useTranslations } from 'next-intl'
import { tryAutoConvert } from '@/lib/auto-convert'

function formatDisplay(val: unknown): string {
  if (val === undefined || val === null || val === '') return ''
  const num = typeof val === 'number' ? val : parseFloat(String(val).replace(/,/g, ''))
  if (isNaN(num)) return String(val)
  return new Intl.NumberFormat('en-US').format(num)
}

interface UnitOption {
  id: string
  label: string
}

interface CalculatorFormFieldProps {
  name: string
  label: string
  type?: string
  min?: number
  max?: number
  step?: string
  placeholder?: string
  helperText?: string
  locked?: boolean
  onLockToggle?: (name: string) => void
  units?: UnitOption[]
  selectedUnit?: string
  onUnitChange?: (name: string, unit: string) => void
  precisionToggle?: boolean
  precision?: number
  onPrecisionChange?: (precision: number) => void
}

export function CalculatorFormField({
  name,
  label,
  type = 'number',
  min,
  max,
  step,
  placeholder,
  helperText,
  locked,
  onLockToggle,
  units,
  selectedUnit,
  onUnitChange,
  precisionToggle,
  precision = 2,
  onPrecisionChange,
}: CalculatorFormFieldProps) {
  const [showPrecision, setShowPrecision] = useState(false)
  const [conversionHint, setConversionHint] = useState<string | null>(null)
  const localPrecision = precisionToggle ? (onPrecisionChange ? precision : 2) : precision

  useEffect(() => {
    if (precisionToggle && !onPrecisionChange) {
      const stored = localStorage.getItem(`precision_${name}`)
      if (stored) {
        const p = parseInt(stored, 10)
        if (!isNaN(p) && p >= 0 && p <= 4) {
          setShowPrecision(true)
        }
      }
    }
  }, [precisionToggle, name, onPrecisionChange])

  const handlePrecisionClick = () => {
    const next = showPrecision ? 2 : 4
    setShowPrecision(!showPrecision)
    localStorage.setItem(`precision_${name}`, String(next))
    if (onPrecisionChange) onPrecisionChange(next)
  }
  const { control, formState: { errors } } = useFormContext()
  const { field } = useController({ name, control, disabled: locked })
  const error = errors[name]
  const { currencySymbol, measurement } = useCurrency()
  const tf = useTranslations('calculatorUI')
  const translatedLabel = useMemo(() => {
    const key = 'formLabels.' + name
    return tf.has(key) ? tf(key) : label
  }, [name, label, tf])
  const displayLabel = useMemo(() => translatedLabel.replace('($)', `(${currencySymbol})`), [translatedLabel, currencySymbol])
  const inputId = useId()
  const helperId = `${inputId}-helper`
  const errorId = `${inputId}-error`
  const describedBy = [error ? errorId : null, helperText ? helperId : null].filter(Boolean).join(' ') || undefined

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/,/g, '')
    if (type === 'number' && raw !== '' && isNaN(parseFloat(raw))) return
    field.onChange(raw)
  }, [field, type])

  // eslint-disable-next-line react-hooks/refs
  const displayValue = type === 'number' && field.value !== '' ? formatDisplay(field.value) : field.value

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <label htmlFor={inputId} className="text-sm font-medium text-gray-700 dark:text-gray-200">
          {displayLabel}
        </label>
        <div className="flex items-center gap-1">
          {precisionToggle && (
            <button
              type="button"
              onClick={handlePrecisionClick}
              className="text-xs px-1.5 py-0.5 rounded text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:text-gray-300 dark:hover:bg-gray-700 transition-colors"
              aria-label={`Toggle precision to ${showPrecision ? '2' : '4'} decimal places`}
            >
              {showPrecision ? '4d' : '2d'}
            </button>
          )}
          {onLockToggle && (
            <button
              type="button"
              onClick={() => onLockToggle(name)}
              className="p-1 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:text-gray-300 dark:hover:bg-gray-700 transition-colors"
              aria-label={locked ? `Unlock ${displayLabel}` : `Lock ${displayLabel}`}
              aria-pressed={locked}
            >
              {locked ? <Lock size={14} /> : <Unlock size={14} />}
            </button>
          )}
        </div>
      </div>
      <div className="relative flex items-center">
        <input
          id={inputId}
          type={type === 'number' ? 'text' : type}
          inputMode={type === 'number' ? 'numeric' : undefined}
          min={min}
          max={max}
          step={step}
          // eslint-disable-next-line react-hooks/refs
          value={displayValue}
          onChange={handleChange}
          onBlur={(e) => {
            field.onBlur()
            const raw = e.target.value
            const result = tryAutoConvert(raw, displayLabel, measurement)
            if (result.converted) {
              field.onChange(result.value)
              if (result.display) {
                setConversionHint(result.display)
                setTimeout(() => setConversionHint(null), 3000)
              }
            }
          }}
          // eslint-disable-next-line react-hooks/refs
          ref={field.ref}
          placeholder={placeholder || `Enter ${displayLabel.toLowerCase()}`}
          disabled={locked}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={describedBy}
          className={`
            flex h-12 w-full rounded-lg border bg-white px-4 py-3 text-base
            transition-all duration-150
            placeholder:text-gray-400 dark:placeholder:text-gray-500
            focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#06b6d4] focus-visible:ring-offset-2
            disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-50 dark:disabled:bg-gray-800/50
            dark:bg-gray-900 dark:text-gray-100
            ${error
              ? 'border-red-400 dark:border-red-500 focus-visible:ring-red-400'
              : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
            }
            ${units ? 'rounded-r-none' : ''}
            ${locked ? 'opacity-60' : ''}
          `}
        />
        {units && selectedUnit && onUnitChange && (
          <select
            value={selectedUnit}
            onChange={e => onUnitChange(name, e.target.value)}
            aria-label={`Unit for ${displayLabel}`}
            className="h-12 rounded-r-lg border border-l-0 border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 px-3 text-sm font-medium text-gray-700 dark:text-gray-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#06b6d4] appearance-none cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            {units.map(u => (
              <option key={u.id} value={u.id}>{u.label}</option>
            ))}
          </select>
        )}
      </div>
      {helperText && !error && (
        <p id={helperId} className="text-xs text-gray-500 dark:text-gray-400">{helperText}</p>
      )}
      {conversionHint && (
        <p className="text-xs text-emerald-600 dark:text-emerald-400 animate-pulse">
          Converted → {conversionHint}
        </p>
      )}
      {error && (
        <p id={errorId} className="text-xs text-red-500 dark:text-red-400 flex items-center gap-1" role="alert">
          {error.message as string}
        </p>
      )}
    </div>
  )
}
