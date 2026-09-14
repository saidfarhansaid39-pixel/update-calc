'use client'

import React, { useCallback, useMemo, useRef, useState } from 'react'
import { useFormContext } from 'react-hook-form'
import { Lock, Unlock } from 'lucide-react'
import { useCurrency } from '@/lib/context/CurrencyContext'
import { tryAutoConvert } from '@/lib/auto-convert'

interface UnitOption {
  id: string
  label: string
}

interface CalculatorSliderProps {
  name: string
  label: string
  min?: number
  max?: number
  step?: number
  unit?: string
  locked?: boolean
  onLockToggle?: (name: string) => void
  units?: UnitOption[]
  selectedUnit?: string
  onUnitChange?: (name: string, unit: string) => void
  formatValue?: (val: number) => string
}

export function CalculatorSlider({
  name, label, min = 0, max = 100000, step = 1, unit,
  locked, onLockToggle, units, selectedUnit, onUnitChange, formatValue,
}: CalculatorSliderProps) {
  const { register, setValue, watch, getValues, formState: { errors } } = useFormContext()
  const value = watch(name)
  const error = errors[name]
  const { currencySymbol, measurement } = useCurrency()
  const displayLabel = useMemo(() => label.replace('($)', `(${currencySymbol})`), [label, currencySymbol])
  const [conversionHint, setConversionHint] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement | null>(null)

  const numericVal = parseFloat(value) || 0
  const [focused, setFocused] = useState(false)

  const { ref: registerRef, ...registerRest } = register(name, {
    disabled: locked,
    valueAsNumber: false,
    setValueAs: (v: string) => v,
  })

  const handleSliderChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value)
    if (!isNaN(val)) {
      setValue(name, val.toString(), { shouldValidate: true })
    }
  }, [name, setValue])

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    let newVal = numericVal
    const stepVal = step || 1

    switch (e.key) {
      case 'ArrowRight':
      case 'ArrowUp':
        e.preventDefault(); newVal = Math.min(numericVal + stepVal, max); break
      case 'ArrowLeft':
      case 'ArrowDown':
        e.preventDefault(); newVal = Math.max(numericVal - stepVal, min); break
      case 'Home':
        e.preventDefault(); newVal = min; break
      case 'End':
        e.preventDefault(); newVal = max; break
      case 'PageUp':
        e.preventDefault(); newVal = Math.min(numericVal + stepVal * 10, max); break
      case 'PageDown':
        e.preventDefault(); newVal = Math.max(numericVal - stepVal * 10, min); break
      default:
        return
    }
    setValue(name, newVal.toString(), { shouldValidate: true })
  }, [name, setValue, numericVal, min, max, step])

  const handleNumberBlur = useCallback((e: React.FocusEvent<HTMLInputElement>) => {
    setFocused(false)
    const raw = e.target.value
    const result = tryAutoConvert(raw, displayLabel, measurement)
    if (result.converted) {
      setValue(name, result.value, { shouldValidate: true })
      if (result.display) {
        setConversionHint(result.display)
        setTimeout(() => setConversionHint(null), 3000)
      }
    }
  }, [name, setValue, displayLabel, measurement])

  const formatDisplay = useCallback((val: number) => {
    if (formatValue) return formatValue(val)
    if (val >= 1000000) return `${(val / 1000000).toFixed(1)}M`
    if (val >= 1000) return `${(val / 1000).toFixed(1)}k`
    if (step < 1) return val.toFixed(2)
    return val.toLocaleString()
  }, [formatValue, step])

  const pct = max > min ? ((numericVal - min) / (max - min)) * 100 : 0

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-200">{displayLabel}</label>
          <span className="text-xs text-gray-400 font-medium">{formatDisplay(numericVal)}{unit ? ` ${unit}` : ''}</span>
          {onLockToggle && (
            <button
              type="button"
              onClick={() => onLockToggle(name)}
              className="p-1 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:text-gray-300 dark:hover:bg-gray-700 transition-colors"
              aria-label={locked ? `Unlock ${displayLabel}` : `Lock ${displayLabel}`}
              aria-pressed={locked}
            >
              {locked ? <Lock size={13} /> : <Unlock size={13} />}
            </button>
          )}
        </div>
      </div>

      <div className="flex items-center gap-3">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={numericVal}
          onChange={handleSliderChange}
          onKeyDown={handleKeyDown}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          disabled={locked}
          tabIndex={0}
          role="slider"
          aria-valuemin={min}
          aria-valuemax={max}
          aria-valuenow={numericVal}
          aria-label={displayLabel}
          className={`flex-1 h-2 rounded-full appearance-none cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#06b6d4] focus-visible:ring-offset-2 ${
            locked ? 'opacity-50 cursor-not-allowed' : ''
          }`}
          style={{
            background: locked
              ? 'rgb(229 231 235)'
              : `linear-gradient(to right, #06b6d4 0%, #06b6d4 ${pct}%, rgb(229 231 235) ${pct}%, rgb(229 231 235) 100%)`,
          }}
        />
        <input
          type="text"
          inputMode="decimal"
          min={min}
          max={max}
          step={step}
          disabled={locked}
          defaultValue={getValues(name)}
          {...registerRest}
          ref={(e) => {
            registerRef(e)
            inputRef.current = e
          }}
          onFocus={() => setFocused(true)}
          onBlur={handleNumberBlur}
          className={`h-12 w-28 rounded-lg border text-base text-center px-3 transition-all duration-150
            ${error ? 'border-red-400 dark:border-red-500' : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'}
            ${locked ? 'opacity-50 cursor-not-allowed bg-gray-50 dark:bg-gray-800/50' : 'bg-white dark:bg-gray-900'}
            focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#06b6d4] focus-visible:ring-offset-2
            dark:text-gray-100
          `}
        />
      </div>

      {conversionHint && (
        <p className="text-xs text-emerald-600 dark:text-emerald-400 animate-pulse">
          Converted → {conversionHint}
        </p>
      )}

      {units && selectedUnit && onUnitChange && (
        <div className="flex gap-1" role="radiogroup" aria-label={`${displayLabel} unit`}>
          {units.map(u => (
            <button
              key={u.id}
              type="button"
              role="radio"
              aria-checked={selectedUnit === u.id}
              onClick={() => onUnitChange(name, u.id)}
              className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                selectedUnit === u.id
                  ? 'bg-[#06b6d4] text-white shadow-sm'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              {u.label}
            </button>
          ))}
        </div>
      )}

      {error && (
        <p className="text-xs text-red-500 dark:text-red-400" role="alert">{error.message as string}</p>
      )}
    </div>
  )
}
