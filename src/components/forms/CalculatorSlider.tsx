'use client'

import React, { useCallback, useEffect, useRef } from 'react'
import { useFormContext } from 'react-hook-form'
import { Label } from '@/components/ui/label'
import { Lock, Unlock } from 'lucide-react'

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
  const { register, setValue, watch, formState: { errors } } = useFormContext()
  const value = watch(name)
  const error = errors[name]
  const numericVal = parseFloat(value) || 0
  const sliderRef = useRef<HTMLInputElement>(null)
  const wasLocked = useRef(locked)

  useEffect(() => {
    if (locked && !wasLocked.current) {
      wasLocked.current = true
    } else if (!locked) {
      wasLocked.current = false
    }
  }, [locked])

  const handleSliderChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value)
    if (!isNaN(val)) {
      setValue(name, val.toString(), { shouldValidate: true })
    }
  }, [name, setValue])

  const formatDisplay = useCallback((val: number) => {
    if (formatValue) return formatValue(val)
    if (val >= 1000000) return `$${(val / 1000000).toFixed(1)}M`
    if (val >= 1000) return `$${(val / 1000).toFixed(1)}k`
    if (step < 1) return `$${val.toFixed(2)}`
    return `$${val.toLocaleString()}`
  }, [formatValue, step])

  const sliderBg = locked
    ? 'bg-gray-200 dark:bg-gray-700'
    : 'bg-gradient-to-r from-[#1a3a8a]/30 via-[#1a3a8a]/50 to-[#1a3a8a]/70'

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Label htmlFor={`${name}-input`} className="text-sm">{label}</Label>
          {onLockToggle && (
            <button
              type="button"
              onClick={() => onLockToggle(name)}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              title={locked ? 'Unlock this value' : 'Lock this value'}
            >
              {locked ? <Lock size={13} /> : <Unlock size={13} />}
            </button>
          )}
        </div>
        {unit && <span className="text-xs text-gray-400">{unit}</span>}
      </div>

      <div className="flex items-center gap-3">
        <input
          ref={sliderRef}
          type="range"
          min={min}
          max={max}
          step={step}
          value={numericVal}
          onChange={handleSliderChange}
          disabled={locked}
          className={`flex-1 h-2 rounded-lg appearance-none cursor-pointer ${
            locked ? 'opacity-50 cursor-not-allowed' : ''
          }`}
          style={{
            background: locked
              ? 'rgb(229 231 235)'
              : `linear-gradient(to right, #1a3a8a 0%, #1a3a8a ${(numericVal - min) / (max - min) * 100}%, rgb(229 231 235) ${(numericVal - min) / (max - min) * 100}%, rgb(229 231 235) 100%)`,
          }}
        />
        <div className="flex items-center gap-1 min-w-[90px]">
          <input
            id={`${name}-input`}
            type="number"
            min={min}
            max={max}
            step={step}
            disabled={locked}
            {...register(name, {
              disabled: locked,
              valueAsNumber: false,
              setValueAs: (v: string) => v,
            })}
            className={`flex-1 w-20 h-9 rounded-md border text-sm text-center px-2 ${
              error ? 'border-red-500' : 'border-input'
            } ${locked ? 'opacity-60 cursor-not-allowed bg-gray-50 dark:bg-gray-800' : 'bg-background'}`}
          />
        </div>
      </div>

      {units && selectedUnit && onUnitChange && (
        <div className="flex gap-1">
          {units.map(u => (
            <button
              key={u.id}
              type="button"
              onClick={() => onUnitChange(name, u.id)}
              className={`px-2 py-0.5 text-[10px] font-medium rounded transition-colors ${
                selectedUnit === u.id
                  ? 'bg-[#1a3a8a] text-white'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              {u.label}
            </button>
          ))}
        </div>
      )}

      {error && (
        <p className="text-xs text-red-500">{error.message as string}</p>
      )}
    </div>
  )
}
