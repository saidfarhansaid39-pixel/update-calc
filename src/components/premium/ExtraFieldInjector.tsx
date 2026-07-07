'use client'

import React, { useState, useEffect, useCallback, useRef } from 'react'
import { useForm, FormProvider, useFormContext } from 'react-hook-form'
import { Plus, X, ChevronDown } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { CalculatorFormField } from '@/components/forms/CalculatorFormField'
import type { ExtraFieldDef } from '@/lib/extra-field-pools'
import { getLabelKey } from '@/lib/extra-field-pools/helpers'

interface ExtraFieldInjectorProps {
  slug: string
  hubSlug: string
  extraFields: ExtraFieldDef[]
  children: React.ReactNode
  onFieldsChange?: (values: Record<string, string>) => void
}

const STORAGE_PREFIX = 'extra_fields_'

function ExtraFieldFormContent({
  activeFields, extraFields, onFieldsChange, removeField, availableFields, grouped,
  addField, showPicker, setShowPicker,
}: {
  activeFields: string[]; extraFields: ExtraFieldDef[]
  onFieldsChange?: (values: Record<string, string>) => void
  removeField: (name: string) => void
  availableFields: ExtraFieldDef[]; grouped: Record<string, ExtraFieldDef[]>
  addField: (name: string) => void; showPicker: boolean; setShowPicker: (v: boolean) => void
}) {
  const t = useTranslations('extraFields')
  const tl = (name: string, fallback: string) => t(getLabelKey(name)) || fallback
  const { register, setValue, getValues, formState: { errors } } = useFormContext()
  const onChangeReported = useRef(onFieldsChange)
  onChangeReported.current = onFieldsChange

  useEffect(() => {
    activeFields.forEach(name => {
      const def = extraFields.find(f => f.name === name)
      if (def?.options?.length) setValue(name, def.options[0].value)
      else setValue(name, '')
    })
  }, [])

  useEffect(() => {
    if (!onChangeReported.current) return
    const filtered: Record<string, string> = {}
    activeFields.forEach(name => {
      const v = getValues(name)
      if (v !== undefined && v !== '') filtered[name] = String(v)
    })
    onChangeReported.current(filtered)
  }, [activeFields, getValues])

  return (
    <>
      {activeFields.length > 0 && (
        <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-6">
          <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">Extra Details</p>
          <div className="space-y-3">
            {activeFields.map(name => {
              const def = extraFields.find(f => f.name === name)
              if (!def) return null
              return (
                <div key={name} className="relative group">
                  <CalculatorFormField
                    name={def.name}
                    label={tl(def.name, def.label)}
                    type={def.type === 'select' ? 'text' : def.type || 'number'}
                    min={def.min}
                    max={def.max}
                    step={def.step?.toString()}
                    placeholder={t(getLabelKey(def.name) + '_placeholder') || def.placeholder}
                  />
                  <button
                    onClick={() => removeField(name)}
                    className="absolute -top-1.5 -right-1.5 p-0.5 rounded-full bg-red-100 dark:bg-red-900/40 text-red-500 dark:text-red-400 opacity-0 group-hover:opacity-100 hover:bg-red-200 dark:hover:bg-red-800/60 transition-all"
                    aria-label={`Remove ${tl(def.name, def.label)}`}
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {availableFields.length > 0 && (
        <div className="relative">
          <button
            onClick={() => setShowPicker(!showPicker)}
            className="flex items-center gap-1.5 text-xs font-medium text-[#1a3a8a] hover:text-[#06b6d4] dark:text-[#06b6d4] dark:hover:text-[#06b6d4] transition-colors px-2 py-1 rounded-md hover:bg-[#1a3a8a]/5 dark:hover:bg-[#06b6d4]/5"
          >
            <Plus className="w-3.5 h-3.5" />
            Add Input Field
            <ChevronDown className={`w-3 h-3 transition-transform ${showPicker ? 'rotate-180' : ''}`} />
          </button>
          {showPicker && (
            <div className="absolute left-0 top-full mt-1 w-72 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-lg py-2 z-10">
              {Object.entries(grouped).map(([group, fields]) => {
                const avail = fields.filter(f => availableFields.some(a => a.name === f.name))
                if (avail.length === 0) return null
                return (
                  <div key={group}>
                    <p className="px-4 py-1 text-[10px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">{group}</p>
                    {avail.map(f => (
                      <button
                        key={f.name}
                        onClick={() => addField(f.name)}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                      >
                      {tl(f.name, f.label)}
                    </button>
                    ))}
                  </div>
                )
              })}
            </div>
          )}
        </div>
      )}
    </>
  )
}

export function ExtraFieldInjector({ slug, extraFields, children, onFieldsChange }: ExtraFieldInjectorProps) {
  const [activeFields, setActiveFields] = useState<string[]>([])
  const [showPicker, setShowPicker] = useState(false)
  const extraForm = useForm({ mode: 'onChange' })

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_PREFIX + slug)
      if (stored) {
        const parsed = JSON.parse(stored) as string[]
        setActiveFields(parsed.filter(n => extraFields.some(f => f.name === n)))
      }
    } catch {}
  }, [slug, extraFields])

  useEffect(() => {
    localStorage.setItem(STORAGE_PREFIX + slug, JSON.stringify(activeFields))
  }, [activeFields, slug])

  useEffect(() => {
    return () => {
      activeFields.forEach(name => extraForm.unregister(name))
    }
  }, [])

  const addField = useCallback((name: string) => {
    if (!activeFields.includes(name)) {
      setActiveFields(prev => [...prev, name])
    }
    setShowPicker(false)
  }, [activeFields])

  const removeField = useCallback((name: string) => {
    setActiveFields(prev => prev.filter(n => n !== name))
    extraForm.unregister(name)
  }, [extraForm])

  const availableFields = extraFields.filter(f => !activeFields.includes(f.name))

  const grouped = extraFields.reduce<Record<string, ExtraFieldDef[]>>((acc, f) => {
    const g = f.group || 'Other'
    if (!acc[g]) acc[g] = []
    acc[g].push(f)
    return acc
  }, {})

  return (
    <div className="space-y-4">
      {children}

      <FormProvider {...extraForm}>
        <ExtraFieldFormContent
          activeFields={activeFields}
          extraFields={extraFields}
          onFieldsChange={onFieldsChange}
          removeField={removeField}
          availableFields={availableFields}
          grouped={grouped}
          addField={addField}
          showPicker={showPicker}
          setShowPicker={setShowPicker}
        />
      </FormProvider>
    </div>
  )
}
