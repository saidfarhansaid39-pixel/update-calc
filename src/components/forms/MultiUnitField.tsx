'use client'

import React from 'react'

interface UnitOption {
  value: string
  label: string
  toBase: (val: number) => number
  fromBase: (val: number) => number
}

interface MultiUnitFieldProps {
  label: string
  name: string
  units: UnitOption[]
  defaultUnit?: string
  value?: number
  onChange?: (value: number, unit: string) => void
  min?: number
  max?: number
  step?: number
  locked?: boolean
  onLockToggle?: () => void
}

export function MultiUnitField({
  label, name, units, defaultUnit, value, onChange,
  min, max, step, locked, onLockToggle,
}: MultiUnitFieldProps) {
  const [activeUnit, setActiveUnit] = React.useState(defaultUnit || units[0]?.value || '')
  const [inputValue, setInputValue] = React.useState('')

  React.useEffect(() => {
    if (value !== undefined && activeUnit) {
      const unit = units.find(u => u.value === activeUnit)
      if (unit) {
        const converted = unit.fromBase(value)
        const formatted = Number.isInteger(converted) ? converted.toString() : converted.toFixed(2)
        if (formatted !== inputValue) setInputValue(formatted)
      }
    }
  }, [value, activeUnit])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value
    setInputValue(raw)
    const num = parseFloat(raw)
    if (!isNaN(num) && activeUnit) {
      const unit = units.find(u => u.value === activeUnit)
      if (unit && onChange) {
        onChange(unit.toBase(num), activeUnit)
      }
    }
  }

  const handleUnitChange = (newUnit: string) => {
    if (value !== undefined) {
      const oldUnit = units.find(u => u.value === activeUnit)
      const newUnitObj = units.find(u => u.value === newUnit)
      if (oldUnit && newUnitObj) {
        const inBase = value
        const newVal = newUnitObj.fromBase(inBase)
        const formatted = Number.isInteger(newVal) ? newVal.toString() : newVal.toFixed(2)
        setInputValue(formatted)
      }
    }
    setActiveUnit(newUnit)
  }

  const fieldId = `multiunit-${name}`

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <label htmlFor={fieldId} className="text-xs font-medium text-gray-700 dark:text-gray-300">
          {label}
        </label>
        {onLockToggle && (
          <button
            type="button"
            onClick={onLockToggle}
            className={`text-[10px] px-1.5 py-0.5 rounded transition-colors ${locked ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300' : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'}`}
            aria-label={locked ? `Unlock ${label}` : `Lock ${label}`}
            title={locked ? 'Locked' : 'Click to lock'}
          >
            {locked ? '🔒' : '🔓'}
          </button>
        )}
      </div>
      <div className="flex gap-1">
        <input
          id={fieldId}
          type="number"
          value={inputValue}
          onChange={handleChange}
          min={min}
          max={max}
          step={step}
          disabled={locked}
          className={`flex-1 px-3 py-2 text-sm border rounded-lg bg-white dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#06b6d4] transition-colors ${locked ? 'opacity-60 cursor-not-allowed border-dashed border-gray-300 dark:border-gray-600' : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'}`}
          aria-label={`${label} value`}
        />
        <select
          value={activeUnit}
          onChange={(e) => handleUnitChange(e.target.value)}
          className="px-2 py-2 text-xs border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#06b6d4]"
          aria-label={`${label} unit`}
        >
          {units.map(u => (
            <option key={u.value} value={u.value}>{u.label}</option>
          ))}
        </select>
      </div>
    </div>
  )
}

export const UNIT_DEFINITIONS = {
  length: {
    metric: [
      { value: 'mm', label: 'mm', toBase: (v: number) => v / 1000, fromBase: (v: number) => v * 1000 },
      { value: 'cm', label: 'cm', toBase: (v: number) => v / 100, fromBase: (v: number) => v * 100 },
      { value: 'm', label: 'm', toBase: (v: number) => v, fromBase: (v: number) => v },
      { value: 'km', label: 'km', toBase: (v: number) => v * 1000, fromBase: (v: number) => v / 1000 },
    ],
    imperial: [
      { value: 'in', label: 'in', toBase: (v: number) => v * 0.0254, fromBase: (v: number) => v / 0.0254 },
      { value: 'ft', label: 'ft', toBase: (v: number) => v * 0.3048, fromBase: (v: number) => v / 0.3048 },
      { value: 'yd', label: 'yd', toBase: (v: number) => v * 0.9144, fromBase: (v: number) => v / 0.9144 },
      { value: 'mi', label: 'mi', toBase: (v: number) => v * 1609.344, fromBase: (v: number) => v / 1609.344 },
    ],
  },
  weight: {
    metric: [
      { value: 'g', label: 'g', toBase: (v: number) => v / 1000, fromBase: (v: number) => v * 1000 },
      { value: 'kg', label: 'kg', toBase: (v: number) => v, fromBase: (v: number) => v },
      { value: 't', label: 't', toBase: (v: number) => v * 1000, fromBase: (v: number) => v / 1000 },
    ],
    imperial: [
      { value: 'oz', label: 'oz', toBase: (v: number) => v * 0.0283495, fromBase: (v: number) => v / 0.0283495 },
      { value: 'lb', label: 'lb', toBase: (v: number) => v * 0.453592, fromBase: (v: number) => v / 0.453592 },
      { value: 'st', label: 'st', toBase: (v: number) => v * 6.35029, fromBase: (v: number) => v / 6.35029 },
    ],
  },
  temperature: [
    { value: 'c', label: '°C', toBase: (v: number) => v, fromBase: (v: number) => v },
    { value: 'f', label: '°F', toBase: (v: number) => (v - 32) * 5 / 9, fromBase: (v: number) => v * 9 / 5 + 32 },
    { value: 'k', label: 'K', toBase: (v: number) => v - 273.15, fromBase: (v: number) => v + 273.15 },
  ],
  volume: {
    metric: [
      { value: 'ml', label: 'mL', toBase: (v: number) => v / 1000, fromBase: (v: number) => v * 1000 },
      { value: 'l', label: 'L', toBase: (v: number) => v, fromBase: (v: number) => v },
    ],
    imperial: [
      { value: 'floz', label: 'fl oz', toBase: (v: number) => v * 0.0295735, fromBase: (v: number) => v / 0.0295735 },
      { value: 'cup', label: 'cup', toBase: (v: number) => v * 0.236588, fromBase: (v: number) => v / 0.236588 },
      { value: 'gal', label: 'gal', toBase: (v: number) => v * 3.78541, fromBase: (v: number) => v / 3.78541 },
    ],
  },
  speed: {
    metric: [
      { value: 'kmh', label: 'km/h', toBase: (v: number) => v / 3.6, fromBase: (v: number) => v * 3.6 },
      { value: 'ms', label: 'm/s', toBase: (v: number) => v, fromBase: (v: number) => v },
    ],
    imperial: [
      { value: 'mph', label: 'mph', toBase: (v: number) => v * 0.44704, fromBase: (v: number) => v / 0.44704 },
      { value: 'knot', label: 'knot', toBase: (v: number) => v * 0.514444, fromBase: (v: number) => v / 0.514444 },
    ],
  },
}
