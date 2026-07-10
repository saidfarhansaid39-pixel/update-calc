import React from 'react'
import { useFormContext } from 'react-hook-form'
import { useId } from 'react'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Lock, Unlock } from 'lucide-react'

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
  locked?: boolean
  onLockToggle?: (name: string) => void
  units?: UnitOption[]
  selectedUnit?: string
  onUnitChange?: (name: string, unit: string) => void
}

export function CalculatorFormField({
  name,
  label,
  type = 'number',
  min,
  max,
  step,
  placeholder,
  locked,
  onLockToggle,
  units,
  selectedUnit,
  onUnitChange,
}: CalculatorFormFieldProps) {
  const { register, formState: { errors } } = useFormContext()
  const error = errors[name]
  const inputId = useId()
  const errorId = `${inputId}-error`
  const describedBy = error ? errorId : undefined

  return (
    <div>
      <div className="flex items-center gap-2">
        <Label htmlFor={inputId}>{label}</Label>
        {onLockToggle && (
          <button
            type="button"
            onClick={() => onLockToggle(name)}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            aria-label={locked ? `Unlock ${label}` : `Lock ${label}`}
            aria-pressed={locked}
          >
            {locked ? <Lock size={14} /> : <Unlock size={14} />}
          </button>
        )}
      </div>
      <div className="flex gap-2 items-start">
        <div className="flex-1">
          <Input
            id={inputId}
            type={type}
            min={min}
            max={max}
            step={step}
            placeholder={placeholder}
            disabled={locked}
            aria-invalid={error ? 'true' : 'false'}
            aria-describedby={describedBy}
            {...register(name, { disabled: locked })}
            className={`mt-1 ${error ? 'border-red-500' : ''} ${locked ? 'opacity-60 cursor-not-allowed' : ''}`}
          />
        </div>
        {units && selectedUnit && onUnitChange && (
          <select
            value={selectedUnit}
            onChange={e => onUnitChange(name, e.target.value)}
            aria-label={`Unit for ${label}`}
            id={`${inputId}-unit`}
            className="mt-1 flex h-10 w-20 rounded-md border border-input bg-background px-2 py-2 text-xs"
          >
            {units.map(u => (
              <option key={u.id} value={u.id}>{u.label}</option>
            ))}
          </select>
        )}
      </div>
      {error && (
        <p id={errorId} className="text-xs text-red-500 mt-1" role="alert">{error.message as string}</p>
      )}
    </div>
  )
}
